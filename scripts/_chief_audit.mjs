/** One-shot SoftenWise site audit for chief loop */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const report = { missingKeys: [], versionSkew: {}, brokenLocalHrefs: [], showcase: {}, notes: [] };

eval(
  fs.readFileSync(path.join(ROOT, "js/locales.js"), "utf8").replace(
    "window.SW_LOCALES",
    "globalThis.SW_LOCALES"
  )
);
const langs = Object.keys(SW_LOCALES);
const trKeys = Object.keys(SW_LOCALES.tr);
const parity = {};
for (const l of langs) {
  if (l === "tr") continue;
  const miss = trKeys.filter((k) => !(k in SW_LOCALES[l]));
  if (miss.length) parity[l] = miss;
}
report.parityGaps = parity;
report.trKeyCount = trKeys.length;

const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const versions = {};
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) {
    if (!(m[1] in SW_LOCALES.tr)) report.missingKeys.push(`${f}:${m[1]}`);
  }
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const part of m[1].split(";")) {
      const key = part.split(":").pop()?.trim();
      if (key && !(key in SW_LOCALES.tr)) report.missingKeys.push(`${f}:attr:${key}`);
    }
  }
  const lv = html.match(/locales\.js\?v=([0-9]+)/)?.[1];
  const iv = html.match(/i18n\.js\?v=([0-9]+)/)?.[1];
  const mv = html.match(/main\.js\?v=([0-9]+)/)?.[1];
  versions[f] = { locales: lv, i18n: iv, main: mv };

  for (const m of html.matchAll(/href="([^"#?]+\.html)(#[^"]*)?"/g)) {
    const target = m[1];
    if (target.startsWith("http")) continue;
    if (!fs.existsSync(path.join(ROOT, target))) {
      report.brokenLocalHrefs.push(`${f} -> ${target}`);
    }
  }
}
report.versions = versions;
const locSet = new Set(Object.values(versions).map((v) => v.locales).filter(Boolean));
const i18nSet = new Set(Object.values(versions).map((v) => v.i18n).filter(Boolean));
const mainSet = new Set(Object.values(versions).map((v) => v.main).filter(Boolean));
report.versionSkew = {
  locales: [...locSet],
  i18n: [...i18nSet],
  main: [...mainSet],
};

const mainJs = fs.readFileSync(path.join(ROOT, "js/main.js"), "utf8");
const netJs = fs.readFileSync(path.join(ROOT, "js/softenwise-network.js"), "utf8");
const siteIds = [...netJs.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
const productIds = siteIds.filter((id) => id !== "softenwise");
report.showcase.order = productIds;
report.showcase.count = productIds.length;
report.showcase.fromNetwork = /showcaseProducts/.test(netJs) && /SoftenWiseNetwork\.showcaseProducts/.test(mainJs);
report.showcase.limanFirst = productIds[0] === "liman";

const crit = [
  "home.hero.lead",
  "home.showcase.products",
  "home.showcase.liman.name",
  "home.showcase.liman.desc",
  "home.case.liman",
];
report.criticalKeys = Object.fromEntries(
  crit.map((k) => [k, langs.every((l) => k in SW_LOCALES[l])])
);

const gi = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");
report.gitignoreNodeModules = /node_modules\//.test(gi);

const unclean =
  report.missingKeys.length > 0 ||
  report.brokenLocalHrefs.length > 0 ||
  !report.showcase.limanFirst ||
  !report.showcase.fromNetwork ||
  report.showcase.count < 2 ||
  Object.keys(report.parityGaps || {}).length > 0 ||
  Object.values(report.criticalKeys || {}).some((ok) => !ok) ||
  report.versionSkew.locales.length !== 1 ||
  report.versionSkew.i18n.length !== 1 ||
  report.versionSkew.main.length !== 1 ||
  !report.gitignoreNodeModules;

report.clean = !unclean;

fs.writeFileSync(
  path.join(ROOT, "scripts/_chief_audit_report.json"),
  JSON.stringify(report, null, 2)
);
console.log(JSON.stringify(report, null, 2));
if (unclean) process.exit(1);
