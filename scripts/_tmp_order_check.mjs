import fs from "fs";
const h = fs.readFileSync("urunler.html", "utf8");
const jumps = [...h.matchAll(/class="product-jump-link"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
console.log("JUMPS", jumps);
const tiles = [...h.matchAll(/data-i18n="(urunler\.[^.]+)\.name"/g)].map((m) => m[1]);
console.log("NAME_KEYS", tiles);
const details = [...h.matchAll(/class="product-detail"[^>]*id="([^"]+)"/g)].map((m) => m[1]);
console.log("DETAILS", details);

const main = fs.readFileSync("js/main.js", "utf8");
const block = main.match(/const featuredProducts = \[([\s\S]*?)\];/)?.[1] || "";
const imgs = [...block.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);
for (const img of imgs) {
  console.log(img, fs.existsSync(img));
}
