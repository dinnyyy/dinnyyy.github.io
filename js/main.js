/* =============================================================
   Interactions: theme toggle, mobile menu, header border, scrollspy
   ============================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  /* ---- Theme toggle (initial theme is set inline in <head> to avoid a flash) ---- */
  var themeBtn = document.querySelector(".theme-toggle");
  function syncThemeUi() {
    var dark = root.classList.contains("dark");
    if (themeBtn) themeBtn.setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " theme");
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#131824" : "#f8fafd");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = !root.classList.contains("dark");
      root.classList.toggle("dark", dark);
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
      syncThemeUi();
    });
  }
  syncThemeUi();

  /* ---- Header border once the page scrolls ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* ---- Scrollspy: mark the nav link for the section in view ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".spy-link[href^='#']"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          links.forEach(function (a) {
            if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
