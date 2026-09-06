import fs from "fs";
const items = JSON.parse(fs.readFileSync("scripts/_softenwise_checklist.json","utf8"));
// Write compact checklist: Sira.Madde | text
let out = "";
let cur = null;
for (const it of items) {
  if (it.sira !== cur) {
    cur = it.sira;
    out += `\n## S${cur} | ${it.faz} | ${it.modul}\n`;
  }
  out += `S${it.sira}.${it.maddeNo}| ${it.kontrol}\n`;
}
fs.writeFileSync("scripts/_all_items.txt", out, "utf8");
console.log("lines", out.split("\n").length);
