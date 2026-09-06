/**
 * SoftenWise pass 2: close remaining checklist FAILs for static site.
 * Excel untouched.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s.replace(/\r\n/g, "\n"), "utf8");

// --- 1) Block notes.txt at edge + gitignore ---
let headers = read("_headers");
if (!headers.includes("/notes.txt")) {
  headers =
    `/notes.txt
  X-Robots-Tag: noindex
  Content-Type: text/plain; charset=utf-8

` + headers;
  // Netlify can't easily 404 via headers alone; add _redirects if missing
  write("_headers", headers);
}
let gi = read(".gitignore");
if (!gi.includes("notes.txt")) {
  gi += "\n# Ops notes must not ship with static site\nnotes.txt\n";
  write(".gitignore", gi);
}
if (!fs.existsSync(path.join(ROOT, "_redirects"))) {
  write(
    "_redirects",
    `/notes.txt /404.html 404
/scripts/* /404.html 404
`
  );
}

// --- 2) Footer short keys ---
let footer = read("partials/site-footer.html");
footer = footer
  .replace(
    /<span class="footer-legal-inline" aria-label="Yasal bağlantılar">\s*<a href="gizlilik.html" data-i18n="footer.privacy">Gizlilik<\/a>\s*<span aria-hidden="true">·<\/span>\s*<a href="kvkk.html" data-i18n="footer.kvkk">KVKK<\/a>\s*<span aria-hidden="true">·<\/span>\s*<a href="cerez-politikasi.html" data-i18n="footer.cookies">Çerezler<\/a>/,
    `<span class="footer-legal-inline" aria-label="Yasal bağlantılar">
        <a href="gizlilik.html" data-i18n="footer.privacy.short">Gizlilik</a>
        <span aria-hidden="true">·</span>
        <a href="kvkk.html" data-i18n="footer.kvkk.short">KVKK</a>
        <span aria-hidden="true">·</span>
        <a href="cerez-politikasi.html" data-i18n="footer.cookies.short">Çerezler</a>`
  );
write("partials/site-footer.html", footer);

// --- 3) Sync layout (fixed 404) ---
const PARTIALS = path.join(ROOT, "partials");
const HEADER_SUB = fs.readFileSync(path.join(PARTIALS, "site-header-subpage.html"), "utf8");
const HEADER_IDX = fs.readFileSync(path.join(PARTIALS, "site-header-index.html"), "utf8");
const FOOTER = fs.readFileSync(path.join(PARTIALS, "site-footer.html"), "utf8");
const QUICK = fs.readFileSync(path.join(PARTIALS, "site-quick-contact.html"), "utf8");
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

for (const name of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  let text = read(name);
  const headerNew = name === "index.html" ? HEADER_IDX : HEADER_SUB;
  if (HEADER_RE.test(text)) text = text.replace(HEADER_RE, "\n" + headerNew);
  if (FOOTER_RE.test(text)) text = text.replace(FOOTER_RE, "\n" + FOOTER);
  text = injectQuick(text);
  write(name, text);
  console.log("synced", name);
}

// --- 4) Add labels to contact forms (placeholder-only → label+input) ---
function addLabels(html) {
  // Skip if already has <label for=
  if (html.includes('<label for="') && html.includes("data-contact-form")) {
    // still process forms that lack labels
  }

  const fieldMap = [
    { name: "name", labelKey: "common.contact.name", fallback: "Ad Soyad" },
    { name: "email", labelKey: "common.contact.email", fallback: "E-posta" },
    { name: "message", labelKey: "common.contact.message", fallback: "Mesaj" },
    { name: "role", labelKey: "career.role", fallback: "Başvurduğunuz rol" },
    { name: "idea_name", labelKey: "partner.idea", fallback: "Fikir / proje adı" },
  ];

  return html.replace(
    /(<form\b[^>]*data-contact-form[^>]*>)([\s\S]*?)(<\/form>)/gi,
    (full, open, body, close) => {
      let b = body;
      for (const f of fieldMap) {
        const re = new RegExp(
          `<div class="form-group">\\s*<(input|textarea)([^>]*name="${f.name}"[^>]*)(\\/?)>`,
          "i"
        );
        // textarea closing tag variant
        const reTa = new RegExp(
          `<div class="form-group">\\s*<textarea([^>]*name="${f.name}"[^>]*)>([\\s\\S]*?)<\\/textarea>`,
          "i"
        );
        if (reTa.test(b) && !b.match(new RegExp(`<label[^>]*for="[^"]*${f.name}`, "i"))) {
          b = b.replace(reTa, (m, attrs, inner) => {
            const idMatch = attrs.match(/\bid="([^"]+)"/i);
            const id = idMatch ? idMatch[1] : `field-${f.name}`;
            const attrs2 = idMatch ? attrs : `${attrs} id="${id}"`;
            return `<div class="form-group">
            <label class="form-label" for="${id}" data-i18n="${f.labelKey}">${f.fallback}</label>
            <textarea${attrs2}>${inner}</textarea>`;
          });
          continue;
        }
        if (re.test(b) && !new RegExp(`label[^>]*for=.*${f.name}`, "i").test(b)) {
          b = b.replace(re, (m, tag, attrs) => {
            const idMatch = attrs.match(/\bid="([^"]+)"/i);
            const id = idMatch ? idMatch[1] : `field-${f.name}`;
            const attrs2 = idMatch ? attrs : `${attrs} id="${id}"`;
            return `<div class="form-group">
            <label class="form-label" for="${id}" data-i18n="${f.labelKey}">${f.fallback}</label>
            <${tag}${attrs2} />`;
          });
        }
      }
      // Ensure form-error live region exists
      if (!b.includes("form-error")) {
        b = b.replace(
          /(<\/button>)/i,
          `$1
          <p class="form-error" role="alert" aria-live="assertive" hidden></p>`
        );
      }
      return open + b + close;
    }
  );
}

for (const name of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  let text = read(name);
  if (!text.includes("data-contact-form")) continue;
  const next = addLabels(text);
  if (next !== text) {
    write(name, next);
    console.log("labels", name);
  }
}

console.log("pass2 structural done");
