// ===== MOBILE MENU (aria + close on link click) =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

const setMenuState = (open) => {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
};

menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.contains("open");
  setMenuState(!isOpen);
});

// Menüden linke tıklayınca kapat (mobil UX)
nav.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => setMenuState(false));
});

// Dışarı tıklayınca kapat
document.addEventListener("click", (e) => {
  const isOpen = nav.classList.contains("open");
  if (!isOpen) return;
  const clickedInside = nav.contains(e.target) || menuBtn.contains(e.target);
  if (!clickedInside) setMenuState(false);
});

// ESC ile kapat
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenuState(false);
});

// ===== HEADER SHADOW ON SCROLL =====
const applyHeaderShadow = () => {
  header.style.boxShadow =
    window.scrollY > 18 ? "0 10px 30px rgba(0,0,0,.08)" : "none";
};
window.addEventListener("scroll", applyHeaderShadow, { passive: true });
applyHeaderShadow();

// ===== REVEAL (IntersectionObserver - performanslı) =====
const reveals = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });

reveals.forEach(el => io.observe(el));
