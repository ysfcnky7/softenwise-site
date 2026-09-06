import fs from "fs";
import path from "path";
const ROOT = process.cwd();
for (const name of fs.readdirSync(ROOT).filter(f=>f.endsWith(".html"))) {
  let t = fs.readFileSync(name,"utf8");
  const n = t
    .replace(/ required \/ id="/g, ' id="')
    .replace(/(\sid="field-[^"]+") \/>/g, '$1 />')
    .replace(/<input([^>]*?)\s\/\s+id="([^"]+)"\s*\/>/g, '<input$1 id="$2" />')
    .replace(/<input([^>]*?) required \/ id="/g, '<input$1 id="');
  // more aggressive fix for broken attrs
  const n2 = n.replace(/<input\b([^>]*?)>/g, (m, attrs) => {
    let a = attrs
      .replace(/\s\/\s+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s\/$/, "")
      .trim();
    // ensure self-close style optional
    if (!a.endsWith("/")) a += " /";
    return `<input ${a}>`.replace("<input  ", "<input ");
  });
  if (n2 !== t) {
    fs.writeFileSync(name, n2.replace(/\r\n/g,"\n"), "utf8");
    console.log("fixed inputs", name);
  }
}
