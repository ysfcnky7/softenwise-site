/** Static site smoke validation for SoftenWise delivery. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isDirectRun } from "./lib/cli.mjs";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const MUST_EXIST = [
  "package.json",
  "package-lock.json",
  "README.md",
  "SECURITY.md",
  ".editorconfig",
  ".env.example",
  "_headers",
  "docs/RUNBOOK.md",
  "gizlilik.html",
  "kvkk.html",
  "cerez-politikasi.html",
  "robots.txt",
  "sitemap.xml",
  ".well-known/security.txt",
];

export const REQUIRED_HEADERS = [
  "Content-Security-Policy",
  "X-Frame-Options",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Cross-Origin-Opener-Policy",
];

export const ASSET_PATTERNS = [
  /css\/local-fonts\.css\?v=([A-Za-z0-9]+)/,
  /css\/style\.css\?v=([A-Za-z0-9]+)/,
  /css\/softenwise\.css\?v=([A-Za-z0-9]+)/,
  /js\/sprite-inject\.js\?v=([A-Za-z0-9]+)/,
  /js\/softenwise-network\.js\?v=([A-Za-z0-9]+)/,
  /js\/locales\.js\?v=([A-Za-z0-9]+)/,
  /js\/i18n\.js\?v=([A-Za-z0-9]+)/,
  /js\/main\.js\?v=([A-Za-z0-9]+)/,
];

export function runValidate(root = DEFAULT_ROOT, io = console) {
  const errors = [];
  const ok = (m) => io.log("PASS", m);
  const fail = (m) => {
    errors.push(m);
    io.error("FAIL", m);
  };

  for (const f of MUST_EXIST) {
    if (fs.existsSync(path.join(root, f))) ok(f);
    else fail(`missing ${f}`);
  }

  const headersPath = path.join(root, "_headers");
  const headers = fs.existsSync(headersPath) ? fs.readFileSync(headersPath, "utf8") : "";
  for (const h of REQUIRED_HEADERS) {
    if (headers.includes(h)) ok(`header ${h}`);
    else fail(`_headers missing ${h}`);
  }
  if (/max-age=0,\s*must-revalidate/.test(headers) && /immutable/.test(headers)) {
    ok("header cache split html-revalidate + asset-immutable");
  } else {
    fail("_headers must revalidate HTML and immutably cache versioned assets");
  }
  if (/\/images\/\*[\s\S]*Cross-Origin-Resource-Policy:\s*cross-origin/.test(headers)) {
    ok("images CORP cross-origin for OG");
  } else {
    fail("_headers /images/* must set Cross-Origin-Resource-Policy: cross-origin");
  }

  const netlifyPath = path.join(root, "netlify.toml");
  const netlify = fs.existsSync(netlifyPath) ? fs.readFileSync(netlifyPath, "utf8") : "";
  if (/publish\s*=\s*"dist"/.test(netlify) && /pack-static\.mjs/.test(netlify)) {
    ok("netlify publishes dist via pack-static");
  } else {
    fail("netlify.toml must publish dist/ after pack-static (not repo root)");
  }

  const indexPath = path.join(root, "index.html");
  const index = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
  if (index.includes("demo-")) fail("index still has demo- logos");
  else ok("no demo logos on index");
  if (/<p id="formSuccess"[\s\S]*?<\/p>/.test(index)) ok("index formSuccess closed");
  else fail("index formSuccess markup");
  if (index.includes("og-image.png")) ok("index uses og-image");
  else fail("index OG still clinic_image");
  if (fs.existsSync(path.join(root, "images/og-image.png"))) ok("images/og-image.png exists");
  else fail("missing images/og-image.png");
  if (/"@type":\s*\[\s*"Organization"/.test(index) || /"@type":\s*"Organization"/.test(index)) {
    ok("index JSON-LD Organization");
  } else fail("index missing JSON-LD Organization");

  const urunlerPath = path.join(root, "urunler.html");
  const urunler = fs.existsSync(urunlerPath) ? fs.readFileSync(urunlerPath, "utf8") : "";
  if (urunler.includes("form-success")) ok("urunler form-success");
  else fail("urunler missing form-success");

  const footerPath = path.join(root, "partials/site-footer.html");
  const footer = fs.existsSync(footerPath) ? fs.readFileSync(footerPath, "utf8") : "";
  if (footer.includes("gizlilik.html") && footer.includes("kvkk.html")) ok("footer legal links");
  else fail("footer legal links");

  const sitemapPath = path.join(root, "sitemap.xml");
  const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
  for (const u of ["gizlilik.html", "kvkk.html", "cerez-politikasi.html", "kullanim.html"]) {
    if (sitemap.includes(u)) ok(`sitemap ${u}`);
    else fail(`sitemap missing ${u}`);
  }
  const publicHtml = fs.existsSync(root)
    ? fs.readdirSync(root).filter((f) => f.endsWith(".html") && f !== "404.html" && f !== "500.html")
    : [];
  for (const name of publicHtml) {
    const needle = name === "index.html" ? "https://softenwise.com/</loc>" : name;
    if (sitemap.includes(needle)) ok(`sitemap covers ${name}`);
    else fail(`sitemap missing ${name}`);
  }
  if (sitemap.includes("404.html")) fail("sitemap should not list 404.html");
  else ok("sitemap omits 404");
  if (sitemap.includes("500.html")) fail("sitemap should not list 500.html");
  else ok("sitemap omits 500");

  const mainJsPath = path.join(root, "js/main.js");
  const mainJs = fs.existsSync(mainJsPath) ? fs.readFileSync(mainJsPath, "utf8") : "";
  if (mainJs.includes("AbortController") && mainJs.includes("sw-cookie-ack")) ok("main.js timeout+cookie");
  else fail("main.js missing timeout/cookie notice");
  if (mainJs.includes('input[name="_gotcha"]') && mainJs.includes("FORMSPREE_ENDPOINT_RE")) {
    ok("main.js honeypot+formspree allowlist");
  } else fail("main.js missing honeypot check or Formspree allowlist");

  const i18nPath = path.join(root, "js/i18n.js");
  const i18n = fs.existsSync(i18nPath) ? fs.readFileSync(i18nPath, "utf8") : "";
  if (i18n.includes('return "tr"')) ok("i18n default tr/browser");
  else fail("i18n default language");
  if (i18n.includes("sanitizeTrustedHtml")) ok("i18n HTML sanitizer");
  else fail("i18n missing HTML sanitizer");

  const htmlNames = fs.existsSync(root) ? fs.readdirSync(root).filter((f) => f.endsWith(".html")) : [];
  for (const name of htmlNames) {
    const html = fs.readFileSync(path.join(root, name), "utf8");
    if (!html.includes('class="site-footer"')) fail(`${name} missing footer`);
    if (html.includes("clinic_image.png") && /og:image|twitter:image|primaryImageOfPage/.test(html)) {
      const ogBits = html.match(/og:image[^>]+content="([^"]+)"/g) || [];
      for (const b of ogBits) {
        if (b.includes("clinic_image")) fail(`${name} OG still clinic_image`);
      }
    }
  }

  if (!fs.existsSync(path.join(root, "notes.txt"))) ok("notes.txt not in publish root");
  else fail("notes.txt still present");
  if (fs.existsSync(path.join(root, "LICENSE"))) ok("LICENSE");
  else fail("LICENSE missing");
  const notFoundPath = path.join(root, "404.html");
  if (fs.existsSync(notFoundPath) && /gizlilik\.html/.test(fs.readFileSync(notFoundPath, "utf8"))) {
    ok("404 legal footer");
  } else fail("404 missing legal links");
  const serverErrorPath = path.join(root, "500.html");
  if (fs.existsSync(serverErrorPath) && /gizlilik\.html/.test(fs.readFileSync(serverErrorPath, "utf8"))) {
    ok("500 legal footer");
  } else fail("500 missing legal links");
  const contactPages = htmlNames.filter((f) =>
    fs.readFileSync(path.join(root, f), "utf8").includes("data-contact-form")
  );
  for (const f of contactPages) {
    const t = fs.readFileSync(path.join(root, f), "utf8");
    if (t.includes("form-label") && /id="field-name"/.test(t)) ok(`${f} form labels`);
    else fail(`${f} form labels`);
  }
  if (!/alert\(i18nText\("form\.err/.test(mainJs) && mainJs.includes("form-error")) ok("inline form errors");
  else fail("form still uses alert for errors");
  const cssPath = path.join(root, "css/style.css");
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
  if (/z-index:\s*1300/.test(css)) ok("cookie z-index");
  else fail("cookie z-index");

  const versionSets = ASSET_PATTERNS.map(() => new Set());
  for (const name of htmlNames) {
    const html = fs.readFileSync(path.join(root, name), "utf8");
    ASSET_PATTERNS.forEach((re, i) => {
      const m = html.match(re);
      if (!m) fail(`${name} missing asset version for ${re}`);
      else versionSets[i].add(m[1]);
    });
  }
  const allVers = new Set(versionSets.flatMap((s) => [...s]));
  const pinnedPath = path.join(root, "scripts/asset-version.txt");
  const pinned = fs.existsSync(pinnedPath) ? fs.readFileSync(pinnedPath, "utf8").trim() : "";
  if (allVers.size === 1 && [...allVers][0] === pinned) ok(`asset ?v= sync (${pinned})`);
  else if (allVers.size > 1) fail(`asset ?v= skew: ${[...allVers].join(", ")} — run npm run bump`);
  else if (allVers.size === 1) fail(`HTML ?v=${[...allVers][0]} != scripts/asset-version.txt ${pinned} — run npm run bump`);
  else fail("asset ?v= missing — run npm run bump");

  const networkPath = path.join(root, "js/softenwise-network.js");
  const networkJs = fs.existsSync(networkPath) ? fs.readFileSync(networkPath, "utf8") : "";
  if (/liman-kaleici\.jpg\?v=[A-Za-z0-9]+/.test(networkJs)) ok("showcase liman image is cache-busted");
  else fail("showcase liman image missing ?v= — run npm run bump");

  return errors;
}

export function validateCli(root = DEFAULT_ROOT, io = console) {
  const errors = runValidate(root, io);
  if (errors.length) {
    io.error(`\n${errors.length} failure(s)`);
    return 1;
  }
  io.log("\nAll validations passed.");
  return 0;
}

/* c8 ignore next 3 */
if (isDirectRun(import.meta.url)) {
  process.exit(validateCli());
}
