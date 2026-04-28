/**
 * Mobile navigation: hamburger, slide-in link panel, optional Chess accordion, backdrop, Escape to close.
 */
(function () {
  "use strict";

  var BP = 800;

  function isNarrow() {
    return window.matchMedia("(max-width: " + BP + "px)").matches;
  }

  function getPrimaryNavs() {
    return document.querySelectorAll("nav.mm-nav");
  }

  function updateNavOffset() {
    var navs = getPrimaryNavs();
    if (!navs.length) return;
    var h = navs[0].getBoundingClientRect().height;
    document.documentElement.style.setProperty("--mm-nav-offset", h + "px");
  }

  function closeMenu() {
    document.body.classList.remove("mm-nav-open");
    document.body.style.overflow = "";
    document
      .querySelectorAll("nav.mm-nav .mm-nav-toggle")
      .forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
        b.setAttribute("aria-label", "Open menu");
      });
    document
      .querySelectorAll("nav .site-nav-dropdown.is-mm-open, nav .nav-dropdown.is-mm-open")
      .forEach(function (d) {
        d.classList.remove("is-mm-open");
      });
  }

  function openMenu() {
    document.body.classList.add("mm-nav-open");
    document.body.style.overflow = "hidden";
    document.querySelectorAll("nav.mm-nav .mm-nav-toggle").forEach(function (b) {
      b.setAttribute("aria-expanded", "true");
      b.setAttribute("aria-label", "Close menu");
    });
  }

  function onChessClick(e) {
    if (!isNarrow()) return;
    var btn = e.target.closest(
      ".site-nav-dropdown-toggle, .nav-dropdown-toggle"
    );
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var wrap = btn.closest(".site-nav-dropdown, .nav-dropdown");
    if (!wrap) return;
    var open = wrap.classList.contains("is-mm-open");
    document
      .querySelectorAll("nav .site-nav-dropdown.is-mm-open, nav .nav-dropdown.is-mm-open")
      .forEach(function (d) {
        d.classList.remove("is-mm-open");
      });
    if (!open) wrap.classList.add("is-mm-open");
  }

  function init() {
    getPrimaryNavs().forEach(function (nav) {
      var btn = nav.querySelector(".mm-nav-toggle");
      var links = nav.querySelector(".site-nav-links, .nav-links");
      var backdrop = nav.querySelector(".mm-nav-backdrop");
      if (!btn || !links) return;

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!isNarrow()) return;
        if (document.body.classList.contains("mm-nav-open")) closeMenu();
        else {
          updateNavOffset();
          openMenu();
        }
      });

      nav.addEventListener("click", onChessClick, true);

      if (backdrop) {
        backdrop.addEventListener("click", function () {
          closeMenu();
        });
      }

      links.addEventListener("click", function (e) {
        if (!isNarrow()) return;
        if (e.target.closest(".site-nav-dropdown-toggle, .nav-dropdown-toggle")) {
          return;
        }
        if (e.target.closest("a[href]")) {
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("mm-nav-open")) {
        e.preventDefault();
        closeMenu();
      }
    });

    window.addEventListener(
      "resize",
      function () {
        updateNavOffset();
        if (!isNarrow()) closeMenu();
      },
      { passive: true }
    );

    updateNavOffset();
    requestAnimationFrame(updateNavOffset);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateNavOffset).catch(function () {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
