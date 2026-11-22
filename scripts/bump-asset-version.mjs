/**
 * SoftenWise — otomatik asset cache-bust (?v=)
 *
 * Kullanım:
 *   npm run bump                 → yeni sürüm üret, tüm HTML’e yaz
 *   npm run bump -- --set 2026112301
 *   npm run bump -- --dry
 *
 * Sürüm: YYYYMMDDHHmm (yerel saat). Tek numara = CSS + JS senkron.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_FILE = path.join(ROOT, "scripts", "asset-version.txt");

const ASSETS = [
  { kind: "href", file: "css/local-fonts.css" },
  { kind: "href", file: "css/style.css" },
  { kind: "href", file: "css/softenwise.css" },
  { kind: "src", file: "js/sprite-inject.js" },
  { kind: "src", file: "js/softenwise-network.js" },
  { kind: "src", file: "js/locales.js" },
  { kind: "src", file: "js/i18n.js" },
  { kind: "src", file: "js/main.js" },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function nowVersion() {
  const d = new Date();
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `${pad(d.getHours())}${pad(d.getMinutes())}`
  );
}

function parseArgs(argv) {
  const out = { dry: false, set: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry") out.dry = true;
    if (argv[i] === "--set" && argv[i + 1]) {
      out.set = String(argv[++i]).trim();
    }
  }
  return out;
}

function bumpHtml(html, version) {
  let next = html;
  for (const { kind, file } of ASSETS) {
    const esc = file.replace(/\./g, "\\.");
    if (kind === "href") {
      const re = new RegExp(`href="${esc}(?:\\?v=[^"]*)?"`, "g");
      next = next.replace(re, `href="${file}?v=${version}"`);
    } else {
      const re = new RegExp(`src="${esc}(?:\\?v=[^"]*)?"`, "g");
      next = next.replace(re, `src="${file}?v=${version}"`);
    }
  }
  return next;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const version = args.set || nowVersion();
  if (!/^\d{10,14}$/.test(version)) {
    console.error("Invalid version. Use digits only, e.g. 202611231145");
    process.exit(1);
  }

  const htmlFiles = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith(".html"))
    .sort();

  let changed = 0;
  for (const name of htmlFiles) {
    const full = path.join(ROOT, name);
    const before = fs.readFileSync(full, "utf8");
    const after = bumpHtml(before, version);
    if (after !== before) {
      changed++;
      if (!args.dry) {
        fs.writeFileSync(full, after, "utf8");
      }
    }
  }

  if (!args.dry) {
    fs.writeFileSync(VERSION_FILE, `${version}\n`, "utf8");
  }

  console.log(
    `${args.dry ? "[dry] " : ""}asset version v=${version} → ${changed}/${htmlFiles.length} HTML updated`
  );
  console.log(`assets: ${ASSETS.map((a) => a.file).join(", ")}`);
}

main();
