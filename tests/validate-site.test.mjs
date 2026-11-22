import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { runValidate, validateCli } from "../scripts/validate-site.mjs";
import { makeTempSite, pageHtml } from "./helpers/site-fixture.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const silent = { log() {}, error() {} };

describe("runValidate live site", () => {
  it("passes on the SoftenWise commercial root", () => {
    const errors = runValidate(ROOT, silent);
    assert.deepEqual(errors, []);
  });

  it("validateCli returns 0 on the live root", () => {
    assert.equal(validateCli(ROOT, silent), 0);
  });
});

describe("runValidate fixtures", () => {
  it("passes a complete temp site", () => {
    const root = makeTempSite();
    assert.deepEqual(runValidate(root, silent), []);
  });

  it("fails missing required files and headers", () => {
    const root = makeTempSite();
    fs.unlinkSync(path.join(root, "package.json"));
    fs.unlinkSync(path.join(root, "netlify.toml"));
    fs.writeFileSync(path.join(root, "_headers"), "X-Frame-Options\n");
    const errors = runValidate(root, silent);
    assert.ok(errors.some((e) => e.includes("missing package.json")));
    assert.ok(errors.some((e) => e.includes("_headers missing Content-Security-Policy")));
    assert.ok(errors.some((e) => e.includes("revalidate HTML")));
    assert.ok(errors.some((e) => e.includes("cross-origin")));
    assert.ok(errors.some((e) => e.includes("netlify.toml")));
  });

  it("fails demo logos, formSuccess, og, json-ld, urunler, footer, sitemap", () => {
    const root = makeTempSite({
      "index.html": pageHtml({ demo: true, formSuccess: false, og: false, jsonLd: "none" }),
      "urunler.html": pageHtml({ formSuccessClass: false }),
      "partials/site-footer.html": "<footer></footer>",
      "sitemap.xml": "https://softenwise.com/404.html\n500.html\n",
    });
    fs.unlinkSync(path.join(root, "images/og-image.png"));
    const errors = runValidate(root, silent);
    assert.ok(errors.some((e) => e.includes("demo-")));
    assert.ok(errors.some((e) => e.includes("formSuccess")));
    assert.ok(errors.some((e) => e.includes("clinic_image")));
    assert.ok(errors.some((e) => e.includes("og-image.png")));
    assert.ok(errors.some((e) => e.includes("JSON-LD")));
    assert.ok(errors.some((e) => e.includes("urunler missing form-success")));
    assert.ok(errors.some((e) => e.includes("footer legal")));
    assert.ok(errors.some((e) => e.includes("sitemap missing")));
    assert.ok(errors.some((e) => e.includes("should not list 404")));
    assert.ok(errors.some((e) => e.includes("should not list 500")));
  });

  it("accepts string Organization JSON-LD", () => {
    const root = makeTempSite({
      "index.html": pageHtml({ formSuccess: true, jsonLd: "string", og: true }),
    });
    const errors = runValidate(root, silent);
    assert.equal(errors.some((e) => e.includes("JSON-LD")), false);
  });

  it("fails main.js / i18n / 404 / notes / LICENSE / form / css / liman", () => {
    const root = makeTempSite({
      "js/main.js": `alert(i18nText("form.err"));`,
      "js/i18n.js": `return "en";`,
      "404.html": pageHtml(),
      "500.html": pageHtml(),
      "css/style.css": "body{}",
      "js/softenwise-network.js": "no-liman",
    });
    fs.unlinkSync(path.join(root, "LICENSE"));
    fs.writeFileSync(path.join(root, "notes.txt"), "no");
    fs.writeFileSync(
      path.join(root, "extra.html"),
      pageHtml({ footer: false, extra: `<form data-contact-form></form>` })
    );
    const errors = runValidate(root, silent);
    assert.ok(errors.some((e) => e.includes("timeout/cookie")));
    assert.ok(errors.some((e) => e.includes("honeypot") || e.includes("Formspree")));
    assert.ok(errors.some((e) => e.includes("default language")));
    assert.ok(errors.some((e) => e.includes("HTML sanitizer")));
    assert.ok(errors.some((e) => e.includes("notes.txt")));
    assert.ok(errors.some((e) => e.includes("LICENSE")));
    assert.ok(errors.some((e) => e.includes("404 missing")));
    assert.ok(errors.some((e) => e.includes("500 missing")));
    assert.ok(errors.some((e) => e.includes("extra.html missing footer")));
    assert.ok(errors.some((e) => e.includes("extra.html form labels")));
    assert.ok(errors.some((e) => e.includes("alert for errors")));
    assert.ok(errors.some((e) => e.includes("cookie z-index")));
    assert.ok(errors.some((e) => e.includes("liman")));
  });

  it("fails clinic OG when clinic_image is in og:image", () => {
    const root = makeTempSite({
      "index.html": pageHtml({ formSuccess: true, jsonLd: "array", clinicOg: true }),
    });
    const errors = runValidate(root, silent);
    assert.ok(errors.some((e) => e.includes("OG still clinic_image")));
  });

  it("fails asset version skew and mismatch", () => {
    const skew = makeTempSite({
      "index.html": pageHtml({ formSuccess: true, jsonLd: "array", version: "aaaaaaaaaa" }),
      "urunler.html": pageHtml({ formSuccessClass: true, contact: true, version: "bbbbbbbbbb" }),
    });
    assert.ok(runValidate(skew, silent).some((e) => e.includes("skew")));

    const mismatch = makeTempSite({
      "scripts/asset-version.txt": "zzzzzzzzzz\n",
    });
    assert.ok(runValidate(mismatch, silent).some((e) => e.includes("asset-version.txt")));

    const missingV = makeTempSite({
      "index.html": `<footer class="site-footer"></footer>`,
      "urunler.html": `<footer class="site-footer"></footer><form data-contact-form><label class="form-label"></label><input id="field-name"></form><p class="form-success"></p>`,
      "gizlilik.html": `<footer class="site-footer"></footer>`,
      "kvkk.html": `<footer class="site-footer"></footer>`,
      "cerez-politikasi.html": `<footer class="site-footer"></footer>`,
      "404.html": `<footer class="site-footer"></footer><a href="gizlilik.html">g</a>`,
    });
    const missErr = runValidate(missingV, silent);
    assert.ok(missErr.some((e) => e.includes("missing asset version") || e.includes("asset ?v= missing")));
  });

  it("validateCli returns 1 when the site fails", () => {
    const root = makeTempSite({ "js/main.js": "x" });
    const printed = [];
    const code = validateCli(root, { log() {}, error: (m) => printed.push(String(m)) });
    assert.equal(code, 1);
    assert.ok(printed.some((m) => m.includes("failure")));
  });

  it("handles a missing root", () => {
    const errors = runValidate(path.join(os.tmpdir(), "sw-no-such-root-xyz"), silent);
    assert.ok(errors.length > 0);
  });

  it("fails when 404.html is absent", () => {
    const root = makeTempSite();
    fs.unlinkSync(path.join(root, "404.html"));
    const errors = runValidate(root, silent);
    assert.ok(errors.some((e) => e.includes("404 missing")));
  });

  it("fails when 500.html is absent", () => {
    const root = makeTempSite();
    fs.unlinkSync(path.join(root, "500.html"));
    const errors = runValidate(root, silent);
    assert.ok(errors.some((e) => e.includes("500 missing")));
  });

  it("scans clinic_image without og:image content attributes", () => {
    const root = makeTempSite();
    fs.writeFileSync(
      path.join(root, "shot.html"),
      pageHtml({
        og: false,
        extra: `clinic_image.png<meta name="twitter:image" content="n">`,
      })
    );
    const errors = runValidate(root, silent);
    assert.equal(errors.some((e) => e.includes("OG still clinic_image")), false);
  });
});
