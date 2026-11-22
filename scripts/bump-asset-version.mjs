/**
 * SoftenWise — asset cache-bust (?v=)
 *
 * HTML is short-cached (must-revalidate). CSS/JS/images are long-cached and
 * busted by content hash so a file change is a new URL for every visitor.
 *
 *   npm run bump
 *   npm run bump -- --dry
 *   npm run bump -- --set 2026112301   (CSS/JS only; images still hashed)
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_FILE = path.join(ROOT, "scripts", "asset-version.txt");

const CODE_ASSETS = [
  { kind: "href", file: "css/local-fonts.css" },
  { kind: "href", file: "css/style.css" },
  { kind: "href", file: "css/softenwise.css" },
  { kind: "src", file: "js/sprite-inject.js" },
  { kind: "src", file: "js/softenwise-network.js" },
  { kind: "src", file: "js/locales.js" },
  { kind: "src", file: "js/i18n.js" },
  { kind: "src", file: "js/main.js" },
];

const JS_FILES = ["js/softenwise-network.js", "js/main.js", "js/i18n.js", "js/locales.js", "js/sprite-inject.js"];

const MEDIA_RE =
  /((?:images|icons)\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg|gif|ico))(?:\?v=[A-Za-z0-9]+)?/g;
const ABS_MEDIA_RE =
  /(https:\/\/softenwise\.com\/(?:images|icons)\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg|gif|ico))(?:\?v=[A-Za-z0-9]+)?/g;

const hashCache = new Map();

function shortHash(buf) {
  return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 10);
}

function hashFile(rel) {
  const posix = rel.replace(/\\/g, "/");
  if (hashCache.has(posix)) return hashCache.get(posix);
  const full = path.join(ROOT, ...posix.split("/"));
  if (!fs.existsSync(full)) {
    hashCache.set(posix, "missing");
    return "missing";
  }
  const h = shortHash(fs.readFileSync(full));
  hashCache.set(posix, h);
  return h;
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

function stampMedia(content) {
  let next = content.replace(MEDIA_RE, (full, file) => `${file}?v=${hashFile(file)}`);
  next = next.replace(ABS_MEDIA_RE, (full, url) => {
    const rel = url.replace("https://softenwise.com/", "");
    return `${url}?v=${hashFile(rel)}`;
  });
  return next;
}

function stampCode(html, version) {
  let next = html;
  for (const { kind, file } of CODE_ASSETS) {
    const esc = file.replace(/\./g, "\\.");
    const attr = kind === "href" ? "href" : "src";
    const re = new RegExp(`${attr}="${esc}(?:\\?v=[^"]*)?"`, "g");
    next = next.replace(re, `${attr}="${file}?v=${version}"`);
  }
  return next;
}

function writeIfChanged(full, after, dry) {
  const before = fs.readFileSync(full, "utf8");
  if (before === after) return false;
  if (!dry) fs.writeFileSync(full, after, "utf8");
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  let jsUpdated = 0;
  for (const rel of JS_FILES) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    const after = stampMedia(fs.readFileSync(full, "utf8"));
    if (writeIfChanged(full, after, args.dry)) jsUpdated++;
  }

  const codeBuf = CODE_ASSETS.map(({ file }) => fs.readFileSync(path.join(ROOT, file)));
  const hashed = shortHash(Buffer.concat(codeBuf));
  const version = args.set || hashed;
  if (!/^[A-Za-z0-9]{8,14}$/.test(version)) {
    console.error("Invalid version. Use 8–14 digits/hex.");
    process.exit(1);
  }

  const htmlFiles = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith(".html"))
    .sort();

  let htmlUpdated = 0;
  for (const name of htmlFiles) {
    const full = path.join(ROOT, name);
    const after = stampCode(stampMedia(fs.readFileSync(full, "utf8")), version);
    if (writeIfChanged(full, after, args.dry)) htmlUpdated++;
  }

  if (!args.dry) {
    fs.writeFileSync(VERSION_FILE, `${version}\n`, "utf8");
  }

  console.log(
    `${args.dry ? "[dry] " : ""}code v=${version} → ${htmlUpdated}/${htmlFiles.length} HTML, ${jsUpdated}/${JS_FILES.length} JS`
  );
}

main();
