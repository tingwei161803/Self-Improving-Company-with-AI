/* =========================================================================
   Self-Improving Company · composite · app.js  (vanilla, no build, no libs)

   A single long page assembled from an ordered list of typed section-blocks.
   The whole page is config-driven:

     window.SITE_META     -> { title:{en,zh}, subtitle:{en,zh} }
     window.SITE_SECTIONS -> [ { type, id, ... }, ... ]   (rendered in order)

   ARCHITECTURE
   ------------
   RENDERERS is the SECTION-TYPE REGISTRY: one function per `type` that takes
   a section config + the active lang and returns an HTML string for the inner
   body of that section. To add a new block type, add one entry to RENDERERS
   and (optionally) an icon to NAV_ICONS — nothing else needs to change.

   A single render() call repaints EVERY section + the sticky nav + chrome +
   <title> in the active language, so the zh/en toggle never leaves anything
   stuck. Hero stat counters count up, and [data-item] blocks fade up into view
   via IntersectionObserver.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- data ---------- */
  var META = window.SITE_META || { title: {}, subtitle: {} };
  var SECTIONS = Array.isArray(window.SITE_SECTIONS) ? window.SITE_SECTIONS : [];

  /* ---------- i18n strings (UI chrome only) ---------- */
  var I18N = {
    en: { footer: "Unofficial summary of a YC talk by Tom Blomfield · static, no backend.",
          brand: "Self-Improving Co.", close: "Close", menu: "On this page" },
    zh: { footer: "Tom Blomfield(YC)演講之非官方整理 · 純靜態、無後端。",
          brand: "自我進化的公司", close: "關閉", menu: "本頁導覽" }
  };

  /* ---------- safe localStorage (sandbox / file:// may throw) ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- global state ---------- */
  var state = {
    lang:  lsGet("lang")  || "en",       // default language: zh
    theme: lsGet("theme") || "light"
  };

  /* ---------- dom refs ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var sectionsEl = $("sections");
  var navInner   = $("sectionNavInner");
  var dialog     = $("dialog");
  var dialogBody = $("dialogBody");

  /* ---------- helpers ---------- */
  function t(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[state.lang] || obj.en || obj.zh || "";
  }
  function ui(key) { return (I18N[state.lang] || I18N.en)[key]; }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function r(n) { return Math.round(n * 100) / 100; }

  /* a shared <header class="section-head"> for every section */
  function sectionHead(sec) {
    var sub = t(sec.subtitle)
      ? '<p class="section-head__sub">' + escapeHtml(t(sec.subtitle)) + "</p>"
      : "";
    return '<header class="section-head">' +
      '<h2 id="' + escapeHtml(sec.id) + '-heading">' + escapeHtml(t(sec.title)) + "</h2>" +
      sub + "</header>";
  }

  /* =======================================================================
     SECTION-TYPE REGISTRY
     Each renderer returns the INNER html for a <section>; the wrapper +
     section-head are added by paintSections(). Add new types here.
     ===================================================================== */
  var RENDERERS = {

    /* ---- hero: eyebrow + display title + pull-quote + animated stats ---- */
    hero: function (sec) {
      var eyebrow = t(sec.eyebrow)
        ? '<span class="hero__eyebrow">' + escapeHtml(t(sec.eyebrow)) + "</span>" : "";
      var sub = t(sec.subtitle)
        ? '<p class="hero__sub">' + escapeHtml(t(sec.subtitle)) + "</p>" : "";
      var head =
        '<header class="section-head hero__head" data-item>' +
          eyebrow +
          '<h2 id="' + escapeHtml(sec.id) + '-heading">' + escapeHtml(t(sec.title)) + "</h2>" +
          sub +
        "</header>";

      var lead = "";
      if (t(sec.lead)) {
        lead = '<figure class="hero__lead" data-item>' +
            '<span class="material-symbols-rounded hero__lead-mark" aria-hidden="true">format_quote</span>' +
            "<blockquote>" + escapeHtml(t(sec.lead)) + "</blockquote>" +
            (t(sec.meta) ? '<figcaption>' + escapeHtml(t(sec.meta)) + "</figcaption>" : "") +
          "</figure>";
      } else if (t(sec.meta)) {
        lead = '<p class="hero__meta" data-item>' + escapeHtml(t(sec.meta)) + "</p>";
      }

      var stats = (sec.stats || []).map(function (s) {
        var pre = s.prefix ? '<span class="hero__stat-aff">' + escapeHtml(s.prefix) + "</span>" : "";
        var suf = s.suffix ? '<span class="hero__stat-aff">' + escapeHtml(s.suffix) + "</span>" : "";
        return '<div class="hero__stat" data-item>' +
          '<span class="hero__stat-num">' + pre +
            '<b class="hero__stat-value" data-count="' + escapeHtml(String(s.value)) + '">0</b>' + suf +
          "</span>" +
          '<span class="hero__stat-label">' + escapeHtml(t(s.label)) + "</span>" +
        "</div>";
      }).join("");

      return head + lead +
        (stats ? '<div class="hero__stats">' + stats + "</div>" : "");
    },

    /* ---- cards: responsive grid; click a card -> detail dialog ---- */
    cards: function (sec) {
      var cards = (sec.items || []).map(function (item) {
        var tags = (item.tags || []).map(function (tg) {
          return '<span class="tag">' + escapeHtml(tg) + "</span>";
        }).join("");
        return '<article class="card" tabindex="0" role="button" data-item ' +
            'data-slug="' + escapeHtml(item.slug) + '" ' +
            'aria-label="' + escapeHtml(t(item.title)) + '">' +
          '<h3 class="card__title">' + escapeHtml(t(item.title)) + "</h3>" +
          '<p class="card__summary">' + escapeHtml(t(item.summary)) + "</p>" +
          (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
          '<span class="card__more"><span class="material-symbols-rounded" aria-hidden="true">arrow_outward</span></span>' +
        "</article>";
      }).join("");
      return sectionHead(sec) + '<div class="grid">' + cards + "</div>";
    },

    /* ---- timeline: dated event cards down a rail ---- */
    timeline: function (sec) {
      var items = (sec.events || []).map(function (ev) {
        return '<li class="tl-item" data-item>' +
          '<div class="tl-dot" aria-hidden="true"></div>' +
          '<div class="tl-card">' +
            '<span class="tl-date">' + escapeHtml(t(ev.date)) + "</span>" +
            '<h3 class="tl-title">' + escapeHtml(t(ev.title)) + "</h3>" +
            '<p class="tl-body">' + escapeHtml(t(ev.body)) + "</p>" +
          "</div>" +
        "</li>";
      }).join("");
      return sectionHead(sec) + '<ol class="timeline">' + items + "</ol>";
    },

    /* ---- bars: inline-SVG bar chart (no chart library) ---- */
    bars: function (sec) {
      var series = sec.series || [];
      var W = 520, H = 260, padL = 16, padR = 16, padT = 16, padB = 46;
      var plotW = W - padL - padR, plotH = H - padT - padB;
      var max = Math.max.apply(null, series.map(function (d) { return d.value; }).concat([1]));
      var n = series.length || 1, gap = 16;
      var bw = (plotW - gap * (n - 1)) / n;
      var baseY = padT + plotH;
      var title = escapeHtml(t(sec.title));

      var bars = series.map(function (d, i) {
        var x = padL + i * (bw + gap);
        var h = (d.value / max) * plotH;
        var y = baseY - h;
        var label = escapeHtml(t(d.label));
        var val = escapeHtml(String(d.value));
        return (
          '<rect class="bar-rect" x="' + r(x) + '" y="' + r(y) + '" width="' + r(bw) +
            '" height="' + r(h) + '" rx="5"><title>' + label + ": " + val + "</title></rect>" +
          '<text class="bar-value" x="' + r(x + bw / 2) + '" y="' + r(y - 6) +
            '" text-anchor="middle">' + val + "</text>" +
          '<text class="bar-label" x="' + r(x + bw / 2) + '" y="' + r(baseY + 20) +
            '" text-anchor="middle">' + label + "</text>"
        );
      }).join("");

      var svg =
        '<svg viewBox="0 0 ' + W + " " + H + '" role="img" ' +
          'preserveAspectRatio="xMidYMid meet" aria-label="' + title + '">' +
          "<title>" + title + "</title>" +
          '<line class="axis-line" x1="' + padL + '" y1="' + r(baseY) +
            '" x2="' + r(W - padR) + '" y2="' + r(baseY) + '" />' +
          bars +
        "</svg>";
      return sectionHead(sec) +
        '<figure class="chart-card" data-item><div class="chart-wrap">' + svg + "</div></figure>";
    },

    /* ---- accordion: native <details> Q&A ---- */
    accordion: function (sec) {
      var items = (sec.qa || []).map(function (row) {
        return '<details class="acc-item" data-item>' +
          '<summary class="acc-q">' +
            "<span>" + escapeHtml(t(row.q)) + "</span>" +
            '<span class="material-symbols-rounded acc-chevron" aria-hidden="true">expand_more</span>' +
          "</summary>" +
          '<div class="acc-a">' + escapeHtml(t(row.a)) + "</div>" +
        "</details>";
      }).join("");
      return sectionHead(sec) + '<div class="accordion">' + items + "</div>";
    },

    /* ---- quotes: pull-quote cards ---- */
    quotes: function (sec) {
      var items = (sec.quotes || []).map(function (q) {
        var by = q.by ? '<figcaption class="quote-by">— ' + escapeHtml(q.by) + "</figcaption>" : "";
        return '<figure class="quote-card" data-item>' +
          '<span class="material-symbols-rounded quote-mark" aria-hidden="true">format_quote</span>' +
          "<blockquote>" + escapeHtml(t(q.text)) + "</blockquote>" +
          by +
        "</figure>";
      }).join("");
      return sectionHead(sec) + '<div class="quotes-grid">' + items + "</div>";
    },

    /* ---- prose: ordered rich-text blocks (p / h3 / ul) ---- */
    prose: function (sec) {
      var body = (sec.blocks || []).map(function (b) {
        if (b.type === "h3") return "<h3>" + escapeHtml(t(b.text)) + "</h3>";
        if (b.type === "ul") {
          var arr = (b.items && (b.items[state.lang] || b.items.en || b.items.zh)) || [];
          return "<ul>" + arr.map(function (li) {
            return "<li>" + escapeHtml(li) + "</li>";
          }).join("") + "</ul>";
        }
        return "<p>" + escapeHtml(t(b.text)) + "</p>";
      }).join("");
      return sectionHead(sec) + '<div class="prose" data-item>' + body + "</div>";
    },

    /* ---- sources: external link cards (web-search corroboration) ---- */
    sources: function (sec) {
      var note = t(sec.note)
        ? '<p class="sources__note" data-item>' + escapeHtml(t(sec.note)) + "</p>" : "";
      var items = (sec.links || []).map(function (l) {
        var kind = t(l.kind) ? '<span class="src-kind">' + escapeHtml(t(l.kind)) + "</span>" : "";
        var by   = t(l.by)   ? '<span class="src-by">' + escapeHtml(t(l.by)) + "</span>" : "";
        return '<a class="src-card" data-item href="' + escapeHtml(l.url) + '" ' +
            'target="_blank" rel="noopener">' +
          '<span class="src-card__head">' + kind +
            '<span class="material-symbols-rounded src-card__go" aria-hidden="true">north_east</span>' +
          "</span>" +
          '<span class="src-card__title">' + escapeHtml(t(l.title)) + "</span>" +
          by +
        "</a>";
      }).join("");
      return sectionHead(sec) + note + '<div class="sources-grid">' + items + "</div>";
    },

    /* ---- cta: closing call-to-action ---- */
    cta: function (sec) {
      var link = "";
      if (sec.link && sec.link.url) {
        link = '<a class="cta-btn" href="' + escapeHtml(sec.link.url) + '" ' +
          'target="_blank" rel="noopener">' +
          escapeHtml(t(sec.link.label)) +
          '<span class="cta-btn__icon"><span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></span></a>';
      }
      return '<div class="cta-card" data-item>' +
        "<h2>" + escapeHtml(t(sec.title)) + "</h2>" +
        (t(sec.text) ? "<p>" + escapeHtml(t(sec.text)) + "</p>" : "") +
        link +
      "</div>";
    }
  };

  /* icon shown in the section nav pill, keyed by type (sec.icon overrides) */
  var NAV_ICONS = {
    hero: "auto_awesome", cards: "grid_view", timeline: "timeline",
    bars: "bar_chart", accordion: "quiz", quotes: "format_quote",
    prose: "article", sources: "menu_book", cta: "flag"
  };

  /* =======================================================================
     RENDER: paint nav + every section in the active language
     ===================================================================== */
  function paintSections() {
    sectionsEl.innerHTML = "";
    SECTIONS.forEach(function (sec) {
      var fn = RENDERERS[sec.type];
      if (!fn) return;                       // unknown type: skip gracefully
      var el = document.createElement("section");
      el.className = "section section--" + sec.type;
      el.id = sec.id;
      if (sec.type !== "cta") el.setAttribute("aria-labelledby", sec.id + "-heading");
      el.innerHTML = fn(sec, state.lang);
      sectionsEl.appendChild(el);
    });
    wireCards();
  }

  function paintNav() {
    navInner.innerHTML = "";
    SECTIONS.forEach(function (sec) {
      var a = document.createElement("a");
      a.className = "navpill";
      a.href = "#" + sec.id;
      a.dataset.target = sec.id;
      a.innerHTML =
        '<span class="material-symbols-rounded" aria-hidden="true">' +
          (sec.icon || NAV_ICONS[sec.type] || "label") + "</span>" +
        "<span>" + escapeHtml(t(sec.title)) + "</span>";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(sec.id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + sec.id);
      });
      navInner.appendChild(a);
    });
  }

  function paintChrome() {
    document.documentElement.setAttribute("lang", state.lang);
    var titleStr = t(META.title);
    var subStr = t(META.subtitle);
    document.title = subStr ? titleStr + " · " + subStr : titleStr;
    var brand = $("brandName");
    if (brand) brand.textContent = ui("brand");
    var foot = $("footerText");
    if (foot) foot.textContent = ui("footer");
    var nav = $("sectionNav");
    if (nav) nav.setAttribute("aria-label", ui("menu"));
    var dc = $("dialogClose");
    if (dc) dc.setAttribute("aria-label", ui("close"));
  }

  /* full-page repaint — used on load AND on every language switch */
  function render() {
    paintChrome();
    paintNav();
    paintSections();
    setupScrollSpy();
    animateCounters();
    setupReveal();
  }

  /* =======================================================================
     SCROLL REVEAL — fade [data-item] blocks up as they enter the viewport
     ===================================================================== */
  var revealObserver = null;
  function setupReveal() {
    var els = [].slice.call(document.querySelectorAll("[data-item]"));
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (revealObserver) { revealObserver.disconnect(); }
    els.forEach(function (el) { el.classList.add("reveal"); });
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          revealObserver.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { revealObserver.observe(el); });
  }

  /* =======================================================================
     HERO COUNT-UP — animate when each counter scrolls into view
     ===================================================================== */
  function animateCounters() {
    var els = [].slice.call(document.querySelectorAll(".hero__stat-value[data-count]"));
    if (!els.length) return;

    function run(el) {
      if (el.dataset.done === "1") return;
      el.dataset.done = "1";
      var target = parseFloat(el.dataset.count) || 0;
      var dur = 1100, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);              // easeOutCubic
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* =======================================================================
     SCROLLSPY — highlight the active section's nav pill
     ===================================================================== */
  var spyObserver = null;
  function setupScrollSpy() {
    if (spyObserver) { spyObserver.disconnect(); spyObserver = null; }
    if (!("IntersectionObserver" in window)) return;
    var pills = {};
    [].forEach.call(navInner.children, function (a) { pills[a.dataset.target] = a; });

    spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var pill = pills[en.target.id];
        if (!pill) return;
        if (en.isIntersecting) {
          [].forEach.call(navInner.children, function (p) {
            p.classList.remove("navpill--active");
            p.removeAttribute("aria-current");
          });
          pill.classList.add("navpill--active");
          pill.setAttribute("aria-current", "true");
          // keep the active pill in view within the horizontal nav
          if (pill.scrollIntoView) {
            pill.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    SECTIONS.forEach(function (sec) {
      var el = document.getElementById(sec.id);
      if (el) spyObserver.observe(el);
    });
  }

  /* =======================================================================
     DIALOG — card detail with #slug deep links + Esc
     ===================================================================== */
  function findCard(slug) {
    for (var i = 0; i < SECTIONS.length; i++) {
      var sec = SECTIONS[i];
      if (sec.type !== "cards" || !sec.items) continue;
      for (var j = 0; j < sec.items.length; j++) {
        if (sec.items[j].slug === slug) return sec.items[j];
      }
    }
    return null;
  }

  function openDialog(slug) {
    var item = findCard(slug);
    if (!item) return;
    var tags = (item.tags || []).map(function (tg) {
      return '<span class="tag">' + escapeHtml(tg) + "</span>";
    }).join("");
    dialogBody.innerHTML =
      '<h2 id="dialogTitle">' + escapeHtml(t(item.title)) + "</h2>" +
      (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
      "<p>" + escapeHtml(t(item.overview) || t(item.summary)) + "</p>";
    if (!dialog.open) dialog.showModal();
    if (location.hash.slice(1) !== slug) history.replaceState(null, "", "#" + slug);
  }
  function closeDialog() {
    if (dialog.open) dialog.close();
    if (isSlugHash()) history.replaceState(null, "", location.pathname + location.search);
  }
  function isSlugHash() {
    var h = location.hash.slice(1);
    return !!h && !!findCard(h);
  }

  function wireCards() {
    [].forEach.call(document.querySelectorAll(".card[data-slug]"), function (card) {
      var slug = card.dataset.slug;
      card.addEventListener("click", function () { openDialog(slug); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDialog(slug); }
      });
    });
  }

  /* =======================================================================
     THEME + LANG
     ===================================================================== */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var icon = $("themeIcon");
    if (icon) icon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
    lsSet("theme", state.theme);
  }
  function applyLangChrome() {
    var label = $("langLabel");
    if (label) label.textContent = state.lang === "en" ? "EN" : "中";
    lsSet("lang", state.lang);
  }

  /* =======================================================================
     GITHUB STARS — optional social proof; degrades silently
     ===================================================================== */
  function loadStars() {
    var el = $("ghStarCount");
    if (!el) return;
    // Only call the GitHub API on the deployed https site — this keeps local
    // file:// / http verification free of "failed resource" console noise.
    if (location.protocol !== "https:") return;
    var link = el.parentNode;
    var repo = link && link.dataset ? link.dataset.repo : null;
    if (!repo || typeof fetch !== "function") return;
    try {
      fetch("https://api.github.com/repos/" + repo)
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (j) {
          if (j && typeof j.stargazers_count === "number") {
            el.textContent = j.stargazers_count >= 1000
              ? (j.stargazers_count / 1000).toFixed(1) + "k"
              : String(j.stargazers_count);
          }
        })
        .catch(function () { /* offline / rate-limited: keep placeholder */ });
    } catch (e) { /* ignore */ }
  }

  /* =======================================================================
     WIRING
     ===================================================================== */
  function wire() {
    $("themeToggle").addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
    });

    $("langToggle").addEventListener("click", function () {
      state.lang = state.lang === "en" ? "zh" : "en";
      applyLangChrome();
      var openSlug = isSlugHash() ? location.hash.slice(1) : null;
      render();                       // repaint EVERYTHING in the new language
      if (dialog.open && openSlug) openDialog(openSlug);  // repaint open dialog too
    });

    $("dialogClose").addEventListener("click", closeDialog);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
    dialog.addEventListener("close", function () {
      if (isSlugHash()) history.replaceState(null, "", location.pathname + location.search);
    });
    // Esc is handled natively by <dialog>

    window.addEventListener("hashchange", syncFromHash);
  }

  /* deep link: open dialog matching #slug on load / hashchange */
  function syncFromHash() {
    var slug = location.hash.slice(1);
    if (slug && findCard(slug)) openDialog(slug);
    else if (!slug && dialog.open) dialog.close();
  }

  /* =======================================================================
     INIT
     ===================================================================== */
  function init() {
    applyTheme();
    applyLangChrome();
    render();
    wire();
    loadStars();
    syncFromHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
