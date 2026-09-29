(function () {
  "use strict";

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) {
      setTimeout(function () {
        loader.classList.add("hidden");
      }, 350);
    }
  });

  /* ---------------- Theme (dark / light) ---------------- */
  var THEME_KEY = "raphael-portfolio-theme";
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
    } else {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }
  initTheme();

  function getByPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function currentLang() {
    var l = document.documentElement.getAttribute("lang") || "fr";
    return window.I18N && window.I18N[l] ? l : "fr";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var isDark = root.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
      });
    }

    /* ---------------- Active nav link on scroll ---------------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a, .mobile-menu a"));

    function updateActiveNav() {
      var scrollPos = window.scrollY + 140;
      var currentId = sections.length ? sections[0].id : null;
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) currentId = sec.id;
      });
      navLinks.forEach(function (link) {
        var match = link.getAttribute("href") === "#" + currentId;
        link.classList.toggle("active", match);
      });
    }

    /* ---------------- Side controls (scroll up / down) ---------------- */
    var sideControls = document.getElementById("side-controls");
    function toggleSideControls() {
      if (!sideControls) return;
      if (window.scrollY > 240) sideControls.classList.add("visible");
      else sideControls.classList.remove("visible");
    }

    /* ---------------- Header scroll state ---------------- */
    var header = document.getElementById("site-header");
    function onScroll() {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");

      toggleSideControls();
      updateActiveNav();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------------- Mobile menu ---------------- */
    var hamburger = document.getElementById("hamburger");
    var mobileMenu = document.getElementById("mobile-menu");
    var overlay = document.getElementById("menu-overlay");

    function closeMenu() {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      overlay.classList.remove("open");
    }
    if (hamburger) {
      hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("open");
        mobileMenu.classList.toggle("open");
        overlay.classList.toggle("open");
      });
      overlay.addEventListener("click", closeMenu);
      mobileMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });
    }

    /* ---------------- Counter animation helper ---------------- */
    function animateCounter(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1100;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    /* ---------------- Reveal on scroll ---------------- */
    var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
            var bars = entry.target.querySelectorAll(".skill-bar-fill, .language-bar-fill");
            bars.forEach(function (bar) {
              var pct = bar.getAttribute("data-fill");
              requestAnimationFrame(function () {
                bar.style.width = pct + "%";
              });
            });
            var counters = entry.target.querySelectorAll(".number-value[data-count]");
            counters.forEach(animateCounter);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 120px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });

    /* ---------------- Side controls buttons ---------------- */
    var btnUp = document.getElementById("scroll-up");
    var btnDown = document.getElementById("scroll-down");
    if (btnUp) {
      btnUp.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    if (btnDown) {
      btnDown.addEventListener("click", function () {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      });
    }

    /* ---------------- Hero blob parallax ---------------- */
    var hero = document.getElementById("home");
    var blobs = document.querySelectorAll(".hero-blob");
    if (hero && blobs.length && window.matchMedia("(pointer: fine)").matches) {
      hero.addEventListener("mousemove", function (e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        blobs.forEach(function (blob, i) {
          var strength = (i + 1) * 14;
          blob.style.transform = "translate(" + x * strength + "px, " + y * strength + "px)";
        });
      });
    }

    /* ---------------- Footer year ---------------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------------- Contact form (demo) ---------------- */
    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector("button[type=submit]");
        var original = btn.innerHTML;
        var dict = window.I18N && window.I18N[currentLang()];
        var sentLabel = (dict && dict.contact && dict.contact.form_send) ? "✓" : "✓";
        btn.innerHTML = "✓";
        btn.style.opacity = "0.7";
        setTimeout(function () {
          btn.innerHTML = original;
          btn.style.opacity = "1";
          form.reset();
        }, 2200);
      });
    }

    /* ================= MARQUEE ================= */
    var marqueeTrack = document.getElementById("marquee-track");
    function buildMarquee() {
      if (!marqueeTrack) return;
      var dict = window.I18N[currentLang()];
      var roles = (dict && dict.hero && dict.hero.roles) || [];
      if (!roles.length) return;
      var html = "";
      for (var rep = 0; rep < 2; rep++) {
        roles.forEach(function (role, i) {
          var accent = i % 2 === 0 ? "" : " accent";
          html += '<span class="marquee-item' + accent + '"><span class="dot"></span>' + role + "</span>";
        });
      }
      marqueeTrack.innerHTML = html;
    }
    buildMarquee();

    /* ================= PROJECT FILTER + SEARCH ================= */
    var projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
    var filterPillsEl = document.getElementById("filter-pills");
    var searchInput = document.getElementById("project-search");
    var emptyMsg = document.getElementById("projects-empty");
    var activeTag = "all";

    function allTags() {
      var set = [];
      projectCards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(",");
        tags.forEach(function (t) {
          t = t.trim();
          if (t && set.indexOf(t) === -1) set.push(t);
        });
      });
      return set;
    }

    function buildFilterPills() {
      if (!filterPillsEl) return;
      var dict = window.I18N[currentLang()];
      var allLabel = (dict && dict.projects && dict.projects.filter_all) || "All";
      var tags = allTags();
      var html = '<button class="filter-pill' + (activeTag === "all" ? " active" : "") + '" data-tag="all">' + allLabel + "</button>";
      tags.forEach(function (tag) {
        html += '<button class="filter-pill' + (activeTag === tag ? " active" : "") + '" data-tag="' + tag + '">' + tag + "</button>";
      });
      filterPillsEl.innerHTML = html;
      filterPillsEl.querySelectorAll(".filter-pill").forEach(function (btn) {
        btn.addEventListener("click", function () {
          activeTag = btn.getAttribute("data-tag");
          filterPillsEl.querySelectorAll(".filter-pill").forEach(function (b) {
            b.classList.toggle("active", b === btn);
          });
          applyFilters();
        });
      });
    }

    function applyFilters() {
      var query = (searchInput && searchInput.value || "").trim().toLowerCase();
      var visibleCount = 0;
      projectCards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").toLowerCase();
        var titleEl = card.querySelector("h3");
        var title = titleEl ? titleEl.textContent.toLowerCase() : "";
        var matchesTag = activeTag === "all" || tags.split(",").map(function(t){return t.trim();}).indexOf(activeTag.toLowerCase()) !== -1;
        var matchesSearch = !query || title.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
        var show = matchesTag && matchesSearch;
        card.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });
      if (emptyMsg) emptyMsg.classList.toggle("visible", visibleCount === 0);
    }

    buildFilterPills();
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    /* ================= PROJECT MODAL ================= */
    var modal = document.getElementById("project-modal");
    var modalClose = document.getElementById("modal-close");
    var modalCategory = document.getElementById("modal-category");
    var modalYear = document.getElementById("modal-year");
    var modalTitle = document.getElementById("modal-title");
    var modalSubtitle = document.getElementById("modal-subtitle");
    var modalDesc = document.getElementById("modal-desc");
    var modalFeatures = document.getElementById("modal-features");
    var modalTags = document.getElementById("modal-tags");
    var modalLinkProject = document.getElementById("modal-link-project");
    var modalLinkCode = document.getElementById("modal-link-code");
    var modalImage = document.getElementById("modal-image");
    var currentModalProject = null;

    function checkIconSvg() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    }

    function populateModal(projectId) {
      var dict = window.I18N[currentLang()];
      var p = dict && dict.projects;
      var meta = window.PROJECTS && window.PROJECTS[projectId];
      if (!p || !meta) return;

      modalCategory.textContent = getByPath(p, projectId + "_category") || "";
      modalYear.textContent = getByPath(p, projectId + "_year") || "";
      modalTitle.textContent = getByPath(p, projectId + "_title") || "";
      modalSubtitle.textContent = getByPath(p, projectId + "_subtitle") || "";
      modalDesc.textContent = getByPath(p, projectId + "_long") || getByPath(p, projectId + "_desc") || "";

      var feats = [
        getByPath(p, projectId + "_feat1"),
        getByPath(p, projectId + "_feat2"),
        getByPath(p, projectId + "_feat3")
      ].filter(Boolean);
      modalFeatures.innerHTML = feats.map(function (f) {
        return "<li>" + checkIconSvg() + "<span>" + f + "</span></li>";
      }).join("");

      modalTags.innerHTML = meta.tags.map(function (t) {
        return '<span class="project-tag">' + t + "</span>";
      }).join("");

      if (modalImage) {
        if (meta.image) {
          modalImage.src = meta.image;
          modalImage.alt = getByPath(p, projectId + "_title") || "";
          modalImage.style.display = "";
        } else {
          modalImage.removeAttribute("src");
          modalImage.style.display = "none";
        }
      }

      var visibility = getByPath(p, projectId + "_visibility");
      var status = getByPath(p, projectId + "_status");

      if (meta.demo && meta.demo !== "#") {
        modalLinkProject.href = meta.demo;
        modalLinkProject.style.display = "";
      } else {
        modalLinkProject.style.display = visibility === "private" ? "none" : "";
        modalLinkProject.href = "#";
      }
      if (meta.code) {
        modalLinkCode.href = meta.code === "#" ? "#" : meta.code;
        modalLinkCode.style.display = "";
      } else {
        modalLinkCode.style.display = "none";
      }
      currentModalProject = projectId;
    }

    function openModal(projectId) {
      populateModal(projectId);
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
    document.querySelectorAll(".project-thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var card = thumb.closest(".project-card");
        if (card) openModal(card.getAttribute("data-project"));
      });
    });

    document.querySelectorAll(".js-open-modal").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(btn.getAttribute("data-project"));
      });
    });
    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });

    /* ================= Re-sync on language change ================= */
    document.addEventListener("langchange", function () {
      buildMarquee();
      buildFilterPills();
      applyFilters();
      if (modal && modal.classList.contains("open") && currentModalProject) {
        populateModal(currentModalProject);
      }
    });
  });
})();
