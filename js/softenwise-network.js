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
    { id: "filter", name: "Filter", url: "https://filter-date.com/", live: false },
    { id: "puff", name: "Puff", url: "https://puffsocial.net/", live: false },
    { id: "viaguide", name: "ViaGuide", url: "https://viaguideapp.com/", live: false },
    { id: "lokman", name: "Lokman", url: "https://lokmanapp.com/", live: false },
    { id: "gavel", name: "Gavel", url: "https://gavelsale.com/", live: false },
    { id: "xagent", name: "XAgent", url: "https://xagentweb.com/", live: false },
  ];

  /**
   * Hero carousel: every first-party product except the hub itself.
   * Add a site to SITES and (optionally) SHOWCASE — it appears on next/next.
   * Liman is always first.
   */
  var SHOWCASE = {
    liman: {
      image: "images/showcase/liman-kaleici.jpg?v=062b1e97a1",
      imageAlt: "SoftenWise Liman — Antalya Kaleiçi Yat Limanı",
      imageMode: "cover",
      description:
        "Kaleiçi Yat Limanı’nda kullanılan liman yazılımı. Gişe, sefer ve kasa yönetimini bir araya getirir.",
      detailUrl: "urunler.html#kaleici-yat-limani",
    },
    clinic: {
      image: "images/showcase/clinic-ui.png?v=6cb284f5ca",
      imageAlt: "SoftenWise Clinic",
      imageMode: "cover",
      description: "Randevu, hasta ve tedavi süreçlerini tek panelde toplar.",
      detailUrl: "urunler.html#softenwise-clinic",
    },
    maps: {
      image: "images/showcase/maps-fake.jpg?v=4b7c4257fa",
      imageAlt: "SoftenWise Maps",
      imageMode: "cover",
      description: "Saha ekipleri için harita, rota planlama ve API.",
      detailUrl: "urunler.html#softenwise-maps",
    },
    otomini: {
      image: "images/showcase/otomini-hero.webp?v=926e81e60a",
      imageAlt: "Otomini",
      imageMode: "contain",
      description: "İkinci el araç değerleme, ekspertiz ve galeri sunumu.",
      detailUrl: "urunler.html#otomini",
    },
    bloc: {
      image: "images/showcase/bloc-fake.jpg?v=028c53448e",
      imageAlt: "BLOC",
      imageMode: "contain",
      description: "Mahalle sakinlerinin keşfetmesi ve bağlanması için sosyal ağ.",
      detailUrl: "urunler.html#bloc",
    },
    filter: {
      image: "images/showcase/filter-og.png?v=78e527824e",
      imageAlt: "Filter",
      imageMode: "contain",
      description: "Dating uygulaması: gerçek cevaplar, turnuva keşfi ve kapılı sohbet.",
      detailUrl: "urunler.html#filter",
    },
    puff: {
      image: "images/showcase/puff-map.png?v=463346725e",
      imageAlt: "Puff",
      imageMode: "contain",
      description: "Haritada kısa ömürlü mesaj; sohbet yalnızca karşılıklı kabul ile açılır.",
      detailUrl: "urunler.html#puff",
    },
    viaguide: {
      image: "images/showcase/viaguide-og.png?v=60b7412df1",
      imageAlt: "ViaGuide",
      imageMode: "contain",
      description: "Sertifikalı yerel rehberlerle şehir yürüyüşü ve deneyim rezervasyonu.",
      detailUrl: "https://viaguideapp.com/",
    },
    lokman: {
      image: "images/showcase/lokman-og.png?v=5d438568fc",
      imageAlt: "Lokman",
      imageMode: "contain",
      description: "Dijital aktar: bitki tanıma, karışım kontrolü ve şifa ansiklopedisi.",
      detailUrl: "https://lokmanapp.com/",
    },
    gavel: {
      image: "images/showcase/gavel-og.png?v=4a23ca63cc",
      imageAlt: "Gavel",
      imageMode: "contain",
      description: "Canlı müzayede: gerçek zamanlı teklif ve şeffaf satış süreci.",
      detailUrl: "https://gavelsale.com/",
    },
    xagent: {
      image: "images/showcase/xagent-og.png?v=4a641457a1",
      imageAlt: "XAgent",
      imageMode: "contain",
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
      var unpublished = site.live === false;
      return {
        id: site.id,
        name: site.name,
        nameKey: "home.showcase." + site.id + ".name",
        image: meta.image || "",
        imageAlt: unpublished ? site.name : meta.imageAlt || site.name,
        imageMode: meta.imageMode || "cover",
        description: meta.description || "",
        descKey: "home.showcase." + site.id + ".desc",
        bullets: [],
        cta: "İncele",
        ctaKey: "home.showcase.cta",
        detailUrl: unpublished ? "" : meta.detailUrl || site.url,
        url: unpublished ? "" : site.url,
        unpublished: unpublished,
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

  function networkNode(s) {
    if (s.live === false) {
      var span = document.createElement("span");
      span.className = "sw-network-soon";
      span.textContent = s.name;
      span.setAttribute("aria-label", s.name);
      return span;
    }
    if (!/^https:\/\//i.test(String(s.url || ""))) {
      var blocked = document.createElement("span");
      blocked.textContent = s.name;
      return blocked;
    }
    var a = document.createElement("a");
    a.href = s.url;
    a.rel = "noopener noreferrer";
    a.textContent = s.name;
    return a;
  }

  function fill(container) {
    if (!container) return;
    others().forEach(function (s) {
      container.appendChild(networkNode(s));
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
      var node = networkNode(s);
      if (node.tagName === "A") node.target = "_blank";
      li.appendChild(node);
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
