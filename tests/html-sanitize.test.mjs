import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeTrustedHtml } from "../scripts/lib/html-sanitize.mjs";

describe("sanitizeTrustedHtml", () => {
  it("keeps allowed markup and text", () => {
    const out = sanitizeTrustedHtml(`hello <strong class="x">SoftenWise</strong> <br>`);
    assert.match(out, /hello/);
    assert.match(out, /<strong class="x">SoftenWise<\/strong>/);
  });

  it("unwraps disallowed tags and drops comments", () => {
    const out = sanitizeTrustedHtml(`<!--c--><p>keep</p></div><b>x</b><i>y</i><small>z</small>`);
    assert.equal(out.includes("<!--"), false);
    assert.match(out, /keep/);
    assert.equal(out.includes("<p>"), false);
    assert.match(out, /<b>x<\/b>/);
  });

  it("strips handlers, style, srcdoc, and unknown attrs", () => {
    const out = sanitizeTrustedHtml(
      `<span class="ok" onclick="x" style="color:red" srcdoc="y" data-x="1">t</span>`
    );
    assert.match(out, /class="ok"/);
    assert.equal(out.includes("onclick"), false);
    assert.equal(out.includes("style"), false);
    assert.equal(out.includes("srcdoc"), false);
    assert.equal(out.includes("data-x"), false);
  });

  it("drops unsafe href and adds noopener on external links", () => {
    const bad = sanitizeTrustedHtml(`<a href="javascript:alert(1)">x</a>`);
    assert.equal(bad.includes("href"), false);

    const proto = sanitizeTrustedHtml(`<a href="//evil.test">x</a>`);
    assert.equal(proto.includes("href"), false);
    const bare = sanitizeTrustedHtml(`<a>x</a>`);
    assert.equal(bare.includes("href"), false);

    const ext = sanitizeTrustedHtml(`<a href="https://example.com/a">x</a>`);
    assert.match(ext, /rel="noopener noreferrer"/);

    const same = sanitizeTrustedHtml(`<a href="/kvkk.html">x</a>`, {
      origin: "https://softenwise.com",
      baseURI: "https://softenwise.com/",
    });
    assert.match(same, /href="\/kvkk.html"/);
    assert.equal(same.includes("noopener"), false);
  });

  it("removes href when URL parsing throws", () => {
    const out = sanitizeTrustedHtml(`<a href="https://[">x</a>`);
    assert.equal(out.includes("href"), false);
  });

  it("removes unsafe images and keeps first-party ones", () => {
    const bad = sanitizeTrustedHtml(`<img src="https://evil.test/x.png" alt="x">`);
    assert.equal(bad.includes("<img"), false);
    const good = sanitizeTrustedHtml(`<img src="images/og-image.png" alt="SoftenWise">`);
    assert.match(good, /images\/og-image.png/);
  });

  it("handles empty input", () => {
    assert.equal(sanitizeTrustedHtml(""), "");
    assert.equal(sanitizeTrustedHtml(null), "");
  });

  it("keeps nested allowed tags", () => {
    const out = sanitizeTrustedHtml(`<span class="a"><em class="b">z</em></span>`);
    assert.match(out, /<span class="a"><em class="b">z<\/em><\/span>/);
  });

  it("parses unquoted and single-quoted attrs and empty tags", () => {
    const out = sanitizeTrustedHtml(`<span class=ok aria-hidden><em class='b'></em></span><p></p>`);
    assert.match(out, /class="ok"/);
    assert.match(out, /aria-hidden/);
    assert.match(out, /<em class="b"><\/em>/);
  });

  it("overwrites rel on external anchors and drops images without src", () => {
    const out = sanitizeTrustedHtml(
      `<a href="https://example.com" rel="nofollow">x</a><img alt="z">`
    );
    assert.match(out, /rel="noopener noreferrer"/);
    assert.equal(out.includes("<img"), false);
  });
});
