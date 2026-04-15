const CATALOG_KEY = "pc_catalog_v1";
const DEFAULT_PRODUCT_IMAGE = "assets/logo-point-croissant.webp";
const toLocalized = (tr = "", en = "", ru = "") => ({ tr, en, ru });
const normalizeLocalized = (value, fallback = "") => {
  if (value && typeof value === "object") {
    return {
      tr: String(value.tr || fallback || "").trim(),
      en: String(value.en || "").trim(),
      ru: String(value.ru || "").trim()
    };
  }
  const tr = typeof value === "string" ? value.trim() : String(fallback || "").trim();
  return toLocalized(tr, "", "");
};
const getActiveLang = () =>
  (typeof window.__pcGetLang === "function" && window.__pcGetLang()) ||
  document.documentElement.lang ||
  "tr";
const getLocalized = (value, lang) => {
  const normalized = normalizeLocalized(value);
  return normalized[lang] || normalized.tr || "";
};
const UI_FALLBACK = {
  tr: { featured: "Öne Çıkan", selection: "Seçki" },
  en: { featured: "Featured", selection: "Selection" },
  ru: { featured: "Популярное", selection: "Подборка" }
};

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: toLocalized("Double Chocolate"),
    description: toLocalized("Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet."),
    price: 205,
    tag: toLocalized("En Çok Satan"),
    image: DEFAULT_PRODUCT_IMAGE
  },
  {
    id: "p2",
    name: toLocalized("Fıstık Supreme"),
    description: toLocalized("Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur."),
    price: 225,
    tag: toLocalized("Şef Önerisi"),
    image: DEFAULT_PRODUCT_IMAGE
  },
  {
    id: "p3",
    name: toLocalized("Yaban Mersinli Danish"),
    description: toLocalized("İpeksi krema ve meyve dolgusu ile ferah, dengeli tat."),
    price: 215,
    tag: toLocalized("Yeni"),
    image: DEFAULT_PRODUCT_IMAGE
  },
  {
    id: "p4",
    name: toLocalized("Trüf Mantarlı Tuzlu"),
    description: toLocalized("Trüf mantarlı tuzlu kruvasan."),
    price: 235,
    tag: toLocalized("Premium"),
    image: DEFAULT_PRODUCT_IMAGE
  }
];

const normalizeProduct = (item) => ({
  id: item.id || `p_${Date.now()}`,
  name: normalizeLocalized(item.name),
  description: normalizeLocalized(item.description),
  price: Number(item.price || 0),
  tag: normalizeLocalized(item.tag),
  image: String(item.image || DEFAULT_PRODUCT_IMAGE).trim()
});

const parseProducts = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_PRODUCTS;
    return parsed.map(normalizeProduct);
  } catch {
    return DEFAULT_PRODUCTS.map(normalizeProduct);
  }
};

const formatPrice = (value) => `${Number(value || 0).toLocaleString("tr-TR")} TL`;

const refreshI18nIfNeeded = () => {
  if (typeof window.__pcApplyLanguage !== "function") return;
  if (typeof window.__pcGetLang !== "function") return;
  window.__pcApplyLanguage(window.__pcGetLang(), false);
};

const refreshLazyMediaIfNeeded = () => {
  if (typeof window.__pcApplyLazyMedia !== "function") return;
  window.__pcApplyLazyMedia();
};

const renderFeaturedProducts = (products) => {
  const grid = document.getElementById("featured-products");
  if (!grid) return;
  const lang = getActiveLang();
  const fallback = UI_FALLBACK[lang] || UI_FALLBACK.tr;

  grid.innerHTML = products
    .map(
      (item) => `
      <article class="card product-card reveal">
        <img class="product-media" src="${item.image || DEFAULT_PRODUCT_IMAGE}" alt="${getLocalized(item.name, lang)}" loading="lazy" decoding="async" />
        <span class="tag">${getLocalized(item.tag, lang) || fallback.selection}</span>
        <h3>${getLocalized(item.name, lang)}</h3>
        <p>${getLocalized(item.description, lang)}</p>
        <p><strong>${formatPrice(item.price)}</strong></p>
        <a href="#iletisim">Detay Al</a>
      </article>
    `
    )
    .join("");
};

const renderMenuProducts = (products) => {
  const highlightGrid = document.getElementById("menu-highlight-grid");
  const categorySections = document.getElementById("menu-category-sections");
  const body = document.getElementById("menu-products-body");
  const lang = getActiveLang();
  const fallback = UI_FALLBACK[lang] || UI_FALLBACK.tr;
  const isSavory = (item) =>
    /tuzlu|peynir|trüf|truf/i.test(`${getLocalized(item.name, "tr")} ${getLocalized(item.description, "tr")}`);

  const isSpecial = (item) =>
    /premium|şef|sef|en çok satan|en cok satan|yeni/i.test(`${getLocalized(item.tag, "tr") || ""}`);

  if (highlightGrid) {
    const highlighted = [...products]
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 2);

    highlightGrid.innerHTML = highlighted
      .map(
        (item) => `
        <article class="card menu-highlight-card reveal">
          <img class="menu-highlight-media" src="${item.image || DEFAULT_PRODUCT_IMAGE}" alt="${getLocalized(item.name, lang)}" loading="lazy" decoding="async" />
          <p class="menu-kicker">${getLocalized(item.tag, lang) || fallback.featured}</p>
          <h3>${getLocalized(item.name, lang)}</h3>
          <p>${getLocalized(item.description, lang)}</p>
          <p class="menu-price-pill">${formatPrice(item.price)}</p>
        </article>
      `
      )
      .join("");
  }

  if (categorySections) {
    const sections = [
      {
        title: "Tatlı Kruvasanlar",
        note: "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.",
        items: products.filter((item) => !isSavory(item))
      },
      {
        title: "Tuzlu Kruvasanlar",
        note: "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.",
        items: products.filter((item) => isSavory(item))
      },
      {
        title: "İmza ve Özel Seçkiler",
        note: "Şef önerileri, premium tarifler ve vitrinin yıldızları.",
        items: products.filter((item) => isSpecial(item))
      }
    ].filter((section) => section.items.length);

    categorySections.innerHTML = sections
      .map(
        (section) => `
        <section class="card menu-category-block reveal">
          <div class="menu-category-head">
            <h3>${section.title}</h3>
            <p>${section.note}</p>
          </div>
          <div class="menu-items-grid">
            ${section.items
              .map(
                (item) => `
                <article class="menu-item-card">
                  <img class="menu-item-media" src="${item.image || DEFAULT_PRODUCT_IMAGE}" alt="${getLocalized(item.name, lang)}" loading="lazy" decoding="async" />
                  <div class="menu-item-top">
                    <h4>${getLocalized(item.name, lang)}</h4>
                    <span class="menu-item-price">${formatPrice(item.price)}</span>
                  </div>
                  <p>${getLocalized(item.description, lang)}</p>
                  <small>${getLocalized(item.tag, lang) || fallback.selection}</small>
                </article>
              `
              )
              .join("")}
          </div>
        </section>
      `
      )
      .join("");
    return;
  }

  if (!body) return;
  body.innerHTML = products
    .map(
      (item) => `
      <tr>
        <td>${getLocalized(item.name, lang)}</td>
        <td>${getLocalized(item.description, lang)}</td>
        <td>${formatPrice(item.price)}</td>
      </tr>
    `
    )
    .join("");
};

const catalog = parseProducts();
renderFeaturedProducts(catalog);
renderMenuProducts(catalog);
refreshI18nIfNeeded();
refreshLazyMediaIfNeeded();
