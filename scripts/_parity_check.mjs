import fs from "fs";
import path from "path";

const src = fs.readFileSync("js/locales.js", "utf8");
const langs = [...src.matchAll(/^\s{2}([a-z]{2}):\s*\{/gm)].map((m) => m[1]);
console.log("langs", langs);

function keysFor(lang) {
  const re = new RegExp(`^\\s{2}${lang}:\\s*\\{`, "m");
  const start = src.search(re);
  if (start < 0) return new Set();
  let depth = 0;
  let i = src.indexOf("{", start);
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const block = src.slice(start, i + 1);
  const keys = [...block.matchAll(/"([^"]+)":\s*"/g)].map((m) => m[1]);
  return new Set(keys);
}

const sets = {};
for (const l of langs) sets[l] = keysFor(l);
const tr = sets.tr || new Set();
console.log("tr keys", tr.size);

const critical = [
  "home.hero.lead",
  "home.showcase.sub",
  "home.showcase.all",
  "home.showcase.products",
  "home.showcase.cta",
  "home.showcase.clinic.name",
  "home.showcase.clinic.desc",
  "home.showcase.liman.name",
  "home.showcase.liman.desc",
  "home.showcase.bloc.name",
  "home.showcase.bloc.desc",
  "home.showcase.maps.name",
  "home.showcase.maps.desc",
  "home.case.liman",
  "home.case.liman.meta",
  "home.case.sector",
  "home.case.clinic.meta",
  "home.case.maps",
  "home.case.maps.meta",
  "home.case.otomini",
  "home.case.otomini.meta",
  "home.refs.label",
  "home.refs.proof",
  "liman.title",
  "marina.title",
];

for (const l of langs) {
  const missing = critical.filter((k) => !sets[l].has(k));
  if (missing.length) console.log("MISSING critical", l, missing.join(", "));
  else console.log("OK critical", l);
}

for (const l of langs) {
  if (l === "tr") continue;
  const miss = [...tr].filter((k) => !sets[l].has(k));
  const extra = [...sets[l]].filter((k) => !tr.has(k));
  console.log(`${l}: missing=${miss.length} extra=${extra.length}`);
  if (miss.length) console.log("  miss:", miss.slice(0, 25).join(" | "));
}

// HTML data-i18n keys present but missing in tr
const htmlFiles = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
const used = new Set();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) used.add(m[1]);
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const part of m[1].split(";")) {
      const key = part.split(":")[1];
      if (key) used.add(key.trim());
    }
  }
}
const missingInTr = [...used].filter((k) => !tr.has(k)).sort();
console.log("HTML keys missing in tr:", missingInTr.length);
if (missingInTr.length) console.log(missingInTr.slice(0, 40).join("\n"));

// broken local hrefs
const missingHrefs = [];
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const h = m[1];
    if (
      h.startsWith("#") ||
      h.startsWith("mailto:") ||
      h.startsWith("tel:") ||
      h.startsWith("http") ||
      h.startsWith("javascript:") ||
      h.startsWith("data:")
    )
      continue;
    const clean = h.split("#")[0].split("?")[0];
    if (!clean) continue;
    if (!fs.existsSync(clean)) missingHrefs.push(`${f}: ${h}`);
  }
}
console.log("broken local hrefs", missingHrefs.length);
missingHrefs.slice(0, 40).forEach((x) => console.log(x));

const imgs = [
  "images/showcase/liman-live.png",
  "images/showcase/clinic-ui.png",
  "images/showcase/bloc-fake.jpg",
  "images/showcase/maps-fake.jpg",
  "images/reference/kaleiciyatlimaniref.svg",
];
for (const i of imgs) console.log(i, fs.existsSync(i) ? "OK" : "MISSING");

// cache bust consistency
const versions = new Set();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  for (const m of html.matchAll(/js\/(?:locales|i18n|main)\.js\?v=(\d+)/g)) {
    versions.add(`${f}:${m[0]}`);
  }
}
const vNums = new Set(
  [...versions].map((x) => x.match(/\?v=(\d+)/)?.[1]).filter(Boolean)
);
console.log("cache bust versions", [...vNums]);
if (vNums.size > 1) console.log("INCONSISTENT cache bust");
else console.log("cache bust OK");
