(function () {
  if (document.getElementById("sw-svg-sprite")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">\n  <symbol id=\"sw-code\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <polyline points=\"16 18 22 12 16 6\" />\n    <polyline points=\"8 6 2 12 8 18\" />\n  </symbol>\n  <symbol id=\"sw-smartphone\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\" />\n    <path d=\"M12 18h.01\" />\n  </symbol>\n  <symbol id=\"sw-plug\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M12 22v-5\" />\n    <path d=\"M9 8V2\" />\n    <path d=\"M15 8V2\" />\n    <path d=\"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z\" />\n  </symbol>\n  <symbol id=\"sw-shield\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />\n  </symbol>\n  <symbol id=\"sw-compass\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <circle cx=\"12\" cy=\"12\" r=\"10\" />\n    <polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\" />\n  </symbol>\n  <symbol id=\"sw-chevron-down\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"m6 9 6 6 6-6\" />\n  </symbol>\n  <symbol id=\"sw-menu\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" />\n    <line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" />\n    <line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />\n  </symbol>\n  <symbol id=\"sw-phone\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" />\n  </symbol>\n  <symbol id=\"sw-mail\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" />\n    <path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />\n  </symbol>\n  <symbol id=\"sw-search\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <circle cx=\"11\" cy=\"11\" r=\"8\" />\n    <path d=\"m21 21-4.3-4.3\" />\n  </symbol>\n  <symbol id=\"sw-clipboard-list\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" />\n    <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" />\n    <path d=\"M12 11h4\" />\n    <path d=\"M12 16h4\" />\n    <path d=\"M8 11h.01\" />\n    <path d=\"M8 16h.01\" />\n  </symbol>\n  <symbol id=\"sw-map\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <polygon points=\"3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21\" />\n    <line x1=\"9\" x2=\"9\" y1=\"3\" y2=\"18\" />\n    <line x1=\"15\" x2=\"15\" y1=\"6\" y2=\"21\" />\n  </symbol>\n  <symbol id=\"sw-zap\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\" />\n  </symbol>\n  <symbol id=\"sw-chart\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M12 20V10\" />\n    <path d=\"M18 20V4\" />\n    <path d=\"M6 20v-4\" />\n  </symbol>\n  <symbol id=\"sw-bell\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\" />\n    <path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\" />\n  </symbol>\n  <symbol id=\"sw-rocket\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\" />\n    <path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\" />\n    <path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\" />\n    <path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\" />\n  </symbol>\n  <symbol id=\"sw-graduate\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M22 10v6M2 10l10-5 10 5-10 5z\" />\n    <path d=\"M6 12v5c3 3 9 3 12 0v-5\" />\n  </symbol>\n  <symbol id=\"sw-briefcase\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <rect width=\"20\" height=\"14\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\" />\n    <path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\" />\n  </symbol>\n  <symbol id=\"sw-trending-up\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\" />\n    <polyline points=\"16 7 22 7 22 13\" />\n  </symbol>\n  <symbol id=\"sw-book-open\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\" />\n    <path d=\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\" />\n  </symbol>\n  <symbol id=\"sw-banknote\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\" />\n    <circle cx=\"12\" cy=\"12\" r=\"2\" />\n    <path d=\"M6 12h.01M18 12h.01\" />\n  </symbol>\n  <symbol id=\"sw-arrow-left\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"m15 18-6-6 6-6\" />\n  </symbol>\n  <symbol id=\"sw-arrow-right\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"m9 18 6-6-6-6\" />\n  </symbol>\n  <symbol id=\"sw-layout-grid\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" />\n    <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" />\n    <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" />\n    <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />\n  </symbol>\n  <symbol id=\"sw-wrench\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" />\n  </symbol>\n</svg>\n".trim();
  const svgEl = wrap.querySelector("svg");
  if (!svgEl) return;
  svgEl.id = "sw-svg-sprite";
  svgEl.setAttribute("aria-hidden", "true");
  svgEl.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  const skip = document.querySelector("a.skip-link");
  if (skip && skip.parentNode === document.body) {
    skip.insertAdjacentElement("afterend", svgEl);
  } else {
    document.body.prepend(svgEl);
  }
  document.querySelectorAll("use[href*='ui-sprite.svg']").forEach((el) => {
    const href = el.getAttribute("href");
    if (!href) return;
    const id = href.split("#")[1];
    if (id) el.setAttribute("href", "#" + id);
  });
})();

// ===== SAFE SELECTORS =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

// ===== MOBILE MENU (ARIA + SAFE) =====
if (menuBtn && nav) {
  const navItemsWithDropdown = nav.querySelectorAll(".nav-item.has-dropdown");

  const closeAllDropdowns = () => {
    navItemsWithDropdown.forEach((item) => {
      item.classList.remove("open");
      const toggle = item.querySelector(".nav-parent-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  };

  const setMenuState = (open) => {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    if (!open) closeAllDropdowns();
  };

  // Toggle menu
  menuBtn.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("open"));
  });

  // Menü linkine tıklayınca kapat
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenuState(false));
  });

  navItemsWithDropdown.forEach((item) => {
    const toggle = item.querySelector(".nav-parent-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (e) => {
      if (window.innerWidth > 768) return;
      e.preventDefault();

      const willOpen = !item.classList.contains("open");
      closeAllDropdowns();
      item.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Dışarı tıklayınca kapat
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
      setMenuState(false);
    }
  });

  // ESC ile kapat
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setMenuState(false);
    }
  });

  // Ekran büyüyünce kapat (CSS breakpoint ile uyumlu)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setMenuState(false);
      closeAllDropdowns();
    }
  });
}

// ===== ACTIVE NAV LINK =====
const activeNav = document.getElementById("nav");
if (activeNav) {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const servicePages = [
    "ozel-yazilim.html",
    "mobil-gelistirme.html",
    "entegrasyon-otomasyon.html",
    "guvenlik-denetim.html",
    "teknik-danismanlik.html",
  ];

  const setActive = (el) => {
    if (el) el.classList.add("is-active");
  };

  if (servicePages.includes(page)) {
    setActive(activeNav.querySelector(`.nav-dropdown a[href="${page}"]`));
    setActive(activeNav.querySelector('.nav-main-link[href*="solutions"]'));
  } else if (
    page === "kariyer.html" ||
    page === "academy.html" ||
    page === "girisim-ortakligi.html" ||
    page === "urunler.html"
  ) {
    setActive(activeNav.querySelector(`.nav-main-link[href="${page}"]`));
  } else if (page === "index.html" && window.location.hash) {
    const hashLink = activeNav.querySelector(`.nav-main-link[href="${window.location.hash}"]`);
    setActive(hashLink);
  } else {
    setActive(activeNav.querySelector('.nav-main-link[href*="solutions"]'));
  }
}

// ===== HEADER SHADOW (CSS CLASS BASED) =====
if (header) {
  const applyHeaderShadow = () => {
    header.classList.toggle("scrolled", window.scrollY > 18);
  };

  window.addEventListener("scroll", applyHeaderShadow, { passive: true });
  applyHeaderShadow();
}

// ===== REVEAL (ACCESSIBLE + PERFORMANT) =====
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("active");
  });
} else {
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    reveals.forEach((el) => {
      // Üst kahraman alanı: ilk boyamada görünür olsun (LCP / IO gecikmesi yok)
      if (
        el.classList.contains("hero-text") ||
        el.classList.contains("hero-products")
      ) {
        el.classList.add("active");
        return;
      }
      io.observe(el);
    });
  }
}

// ===== HERO PRODUCT SHOWCASE =====
const featuredProducts = [
  {
    name: "SoftenWise Clinic",
    label: "Canlı",
    image: "images/clinic_image.png",
    imageAlt: "SoftenWise Clinic ürün görseli",
    imageMode: "cover",
    description:
      "Klinik yönetimi için randevu, hasta, finans ve raporlama modüllerini tek panelde birleştirir.",
    bullets: [
      "11 dil ve çok ülkeli kullanım",
      "Rol/yetki yönetimi ve audit log",
      "15 gün ücretsiz deneme",
    ],
    cta: "Detaya git",
    /* Ana vitrin: site içi ürün özeti; canlı ürün sitesi urunler sayfasında */
    detailUrl: "urunler.html#softenwise-clinic",
  },
  {
    name: "Envantra",
    label: "Canlı",
    image: "images/envantra-logo.png",
    imageAlt: "Envantra logosu — stok, satış ve fatura yönetimi",
    imageMode: "contain",
    description:
      "Stok, satış, fatura ve operasyonu tek sade ekrandan yönetin; iOS uygulaması ile uyumlu vitrin ve altyapı.",
    bullets: [
      "Stok takibi ve kritik seviye yönetimi",
      "Hızlı satış kaydı ve fatura akışı",
      "Mobil odaklı, App Store uyumlu çizgi",
    ],
    cta: "Detaya git",
    detailUrl: "urunler.html#envantra",
  },
  {
    name: "Otomini",
    label: "Canlı",
    image: "images/otomini-logo.webp",
    imageAlt: "Otomini logosu — ikinci el araç değerleme ve galeri",
    imageMode: "contain",
    description:
      "İkinci el araç için anlık dijital değerleme, ekspertiz adımları ve güvenli galeri ilan akışı sunan platform.",
    bullets: [
      "Marka / model / donanım ile hızlı değerleme akışı",
      "Tramer ve parça bazlı ekspertiz görünümü",
      "Galeride paylaşım ve ilan vitrini",
    ],
    cta: "Detaya git",
    detailUrl: "urunler.html#otomini",
  },
  {
    name: "SoftenWise GeoMaps",
    label: "Canlı",
    image: "images/geomaps_logo.png",
    imageAlt: "SoftenWise GeoMaps ürün logosu",
    imageMode: "contain",
    description:
      "Lokasyon, saha operasyonu ve harita tabanlı takip için üretimde olan ürün ailesi; operasyon paneli ve entegrasyon odaklı.",
    bullets: [
      "Canlı konum ve rota görünümü",
      "Saha ekipleri için durum takibi",
      "Kurumsal entegrasyon ve raporlama (proje bazlı)",
    ],
    cta: "Detaya git",
    detailUrl: "urunler.html#geomaps",
  },
];

const productShowcase = document.getElementById("productShowcase");
const productTrack = document.getElementById("productTrack");
const productDots = document.getElementById("productDots");
const productPrev = document.getElementById("productPrev");
const productNext = document.getElementById("productNext");

if (
  productShowcase &&
  productTrack &&
  productDots &&
  productPrev &&
  productNext &&
  featuredProducts.length
) {
  let activeIndex = 0;
  let autoplayTimer = null;
  const autoplayMs = Number(productShowcase.dataset.autoplayMs) || 5000;

  const renderProductItem = (product, index) => {
    const item = document.createElement("article");
    item.className = "product-item";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-hidden", "true");

    const linkUrl = (product.detailUrl || product.url || "").trim();
    const wrapperTag = linkUrl ? "a" : "div";
    const wrapper = document.createElement(wrapperTag);
    wrapper.className = "product-card";

    if (linkUrl) {
      wrapper.href = linkUrl;
      const isExternal = /^https?:\/\//i.test(linkUrl);
      if (isExternal) {
        wrapper.target = "_blank";
        wrapper.rel = "noopener noreferrer";
        wrapper.setAttribute(
          "aria-label",
          `${product.name} harici bağlantı, yeni sekmede açılır`
        );
      } else {
        wrapper.setAttribute("aria-label", `${product.name} ürün detayına git`);
      }
    } else {
      item.classList.add("is-disabled");
    }

    const mediaClass =
      product.imageMode === "contain"
        ? "product-media product-media--contain"
        : "product-media";

    const imgAttrs =
      index === 0
        ? 'loading="eager" fetchpriority="high" decoding="async" width="640" height="360"'
        : 'loading="lazy" decoding="async" width="640" height="360"';

    const mediaHtml = product.image
      ? `
      <div class="${mediaClass}">
        <img src="${product.image}" alt="${product.imageAlt || product.name}" ${imgAttrs} />
      </div>
    `
      : `
      <div class="product-media">
        <div class="product-media-placeholder">${product.name}<br />Yakında</div>
      </div>
    `;

    wrapper.innerHTML = `
      ${mediaHtml}
      <div class="product-card-head">
        <h3 class="product-name">${product.name}</h3>
        <span class="product-badge">${product.label}</span>
      </div>
      <p class="product-desc">${product.description}</p>
      <ul class="product-list">
        ${product.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
      <div class="product-cta">${product.cta}</div>
    `;

    item.appendChild(wrapper);
    productTrack.appendChild(item);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "product-dot";
    dot.setAttribute("aria-label", `${index + 1}. ürüne git`);
    dot.addEventListener("click", () => {
      goTo(index);
      restartAutoplay();
    });
    productDots.appendChild(dot);
  };

  const items = [];
  const dots = [];

  featuredProducts.forEach((product, index) => {
    renderProductItem(product, index);
    items.push(productTrack.children[index]);
    dots.push(productDots.children[index]);
  });

  const goTo = (index) => {
    activeIndex = (index + items.length) % items.length;
    items.forEach((item, i) => {
      const isActive = i === activeIndex;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeIndex);
    });
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    if (items.length <= 1 || prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, autoplayMs);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  productPrev.addEventListener("click", () => {
    prev();
    restartAutoplay();
  });

  productNext.addEventListener("click", () => {
    next();
    restartAutoplay();
  });

  productShowcase.addEventListener("mouseenter", stopAutoplay);
  productShowcase.addEventListener("mouseleave", startAutoplay);
  productShowcase.addEventListener("focusin", stopAutoplay);
  productShowcase.addEventListener("focusout", startAutoplay);

  goTo(0);
  startAutoplay();
}

// ===== CONTACT FORMS (MULTI PAGE SUPPORT) =====
const contactForms = document.querySelectorAll("[data-contact-form]");

const createHumanCheck = (form) => {
  const wrapper = document.createElement("div");
  wrapper.className = "human-check";

  const label = document.createElement("label");
  label.className = "human-check-label";
  const inputId = `humanCheck-${Math.random().toString(36).slice(2, 8)}`;
  label.setAttribute("for", inputId);

  const challengeText = document.createElement("span");
  challengeText.className = "human-check-question";

  const input = document.createElement("input");
  input.type = "number";
  input.id = inputId;
  input.inputMode = "numeric";
  input.className = "human-check-input";
  input.placeholder = "Sonuç";
  input.required = true;
  input.autocomplete = "off";
  input.min = "0";
  input.step = "1";

  label.appendChild(challengeText);
  wrapper.appendChild(label);
  wrapper.appendChild(input);

  let expectedAnswer = 0;

  const refresh = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    expectedAnswer = a + b;
    challengeText.textContent = `${a} + ${b} =`;
    input.value = "";
    wrapper.classList.remove("is-invalid");
  };

  refresh();

  return {
    element: wrapper,
    input,
    refresh,
    validate() {
      const ok = Number(input.value) === expectedAnswer;
      wrapper.classList.toggle("is-invalid", !ok);
      return ok;
    },
  };
};

contactForms.forEach((form) => {
  const submitBtn = form.querySelector("button[type='submit']");
  if (!submitBtn) return;

  const defaultLabel =
    form.dataset.submitLabel || submitBtn.textContent.trim() || "Gönder";
  const endpoint = form.dataset.endpoint || "https://formspree.io/f/xldqyewl";
  const startedAt = Date.now();

  const humanCheck = createHumanCheck(form);
  submitBtn.before(humanCheck.element);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs < 4000) {
      alert("Lütfen formu dikkatlice doldurup tekrar deneyin.");
      return;
    }

    if (!humanCheck.validate()) {
      alert("Doğrulama yanıtı hatalı. Lütfen tekrar deneyin.");
      humanCheck.input.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Gönderiliyor...";

    const formData = new FormData(form);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        humanCheck.refresh();

        const successMsg =
          form.querySelector(".form-success") ||
          document.getElementById("formSuccess");
        if (successMsg) successMsg.style.display = "block";

        submitBtn.textContent = "Talep Alındı";
      } else {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
    } catch (error) {
      alert("Bağlantı hatası. Lütfen tekrar deneyin.");
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    }
  });
});

// ===== SERVICE CATEGORY FILTER =====
const serviceFilterButtons = document.querySelectorAll("[data-service-filter]");
const serviceCards = document.querySelectorAll(
  "[data-filterable-services] .service-card[data-service-category]"
);

if (serviceFilterButtons.length && serviceCards.length) {
  const applyServiceFilter = (category) => {
    serviceCards.forEach((card) => {
      const cardCategory = card.dataset.serviceCategory;
      const visible = category === "all" || cardCategory === category;
      card.classList.toggle("is-hidden", !visible);
    });
  };

  serviceFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.serviceFilter || "all";

      serviceFilterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      applyServiceFilter(category);
    });
  });
}
