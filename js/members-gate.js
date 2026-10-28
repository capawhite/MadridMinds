/**
 * Soft password gate for the Members learning area.
 * Not real security — courtesy lock so casual visitors don’t self-serve.
 */
(function () {
  "use strict";

  var cfg = (window.MM_CONFIG && window.MM_CONFIG.members) || {};
  var password = cfg.password || "";
  var storageKey = cfg.storageKey || "mm-members";

  function unlocked() {
    try {
      return sessionStorage.getItem(storageKey) === "1";
    } catch (e) {
      return false;
    }
  }

  function unlock() {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (e) {}
  }

  function showContent() {
    document.documentElement.classList.remove("mm-members-locked");
    document.documentElement.classList.add("mm-members-unlocked");
    var gate = document.getElementById("mm-members-gate");
    if (gate) gate.hidden = true;
    var main = document.getElementById("mm-members-content");
    if (main) main.hidden = false;
  }

  function buildGate() {
    var existing = document.getElementById("mm-members-gate");
    if (existing) return existing;

    var gate = document.createElement("div");
    gate.id = "mm-members-gate";
    gate.className = "mm-members-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "mm-members-gate-title");
    gate.innerHTML =
      '<div class="mm-members-gate-card">' +
      '<p class="kicker">Members</p>' +
      '<h1 id="mm-members-gate-title">Member area</h1>' +
      "<p>Basics for people who’ve already played with MadridMinds. Enter the access code from your booking email.</p>" +
      '<form id="mm-members-gate-form" class="mm-members-gate-form">' +
      '<label for="mm-members-password">Access code</label>' +
      '<input id="mm-members-password" name="password" type="password" autocomplete="current-password" required />' +
      '<button type="submit" class="btn btn-primary">Enter</button>' +
      '<p class="mm-members-gate-error" id="mm-members-gate-error" hidden>That code doesn’t match. Check your booking email.</p>' +
      "</form>" +
      '<p class="mm-members-gate-note"><a href="/book.html">Looking for an evening?</a> Book The First Move instead.</p>' +
      "</div>";
    document.body.appendChild(gate);
    return gate;
  }

  function init() {
    if (!password) {
      showContent();
      return;
    }

    document.documentElement.classList.add("mm-members-locked");
    var content = document.getElementById("mm-members-content");
    if (content) content.hidden = true;

    if (unlocked()) {
      showContent();
      return;
    }

    var gate = buildGate();
    gate.hidden = false;

    var form = document.getElementById("mm-members-gate-form");
    var input = document.getElementById("mm-members-password");
    var err = document.getElementById("mm-members-gate-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (input.value || "").trim();
      if (value === password) {
        unlock();
        showContent();
        return;
      }
      if (err) err.hidden = false;
      input.focus();
      input.select();
    });

    if (input) input.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
