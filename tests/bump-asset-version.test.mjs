import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import {
  bumpAssets,
  hashFile,
  parseArgs,
  shortHash,
  stampCode,
  stampFonts,
  stampMedia,
  writeIfChanged,
  CODE_ASSETS,
  JS_FILES,
  CSS_FILES,
} from "../scripts/bump-asset-version.mjs";

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "sw-bump-"));
}

function write(root, rel, body) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body);
}

describe("parseArgs / shortHash / hashFile", () => {
  it("parses dry and set", () => {
    assert.deepEqual(parseArgs([]), { dry: false, set: null });
    assert.deepEqual(parseArgs(["--dry"]), { dry: true, set: null });
    assert.deepEqual(parseArgs(["--set", "2026112301"]), { dry: false, set: "2026112301" });
    assert.deepEqual(parseArgs(["--set"]), { dry: false, set: null });
    assert.deepEqual(parseArgs(["--dry", "--set", "abcdefghij"]), { dry: true, set: "abcdefghij" });
  });

  it("hashes buffers and missing files", () => {
    const h = shortHash(Buffer.from("abc"));
    assert.match(h, /^[a-f0-9]{10}$/);
    const root = tmpDir();
    const cache = new Map();
    assert.equal(hashFile(root, "images/nope.png", cache), "missing");
    assert.equal(hashFile(root, "images/nope.png", cache), "missing");
    write(root, "images/ok.png", "png");
    const slash = hashFile(root, "images\\ok.png", new Map());
    assert.match(slash, /^[a-f0-9]{10}$/);
    const a = hashFile(root, "images/ok.png", cache);
    const b = hashFile(root, "images/ok.png", cache);
    assert.equal(a, b);
    assert.match(a, /^[a-f0-9]{10}$/);
  });
});

describe("stampMedia / stampFonts / stampCode / writeIfChanged", () => {
  it("stamps relative and absolute media plus fonts", () => {
    const root = tmpDir();
    write(root, "images/og-image.png", "png");
    write(root, "fonts/Inter.woff2", "font");
    const cache = new Map();
    const html = stampMedia(
      `src="images/og-image.png" abs="https://softenwise.com/images/og-image.png"`,
      root,
      cache
    );
    assert.match(html, /images\/og-image\.png\?v=[a-f0-9]{10}/);
    assert.match(html, /https:\/\/softenwise\.com\/images\/og-image\.png\?v=[a-f0-9]{10}/);

    const quoted = stampFonts(`url('../fonts/Inter.woff2')`, root, cache);
    assert.match(quoted, /url\('\.\.\/fonts\/Inter\.woff2\?v=[a-f0-9]{10}'\)/);
    const bare = stampFonts(`url(../fonts/Inter.woff2)`, root, cache);
    assert.match(bare, /url\(\.\.\/fonts\/Inter\.woff2\?v=[a-f0-9]{10}\)/);
  });

  it("rewrites code asset href/src", () => {
    const html = CODE_ASSETS.map((a) => `${a.kind}="${a.file}"`).join(" ");
    const out = stampCode(html, "ver1234567");
    for (const a of CODE_ASSETS) {
      assert.ok(out.includes(`${a.kind}="${a.file}?v=ver1234567"`), a.file);
    }
    const again = stampCode(`href="css/style.css?v=old"`, "newversion1");
    assert.equal(again, `href="css/style.css?v=newversion1"`);
  });

  it("writeIfChanged skips equal, writes, and dry-runs", () => {
    const root = tmpDir();
    const file = path.join(root, "a.txt");
    fs.writeFileSync(file, "same");
    assert.equal(writeIfChanged(file, "same", false), false);
    assert.equal(writeIfChanged(file, "next", true), true);
    assert.equal(fs.readFileSync(file, "utf8"), "same");
    assert.equal(writeIfChanged(file, "next", false), true);
    assert.equal(fs.readFileSync(file, "utf8"), "next");
  });
});

describe("bumpAssets", () => {
  it("rejects invalid --set before writing", () => {
    const logs = [];
    const code = bumpAssets({
      root: tmpDir(),
      argv: ["--set", "bad"],
      log: () => {},
      error: (m) => logs.push(m),
    });
    assert.equal(code, 1);
    assert.match(logs.join(" "), /Invalid version/);
  });

  it("dry-run stamps without writing version file", () => {
    const root = tmpDir();
    write(root, "index.html", `<img src="images/og-image.png" /><link href="css/style.css">`);
    write(root, "images/og-image.png", "png");
    write(root, "css/style.css", `url(../fonts/Inter.woff2)`);
    write(root, "fonts/Inter.woff2", "f");
    for (const a of CODE_ASSETS) write(root, a.file, "x");
    const code = bumpAssets({ root, argv: ["--dry", "--set", "2026112301"], log: () => {}, error: () => {} });
    assert.equal(code, 0);
    assert.equal(fs.existsSync(path.join(root, "scripts/asset-version.txt")), false);
    assert.equal(fs.readFileSync(path.join(root, "index.html"), "utf8").includes("?v="), false);
  });

  it("writes HTML, JS, CSS, partials, and version; skips missing code files", () => {
    const root = tmpDir();
    write(root, "index.html", `<img src="images/og-image.png" /><script src="js/main.js"></script>`);
    write(root, "images/og-image.png", "png");
    write(root, "js/main.js", `const x = "images/og-image.png";`);
    write(root, "css/style.css", `url('../fonts/Inter.woff2')`);
    write(root, "fonts/Inter.woff2", "f");
    write(root, "partials/site-footer.html", `<img src="icons/favicon.ico">`);
    write(root, "icons/favicon.ico", "ico");
    const messages = [];
    const code = bumpAssets({
      root,
      argv: ["--set", "2026112301"],
      log: (m) => messages.push(m),
      error: () => {},
    });
    assert.equal(code, 0);
    const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
    assert.match(html, /js\/main\.js\?v=2026112301/);
    assert.match(html, /images\/og-image\.png\?v=/);
    const js = fs.readFileSync(path.join(root, "js/main.js"), "utf8");
    assert.match(js, /images\/og-image\.png\?v=/);
    const css = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
    assert.match(css, /Inter\.woff2\?v=/);
    const partial = fs.readFileSync(path.join(root, "partials/site-footer.html"), "utf8");
    assert.match(partial, /icons\/favicon\.ico\?v=/);
    assert.equal(fs.readFileSync(path.join(root, "scripts/asset-version.txt"), "utf8").trim(), "2026112301");
    assert.match(messages.join("\n"), /code v=2026112301/);
    assert.ok(JS_FILES.length >= 1 && CSS_FILES.length >= 1);
  });

  it("hashes code when --set is omitted and no-ops on second run", () => {
    const root = tmpDir();
    write(root, "page.html", `<script src="js/main.js"></script>`);
    for (const a of CODE_ASSETS) write(root, a.file, "payload");
    const code = bumpAssets({ root, argv: [], log: () => {}, error: () => {} });
    assert.equal(code, 0);
    const v = fs.readFileSync(path.join(root, "scripts/asset-version.txt"), "utf8").trim();
    assert.match(v, /^[a-f0-9]{10}$/);
    const again = bumpAssets({ root, argv: ["--set", v], log: () => {}, error: () => {} });
    assert.equal(again, 0);
  });
});
