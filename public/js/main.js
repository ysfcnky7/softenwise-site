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
