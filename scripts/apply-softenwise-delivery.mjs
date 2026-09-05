/**
 * SoftenWise delivery: apply checklist fixes for static commercial site.
 * Does NOT touch the Excel checklist file.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PARTIALS = path.join(ROOT, "partials");

const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => fs.writeFileSync(p, s.replace(/\r\n/g, "\n"), "utf8");

const HEADER_SUB = read(path.join(PARTIALS, "site-header-subpage.html"));
const HEADER_IDX = read(path.join(PARTIALS, "site-header-index.html"));
const FOOTER = read(path.join(PARTIALS, "site-footer.html"));
const QUICK = read(path.join(PARTIALS, "site-quick-contact.html"));

const HEADER_RE = /\s*<header\s+class="site-header"\s+id="header">[\s\S]*?<\/header>/i;
const FOOTER_RE = /\s*<footer\s+class="site-footer">[\s\S]*?<\/footer>/i;
const QUICK_RE = /\s*<div\s+class="quick-contact"[\s\S]*?<\/div>\s*\n/i;

function injectQuick(html) {
  const marker = '  <script src="js/main.js';
  if (!html.includes(marker)) return html;
  const q = "\n" + QUICK.trimEnd() + "\n";
  if (html.includes("quick-contact")) return html.replace(QUICK_RE, q);
  return html.replace(marker, q + marker);
}

function syncLayout(name, text) {
  if (name === "404.html") {
    const m = text.match(/<main\s+class="err404"[^>]*>[\s\S]*?<\/main>/i);
    if (!m) return text;
    const body =
      "<body>\n" +
      '  <a class="skip-link" href="#main">İçeriğe atla</a>\n' +
      '  <script src="js/sprite-inject.js?v=202604081"></script>\n' +
      HEADER_SUB +
      "\n  " +
      m[0] +
      "\n" +
      FOOTER +
      "\n\n" +
      QUICK.trimEnd() +
      "\n" +
      '  <script src="js/main.js?v=202604224" defer></script>\n' +
      "</body>";
    return text.replace(/<body>[\s\S]*?<\/body>/i, body);
  }
  const headerNew = name === "index.html" ? HEADER_IDX : HEADER_SUB;
  let out = text.replace(HEADER_RE, "\n" + headerNew);
  out = out.replace(FOOTER_RE, "\n" + FOOTER);
  out = injectQuick(out);
  return out;
}

function stripDemoLogos(html) {
  // Only remove a single logo-item node that itself references demo-*.svg
  // (do not span across neighboring logo-item blocks).
  return html.replace(
    /<div class="logo-item"[^>]*>(?:(?!<div class="logo-item").)*?demo-[a-z0-9-]+\.svg(?:(?!<div class="logo-item").)*?<\/div>/gi,
    ""
  );
}

function fixOg(html) {
  return html
    .replaceAll(
      "https://softenwise.com/images/clinic_image.png",
      "https://softenwise.com/images/og-image.png"
    )
    .replaceAll(
      'content="https://softenwise.com/images/clinic_image.png"',
      'content="https://softenwise.com/images/og-image.png"'
    );
}

function fixIndexForm(html) {
  return html.replace(
    /<p id="formSuccess"([\s\S]*?)<\/div>\s*<\/form>/,
    '<p id="formSuccess" class="form-success"$1</p>\n        </form>'
  );
}

function ensureUrunlerSuccess(html) {
  if (html.includes("form-success") || !html.includes("data-contact-form")) return html;
  return html.replace(
    /(<button type="submit" class="btn-primary"[^>]*>[\s\S]*?<\/button>)\s*<\/form>/,
    `$1
          <p class="form-success" style="display:none; margin-top:16px; color:#2a5865; font-weight:600;" data-i18n="gap.0057">Talebiniz alındı. Ekibimiz sizinle iletişime geçecek.</p>
        </form>`
  );
}

function patchAllHtml() {
  for (const name of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
    let text = read(path.join(ROOT, name));
    text = fixOg(text);
    if (name === "index.html") {
      text = stripDemoLogos(text);
      text = fixIndexForm(text);
    }
    if (name === "urunler.html") text = ensureUrunlerSuccess(text);
    text = syncLayout(name, text);
    write(path.join(ROOT, name), text);
    console.log("html", name);
  }
}

patchAllHtml();
console.log("done apply-softenwise-delivery");
