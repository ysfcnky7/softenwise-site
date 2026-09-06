import fs from "fs";
const ver = { locales: "202607229", i18n: "202607178", main: "202609050", sprite: "202607163", css: "202609050" };
for (const f of ["gizlilik.html","kvkk.html","cerez-politikasi.html"]) {
  let t = fs.readFileSync(f,"utf8");
  t = t
    .replace(/js\/locales\.js\?v=[^"]+/g, `js/locales.js?v=${ver.locales}`)
    .replace(/js\/i18n\.js\?v=[^"]+/g, `js/i18n.js?v=${ver.i18n}`)
    .replace(/js\/main\.js\?v=[^"]+/g, `js/main.js?v=${ver.main}`)
    .replace(/css\/style\.css\?v=[^"]+/g, `css/style.css?v=${ver.css}`)
    .replace(/css\/softenwise\.css\?v=[^"]+/g, `css/softenwise.css?v=${ver.css}`);
  fs.writeFileSync(f, t.replace(/\r\n/g,"\n"));
  console.log("versioned", f);
}
// bump main/css on all pages lightly for cache
for (const f of fs.readdirSync(".").filter(x=>x.endsWith(".html"))) {
  let t = fs.readFileSync(f,"utf8");
  const n = t
    .replace(/js\/main\.js\?v=[^"]+/g, `js/main.js?v=${ver.main}`)
    .replace(/css\/style\.css\?v=[^"]+/g, `css/style.css?v=${ver.css}`)
    .replace(/css\/softenwise\.css\?v=[^"]+/g, `css/softenwise.css?v=${ver.css}`)
    .replace(/css\/local-fonts\.css\?v=[^"]+/g, `css/local-fonts.css?v=${ver.css}`);
  if (n!==t) { fs.writeFileSync(f,n.replace(/\r\n/g,"\n")); console.log("bump", f); }
}
