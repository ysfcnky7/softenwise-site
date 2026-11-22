/** URL / form allowlist helpers — Node-testable copy of js/i18n.js + js/main.js. */

export const FORMSPREE_ENDPOINT_RE = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;
export const DEFAULT_FORM_ENDPOINT = "https://formspree.io/f/xldqyewl";

export function isSafeHref(href) {
  const v = String(href || "").trim();
  if (!v) return false;
  const lower = v.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return false;
  }
  if (v.startsWith("//")) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) {
    return /^(https?:|mailto:|tel:)/i.test(v);
  }
  return true;
}

export function isSafeImgSrc(src) {
  const v = String(src || "").trim();
  if (!v || v.includes("..") || v.startsWith("//")) return false;
  const lower = v.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return false;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return false;
  return /^(images|icons)\//i.test(v);
}

export function isSafeNavUrl(raw) {
  const v = String(raw || "").trim();
  if (!v) return false;
  const lower = v.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return false;
  }
  if (v.startsWith("//")) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return /^https?:/i.test(v);
  return true;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function hrefAttr(u) {
  if (!isSafeNavUrl(u)) return "#";
  return String(u).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function resolveFormEndpoint(raw) {
  const v = String(raw || "").trim();
  return FORMSPREE_ENDPOINT_RE.test(v) ? v : DEFAULT_FORM_ENDPOINT;
}
