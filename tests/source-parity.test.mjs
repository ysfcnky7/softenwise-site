import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("browser sources keep allowlist logic", () => {
  it("js/i18n.js contains sanitizer primitives", () => {
    const src = fs.readFileSync(path.join(ROOT, "js/i18n.js"), "utf8");
    for (const needle of [
      "function isSafeHref",
      "function isSafeImgSrc",
      "function sanitizeTrustedHtml",
      "javascript:",
      "vbscript:",
      'return "tr"',
    ]) {
      assert.ok(src.includes(needle), needle);
    }
  });

  it("js/main.js contains form allowlist primitives", () => {
    const src = fs.readFileSync(path.join(ROOT, "js/main.js"), "utf8");
    for (const needle of [
      "const isSafeNavUrl",
      "const hrefAttr",
      "FORMSPREE_ENDPOINT_RE",
      "resolveFormEndpoint",
      "input[name=\"_gotcha\"]",
      "https://formspree.io/f/xldqyewl",
      "data-i18n=\"${escapeHtml(product.descKey)}\"",
    ]) {
      assert.ok(src.includes(needle), needle);
    }
  });
});
