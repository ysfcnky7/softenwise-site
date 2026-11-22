import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isDirectRun } from "../scripts/lib/cli.mjs";

describe("isDirectRun", () => {
  it("rejects missing args", () => {
    assert.equal(isDirectRun("", "x"), false);
    assert.equal(isDirectRun("file:///x", ""), false);
    assert.equal(isDirectRun(undefined, undefined), false);
  });

  it("matches resolved paths on win32 ignoring case", () => {
    const file = path.resolve("scripts/lib/cli.mjs");
    const url = pathToFileURL(file).href;
    assert.equal(isDirectRun(url, file, "win32"), true);
    assert.equal(isDirectRun(url, file.toUpperCase(), "win32"), true);
  });

  it("matches posix paths with case sensitivity", () => {
    const file = path.resolve("scripts/lib/cli.mjs");
    const url = pathToFileURL(file).href;
    assert.equal(isDirectRun(url, file, "linux"), true);
    assert.equal(isDirectRun(url, `${file}.bak`, "linux"), false);
  });

  it("returns false for a different entry", () => {
    const url = pathToFileURL(path.resolve("scripts/lib/cli.mjs")).href;
    assert.equal(isDirectRun(url, path.resolve("scripts/validate-site.mjs"), "win32"), false);
  });

  it("returns false when metaUrl is not a file URL", () => {
    assert.equal(isDirectRun("not-a-url", "foo.js"), false);
  });
});
