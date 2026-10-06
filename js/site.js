/**
 * Shared site behaviour: prices from config, booking list, sticky CTA.
 */
(function () {
  "use strict";

  var cfg = window.MM_CONFIG || {};
  var pricing = cfg.pricing || {};
  var sessions = cfg.sessions || [];
  var experiences = cfg.experiences || [];
  var email = (cfg.contact && cfg.contact.email) || "ruy@madridminds.com";

  function formatEuro(n) {
    if (typeof n !== "number") return "";
    return "€" + n;
  }

  function fillPrices() {
    document.querySelectorAll("[data-mm-price]").forEach(function (el) {
      var key = el.getAttribute("data-mm-price");
      if (key === "experience") el.textContent = formatEuro(pricing.experienceForTwo);
      if (key === "bundle") el.textContent = formatEuro(pricing.bundleForTwo);
    });
  }

  function t(key, fallback) {
    var dict = window.MM_I18N && window.MM_I18N.dict;
    if (!dict || !key) return fallback;
    var cur = dict;
    var parts = key.split(".");
    for (var i = 0; i < parts.length; i++) {
      cur = cur[parts[i]];
      if (cur == null) return fallback;
    }
    return cur;
  }

  function pageHref(path) {
    if (window.MM_I18N && typeof window.MM_I18N.href === "function") {
      return window.MM_I18N.href(path);
    }
    return path;
  }

  function fillDuration() {
    var published = cfg.duration && cfg.duration.published && cfg.duration.label;
    if (!published) {
      document.querySelectorAll("[data-mm-duration]").forEach(function (el) {
        var item = el.closest(".practical-item, .pill, li");
        if (item) item.remove();
        else el.remove();
      });
      return;
    }
    var label = t("common.duration", cfg.duration.label);
    document.querySelectorAll("[data-mm-duration]").forEach(function (el) {
      el.textContent = label;
    });
  }

  function fillEnglish() {
    var note = t("common.englishLevel", cfg.englishLevelNote || "Comfortable following English");
    document.querySelectorAll("[data-mm-english]").forEach(function (el) {
      el.textContent = note;
    });
  }

  function experienceById(id) {
    for (var i = 0; i < experiences.length; i++) {
      if (experiences[i].id === id) return experiences[i];
    }
    return null;
  }

  function mailLink(subject) {
    return (
      "mailto:" +
      email +
      "?subject=" +
      encodeURIComponent(subject || "Book The First Move")
    );
  }

  function emptyCard(exp, featured) {
    var isFirst = exp.id === "the-first-move";
    var heading = isFirst
      ? t("book.datesSoon", "New dates coming soon")
      : t("book.nextDatesSoon", "New dates coming soon");
    var copy = isFirst
      ? t(
          "book.firstMoveWait",
          "A beginner evening for people who have never played. Register your interest and we’ll send the next date as soon as it’s set."
        )
      : t(
          "book.lessOftenWait",
          "New dates coming soon. Leave your email and we’ll tell you when the next evening is set."
        );
    var aboutHref = pageHref(exp.href || "/experiences.html");
    var actions = isFirst
      ? '<a class="btn btn-primary" href="' +
        mailLink(t("book.bookSubject", "Book The First Move")) +
        '">' +
        t("common.bookFirstMove", "Book The First Move") +
        "</a>" +
        '<a class="btn btn-ghost" href="#waitlist">' +
        t("common.getNotified", "Get notified of the next dates") +
        "</a>"
      : '<a class="btn btn-primary" href="#waitlist">' +
        t("common.getNotified", "Get notified of the next dates") +
        "</a>" +
        '<a class="btn btn-ghost" href="' +
        aboutHref +
        '">' +
        t("common.aboutThisEvening", "About this evening") +
        "</a>";
    var name = t("experiences." + (isFirst ? "firstMove" : exp.id === "think-ahead" ? "thinkAhead" : "gamePlan") + "Name", exp.name || "Experience");
    return (
      '<article class="event-card' +
      (featured ? " event-card--featured" : " event-card--soon") +
      '">' +
      '<p class="event-card-label">' +
      name +
      "</p>" +
      "<h2>" +
      heading +
      "</h2>" +
      "<p>" +
      copy +
      "</p>" +
      '<ul class="event-meta-list">' +
      "<li>" +
      t("common.madrid", "Madrid") +
      "</li>" +
      "<li>" +
      t("common.guestIncluded", "Your guest is on us") +
      "</li>" +
      '<li><span data-mm-price="experience"></span> ' +
      t("home.forYouGuest", "for you + one guest") +
      "</li>" +
      "</ul>" +
      '<div class="event-card-actions">' +
      actions +
      "</div>" +
      "</article>"
    );
  }

  function sessionCard(session, featured) {
    var exp = experienceById(session.experienceId) || {};
    return (
      '<article class="event-card' +
      (featured ? " event-card--featured" : "") +
      '">' +
      '<p class="event-card-label">' +
      (exp.name || "Experience") +
      "</p>" +
      "<h2>" +
      (session.dateLabel || "") +
      "</h2>" +
      "<p>" +
      (exp.tagline || "") +
      "</p>" +
      '<ul class="event-meta-list">' +
      "<li>" +
      (session.timeLabel || "") +
      "</li>" +
      "<li>" +
      (session.city || "Madrid") +
      "</li>" +
      "<li>" +
      (session.seatsLabel || "Small group") +
      "</li>" +
      '<li>' +
      t("common.guestIncluded", "Your guest is on us") +
      "</li>" +
      '<li><span data-mm-price="experience"></span> ' +
      t("home.forYouGuest", "for you + one guest") +
      "</li>" +
      "</ul>" +
      '<div class="event-card-actions">' +
      '<a class="btn btn-primary" href="' +
      mailLink(session.mailtoSubject || "Book " + (exp.name || "MadridMinds")) +
      '">' +
      t("common.book", "Book") +
      "</a>" +
      "</div>" +
      "</article>"
    );
  }

  function renderBooking() {
    var root = document.getElementById("booking-list");
    if (!root) return;

    var html = "";
    var idsWithDates = {};

    sessions.forEach(function (session, index) {
      idsWithDates[session.experienceId] = true;
      html += sessionCard(session, index === 0);
    });

    var order = ["the-first-move", "think-ahead", "game-plan"];
    order.forEach(function (id) {
      if (idsWithDates[id]) return;
      var exp = experienceById(id);
      if (!exp) return;
      html += emptyCard(exp, !sessions.length && id === "the-first-move");
    });

    root.innerHTML = html;
    fillPrices();
  }

  function stickyCta() {
    var bar = document.querySelector("[data-sticky-cta]");
    if (!bar) return;
    var hero = document.querySelector(".page-hero, .hero");
    function update() {
      var threshold = hero ? hero.getBoundingClientRect().bottom : 280;
      bar.classList.toggle("is-visible", threshold < 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderProof() {
    var features = cfg.features || {};
    var quotes = features.testimonials || [];
    var logos = features.clientLogos || [];

    var quoteRoot = document.querySelector("[data-mm-testimonials]");
    var quoteSection = document.querySelector('[data-proof="testimonials"]');
    if (quoteRoot && quoteSection && quotes.length) {
      quoteSection.hidden = false;
      quoteSection.removeAttribute("aria-hidden");
      quoteRoot.innerHTML = quotes
        .map(function (item) {
          var quote = escapeHtml(item.quote);
          var by = escapeHtml(item.attribution);
          var role = escapeHtml(item.role);
          return (
            '<blockquote class="proof-quote"><p>' +
            quote +
            "</p><footer>" +
            by +
            (role ? "<span>" + role + "</span>" : "") +
            "</footer></blockquote>"
          );
        })
        .join("");
    }

    var logoRoot = document.querySelector("[data-mm-logos]");
    var logoSection = document.querySelector('[data-proof="logos"]');
    if (logoRoot && logoSection && logos.length) {
      logoSection.hidden = false;
      logoSection.removeAttribute("aria-hidden");
      logoRoot.innerHTML = logos
        .map(function (logo) {
          var src = escapeHtml(logo.src);
          var alt = escapeHtml(logo.alt || logo.name || "Client");
          return '<div class="proof-logo"><img src="' + src + '" alt="' + alt + '" /></div>';
        })
        .join("");
    }
  }

  var didSticky = false;
  function init() {
    fillPrices();
    fillDuration();
    fillEnglish();
    renderBooking();
    renderProof();
    if (!didSticky) {
      stickyCta();
      didSticky = true;
    }
  }

  document.addEventListener("mm:i18n-ready", init);
  if (!document.documentElement.getAttribute("data-i18n-page")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
