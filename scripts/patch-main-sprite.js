const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const svgPath = path.join(root, "icons", "ui-sprite.svg");
const mainPath = path.join(root, "js", "main.js");

const svg = fs.readFileSync(svgPath, "utf8");

const inject = `(function () {
  if (document.getElementById("sw-svg-sprite")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = ${JSON.stringify(svg)}.trim();
  const svgEl = wrap.querySelector("svg");
  if (!svgEl) return;
  svgEl.id = "sw-svg-sprite";
  svgEl.setAttribute("aria-hidden", "true");
  svgEl.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  const skip = document.querySelector("a.skip-link");
  if (skip && skip.parentNode === document.body) {
    skip.insertAdjacentElement("afterend", svgEl);
  } else {
    document.body.prepend(svgEl);
  }
  document.querySelectorAll("use[href*='ui-sprite.svg']").forEach((el) => {
    const href = el.getAttribute("href");
    if (!href) return;
    const id = href.split("#")[1];
    if (id) el.setAttribute("href", "#" + id);
  });
})();

`;

let main = fs.readFileSync(mainPath, "utf8");
const marker = "// ===== SAFE SELECTORS =====";
const idx = main.indexOf(marker);
if (idx === -1) {
  console.error("main.js missing marker, abort.");
  process.exit(1);
}
main = inject + main.slice(idx);
fs.writeFileSync(mainPath, main);
console.log("main.js sprite inject güncellendi (icons/ui-sprite.svg ile senkron).");
