/**
 * SoftenWise first-party public sites — dofollow homepage mesh for crawl/findability.
 * Client brands (Aytu, Point Croissant, …) are not in this list: they credit the hub only.
 */
(function (root) {
  var SITES = [
    { id: "softenwise", name: "SoftenWise", url: "https://softenwise.com/" },
    { id: "liman", name: "SoftenWise Liman", url: "https://liman.softenwise.com/" },
    { id: "clinic", name: "SoftenWise Clinic", url: "https://softenwiseclinic.com/" },
    { id: "maps", name: "SoftenWise Maps", url: "https://softenwisemaps.com/" },
    { id: "otomini", name: "Otomini", url: "https://otomini.com/" },
    { id: "bloc", name: "BLOC", url: "https://bloc.app/" },
    { id: "filter", name: "Filter", url: "https://filter-date.com/" },
    { id: "puff", name: "Puff", url: "https://puffsocial.net/" },
    { id: "viaguide", name: "ViaGuide", url: "https://viaguideapp.com/" },
    { id: "lokman", name: "Lokman", url: "https://lokmanapp.com/" },
    { id: "gavel", name: "Gavel", url: "https://gavelsale.com/" },
    { id: "xagent", name: "XAgent", url: "https://xagentweb.com/" },
  ];

  /**
   * Hero carousel: every first-party product except the hub itself.
   * Add a site to SITES and (optionally) SHOWCASE — it appears on next/next.
   * Liman is always first.
   */
  var SHOWCASE = {
    liman: {
      image: "images/showcase/liman-kaleici.jpg",
      imageAlt: "SoftenWise Liman — Antalya Kaleiçi Yat Limanı",
      imageMode: "cover",
      description:
        "Kaleiçi Yat Limanı’nda kullanılan liman yazılımı. Gişe, sefer ve kasa yönetimini bir araya getirir.",
      detailUrl: "urunler.html#kaleici-yat-limani",
    },
    clinic: {
      image: "images/showcase/clinic-ui.png",
      imageAlt: "SoftenWise Clinic",
      imageMode: "cover",
      description: "Randevu, hasta ve tedavi süreçlerini tek panelde toplar.",
      detailUrl: "urunler.html#softenwise-clinic",
    },
    maps: {
      image: "images/showcase/maps-fake.jpg",
      imageAlt: "SoftenWise Maps",
      imageMode: "cover",
      description: "Saha ekipleri için harita, rota planlama ve API.",
      detailUrl: "urunler.html#softenwise-maps",
    },
    otomini: {
      image: "images/showcase/otomini-ui.webp",
      imageAlt: "Otomini",
      imageMode: "cover",
      description: "İkinci el araç değerleme, ekspertiz ve galeri sunumu.",
      detailUrl: "urunler.html#otomini",
    },
    bloc: {
      image: "images/showcase/bloc-fake.jpg",
      imageAlt: "BLOC",
      imageMode: "cover",
      description: "Mahalle sakinlerinin keşfetmesi ve bağlanması için sosyal ağ.",
      detailUrl: "urunler.html#bloc",
    },
    filter: {
      image: "images/showcase/filter-og.png",
      imageAlt: "Filter",
      imageMode: "cover",
      description: "Dating uygulaması: gerçek cevaplar, turnuva keşfi ve kapılı sohbet.",
      detailUrl: "urunler.html#filter",
    },
    puff: {
      image: "images/showcase/puff-icon.png",
      imageAlt: "Puff",
      imageMode: "contain",
      description: "Haritada kısa ömürlü mesaj; sohbet yalnızca karşılıklı kabul ile açılır.",
      detailUrl: "urunler.html#puff",
    },
    viaguide: {
      image: "images/showcase/viaguide-og.png",
      imageAlt: "ViaGuide",
      imageMode: "cover",
      description: "Sertifikalı yerel rehberlerle şehir yürüyüşü ve deneyim rezervasyonu.",
      detailUrl: "https://viaguideapp.com/",
    },
    lokman: {
      image: "images/showcase/lokman-og.png",
      imageAlt: "Lokman",
      imageMode: "cover",
      description: "Dijital aktar: bitki tanıma, karışım kontrolü ve şifa ansiklopedisi.",
      detailUrl: "https://lokmanapp.com/",
    },
    gavel: {
      image: "images/showcase/gavel-og.png",
      imageAlt: "Gavel",
      imageMode: "cover",
      description: "Canlı müzayede: gerçek zamanlı teklif ve şeffaf satış süreci.",
      detailUrl: "https://gavelsale.com/",
    },
    xagent: {
      image: "images/showcase/xagent-og.png",
      imageAlt: "XAgent",
      imageMode: "cover",
      description: "Doğrulanmış araştırmacılarla özel araştırma pazaryeri.",
      detailUrl: "https://xagentweb.com/",
    },
  };

  function showcaseProducts() {
    var hubId = "softenwise";
    var firstId = "liman";
    var extra = [];
    var first = null;
    for (var i = 0; i < SITES.length; i++) {
      var site = SITES[i];
      if (!site || site.id === hubId) continue;
      if (site.id === firstId) first = site;
      else extra.push(site);
    }
    var ordered = first ? [first].concat(extra) : extra;
    return ordered.map(function (site) {
      var meta = SHOWCASE[site.id] || {};
      return {
        id: site.id,
        name: site.name,
        nameKey: "home.showcase." + site.id + ".name",
        image: meta.image || "",
        imageAlt: meta.imageAlt || site.name,
        imageMode: meta.imageMode || "cover",
        description: meta.description || "",
        descKey: "home.showcase." + site.id + ".desc",
        bullets: [],
        cta: "İncele",
        ctaKey: "home.showcase.cta",
        detailUrl: meta.detailUrl || site.url,
        url: site.url,
      };
    });
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return "";
    }
  }

  function currentHost() {
    if (typeof location === "undefined") return "";
    return String(location.hostname || "").replace(/^www\./i, "").toLowerCase();
  }

  function others() {
    var host = currentHost();
    return SITES.filter(function (s) {
      return hostOf(s.url) !== host;
    });
  }

  function fill(container) {
    if (!container) return;
    others().forEach(function (s) {
      var a = document.createElement("a");
      a.href = s.url;
      a.rel = "noopener noreferrer";
      a.textContent = s.name;
      container.appendChild(a);
    });
  }

  function injectCommercial() {
    var links = document.querySelector(".site-footer .footer-links");
    if (!links || document.getElementById("sw-network")) return;
    var col = document.createElement("div");
    col.className = "footer-col";
    col.id = "sw-network";
    var title = document.createElement("div");
    title.className = "footer-title";
    title.setAttribute("data-i18n", "footer.network");
    title.textContent = "SoftenWise ağı";
    col.appendChild(title);
    fill(col);
    links.appendChild(col);
  }

  function injectPromoGrid() {
    var grid = document.querySelector(".promoFooterGrid");
    if (!grid || document.getElementById("sw-network")) return;
    var sec = document.createElement("section");
    sec.className = "promoCol";
    sec.id = "sw-network";
    var h2 = document.createElement("h2");
    h2.className = "promoColTitle";
    h2.textContent = document.documentElement.lang === "en" ? "SoftenWise network" : "SoftenWise ağı";
    sec.appendChild(h2);
    var ul = document.createElement("ul");
    ul.className = "promoList";
    others().forEach(function (s) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = s.name;
      li.appendChild(a);
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    var legal = null;
    grid.querySelectorAll(".promoColTitle").forEach(function (t) {
      var x = (t.textContent || "").trim().toUpperCase();
      if (x === "YASAL" || x === "LEGAL") legal = t.closest(".promoCol");
    });
    if (legal) grid.insertBefore(sec, legal);
    else grid.appendChild(sec);
  }

  root.SoftenWiseNetwork = {
    SITES: SITES,
    SHOWCASE: SHOWCASE,
    others: others,
    showcaseProducts: showcaseProducts,
    fill: fill,
    injectCommercial: injectCommercial,
    injectPromoGrid: injectPromoGrid,
  };

  if (typeof document === "undefined") return;
  var run = function () {
    injectCommercial();
    injectPromoGrid();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})(typeof window !== "undefined" ? window : this);
