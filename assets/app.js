/* =========================================================================
   Self-Improving Company · composite · app.js  (vanilla, no build, no libs)

   A single long page assembled from an ordered list of typed section-blocks.
   The whole page is config-driven:

     window.SITE_META     -> { title:{en,zh}, subtitle:{en,zh} }
     window.SITE_SECTIONS -> [ { type, id, nav, ... }, ... ]   (rendered in order)

   ARCHITECTURE
   ------------
   RENDERERS is the SECTION-TYPE REGISTRY: one function per `type` that takes
   a section config + the active lang and returns an HTML string for the inner
   body of that section. To add a new block type, add one entry to RENDERERS —
   nothing else needs to change.

   The language comes from the URL (`/` = Chinese, `/en/` = English) via the
   page's <html lang>; a single render() call paints EVERY section + the sticky
   nav + chrome + <title> in it. The same markup is also baked into each HTML
   file's <main>, so readers without JS (and crawlers) get the full page.

   Nothing here hides content: there is no scroll-reveal. The only motion is
   the five-layer loop's return arrow, drawn by CSS as it scrolls into view.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- data ---------- */
  var META = window.SITE_META || { title: {}, subtitle: {} };
  var SECTIONS = Array.isArray(window.SITE_SECTIONS) ? window.SITE_SECTIONS : [];

  /* ---------- i18n strings (UI chrome only) ---------- */
  var I18N = {
    en: { footer: "Unofficial summary of a YC talk by Tom Blomfield · static, no backend.",
          brand: "Self-Improving Co.", menu: "On this page",
          figures: "The talk in numbers", tags: "Keywords" },
    zh: { footer: "Tom Blomfield（YC）演講之非官方整理 · 純靜態、無後端。",
          brand: "自我進化的公司", menu: "本頁導覽",
          figures: "演講裡的數字", tags: "關鍵字" }
  };

  /* ---------- safe storage (sandbox / file:// may throw) ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- language is owned by the URL ---------- */
  /* `/` is Chinese, `/en/` is English, and <html lang> on each page says which.
     localStorage must never pick the language: a crawler has none and would
     always land on the fallback, and a returning reader would see a different
     page than the URL promises. */
  var LANG_DIR  = "/en";                        // secondary-language directory
  var HTML_LANG = { zh: "zh-Hant", en: "en" };  // <html lang> / hreflang codes

  function langFromDocument() {
    var declared = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
    return declared.indexOf("zh") === 0 ? "zh" : "en";
  }

  /* this same page in the other language — the toggle link's destination */
  function altPath() {
    var p = location.pathname;
    if (p === LANG_DIR || p.indexOf(LANG_DIR + "/") === 0) {
      return p.slice(LANG_DIR.length) || "/";
    }
    return LANG_DIR + (p.charAt(0) === "/" ? p : "/" + p);
  }

  /* ---------- theme: saved choice, else the OS preference ---------- */
  /* The inline script in <head> already set data-theme before first paint;
     this mirrors the same rule so the toggle starts from the right state. */
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function savedTheme() {
    var v = lsGet("theme");
    return v === "dark" || v === "light" ? v : null;
  }
  function systemTheme() { return darkQuery && darkQuery.matches ? "dark" : "light"; }

  /* ---------- global state ---------- */
  var state = {
    lang:  langFromDocument(),
    theme: savedTheme() || systemTheme()
  };

  /* ---------- dom refs ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var sectionsEl = $("sections");
  var navEl      = $("sectionNav");
  var navInner   = $("sectionNavInner");

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
  function fmtNum(v) {
    var n = Number(v);
    return isNaN(n) ? String(v) : n.toLocaleString("en-US");
  }
  function idAttr(slug) { return slug ? ' id="' + escapeHtml(slug) + '"' : ""; }
  function tagLine(tags) {
    if (!tags || !tags.length) return "";
    return '<p class="tagline"><span class="sr-only">' + escapeHtml(ui("tags")) + ": </span>" +
      tags.map(escapeHtml).join(" / ") + "</p>";
  }

  /* a shared <header class="section-head"> for every section */
  function sectionHead(sec) {
    var sub = t(sec.subtitle)
      ? '<p class="section-head__sub">' + escapeHtml(t(sec.subtitle)) + "</p>"
      : "";
    return '<header class="section-head">' +
      '<h2 id="' + escapeHtml(sec.id) + '-heading">' + escapeHtml(t(sec.title)) + "</h2>" +
      sub + "</header>";
  }

  /* small circular-arrow glyph: the page's one recurring mark (a loop) */
  var LOOP_GLYPH =
    '<svg class="loop-glyph" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<path d="M26 16a10 10 0 1 1-3.2-7.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M23.6 3.6l-.6 5.6-5.6-.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  /* =======================================================================
     SECTION-TYPE REGISTRY
     Each renderer returns the INNER html for a <section>; the wrapper is
     added by paintSections(). Add new types here.
     ===================================================================== */
  var RENDERERS = {

    /* ---- hero: eyebrow + display title + pull-quote + one pull figure ---- */
    hero: function (sec) {
      var eyebrow = t(sec.eyebrow)
        ? '<p class="hero__eyebrow">' + escapeHtml(t(sec.eyebrow)) + "</p>" : "";
      var sub = t(sec.subtitle)
        ? '<p class="hero__sub">' + escapeHtml(t(sec.subtitle)) + "</p>" : "";
      var head =
        '<header class="hero__head">' +
          eyebrow +
          '<h1 id="' + escapeHtml(sec.id) + '-heading">' + escapeHtml(t(sec.title)) + "</h1>" +
          sub +
        "</header>";

      var lead = "";
      if (t(sec.lead)) {
        lead = '<figure class="hero__lead">' +
            "<blockquote>" + escapeHtml(t(sec.lead)) + "</blockquote>" +
            (t(sec.meta) ? "<figcaption>" + escapeHtml(t(sec.meta)) + "</figcaption>" : "") +
          "</figure>";
      } else if (t(sec.meta)) {
        lead = '<p class="hero__meta">' + escapeHtml(t(sec.meta)) + "</p>";
      }

      /* the first stat is the headline figure; the rest sit in a small ledger */
      var stats = sec.stats || [];
      var figures = "";
      if (stats.length) {
        var top = stats[0];
        var pull =
          '<p class="pull">' +
            '<span class="pull__num">' + escapeHtml(top.prefix || "") + escapeHtml(fmtNum(top.value)) +
              (top.suffix ? '<span class="pull__aff">' + escapeHtml(top.suffix) + "</span>" : "") +
            "</span>" +
            '<span class="pull__label">' + escapeHtml(t(top.label)) + "</span>" +
          "</p>";
        var ledger = stats.slice(1).map(function (s) {
          return '<div class="ledger__row">' +
            "<dt>" + escapeHtml(s.prefix || "") + escapeHtml(fmtNum(s.value)) + escapeHtml(s.suffix || "") + "</dt>" +
            "<dd>" + escapeHtml(t(s.label)) + "</dd>" +
          "</div>";
        }).join("");
        figures = '<aside class="hero__figures" aria-label="' + escapeHtml(ui("figures")) + '">' +
          pull + (ledger ? '<dl class="ledger">' + ledger + "</dl>" : "") +
        "</aside>";
      }

      return head + '<div class="hero__body">' + lead + figures + "</div>";
    },

    /* ---- layers: a stacked architecture with a return arrow 5 -> 1 ---- */
    layers: function (sec) {
      var items = (sec.items || []).map(function (item, i) {
        var parts = t(item.title).split(" · ");
        var name = parts.length > 1 ? parts.slice(1).join(" · ") : parts[0];
        var kicker = parts.length > 1 && !/^\d+$/.test(parts[0].trim()) ? parts[0] : "";
        return '<li class="layer"' + idAttr(item.slug) + ' style="--i:' + i + '">' +
          '<span class="layer__n" aria-hidden="true">' + (i + 1) + "</span>" +
          '<div class="layer__head">' +
            (kicker ? '<span class="layer__kicker">' + escapeHtml(kicker) + "</span>" : "") +
            '<h3 class="layer__title">' + escapeHtml(name) + "</h3>" +
            '<p class="layer__sum">' + escapeHtml(t(item.summary)) + "</p>" +
          "</div>" +
          '<div class="layer__body"><p>' + escapeHtml(t(item.overview)) + "</p>" +
            tagLine(item.tags) + "</div>" +
        "</li>";
      }).join("");
      var back = t(sec.loopLabel)
        ? '<div class="layers__return" aria-hidden="true"><span class="layers__return-label">' +
            escapeHtml(t(sec.loopLabel)) + "</span></div>"
        : "";
      return sectionHead(sec) +
        '<div class="layers-wrap"><ol class="layers">' + items + "</ol>" + back + "</div>";
    },

    /* ---- columns: a few parallel ideas, side by side, no boxes ---- */
    columns: function (sec) {
      var items = (sec.items || []).map(function (item) {
        return '<article class="column"' + idAttr(item.slug) + ">" +
          LOOP_GLYPH +
          '<h3 class="column__title">' + escapeHtml(t(item.title)) + "</h3>" +
          '<p class="column__sum">' + escapeHtml(t(item.summary)) + "</p>" +
          '<p class="column__body">' + escapeHtml(t(item.overview)) + "</p>" +
          tagLine(item.tags) +
        "</article>";
      }).join("");
      return sectionHead(sec) + '<div class="columns">' + items + "</div>";
    },

    /* ---- entries: heading on the left, a definition list on the right ---- */
    entries: function (sec) {
      var items = (sec.items || []).map(function (item) {
        return '<article class="entry"' + idAttr(item.slug) + ">" +
          '<h3 class="entry__title">' + escapeHtml(t(item.title)) + "</h3>" +
          '<p class="entry__sum">' + escapeHtml(t(item.summary)) + "</p>" +
          '<p class="entry__body">' + escapeHtml(t(item.overview)) + "</p>" +
          tagLine(item.tags) +
        "</article>";
      }).join("");
      return '<div class="split">' + sectionHead(sec) +
        '<div class="entries">' + items + "</div></div>";
    },

    /* ---- spread: two statements facing each other ---- */
    spread: function (sec) {
      var items = (sec.qa || []).map(function (row) {
        return '<article class="spread__item">' +
          '<h3 class="spread__q">' + escapeHtml(t(row.q)) + "</h3>" +
          '<p class="spread__a">' + escapeHtml(t(row.a)) + "</p>" +
        "</article>";
      }).join("");
      return sectionHead(sec) + '<div class="spread">' + items + "</div>";
    },

    /* ---- timeline: dated steps down a rail ---- */
    timeline: function (sec) {
      var items = (sec.events || []).map(function (ev) {
        return '<li class="tl-item">' +
          '<span class="tl-date">' + escapeHtml(t(ev.date)) + "</span>" +
          '<div class="tl-main">' +
            '<h3 class="tl-title">' + escapeHtml(t(ev.title)) + "</h3>" +
            '<p class="tl-body">' + escapeHtml(t(ev.body)) + "</p>" +
          "</div>" +
        "</li>";
      }).join("");
      return sectionHead(sec) + '<ol class="timeline">' + items + "</ol>";
    },

    /* ---- chapters: a table of contents; each timestamp opens the video there ---- */
    chapters: function (sec) {
      var items = (sec.events || []).map(function (ev) {
        var stamp = t(ev.date);
        var inner =
          '<span class="toc__time">' + escapeHtml(stamp) + "</span>" +
          '<span class="toc__text"><span class="toc__title">' + escapeHtml(t(ev.title)) + "</span>" +
          '<span class="toc__body">' + escapeHtml(t(ev.body)) + "</span></span>";
        var m = /^(\d+):(\d{2})$/.exec(stamp);
        if (sec.video && m) {
          var secs = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
          var href = sec.video + (sec.video.indexOf("?") > -1 ? "&" : "?") + "t=" + secs + "s";
          inner = '<a class="toc__link" href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' + inner + "</a>";
        } else {
          inner = '<div class="toc__link">' + inner + "</div>";
        }
        return '<li class="toc__item">' + inner + "</li>";
      }).join("");
      return sectionHead(sec) + '<ol class="toc">' + items + "</ol>";
    },

    /* ---- bars: inline-SVG bar chart (no chart library; unused here) ---- */
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
        '<figure class="chart-card"><div class="chart-wrap">' + svg + "</div></figure>";
    },

    /* ---- accordion: native <details> Q&A ---- */
    accordion: function (sec) {
      var items = (sec.qa || []).map(function (row) {
        return '<details class="acc-item">' +
          '<summary class="acc-q">' +
            "<span>" + escapeHtml(t(row.q)) + "</span>" +
            '<span class="material-symbols-rounded acc-chevron" aria-hidden="true">expand_more</span>' +
          "</summary>" +
          '<div class="acc-a">' + escapeHtml(t(row.a)) + "</div>" +
        "</details>";
      }).join("");
      return sectionHead(sec) + '<div class="accordion">' + items + "</div>";
    },

    /* ---- quotes: one large quote, the rest beside it ---- */
    quotes: function (sec) {
      var items = (sec.quotes || []).map(function (q) {
        var by = q.by ? '<figcaption class="quote-by">' + escapeHtml(q.by) + "</figcaption>" : "";
        return '<figure class="quote">' +
          "<blockquote>" + escapeHtml(t(q.text)) + "</blockquote>" +
          by +
        "</figure>";
      }).join("");
      return sectionHead(sec) + '<div class="quotes">' + items + "</div>";
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
      return sectionHead(sec) + '<div class="prose">' + body + "</div>";
    },

    /* ---- sources: a plain bibliography ---- */
    sources: function (sec) {
      var note = t(sec.note)
        ? '<p class="sources__note">' + escapeHtml(t(sec.note)) + "</p>" : "";
      var items = (sec.links || []).map(function (l) {
        var kind = t(l.kind) ? '<span class="bib__kind">' + escapeHtml(t(l.kind)) + "</span>" : "<span></span>";
        var by   = t(l.by)   ? '<span class="bib__by">' + escapeHtml(t(l.by)) + "</span>" : "";
        return '<li class="bib__item"><a class="bib__link" href="' + escapeHtml(l.url) + '" ' +
            'target="_blank" rel="noopener">' +
          kind +
          '<span class="bib__text"><span class="bib__title">' + escapeHtml(t(l.title)) + "</span>" + by + "</span>" +
          '<span class="material-symbols-rounded bib__go" aria-hidden="true">north_east</span>' +
        "</a></li>";
      }).join("");
      return sectionHead(sec) + note + '<ol class="bib">' + items + "</ol>";
    },

    /* ---- cta: closing call-to-action ---- */
    cta: function (sec) {
      var link = "";
      if (sec.link && sec.link.url) {
        link = '<a class="cta-btn" href="' + escapeHtml(sec.link.url) + '" ' +
          'target="_blank" rel="noopener">' +
          escapeHtml(t(sec.link.label)) +
          '<span class="cta-btn__icon"><span class="material-symbols-rounded" aria-hidden="true">play_arrow</span></span></a>';
      }
      return '<div class="cta-card">' +
        LOOP_GLYPH +
        "<h2>" + escapeHtml(t(sec.title)) + "</h2>" +
        (t(sec.text) ? "<p>" + escapeHtml(t(sec.text)) + "</p>" : "") +
        link +
      "</div>";
    }
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
  }

  function paintNav() {
    navInner.innerHTML = "";
    SECTIONS.forEach(function (sec) {
      if (!RENDERERS[sec.type]) return;
      var a = document.createElement("a");
      a.className = "navlink";
      a.href = "#" + sec.id;
      a.dataset.target = sec.id;
      a.textContent = t(sec.nav) || t(sec.title);
      navInner.appendChild(a);
    });
  }

  function paintChrome() {
    document.documentElement.setAttribute("lang", HTML_LANG[state.lang]);
    var titleStr = t(META.title);
    var subStr = t(META.subtitle);
    document.title = subStr ? titleStr + " · " + subStr : titleStr;
    var brand = $("brandName");
    if (brand) brand.textContent = ui("brand");
    var foot = $("footerText");
    if (foot) foot.textContent = ui("footer");
    if (navEl) navEl.setAttribute("aria-label", ui("menu"));
  }

  function render() {
    paintChrome();
    paintNav();
    paintSections();
    setupScrollSpy();
    updateNavFade();
  }

  /* =======================================================================
     SECTION NAV — edge fades show there is more to scroll; scrollspy
     ===================================================================== */
  function updateNavFade() {
    if (!navEl || !navInner) return;
    var max = navInner.scrollWidth - navInner.clientWidth;
    navEl.classList.toggle("is-fade-start", navInner.scrollLeft > 2);
    navEl.classList.toggle("is-fade-end", max > 2 && navInner.scrollLeft < max - 2);
  }

  /* keep the active link visible inside the horizontal nav. Scrolls only the
     nav itself — element.scrollIntoView() would also nudge the page and
     interrupt the reader's own smooth scroll. */
  function revealNavLink(a) {
    var left = a.offsetLeft, right = left + a.offsetWidth;
    var viewL = navInner.scrollLeft, viewR = viewL + navInner.clientWidth;
    if (left >= viewL + 24 && right <= viewR - 24) return;
    var target = left - (navInner.clientWidth - a.offsetWidth) / 2;
    if (navInner.scrollTo) navInner.scrollTo({ left: target, behavior: "smooth" });
    else navInner.scrollLeft = target;
  }

  var spyObserver = null;
  function setupScrollSpy() {
    if (spyObserver) { spyObserver.disconnect(); spyObserver = null; }
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    [].forEach.call(navInner.children, function (a) { links[a.dataset.target] = a; });

    spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = links[en.target.id];
        if (!link || !en.isIntersecting) return;
        [].forEach.call(navInner.children, function (p) {
          p.classList.remove("is-active");
          p.removeAttribute("aria-current");
        });
        link.classList.add("is-active");
        link.setAttribute("aria-current", "true");
        revealNavLink(link);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    SECTIONS.forEach(function (sec) {
      var el = document.getElementById(sec.id);
      if (el) spyObserver.observe(el);
    });
  }

  /* =======================================================================
     THEME + LANG
     ===================================================================== */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var icon = $("themeIcon");
    if (icon) icon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#15110C" : "#F6F1E8");
  }
  function applyLangChrome() {
    var other = state.lang === "en" ? "zh" : "en";
    var toggle = $("langToggle");
    if (toggle) {
      toggle.setAttribute("href", altPath());
      toggle.setAttribute("hreflang", HTML_LANG[other]);
      toggle.setAttribute("lang", HTML_LANG[other]);
    }
    var label = $("langLabel");
    if (label) label.textContent = other === "en" ? "EN" : "中";  // where the link goes
    lsSet("lang", state.lang);
  }

  /* =======================================================================
     GITHUB STARS — optional social proof; never shows a wrong number
     The count is cached for the session (one API call per visit). If the
     request fails, is rate-limited (403) or the repo has 0 stars, the badge
     keeps its plain "GitHub" label instead of showing a misleading number.
     ===================================================================== */
  function showStars(el, n) {
    if (!(n > 0)) return;
    el.textContent = n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
  }
  function loadStars() {
    var el = $("ghStarCount");
    if (!el) return;
    var link = el.parentNode;
    var repo = link && link.dataset ? link.dataset.repo : null;
    if (!repo) return;
    var key = "gh-stars:" + repo;
    var cached = ssGet(key);
    if (cached !== null) { showStars(el, parseInt(cached, 10)); return; }
    // Only call the API on the deployed https site — keeps local checks quiet.
    if (location.protocol !== "https:" || typeof fetch !== "function") return;
    fetch("https://api.github.com/repos/" + repo, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (j) {
        var n = j && typeof j.stargazers_count === "number" ? j.stargazers_count : 0;
        ssSet(key, String(n));
        showStars(el, n);
      })
      .catch(function () { /* offline / blocked: keep the "GitHub" label */ });
  }

  /* =======================================================================
     WIRING
     ===================================================================== */
  function wire() {
    $("themeToggle").addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      lsSet("theme", state.theme);           // an explicit choice is remembered
      applyTheme();
    });
    if (darkQuery) {
      var follow = function () {
        if (savedTheme()) return;            // a saved choice wins over the OS
        state.theme = systemTheme();
        applyTheme();
      };
      if (darkQuery.addEventListener) darkQuery.addEventListener("change", follow);
      else if (darkQuery.addListener) darkQuery.addListener(follow);
    }

    /* #langToggle is a plain link — clicking it navigates to the other
       language's URL, so there is nothing to repaint in place. */

    navInner.addEventListener("scroll", updateNavFade, { passive: true });
    window.addEventListener("resize", updateNavFade);
  }

  /* deep links (#section or an item's #slug): the static HTML already put the
     reader there; re-align once after the client render in case fonts or
     layout shifted. */
  function syncFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: "start" });
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
