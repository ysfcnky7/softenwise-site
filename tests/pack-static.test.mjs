import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { packStatic } from "../scripts/pack-static.mjs";

describe("packStatic", () => {
  it("copies public files and skips node_modules and tooling", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "sw-pack-"));
    fs.mkdirSync(path.join(root, "css"));
    fs.mkdirSync(path.join(root, "node_modules/playwright"), { recursive: true });
    fs.mkdirSync(path.join(root, "scripts"));
    fs.writeFileSync(path.join(root, "index.html"), "<html></html>");
    fs.writeFileSync(path.join(root, "css/style.css"), "body{}");
    fs.writeFileSync(path.join(root, "package.json"), "{}");
    fs.writeFileSync(path.join(root, "README.md"), "ok");
    fs.writeFileSync(path.join(root, "NOTES.md"), "skip");
    fs.writeFileSync(path.join(root, "node_modules/playwright/index.js"), "x");
    fs.writeFileSync(path.join(root, "scripts/x.mjs"), "x");
    fs.writeFileSync(path.join(root, ".env.local"), "secret");
    fs.symlinkSync(path.join(root, "index.html"), path.join(root, "link-skip"));

    const { dest, copied } = packStatic(root);
    assert.equal(fs.existsSync(path.join(dest, "index.html")), true);
    assert.equal(fs.existsSync(path.join(dest, "css/style.css")), true);
    assert.equal(fs.existsSync(path.join(dest, "README.md")), true);
    assert.equal(fs.existsSync(path.join(dest, "node_modules")), false);
    assert.equal(fs.existsSync(path.join(dest, "package.json")), false);
    assert.equal(fs.existsSync(path.join(dest, "NOTES.md")), false);
    assert.equal(fs.existsSync(path.join(dest, ".env.local")), false);
    assert.ok(copied.includes("index.html"));
    assert.ok(copied.includes("css"));
  });

  it("throws if node_modules appears in dist", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "sw-pack-leak-"));
    fs.mkdirSync(path.join(root, "css"));
    fs.writeFileSync(path.join(root, "css/style.css"), "body{}");
    const orig = fs.cpSync;
    fs.cpSync = (from, to, opts) => {
      orig(from, to, opts);
      fs.mkdirSync(path.join(root, "dist", "node_modules"), { recursive: true });
    };
    try {
      assert.throws(() => packStatic(root), /node_modules leaked/);
    } finally {
      fs.cpSync = orig;
    }
  });
});
