import fs from "fs";
const html = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
const issues = [];
for (const f of html) {
  const t = fs.readFileSync(f, "utf8");
  if (t.includes("data-contact-form")) {
    if (!t.includes("form-label")) issues.push(`${f}: no form-label`);
    const labels = (t.match(/form-label/g) || []).length;
    if (labels < 3) issues.push(`${f}: labels=${labels}`);
  }
  if (!t.includes("gizlilik.html")) issues.push(`${f}: missing gizlilik`);
}
console.log("notes", fs.existsSync("notes.txt"));
console.log("404", /footer\.privacy/.test(fs.readFileSync("404.html", "utf8")));
console.log("issues", issues);
console.log("alert", /alert\(i18nText\("form\.err/.test(fs.readFileSync("js/main.js", "utf8")));
console.log("cookieZ", /z-index:\s*1300/.test(fs.readFileSync("css/style.css", "utf8")));
