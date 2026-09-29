(function () {
  "use strict";

  var LANGS = ["mg", "fr", "en", "de", "es"];
  var LANG_LABELS = {
    mg: { flag: "🇲🇬", name: "Malagasy" },
    fr: { flag: "🇫🇷", name: "Français" },
    en: { flag: "🇬🇧", name: "English" },
    de: { flag: "🇩🇪", name: "Deutsch" },
    es: { flag: "🇪🇸", name: "Español" }
  };
  var STORAGE_KEY = "raphael-portfolio-lang";

  function getByPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function detectDefaultLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (LANGS.indexOf(nav) !== -1) return nav;
    return "fr";
  }

  function applyLang(lang) {
    var dict = window.I18N && window.I18N[lang];
    if (!dict) return;

    document.documentElement.setAttribute("lang", lang === "mg" ? "mg" : lang);

    // Simple text content
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = getByPath(dict, key);
      if (value === undefined) return;
      if (Array.isArray(value)) {
        // handled separately by data-i18n-list
        return;
      }
      el.textContent = value;
    });

    // Placeholder attributes
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var value = getByPath(dict, key);
      if (value !== undefined) el.setAttribute("placeholder", value);
    });

    // List values (e.g. interests chips)
    document.querySelectorAll("[data-i18n-list]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-list");
      var value = getByPath(dict, key);
      if (Array.isArray(value)) {
        el.innerHTML = "";
        value.forEach(function (item) {
          var span = document.createElement("span");
          span.className = "chip";
          span.textContent = item;
          el.appendChild(span);
        });
      }
    });

    // Document title
    var titleVal = getByPath(dict, "meta.title");
    if (titleVal) document.title = titleVal;

    // Update active state in language menu
    document.querySelectorAll(".lang-menu button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    var currentLabel = document.getElementById("lang-current-label");
    if (currentLabel) currentLabel.textContent = lang.toUpperCase();

    localStorage.setItem(STORAGE_KEY, lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function buildLangMenu() {
    var menu = document.getElementById("lang-menu");
    if (!menu) return;
    menu.innerHTML = "";
    LANGS.forEach(function (lang) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-lang", lang);
      btn.innerHTML =
        '<span class="flag">' + LANG_LABELS[lang].flag + "</span><span>" + LANG_LABELS[lang].name + "</span>";
      btn.addEventListener("click", function () {
        applyLang(lang);
        document.getElementById("lang-dropdown").classList.remove("open");
      });
      menu.appendChild(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildLangMenu();
    applyLang(detectDefaultLang());

    var dropdown = document.getElementById("lang-dropdown");
    var trigger = document.getElementById("lang-trigger");
    if (trigger && dropdown) {
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdown.classList.toggle("open");
      });
      document.addEventListener("click", function () {
        dropdown.classList.remove("open");
      });
    }
  });
})();
