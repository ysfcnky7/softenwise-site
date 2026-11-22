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
import { isDirectRun } from "./lib/cli.mjs";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const CODE_ASSETS = [
  { kind: "href", file: "css/local-fonts.css" },
  { kind: "href", file: "css/style.css" },
  { kind: "href", file: "css/softenwise.css" },
  { kind: "src", file: "js/sprite-inject.js" },
  { kind: "src", file: "js/softenwise-network.js" },
  { kind: "src", file: "js/locales.js" },
  { kind: "src", file: "js/i18n.js" },
  { kind: "src", file: "js/main.js" },
];

export const JS_FILES = ["js/softenwise-network.js", "js/main.js", "js/i18n.js", "js/locales.js", "js/sprite-inject.js"];
export const CSS_FILES = CODE_ASSETS.filter((a) => a.file.startsWith("css/")).map((a) => a.file);

const MEDIA_RE =
  /((?:images|icons)\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg|gif|ico))(?:\?v=[A-Za-z0-9]+)?/g;
const ABS_MEDIA_RE =
  /(https:\/\/softenwise\.com\/(?:images|icons)\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg|gif|ico))(?:\?v=[A-Za-z0-9]+)?/g;
const FONT_URL_RE =
  /url\((['"]?)(\.\.\/fonts\/[A-Za-z0-9_.-]+\.woff2)(?:\?v=[A-Za-z0-9]+)?\1\)/g;

export function shortHash(buf) {
  return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 10);
}

export function hashFile(root, rel, hashCache) {
  const posix = rel.replace(/\\/g, "/");
  if (hashCache.has(posix)) return hashCache.get(posix);
  const full = path.join(root, ...posix.split("/"));
  if (!fs.existsSync(full)) {
    hashCache.set(posix, "missing");
    return "missing";
  }
  const h = shortHash(fs.readFileSync(full));
  hashCache.set(posix, h);
  return h;
}

export function parseArgs(argv) {
  const out = { dry: false, set: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry") out.dry = true;
    if (argv[i] === "--set" && argv[i + 1]) {
      out.set = String(argv[++i]).trim();
    }
  }
  return out;
}

export function stampMedia(content, root, hashCache) {
  let next = content.replace(MEDIA_RE, (full, file) => `${file}?v=${hashFile(root, file, hashCache)}`);
  next = next.replace(ABS_MEDIA_RE, (full, url) => {
    const rel = url.replace("https://softenwise.com/", "");
    return `${url}?v=${hashFile(root, rel, hashCache)}`;
  });
  return next;
}

export function stampFonts(css, root, hashCache) {
  return css.replace(FONT_URL_RE, (full, quote, relFromCss) => {
    const q = quote || "";
    const rel = relFromCss.replace(/^\.\.\//, "");
    return `url(${q}${relFromCss}?v=${hashFile(root, rel, hashCache)}${q})`;
  });
}

export function stampCode(html, version) {
  let next = html;
  for (const { kind, file } of CODE_ASSETS) {
    const esc = file.replace(/\./g, "\\.");
    const attr = kind === "href" ? "href" : "src";
    const re = new RegExp(`${attr}="${esc}(?:\\?v=[^"]*)?"`, "g");
    next = next.replace(re, `${attr}="${file}?v=${version}"`);
  }
  return next;
}

export function writeIfChanged(full, after, dry) {
  const before = fs.readFileSync(full, "utf8");
  if (before === after) return false;
  if (!dry) fs.writeFileSync(full, after, "utf8");
  return true;
}

export function bumpAssets({
  root = DEFAULT_ROOT,
  argv = process.argv.slice(2),
  log = console.log,
  error = console.error,
} = {}) {
  const args = parseArgs(argv);
  if (args.set && !/^[A-Za-z0-9]{8,14}$/.test(args.set)) {
    error("Invalid version. Use 8–14 digits/hex.");
    return 1;
  }
  const hashCache = new Map();
  const versionFile = path.join(root, "scripts", "asset-version.txt");

  let jsUpdated = 0;
  for (const rel of JS_FILES) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const after = stampMedia(fs.readFileSync(full, "utf8"), root, hashCache);
    if (writeIfChanged(full, after, args.dry)) jsUpdated++;
  }

  let cssUpdated = 0;
  for (const rel of CSS_FILES) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const after = stampFonts(fs.readFileSync(full, "utf8"), root, hashCache);
    if (writeIfChanged(full, after, args.dry)) cssUpdated++;
  }

  const codeBuf = CODE_ASSETS.map(({ file }) => {
    const full = path.join(root, file);
    return fs.existsSync(full) ? fs.readFileSync(full) : Buffer.alloc(0);
  });
  const hashed = shortHash(Buffer.concat(codeBuf));
  const version = args.set || hashed;

  const htmlFiles = fs
    .readdirSync(root)
    .filter((f) => f.endsWith(".html"))
    .sort();
  const partialDir = path.join(root, "partials");
  const partialFiles = fs.existsSync(partialDir)
    ? fs.readdirSync(partialDir).filter((f) => f.endsWith(".html")).map((f) => path.join("partials", f))
    : [];

  let htmlUpdated = 0;
  for (const name of htmlFiles) {
    const full = path.join(root, name);
    const after = stampCode(stampMedia(fs.readFileSync(full, "utf8"), root, hashCache), version);
    if (writeIfChanged(full, after, args.dry)) htmlUpdated++;
  }

  let partialUpdated = 0;
  for (const rel of partialFiles) {
    const full = path.join(root, rel);
    const after = stampMedia(fs.readFileSync(full, "utf8"), root, hashCache);
    if (writeIfChanged(full, after, args.dry)) partialUpdated++;
  }

  if (!args.dry) {
    fs.mkdirSync(path.dirname(versionFile), { recursive: true });
    fs.writeFileSync(versionFile, `${version}\n`, "utf8");
  }

  log(
    `${args.dry ? "[dry] " : ""}code v=${version} → ${htmlUpdated}/${htmlFiles.length} HTML, ${partialUpdated}/${partialFiles.length} partials, ${jsUpdated}/${JS_FILES.length} JS, ${cssUpdated}/${CSS_FILES.length} CSS`
  );
  return 0;
}

/* c8 ignore next 3 */
if (isDirectRun(import.meta.url)) {
  process.exit(bumpAssets());
}
