import { isSafeHref, isSafeImgSrc } from "./url-safety.mjs";

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

export const ATTR_ALLOW = {
  A: new Set(["href", "rel", "target", "class"]),
  IMG: new Set(["src", "alt", "width", "height", "loading", "decoding", "class"]),
  SPAN: new Set(["class", "aria-hidden"]),
  STRONG: new Set(["class"]),
  EM: new Set(["class"]),
  B: new Set(["class"]),
  I: new Set(["class"]),
  SMALL: new Set(["class"]),
  BR: new Set([]),
};

const VOID = new Set(["BR", "IMG"]);

function textNode(value) {
  return { nodeType: TEXT_NODE, nodeValue: String(value), childNodes: [], parentNode: null };
}

function commentNode(value) {
  return { nodeType: COMMENT_NODE, nodeValue: String(value), childNodes: [], parentNode: null };
}

function elementNode(tagName) {
  const node = {
    nodeType: ELEMENT_NODE,
    tagName,
    attributes: [],
    childNodes: [],
    parentNode: null,
    getAttribute(name) {
      const hit = this.attributes.find((a) => a.name.toLowerCase() === String(name).toLowerCase());
      return hit ? hit.value : null;
    },
    setAttribute(name, value) {
      const key = String(name);
      const i = this.attributes.findIndex((a) => a.name.toLowerCase() === key.toLowerCase());
      if (i >= 0) this.attributes[i] = { name: this.attributes[i].name, value: String(value) };
      else this.attributes.push({ name: key, value: String(value) });
    },
    removeAttribute(name) {
      const key = String(name).toLowerCase();
      this.attributes = this.attributes.filter((a) => a.name.toLowerCase() !== key);
    },
    removeChild(child) {
      this.childNodes = this.childNodes.filter((c) => c !== child);
      if (child) child.parentNode = null;
      return child;
    },
    remove() {
      if (this.parentNode) this.parentNode.removeChild(this);
    },
  };
  return node;
}

function parseAttrs(raw) {
  const attrs = [];
  const re = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    attrs.push({ name: m[1], value: m[2] ?? m[3] ?? m[4] ?? "" });
  }
  return attrs;
}

function parseFragment(html) {
  const root = elementNode("FRAGMENT");
  const stack = [root];
  const re = /<!--([\s\S]*?)-->|<\/([A-Za-z][\w:-]*)\s*>|<([A-Za-z][\w:-]*)([^>]*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(String(html || "")))) {
    const parent = stack[stack.length - 1];
    if (m[1] != null) {
      const n = commentNode(m[1]);
      n.parentNode = parent;
      parent.childNodes.push(n);
      continue;
    }
    if (m[2]) {
      const want = m[2].toUpperCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === want) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    if (m[3]) {
      const tag = m[3].toUpperCase();
      const rawAttrs = m[4] || "";
      const selfClosing = /\/\s*$/.test(rawAttrs) || VOID.has(tag);
      const el = elementNode(tag);
      el.attributes = parseAttrs(rawAttrs.replace(/\/\s*$/, ""));
      el.parentNode = parent;
      parent.childNodes.push(el);
      if (!selfClosing) stack.push(el);
      continue;
    }
    if (m[5] != null) {
      const n = textNode(m[5]);
      n.parentNode = parent;
      parent.childNodes.push(n);
    }
  }
  return root;
}

function serialize(node) {
  if (node.nodeType === TEXT_NODE) return node.nodeValue;
  const inner = node.childNodes.map(serialize).join("");
  if (node.tagName === "FRAGMENT") return inner;
  const attrs = node.attributes.map((a) => (a.value === "" && !a.name.includes("=") ? ` ${a.name}` : ` ${a.name}="${a.value}"`)).join("");
  if (VOID.has(node.tagName) && node.childNodes.length === 0) return `<${node.tagName.toLowerCase()}${attrs}>`;
  return `<${node.tagName.toLowerCase()}${attrs}>${inner}</${node.tagName.toLowerCase()}>`;
}

/**
 * First-party locale HTML only — strip scripts, handlers, and unsafe URLs.
 * Node port of js/i18n.js sanitizeTrustedHtml (no browser DOM).
 */
export function sanitizeTrustedHtml(html, env = {}) {
  const origin = env.origin || "https://softenwise.com";
  const baseURI = env.baseURI || `${origin}/`;
  const allowed = new Set(Object.keys(ATTR_ALLOW));
  const root = parseFragment(html);

  const sanitize = (parent) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === TEXT_NODE) return;
      if (node.nodeType !== ELEMENT_NODE) {
        parent.removeChild(node);
        return;
      }
      sanitize(node);
      const tag = node.tagName;
        if (!allowed.has(tag)) {
          const at = parent.childNodes.indexOf(node);
          const moved = [...node.childNodes];
          node.childNodes = [];
          for (const ch of moved) {
            ch.parentNode = parent;
            parent.childNodes.splice(at + moved.indexOf(ch), 0, ch);
          }
          parent.removeChild(node);
          return;
        }
      const keep = ATTR_ALLOW[tag];
      [...node.attributes].forEach((attr) => {
        const n = attr.name.toLowerCase();
        if (n.startsWith("on") || n === "style" || n === "srcdoc" || !keep.has(n)) {
          node.removeAttribute(attr.name);
        }
      });
      if (tag === "A") {
        const href = node.getAttribute("href") || "";
        if (!isSafeHref(href)) {
          node.removeAttribute("href");
        } else {
          try {
            const u = new URL(href, baseURI);
            if (u.origin !== origin) {
              node.setAttribute("rel", "noopener noreferrer");
            }
          } catch {
            node.removeAttribute("href");
          }
        }
      }
      if (tag === "IMG") {
        const src = node.getAttribute("src") || "";
        if (!isSafeImgSrc(src)) node.remove();
      }
    });
  };

  sanitize(root);
  return serialize(root);
}
