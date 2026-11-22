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
    others: others,
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
