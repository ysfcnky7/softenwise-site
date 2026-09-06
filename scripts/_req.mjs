import fs from "fs";
for (const name of fs.readdirSync(".").filter(f=>f.endsWith(".html"))) {
  let t = fs.readFileSync(name,"utf8");
  const n = t
    .replace(/<input type="text" name="name"([^>]*?)(?:\s+required)?(\s*\/?)>/g, (m, mid, end) => {
      if (/\brequired\b/.test(mid)) return m;
      return `<input type="text" name="name"${mid} required${end || " /"}>`;
    })
    .replace(/<input type="email" name="email"([^>]*?)(?:\s+required)?(\s*\/?)>/g, (m, mid, end) => {
      if (/\brequired\b/.test(mid)) return m;
      return `<input type="email" name="email"${mid} required${end || " /"}>`;
    })
    .replace(/<input type="text" name="role"([^>]*?)(?:\s+required)?(\s*\/?)>/g, (m, mid, end) => {
      if (/\brequired\b/.test(mid)) return m;
      return `<input type="text" name="role"${mid} required${end || " /"}>`;
    })
    .replace(/<input type="text" name="idea_name"([^>]*?)(?:\s+required)?(\s*\/?)>/g, (m, mid, end) => {
      if (/\brequired\b/.test(mid)) return m;
      return `<input type="text" name="idea_name"${mid} required${end || " /"}>`;
    });
  if (n!==t) { fs.writeFileSync(name,n.replace(/\r\n/g,"\n")); console.log("required", name); }
}
