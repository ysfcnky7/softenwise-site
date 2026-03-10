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
    document.body.style.overflow = open ? "hidden" : "";
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
  } else if (page === "kariyer.html" || page === "academy.html" || page === "girisim-ortakligi.html") {
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

    reveals.forEach((el) => io.observe(el));
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
    url: "https://softenwiseclinic.com/",
  },
  {
    name: "GeoMaps",
    label: "Canlı",
    image: "images/geomaps_logo.png",
    imageAlt: "GeoMaps ürün logosu",
    imageMode: "contain",
    description:
      "Lokasyon, saha operasyonu ve harita tabanlı takip ihtiyaçları için geliştirilen yeni ürün ailesi.",
    bullets: [
      "Canlı konum ve rota görünümü",
      "Saha ekipleri için durum takibi",
      "Yeni modüller düzenli olarak ekleniyor",
    ],
    cta: "Ürün yayında",
    url: "",
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

    const wrapperTag = product.url ? "a" : "div";
    const wrapper = document.createElement(wrapperTag);
    wrapper.className = "product-card";

    if (product.url) {
      wrapper.href = product.url;
      wrapper.target = "_blank";
      wrapper.rel = "noopener noreferrer";
      wrapper.setAttribute("aria-label", `${product.name} yeni sekmede açılır`);
    } else {
      item.classList.add("is-disabled");
    }

    const mediaClass =
      product.imageMode === "contain"
        ? "product-media product-media--contain"
        : "product-media";

    const mediaHtml = product.image
      ? `
      <div class="${mediaClass}">
        <img src="${product.image}" alt="${product.imageAlt || product.name}" loading="lazy" decoding="async" />
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
