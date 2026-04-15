const CATALOG_KEY = "pc_catalog_v1";
const SETTINGS_KEY = "pc_settings_v1";
const SUPPORTED_LANGS = ["tr", "en", "ru"];
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

const trText = (localized) => normalizeLocalized(localized).tr;
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

const DEFAULT_SETTINGS = {
  phoneDisplay: "+90 532 315 07 77",
  phoneTel: "+905323150777",
  whatsappDisplay: "+90 532 315 07 77",
  whatsappNumber: "905323150777",
  email: "hello@pointcroissant.com",
  address: toLocalized("Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya"),
  mapQuery: toLocalized("Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya")
};

const normalizeProduct = (item) => ({
  id: item.id || `p_${Date.now()}`,
  name: normalizeLocalized(item.name),
  description: normalizeLocalized(item.description),
  price: Number(item.price || 0),
  tag: normalizeLocalized(item.tag),
  image: String(item.image || DEFAULT_PRODUCT_IMAGE).trim()
});

const normalizeSettings = (raw) => {
  const merged = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  return {
    ...merged,
    address: normalizeLocalized(merged.address, trText(DEFAULT_SETTINGS.address)),
    mapQuery: normalizeLocalized(merged.mapQuery, trText(DEFAULT_SETTINGS.mapQuery))
  };
};

const qs = (id) => document.getElementById(id);
const form = qs("product-form");
const tableBody = qs("admin-products-body");
const feedback = qs("admin-feedback");
const settingsForm = qs("settings-form");
const settingsFeedback = qs("settings-feedback");

const loadProducts = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
    const source = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PRODUCTS;
    return source.map(normalizeProduct);
  } catch {
    return DEFAULT_PRODUCTS.map(normalizeProduct);
  }
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return normalizeSettings(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    return normalizeSettings(parsed);
  } catch {
    return normalizeSettings(DEFAULT_SETTINGS);
  }
};

let products = loadProducts();
let settings = loadSettings();

const saveProducts = () => {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
};

const saveSettings = () => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const clearForm = () => {
  qs("product-id").value = "";
  qs("product-name-tr").value = "";
  qs("product-name-en").value = "";
  qs("product-name-ru").value = "";
  qs("product-desc-tr").value = "";
  qs("product-desc-en").value = "";
  qs("product-desc-ru").value = "";
  qs("product-price").value = "";
  qs("product-tag-tr").value = "";
  qs("product-tag-en").value = "";
  qs("product-tag-ru").value = "";
  qs("product-image").value = "";
};

const formatPrice = (price) => `${Number(price).toLocaleString("tr-TR")} TL`;

const renderTable = () => {
  tableBody.innerHTML = products
    .map(
      (item) => `
      <tr>
        <td>${trText(item.name)}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${trText(item.tag) || "-"}</td>
        <td>
          <button class="admin-link-btn" data-action="edit" data-id="${item.id}" type="button">Düzenle</button>
          <button class="admin-link-btn danger" data-action="delete" data-id="${item.id}" type="button">Sil</button>
        </td>
      </tr>
    `
    )
    .join("");
};

const showMessage = (text) => {
  feedback.textContent = text;
};

const showSettingsMessage = (text) => {
  settingsFeedback.textContent = text;
};

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const ADMIN_DIALOG_TEXT = {
  tr: {
    confirmDelete: "Bu ürünü silmek istediğine emin misin?",
    confirmResetDefaults: "Varsayılan ürünleri geri yüklemek istediğine emin misin?"
  },
  en: {
    confirmDelete: "Are you sure you want to delete this product?",
    confirmResetDefaults: "Are you sure you want to restore default products?"
  },
  ru: {
    confirmDelete: "Вы уверены, что хотите удалить этот товар?",
    confirmResetDefaults: "Вы уверены, что хотите восстановить товары по умолчанию?"
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = qs("product-id").value || `p_${Date.now()}`;
  const name = toLocalized(
    qs("product-name-tr").value.trim(),
    qs("product-name-en").value.trim(),
    qs("product-name-ru").value.trim()
  );
  const description = toLocalized(
    qs("product-desc-tr").value.trim(),
    qs("product-desc-en").value.trim(),
    qs("product-desc-ru").value.trim()
  );
  const tag = toLocalized(
    qs("product-tag-tr").value.trim(),
    qs("product-tag-en").value.trim(),
    qs("product-tag-ru").value.trim()
  );
  const payload = {
    id,
    name,
    description,
    price: Number(qs("product-price").value),
    tag,
    image: qs("product-image").value.trim() || DEFAULT_PRODUCT_IMAGE
  };

  if (!payload.name.tr || !payload.description.tr || !payload.price) {
    showMessage("Lütfen ürün adı, açıklama ve fiyatı doldur.");
    return;
  }

  const idx = products.findIndex((item) => item.id === id);
  if (idx >= 0) {
    products[idx] = payload;
    showMessage("Ürün güncellendi. Ön yüzde anında yansır.");
  } else {
    products.push(payload);
    showMessage("Ürün eklendi. Ön yüzde anında yansır.");
  }
  saveProducts();
  clearForm();
  renderTable();
});

tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  const item = products.find((product) => product.id === id);
  if (!item) return;

  if (action === "edit") {
    qs("product-id").value = item.id;
    const itemName = normalizeLocalized(item.name);
    const itemDescription = normalizeLocalized(item.description);
    const itemTag = normalizeLocalized(item.tag);
    qs("product-name-tr").value = itemName.tr;
    qs("product-name-en").value = itemName.en;
    qs("product-name-ru").value = itemName.ru;
    qs("product-desc-tr").value = itemDescription.tr;
    qs("product-desc-en").value = itemDescription.en;
    qs("product-desc-ru").value = itemDescription.ru;
    qs("product-price").value = item.price;
    qs("product-tag-tr").value = itemTag.tr;
    qs("product-tag-en").value = itemTag.en;
    qs("product-tag-ru").value = itemTag.ru;
    qs("product-image").value = item.image || DEFAULT_PRODUCT_IMAGE;
    showMessage("Ürün düzenleme için forma getirildi.");
  }

  if (action === "delete") {
    const lang = getActiveLang();
    const textSet = ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr;
    const ok = window.confirm(textSet.confirmDelete);
    if (!ok) return;
    products = products.filter((product) => product.id !== id);
    saveProducts();
    renderTable();
    showMessage("Ürün silindi.");
  }
});

qs("clear-form").addEventListener("click", () => {
  clearForm();
  showMessage("Form temizlendi.");
});

qs("reset-defaults").addEventListener("click", () => {
  const lang = getActiveLang();
  const textSet = ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr;
  const ok = window.confirm(textSet.confirmResetDefaults);
  if (!ok) return;
  products = [...DEFAULT_PRODUCTS];
  saveProducts();
  renderTable();
  clearForm();
  showMessage("Varsayılan ürünler geri yüklendi.");
});

const fillSettingsForm = () => {
  qs("setting-phone-display").value = settings.phoneDisplay;
  qs("setting-phone-tel").value = settings.phoneTel;
  qs("setting-whatsapp-display").value = settings.whatsappDisplay;
  qs("setting-whatsapp-number").value = settings.whatsappNumber;
  qs("setting-email").value = settings.email;
  qs("setting-address-tr").value = settings.address.tr || "";
  qs("setting-address-en").value = settings.address.en || "";
  qs("setting-address-ru").value = settings.address.ru || "";
  qs("setting-map-query-tr").value = settings.mapQuery.tr || "";
  qs("setting-map-query-en").value = settings.mapQuery.en || "";
  qs("setting-map-query-ru").value = settings.mapQuery.ru || "";
};

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const address = toLocalized(
    qs("setting-address-tr").value.trim(),
    qs("setting-address-en").value.trim(),
    qs("setting-address-ru").value.trim()
  );
  const mapQueryTr = qs("setting-map-query-tr").value.trim();
  const mapQuery = toLocalized(
    mapQueryTr || address.tr,
    qs("setting-map-query-en").value.trim(),
    qs("setting-map-query-ru").value.trim()
  );
  settings = {
    phoneDisplay: qs("setting-phone-display").value.trim(),
    phoneTel: qs("setting-phone-tel").value.trim(),
    whatsappDisplay: qs("setting-whatsapp-display").value.trim(),
    whatsappNumber: qs("setting-whatsapp-number").value.trim(),
    email: qs("setting-email").value.trim(),
    address,
    mapQuery
  };

  if (
    !settings.phoneDisplay ||
    !settings.phoneTel ||
    !settings.whatsappDisplay ||
    !settings.whatsappNumber ||
    !settings.email ||
    !settings.address.tr
  ) {
    showSettingsMessage("Lütfen tüm iletişim alanlarını doldur.");
    return;
  }

  saveSettings();
  showSettingsMessage("İletişim ve konum ayarları kaydedildi.");
});

qs("reset-settings").addEventListener("click", () => {
  settings = normalizeSettings(DEFAULT_SETTINGS);
  saveSettings();
  fillSettingsForm();
  showSettingsMessage("Ayarlar varsayılana alındı.");
});

renderTable();
fillSettingsForm();
