/* =============================================================
   Interactions: theme toggle, sidebar explorer, scrollspy, reveal
   ============================================================= */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- Theme toggle (init happens inline in <head> to avoid FOUC) ---- */
  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.setAttribute("aria-label", "Switch to " + (theme === "light" ? "dark" : "light") + " theme");
  }
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  /* ---- Tab bar shadow on scroll ---- */
  var tabbar = document.querySelector(".tabbar");
  function onScroll() {
    if (tabbar) tabbar.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile file-explorer sidebar ---- */
  var explorerToggle = document.querySelector(".explorer-toggle");
  var sidebar = document.getElementById("file-tree");
  var scrim = document.querySelector(".sidebar-scrim");
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (scrim) scrim.classList.remove("show");
    if (explorerToggle) explorerToggle.setAttribute("aria-expanded", "false");
  }
  if (explorerToggle && sidebar) {
    explorerToggle.addEventListener("click", function () {
      var open = sidebar.classList.toggle("open");
      if (scrim) scrim.classList.toggle("show", open);
      explorerToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    sidebar.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeSidebar();
    });
    if (scrim) scrim.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ---- Scrollspy: highlight active tab + sidebar file ---- */
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
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
