/**
 * SoftenWise site i18n — 11 languages (Clinic parity).
 * Uses data-i18n / data-i18n-attr / data-i18n-html on the DOM.
 */
(function () {
  const STORAGE_KEY = "sw-lang";
  const RTL = new Set(["ar"]);

  const META = {
    tr: { label: "Türkçe", short: "TR", locale: "tr_TR", dir: "ltr" },
    en: { label: "English", short: "EN", locale: "en_US", dir: "ltr" },
    de: { label: "Deutsch", short: "DE", locale: "de_DE", dir: "ltr" },
    fr: { label: "Français", short: "FR", locale: "fr_FR", dir: "ltr" },
    ar: { label: "العربية", short: "AR", locale: "ar_SA", dir: "rtl" },
    ru: { label: "Русский", short: "RU", locale: "ru_RU", dir: "ltr" },
    es: { label: "Español", short: "ES", locale: "es_ES", dir: "ltr" },
    it: { label: "Italiano", short: "IT", locale: "it_IT", dir: "ltr" },
    nl: { label: "Nederlands", short: "NL", locale: "nl_NL", dir: "ltr" },
    pt: { label: "Português", short: "PT", locale: "pt_PT", dir: "ltr" },
    az: { label: "Azərbaycan", short: "AZ", locale: "az_AZ", dir: "ltr" },
  };

  const dict = window.SW_LOCALES || {};

  function resolveLang(raw) {
    const code = String(raw || "").toLowerCase().slice(0, 2);
    return META[code] ? code : "en";
  }

  function getInitialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && META[stored]) return stored;
    } catch (_) {}
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (q && META[resolveLang(q)]) return resolveLang(q);
    // First visit: English by default
    return "en";
  }

  function t(lang, key) {
    const pack = dict[lang] || {};
    const en = dict.en || {};
    const tr = dict.tr || {};
    return pack[key] ?? en[key] ?? tr[key] ?? key;
  }

  function applyAttr(el, lang) {
    const raw = el.getAttribute("data-i18n-attr");
    if (!raw) return;
    raw.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (!attr || !key) return;
      const val = t(lang, key);
      if (attr === "html") el.innerHTML = val;
      else el.setAttribute(attr, val);
    });
  }

  function applyLang(lang) {
    const code = resolveLang(lang);
    const meta = META[code];
    document.documentElement.lang = code;
    document.documentElement.dir = meta.dir;
    document.documentElement.classList.toggle("is-rtl", RTL.has(code));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = t(code, key);
      else el.textContent = t(code, key);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => applyAttr(el, code));

    const titleKey = document.body?.getAttribute("data-i18n-title");
    if (titleKey) document.title = t(code, titleKey);

    const desc = document.querySelector('meta[name="description"]');
    const descKey = document.body?.getAttribute("data-i18n-desc");
    if (desc && descKey) desc.setAttribute("content", t(code, descKey));

    document.querySelectorAll("[data-lang-current]").forEach((btn) => {
      btn.textContent = meta.short;
      btn.setAttribute("aria-label", t(code, "lang.aria"));
    });

    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      const opt = btn.getAttribute("data-lang-option");
      btn.setAttribute("aria-selected", opt === code ? "true" : "false");
      btn.classList.toggle("is-active", opt === code);
    });

    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (_) {}

    window.dispatchEvent(new CustomEvent("sw:langchange", { detail: { lang: code } }));
  }

  function closeMenus() {
    document.querySelectorAll(".lang-switch").forEach((wrap) => {
      wrap.classList.remove("is-open");
      const btn = wrap.querySelector("[data-lang-current]");
      const menu = wrap.querySelector(".lang-switch__menu");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (menu) menu.hidden = true;
    });
  }

  function buildSwitcher(mount) {
    if (!mount || mount.querySelector(".lang-switch")) return;

    const wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.dataset.langSwitch = "";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-switch__btn";
    btn.setAttribute("data-lang-current", "");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-haspopup", "listbox");

    const menu = document.createElement("ul");
    menu.className = "lang-switch__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    Object.keys(META).forEach((code) => {
      const li = document.createElement("li");
      li.setAttribute("role", "presentation");
      const opt = document.createElement("button");
      opt.type = "button";
      opt.className = "lang-switch__option";
      opt.setAttribute("role", "option");
      opt.setAttribute("data-lang-option", code);
      opt.textContent = `${META[code].short} · ${META[code].label}`;
      opt.addEventListener("click", () => {
        applyLang(code);
        closeMenus();
        const url = new URL(window.location.href);
        url.searchParams.set("lang", code);
        window.history.replaceState({}, "", url);
      });
      li.appendChild(opt);
      menu.appendChild(li);
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !wrap.classList.contains("is-open");
      closeMenus();
      if (open) {
        wrap.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        menu.hidden = false;
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    mount.appendChild(wrap);
  }

  function init() {
    if (!window.SW_LOCALES) return;
    const inner = document.querySelector(".header-inner");
    if (inner) {
      const menuBtn = document.getElementById("menuBtn");
      const mount = document.createElement("div");
      mount.className = "lang-switch-mount";
      if (menuBtn) inner.insertBefore(mount, menuBtn);
      else inner.appendChild(mount);
      buildSwitcher(mount);
    }

    const lang = getInitialLang();
    applyLang(lang);

    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenus();
    });
  }

  window.SW_I18N = { applyLang, getInitialLang, META, t: (k) => t(getInitialLang(), k) };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
