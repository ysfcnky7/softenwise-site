import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_FORM_ENDPOINT,
  escapeHtml,
  hrefAttr,
  isSafeHref,
  isSafeImgSrc,
  isSafeNavUrl,
  resolveFormEndpoint,
} from "../scripts/lib/url-safety.mjs";

describe("isSafeHref", () => {
  it("allows relative, http(s), mailto, tel", () => {
    assert.equal(isSafeHref("kvkk.html"), true);
    assert.equal(isSafeHref("/path"), true);
    assert.equal(isSafeHref("https://softenwise.com/"), true);
    assert.equal(isSafeHref("http://example.com"), true);
    assert.equal(isSafeHref("mailto:info@softenwise.com"), true);
    assert.equal(isSafeHref("tel:+905421846595"), true);
  });

  it("rejects empty, scripts, data, protocol-relative, unknown schemes", () => {
    assert.equal(isSafeHref(""), false);
    assert.equal(isSafeHref(null), false);
    assert.equal(isSafeHref("javascript:alert(1)"), false);
    assert.equal(isSafeHref("JAVASCRIPT:alert(1)"), false);
    assert.equal(isSafeHref("data:text/html,x"), false);
    assert.equal(isSafeHref("vbscript:msg"), false);
    assert.equal(isSafeHref("//evil.test"), false);
    assert.equal(isSafeHref("file:///etc/passwd"), false);
  });
});

describe("isSafeImgSrc", () => {
  it("allows first-party images and icons", () => {
    assert.equal(isSafeImgSrc("images/og-image.png"), true);
    assert.equal(isSafeImgSrc("icons/favicon.ico"), true);
  });

  it("rejects traversal, remote, and schemes", () => {
    assert.equal(isSafeImgSrc(""), false);
    assert.equal(isSafeImgSrc("images/../secrets.png"), false);
    assert.equal(isSafeImgSrc("//cdn.example/x.png"), false);
    assert.equal(isSafeImgSrc("javascript:x"), false);
    assert.equal(isSafeImgSrc("data:image/png,xx"), false);
    assert.equal(isSafeImgSrc("vbscript:x"), false);
    assert.equal(isSafeImgSrc("https://evil.test/x.png"), false);
    assert.equal(isSafeImgSrc("css/style.css"), false);
  });
});

describe("isSafeNavUrl", () => {
  it("allows http(s) and relative; rejects mailto and scripts", () => {
    assert.equal(isSafeNavUrl("https://softenwise.com/liman"), true);
    assert.equal(isSafeNavUrl("urunler.html"), true);
    assert.equal(isSafeNavUrl(""), false);
    assert.equal(isSafeNavUrl("javascript:x"), false);
    assert.equal(isSafeNavUrl("data:x"), false);
    assert.equal(isSafeNavUrl("vbscript:x"), false);
    assert.equal(isSafeNavUrl("//evil"), false);
    assert.equal(isSafeNavUrl("mailto:info@softenwise.com"), false);
  });
});

describe("escapeHtml / hrefAttr / form endpoint", () => {
  it("escapes HTML entities", () => {
    assert.equal(escapeHtml(`&<>"`), "&amp;&lt;&gt;&quot;");
  });

  it("hrefAttr falls back to # when unsafe", () => {
    assert.equal(hrefAttr("javascript:x"), "#");
    assert.equal(hrefAttr('https://a.test/?q=a&b="x"'), "https://a.test/?q=a&amp;b=&quot;x&quot;");
  });

  it("allowlists Formspree endpoints only", () => {
    assert.equal(resolveFormEndpoint("https://formspree.io/f/xldqyewl"), "https://formspree.io/f/xldqyewl");
    assert.equal(resolveFormEndpoint("https://evil.test/f/abc"), DEFAULT_FORM_ENDPOINT);
    assert.equal(resolveFormEndpoint(""), DEFAULT_FORM_ENDPOINT);
    assert.equal(resolveFormEndpoint("https://formspree.io/f/abc-def"), DEFAULT_FORM_ENDPOINT);
  });
});
