const fs=require("fs");
const s=fs.readFileSync("js/locales.js","utf8");
console.log(s.slice(0,300));
console.log("size", s.length);
console.log("footer.copy", (s.match(/footer\.copy/g)||[]).length);
console.log("langs", [...s.matchAll(/^\s{2}([a-z]{2}):\s*\{/gm)].map(m=>m[1]));
const og=fs.statSync("images/og-image.png");
const clinic=fs.statSync("images/clinic_image.png");
console.log("og", og.size, "clinic", clinic.size);
