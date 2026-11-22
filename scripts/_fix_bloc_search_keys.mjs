import fs from "fs";

const translations = {
  tr: {
    "bloc.play.search": "Google Play’de BLOC ara",
    "bloc.ios.search": "App Store’da BLOC ara",
  },
  en: {
    "bloc.play.search": "Search BLOC on Google Play",
    "bloc.ios.search": "Search BLOC on the App Store",
  },
  de: {
    "bloc.play.search": "BLOC im Google Play suchen",
    "bloc.ios.search": "BLOC im App Store suchen",
  },
  fr: {
    "bloc.play.search": "Rechercher BLOC sur Google Play",
    "bloc.ios.search": "Rechercher BLOC sur l’App Store",
  },
  ar: {
    "bloc.play.search": "ابحث عن BLOC في Google Play",
    "bloc.ios.search": "ابحث عن BLOC في App Store",
  },
  ru: {
    "bloc.play.search": "Искать BLOC в Google Play",
    "bloc.ios.search": "Искать BLOC в App Store",
  },
  es: {
    "bloc.play.search": "Buscar BLOC en Google Play",
    "bloc.ios.search": "Buscar BLOC en App Store",
  },
  it: {
    "bloc.play.search": "Cerca BLOC su Google Play",
    "bloc.ios.search": "Cerca BLOC sull’App Store",
  },
  nl: {
    "bloc.play.search": "Zoek BLOC in Google Play",
    "bloc.ios.search": "Zoek BLOC in de App Store",
  },
  pt: {
    "bloc.play.search": "Pesquisar BLOC no Google Play",
    "bloc.ios.search": "Pesquisar BLOC na App Store",
  },
  az: {
    "bloc.play.search": "Google Play-də BLOC axtar",
    "bloc.ios.search": "App Store-da BLOC axtar",
  },
};

let src = fs.readFileSync("js/locales.js", "utf8");

for (const [lang, pairs] of Object.entries(translations)) {
  const marker = `"${lang}": {`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`lang block missing: ${lang}`);
  let depth = 0;
  let i = src.indexOf("{", start);
  const blockStart = i;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const blockEnd = i;
  let block = src.slice(blockStart + 1, blockEnd);

  for (const [key, value] of Object.entries(pairs)) {
    const keyRe = new RegExp(`"${key.replace(/\./g, "\\.")}"\\s*:`);
    const line = `"${key}": ${JSON.stringify(value)},`;
    if (keyRe.test(block)) {
      block = block.replace(
        new RegExp(`"${key.replace(/\./g, "\\.")}"\\s*:\\s*"[^"]*"`),
        line.replace(/,$/, "")
      );
    } else {
      const anchor = `"urunler.bloc.b5"`;
      const aIdx = block.indexOf(anchor);
      if (aIdx >= 0) {
        const lineEnd = block.indexOf("\n", aIdx);
        block = block.slice(0, lineEnd) + `\n    ${line}` + block.slice(lineEnd);
      } else {
        block = `\n    ${line}` + block;
      }
    }
  }

  src = src.slice(0, blockStart + 1) + block + src.slice(blockEnd);
}

fs.writeFileSync("js/locales.js", src);
console.log("patched bloc.play.search + bloc.ios.search");

const ver = "202611222";
for (const f of fs.readdirSync(".").filter((x) => x.endsWith(".html"))) {
  let t = fs.readFileSync(f, "utf8");
  const n = t
    .replace(/js\/locales\.js\?v=[^"]+/g, `js/locales.js?v=${ver}`)
    .replace(/js\/i18n\.js\?v=[^"]+/g, `js/i18n.js?v=${ver}`)
    .replace(/js\/main\.js\?v=[^"]+/g, `js/main.js?v=${ver}`);
  if (n !== t) {
    fs.writeFileSync(f, n);
    console.log("bumped", f);
  }
}
