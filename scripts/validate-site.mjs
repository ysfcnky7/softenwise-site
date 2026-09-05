/** Static site smoke validation for SoftenWise delivery. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (m) => console.log("PASS", m);
const fail = (m) => {
  errors.push(m);
  console.error("FAIL", m);
};

const mustExist = [
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

for (const f of mustExist) {
  if (fs.existsSync(path.join(ROOT, f))) ok(f);
  else fail(`missing ${f}`);
}

const headers = fs.readFileSync(path.join(ROOT, "_headers"), "utf8");
for (const h of [
  "Content-Security-Policy",
  "X-Frame-Options",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
]) {
  if (headers.includes(h)) ok(`header ${h}`);
  else fail(`_headers missing ${h}`);
}

const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
if (index.includes("demo-")) fail("index still has demo- logos");
else ok("no demo logos on index");
if (/<p id="formSuccess"[\s\S]*?<\/p>/.test(index)) ok("index formSuccess closed");
else fail("index formSuccess markup");
if (index.includes("og-image.png")) ok("index uses og-image");
else fail("index OG still clinic_image");

const urunler = fs.readFileSync(path.join(ROOT, "urunler.html"), "utf8");
if (urunler.includes("form-success")) ok("urunler form-success");
else fail("urunler missing form-success");

const footer = fs.readFileSync(path.join(ROOT, "partials/site-footer.html"), "utf8");
if (footer.includes("gizlilik.html") && footer.includes("kvkk.html")) ok("footer legal links");
else fail("footer legal links");

const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
for (const u of ["gizlilik.html", "kvkk.html", "cerez-politikasi.html"]) {
  if (sitemap.includes(u)) ok(`sitemap ${u}`);
  else fail(`sitemap missing ${u}`);
}

const mainJs = fs.readFileSync(path.join(ROOT, "js/main.js"), "utf8");
if (mainJs.includes("AbortController") && mainJs.includes("sw-cookie-ack")) ok("main.js timeout+cookie");
else fail("main.js missing timeout/cookie notice");

const i18n = fs.readFileSync(path.join(ROOT, "js/i18n.js"), "utf8");
if (i18n.includes('return "tr"')) ok("i18n default tr/browser");
else fail("i18n default language");

// Basic HTML parse: unmatched script tags count
for (const name of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(ROOT, name), "utf8");
  if (!html.includes('class="site-footer"')) fail(`${name} missing footer`);
  if (html.includes("clinic_image.png") && /og:image|twitter:image|primaryImageOfPage/.test(html)) {
    // product screenshots of clinic may remain; OG must not
    const ogBits = html.match(/og:image[^>]+content="([^"]+)"/g) || [];
    for (const b of ogBits) {
      if (b.includes("clinic_image")) fail(`${name} OG still clinic_image`);
    }
  }
}

if (!fs.existsSync(path.join(ROOT, "notes.txt"))) ok("notes.txt not in publish root");
else fail("notes.txt still present");
if (fs.existsSync(path.join(ROOT, "LICENSE"))) ok("LICENSE");
else fail("LICENSE missing");
if (/gizlilik\.html/.test(fs.readFileSync(path.join(ROOT, "404.html"), "utf8"))) ok("404 legal footer");
else fail("404 missing legal links");
const contactPages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"))
  .filter((f) => fs.readFileSync(path.join(ROOT, f), "utf8").includes("data-contact-form"));
for (const f of contactPages) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  if (t.includes("form-label") && /id="field-name"/.test(t)) ok(`${f} form labels`);
  else fail(`${f} form labels`);
}
if (!/alert\(i18nText\("form\.err/.test(mainJs) && mainJs.includes("form-error")) ok("inline form errors");
else fail("form still uses alert for errors");
if (/z-index:\s*1300/.test(fs.readFileSync(path.join(ROOT, "css/style.css"), "utf8"))) ok("cookie z-index");
else fail("cookie z-index");

if (errors.length) {
  console.error(`\n${errors.length} failure(s)`);
  process.exit(1);
}
console.log("\nAll validations passed.");
