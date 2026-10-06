/**
 * Locale from the URL (/en/... or /es/...), copy from /i18n/{locale}.json.
 * Missing Spanish keys fall back to English. HTML English is the no-JS fallback.
 */
(function () {
  "use strict";

  var DEFAULT = "en";
  var LOCALES = ["en", "es"];
  var ORIGIN = "https://madridminds.com";
  var ASSET = /^\/(css|js|i18n|photos|social|Branding|nav-mobile|TopHeader|chess\.png|Ruy|Avatar|favicon)/i;

  function detectLocale() {
    var match = (location.pathname || "").match(/\/(en|es)(?=\/|$)/);
    if (match && LOCALES.indexOf(match[1]) !== -1) return match[1];
    return DEFAULT;
  }

  function pathWithoutLocale() {
    var path = location.pathname || "/";
    var stripped = path.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
    if (stripped.charAt(0) !== "/") stripped = "/" + stripped;
    if (stripped === "/index.html") stripped = "/";
    return stripped;
  }

  function localeHref(locale, path) {
    var p = path == null ? pathWithoutLocale() : path;
    if (!p || p === "/") return "/" + locale + "/";
    if (p.charAt(0) !== "/") p = "/" + p;
    p = p.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
    if (p === "/index.html") p = "/";
    if (p === "/") return "/" + locale + "/";
    return "/" + locale + p;
  }

  function localizeHref(href, locale) {
    if (!href) return href;
    var hash = "";
    var q = "";
    var hashAt = href.indexOf("#");
    if (hashAt !== -1) {
      hash = href.slice(hashAt);
      href = href.slice(0, hashAt);
    }
    var qAt = href.indexOf("?");
    if (qAt !== -1) {
      q = href.slice(qAt);
      href = href.slice(0, qAt);
    }
    if (!href) return q + hash;
    if (/^(mailto:|https?:|\/\/)/i.test(href)) return href + q + hash;
    if (href.charAt(0) !== "/") href = "/" + href.replace(/^\.\//, "");
    if (ASSET.test(href)) return href + q + hash;
    return localeHref(locale, href) + q + hash;
  }

  function get(obj, path) {
    if (!obj || !path) return null;
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] != null ? acc[key] : null;
    }, obj);
  }

  function deepMerge(base, over) {
    if (!over || typeof over !== "object" || Array.isArray(over)) return over != null ? over : base;
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base || {});
    Object.keys(over).forEach(function (key) {
      var bv = out[key];
      var ov = over[key];
      if (ov && typeof ov === "object" && !Array.isArray(ov) && bv && typeof bv === "object" && !Array.isArray(bv)) {
        out[key] = deepMerge(bv, ov);
      } else {
        out[key] = ov;
      }
    });
    return out;
  }

  function setMeta(selector, attr, value) {
    if (value == null) return;
    var el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  function ensureLink(rel, hreflang, href) {
    var sel = 'link[rel="' + rel + '"]' + (hreflang ? '[hreflang="' + hreflang + '"]' : ":not([hreflang])");
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      if (hreflang) el.setAttribute("hreflang", hreflang);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  function applyMeta(pageDict, locale) {
    var meta = (pageDict && pageDict.meta) || {};
    if (meta.title) document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.ogTitle || meta.title);
    setMeta('meta[property="og:description"]', "content", meta.ogDescription || meta.description);
    setMeta('meta[name="twitter:title"]', "content", meta.twitterTitle || meta.ogTitle || meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.twitterDescription || meta.ogDescription || meta.description);

    var canonical = ORIGIN + localeHref(locale);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:locale"]', "content", locale === "es" ? "es_ES" : "en_GB");

    LOCALES.forEach(function (loc) {
      ensureLink("alternate", loc, ORIGIN + localeHref(loc));
    });
    ensureLink("alternate", "x-default", ORIGIN + localeHref(DEFAULT));
  }

  function rewriteLinks(locale) {
    document.querySelectorAll("a[href]").forEach(function (el) {
      if (el.hasAttribute("data-keep-href")) return;
      if (el.hasAttribute("data-locale-link")) return;
      var href = el.getAttribute("href");
      el.setAttribute("href", localizeHref(href, locale));
    });
  }

  function markCurrentNav() {
    var here = pathWithoutLocale();
    document.querySelectorAll(".site-nav-link[href], .site-nav-dropdown-item[href]").forEach(function (el) {
      var href = el.getAttribute("href") || "";
      var path = href.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
      if (path === "/index.html") path = "/";
      var hashAt = path.indexOf("#");
      if (hashAt !== -1) path = path.slice(0, hashAt);
      if (path === here) el.setAttribute("aria-current", "page");
    });
  }

  function apply(dict, locale) {
    document.documentElement.lang = locale;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = get(dict, el.getAttribute("data-i18n"));
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var value = get(dict, el.getAttribute("data-i18n-aria"));
      if (value != null) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var value = get(dict, el.getAttribute("data-i18n-alt"));
      if (value != null) el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var value = get(dict, el.getAttribute("data-i18n-title"));
      if (value != null) el.setAttribute("title", value);
    });

    document.querySelectorAll("[data-i18n-mailto-subject]").forEach(function (el) {
      var value = get(dict, el.getAttribute("data-i18n-mailto-subject"));
      if (value == null) return;
      var href = el.getAttribute("href") || "";
      var base = href.split("?")[0] || href;
      el.setAttribute("href", base + "?subject=" + encodeURIComponent(value));
    });

    rewriteLinks(locale);

    document.querySelectorAll("[data-locale-link]").forEach(function (el) {
      var loc = el.getAttribute("data-locale-link");
      if (LOCALES.indexOf(loc) === -1) return;
      el.setAttribute("href", localeHref(loc));
      if (loc === locale) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });

    document.querySelectorAll("[data-locale-self]").forEach(function (el) {
      el.setAttribute("href", localeHref(locale));
    });

    markCurrentNav();

    var page = document.documentElement.getAttribute("data-i18n-page");
    if (page) applyMeta(dict[page], locale);

    document.documentElement.classList.remove("mm-i18n-pending");
  }

  function loadJson(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (res) {
      if (!res.ok) throw new Error("i18n " + res.status);
      return res.json();
    });
  }

  function reveal() {
    document.documentElement.classList.remove("mm-i18n-pending");
  }

  var locale = detectLocale();
  document.documentElement.lang = locale;

  var readyTimer = window.setTimeout(reveal, 2000);

  loadJson("/i18n/" + DEFAULT + ".json")
    .then(function (enDict) {
      if (locale === DEFAULT) return enDict;
      return loadJson("/i18n/" + locale + ".json")
        .then(function (locDict) {
          return deepMerge(enDict, locDict);
        })
        .catch(function () {
          return enDict;
        });
    })
    .then(function (dict) {
      window.clearTimeout(readyTimer);
      window.MM_I18N = { locale: locale, dict: dict, href: function (path) { return localeHref(locale, path); } };
      apply(dict, locale);
      document.dispatchEvent(new CustomEvent("mm:i18n-ready"));
    })
    .catch(function () {
      window.clearTimeout(readyTimer);
      reveal();
    });
})();
