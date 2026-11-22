import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "js", "main.js"), "utf8");

describe("js/main.js form contracts (static, no Playwright)", () => {
  it("keeps honeypot, min-fill, rate-limit and abort timeout", () => {
    assert.match(src, /name="_gotcha"/);
    assert.match(src, /elapsedMs < 4000/);
    assert.match(src, /RL_KEY = "sw-form-rl"/);
    assert.match(src, /new AbortController/);
  });

  it("keeps topic select values iletisim/oneri/sikayet", () => {
    assert.match(src, /name="topic"/);
    assert.match(src, /\["iletisim"/);
    assert.match(src, /\["oneri"/);
    assert.match(src, /\["sikayet"/);
  });

  it("does not post the honeypot field", () => {
    assert.match(src, /formData\.delete\("_gotcha"\)/);
  });
});
