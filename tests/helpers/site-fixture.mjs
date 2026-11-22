import fs from "fs";
import os from "os";
import path from "path";

const VER = "abc1234567";

export function assetTags(version = VER) {
  return `
<link rel="stylesheet" href="css/local-fonts.css?v=${version}" />
<link rel="stylesheet" href="css/style.css?v=${version}" />
<link rel="stylesheet" href="css/softenwise.css?v=${version}" />
<script src="js/sprite-inject.js?v=${version}"></script>
<script src="js/softenwise-network.js?v=${version}"></script>
<script src="js/locales.js?v=${version}"></script>
<script src="js/i18n.js?v=${version}"></script>
<script src="js/main.js?v=${version}"></script>`;
}

export function pageHtml({
  version = VER,
  footer = true,
  contact = false,
  formSuccess = false,
  formSuccessClass = false,
  demo = false,
  og = true,
  jsonLd = "string",
  extra = "",
  clinicOg = false,
  clinicTwitterOnly = false,
} = {}) {
  const foot = footer ? `<footer class="site-footer"></footer>` : "";
  const form = contact
    ? `<form data-contact-form><label class="form-label" for="field-name">Ad</label><input id="field-name" /></form>`
    : "";
  const success = formSuccess ? `<p id="formSuccess"></p>` : "";
  const successClass = formSuccessClass ? `<p class="form-success"></p>` : "";
  const demoBit = demo ? `<img src="demo-logo.png" alt="" />` : "";
  const ogBit = og ? `<meta property="og:image" content="https://softenwise.com/images/og-image.png" />` : "";
  const clinic = clinicOg
    ? `<meta property="og:image" content="https://x/clinic_image.png" />`
    : clinicTwitterOnly
      ? `<meta name="twitter:image" content="clinic_image.png" /><link rel="primaryImageOfPage" href="x">`
      : "";
  const ld =
    jsonLd === "array"
      ? `"@type": ["Organization", "ProfessionalService"]`
      : jsonLd === "none"
        ? `"@type": "WebPage"`
        : `"@type": "Organization"`;
  return `<!DOCTYPE html><html><head>${ogBit}${clinic}<script type="application/ld+json">{${ld}}</script>${assetTags(version)}</head><body>${demoBit}${form}${success}${successClass}${extra}${foot}</body></html>`;
}

export function writeTree(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    if (content == null) continue;
    fs.writeFileSync(full, content);
  }
}

export function goodSiteFiles(overrides = {}) {
  const headers = `Content-Security-Policy
X-Frame-Options
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Cross-Origin-Opener-Policy
max-age=0, must-revalidate
immutable
/images/*
  Cross-Origin-Resource-Policy: cross-origin
`;
  const base = {
    "package.json": "{}",
    "package-lock.json": "{}",
    "README.md": "x",
    "SECURITY.md": "x",
    ".editorconfig": "x",
    ".env.example": "x",
    _headers: headers,
    "docs/RUNBOOK.md": "x",
    "gizlilik.html": pageHtml(),
    "kvkk.html": pageHtml(),
    "cerez-politikasi.html": pageHtml(),
    "kullanim.html": pageHtml(),
    "robots.txt": "x",
    "sitemap.xml": `https://softenwise.com/</loc>
gizlilik.html
kvkk.html
cerez-politikasi.html
kullanim.html
index.html
urunler.html
`,
    ".well-known/security.txt": "x",
    "index.html": pageHtml({ formSuccess: true, jsonLd: "array", og: true }),
    "urunler.html": pageHtml({ formSuccessClass: true, contact: true }),
    "404.html": pageHtml({ extra: `<a href="gizlilik.html">g</a>` }),
    "500.html": pageHtml({ extra: `<a href="gizlilik.html">g</a>` }),
    "partials/site-footer.html": `<a href="gizlilik.html"></a><a href="kvkk.html"></a>`,
    "js/main.js": `AbortController sw-cookie-ack input[name="_gotcha"] FORMSPREE_ENDPOINT_RE form-error`,
    "js/i18n.js": `function x() { return "tr"; }\nfunction sanitizeTrustedHtml() {}`,
    "js/softenwise-network.js": `images/liman-kaleici.jpg?v=deadbeef01`,
    "css/style.css": `.cookie-notice { z-index: 1300; }`,
    "css/local-fonts.css": "x",
    "css/softenwise.css": "x",
    "js/sprite-inject.js": "x",
    "js/locales.js": "x",
    "scripts/asset-version.txt": `${VER}\n`,
    "images/og-image.png": "png",
    LICENSE: "MIT",
    "netlify.toml": `publish = "dist"\ncommand = "node scripts/pack-static.mjs"\n`,
  };
  return { ...base, ...overrides };
}

export function makeTempSite(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sw-site-"));
  writeTree(root, goodSiteFiles(overrides));
  return root;
}
