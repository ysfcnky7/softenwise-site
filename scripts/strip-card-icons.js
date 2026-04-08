const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const re = /<div class="icon" aria-hidden="true">\s*<svg class="sw-icon"[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g;

const files = [
  "index.html",
  "kariyer.html",
  "guvenlik-denetim.html",
  "mobil-gelistirme.html",
  "entegrasyon-otomasyon.html",
  "teknik-danismanlik.html",
];

for (const f of files) {
  const fp = path.join(root, f);
  let s = fs.readFileSync(fp, "utf8");
  const n = (s.match(re) || []).length;
  s = s.replace(re, "");
  fs.writeFileSync(fp, s);
  console.log(f, "removed", n, "icon blocks");
}
