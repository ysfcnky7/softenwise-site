// ===== SAFE SELECTORS =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

// ===== MOBILE MENU (ARIA + SAFE) =====
if (menuBtn && nav) {
  const setMenuState = (open) => {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  // Toggle menu
  menuBtn.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("open"));
  });

  // Menü linkine tıklayınca kapat
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenuState(false));
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
    if (window.innerWidth > 768) setMenuState(false);
  });
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
    label: "Yakında",
    image: "images/geomaps_logo.png",
    imageAlt: "GeoMaps ürün logosu",
    imageMode: "contain",
    description:
      "Lokasyon, saha operasyonu ve harita tabanlı takip ihtiyaçları için geliştirilen yeni ürün ailesi.",
    bullets: [
      "Canlı konum ve rota görünümü",
      "Saha ekipleri için durum takibi",
      "Yeni modüller eklendikçe bu alanda yayınlanacak",
    ],
    cta: "Yayına alınınca açılacak",
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

const form = document.getElementById("contactForm");

if (form) {
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Gönderiliyor...";

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xldqyewl", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        const successMsg = document.getElementById("formSuccess");
        if (successMsg) successMsg.style.display = "block";

        submitBtn.textContent = "Talep Alındı";
      } else {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        submitBtn.disabled = false;
        submitBtn.textContent = "15 Dakikalık Teknik Görüşme Talep Et";
      }
    } catch (error) {
      alert("Bağlantı hatası. Lütfen tekrar deneyin.");
      submitBtn.disabled = false;
      submitBtn.textContent = "15 Dakikalık Teknik Görüşme Talep Et";
    }
  });
}
