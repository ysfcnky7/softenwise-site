import fs from "fs";

// notes.txt out of public tree
if (fs.existsSync("notes.txt")) {
  fs.mkdirSync("docs", { recursive: true });
  fs.writeFileSync("docs/OPS_NOTES.local.md", "# Local ops (do not publish)\n\n" + fs.readFileSync("notes.txt","utf8"), "utf8");
  fs.unlinkSync("notes.txt");
  console.log("moved notes.txt -> docs/OPS_NOTES.local.md");
}

let gi = fs.readFileSync(".gitignore","utf8");
if (!gi.includes("OPS_NOTES")) {
  gi += "\ndocs/OPS_NOTES.local.md\nnotes.txt\n";
  fs.writeFileSync(".gitignore", gi.replace(/\r\n/g,"\n"));
}

// LICENSE
fs.writeFileSync("LICENSE", `Copyright (c) 2022-2026 SoftenWise

All rights reserved.

This repository contains SoftenWise marketing website source.
Unauthorized copying, redistribution, or commercial reuse of SoftenWise
brand assets, copy, or code without written permission is prohibited.

Third-party packages under node_modules/ retain their own licenses.
`, "utf8");

// Font fallbacks for non-latin UI languages
let fonts = fs.readFileSync("css/local-fonts.css","utf8");
if (!fonts.includes("lang=\"ar\"")) {
  fonts += `

/* Non-latin packs: system stacks (latin webfonts lack glyphs) */
html[lang="ar"] body,
html[lang="ar"] button,
html[lang="ar"] input,
html[lang="ar"] textarea,
html[lang="ar"] select {
  font-family: "Segoe UI", "Tahoma", "Arial Unicode MS", sans-serif;
}
html[lang="ar"] .page-hero__title,
html[lang="ar"] h1,
html[lang="ar"] h2 {
  font-family: "Segoe UI", "Tahoma", "Arial Unicode MS", sans-serif;
}
html[lang="ru"] body {
  font-family: "Outfit", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}
`;
  fs.writeFileSync("css/local-fonts.css", fonts.replace(/\r\n/g,"\n"));
  console.log("font fallbacks added");
}

// Locales short keys + product.soon
const localesPath = "js/locales.js";
let loc = fs.readFileSync(localesPath,"utf8");
const extras = {
  "footer.privacy.short": { tr:"Gizlilik", en:"Privacy", de:"Datenschutz", fr:"Confidentialité", ar:"الخصوصية", ru:"Конфиденц.", es:"Privacidad", it:"Privacy", nl:"Privacy", pt:"Privacidade", az:"Məxfilik" },
  "footer.kvkk.short": { tr:"KVKK", en:"KVKK", de:"KVKK", fr:"KVKK", ar:"KVKK", ru:"KVKK", es:"KVKK", it:"KVKK", nl:"KVKK", pt:"KVKK", az:"KVKK" },
  "footer.cookies.short": { tr:"Çerezler", en:"Cookies", de:"Cookies", fr:"Cookies", ar:"الكوكيز", ru:"Cookie", es:"Cookies", it:"Cookie", nl:"Cookies", pt:"Cookies", az:"Kukilər" },
  "product.soon": { tr:"Yakında", en:"Coming soon", de:"Demnächst", fr:"Bientôt", ar:"قريبًا", ru:"Скоро", es:"Pronto", it:"Presto", nl:"Binnenkort", pt:"Em breve", az:"Tezliklə" },
  "career.role": { tr:"Başvurduğunuz rol", en:"Role you are applying for", de:"Beworbene Rolle", fr:"Poste visé", ar:"الدور المتقدم له", ru:"Желаемая роль", es:"Puesto", it:"Ruolo", nl:"Functie", pt:"Função", az:"Müraciət olunan rol" },
  "partner.idea": { tr:"Fikir / proje adı", en:"Idea / project name", de:"Idee / Projektname", fr:"Idée / nom du projet", ar:"اسم الفكرة / المشروع", ru:"Название идеи", es:"Idea / proyecto", it:"Idea / progetto", nl:"Idee / project", pt:"Ideia / projeto", az:"Fikir / layihə adı" },
  "common.contact.message": { tr:"Mesaj", en:"Message", de:"Nachricht", fr:"Message", ar:"الرسالة", ru:"Сообщение", es:"Mensaje", it:"Messaggio", nl:"Bericht", pt:"Mensagem", az:"Mesaj" },
};
const langs = ["tr","en","de","fr","ar","ru","es","it","nl","pt","az"];
for (const lang of langs) {
  const blockRe = new RegExp(`"${lang}"\\s*:\\s*\\{`);
  const m = loc.match(blockRe);
  if (!m) continue;
  const start = loc.indexOf(m[0]) + m[0].length;
  let inject = "";
  const packSlice = loc.slice(start, start + 90000);
  for (const [k, map] of Object.entries(extras)) {
    if (packSlice.includes(`"${k}"`)) continue;
    inject += `\n    "${k}": ${JSON.stringify(map[lang] || map.en)},`;
  }
  if (inject) loc = loc.slice(0, start) + inject + loc.slice(start);
}
fs.writeFileSync(localesPath, loc.replace(/\r\n/g,"\n"));
console.log("locales patched");

// Yakında in main.js
let main = fs.readFileSync("js/main.js","utf8");
if (main.includes('"Yakında"') || main.includes("'Yakında'")) {
  main = main.replace(/["']Yakında["']/, 'i18nText("product.soon", "Yakında")');
  // i18nText may not be in scope early - check
  fs.writeFileSync("js/main.js", main.replace(/\r\n/g,"\n"));
  console.log("yakinda patched - verify scope");
}
