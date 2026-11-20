(function () {
  /* ---------- helpers ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pad(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }

  /* ---------- gallery (from works.js) ---------- */
  var works = window.WORKS || [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  works.forEach(function (w, i) {
    var host = document.querySelector(w.series ? '.collage[data-series="' + w.series + '"]' : '.collage[data-section="' + w.section + '"]');
    if (!host) return;
    var title = w.title || 'Untitled';
    var cap = 'No. ' + pad(i + 2) + ' \u2014 ' + title; // No. 001 is the hero
    var meta = [w.year, w.medium].filter(Boolean).join(', ');
    var base = w.file.replace(/\.jpg$/, '');
    var f = el('figure', 'work ' + (w.cut ? 'cutout art' : 'photo'));
    if (w.w && w.h) f.style.setProperty('--ar', w.w + ' / ' + w.h);
    if (w.cut) f.style.setProperty('--span', w.span || 4);
    f.dataset.full = w.cut ? 'images/works/cut/' + base + '.png' : 'images/works/' + w.file;
    f.dataset.cap = cap + (meta ? ' (' + meta + ')' : '');
    var img = el('img');
    img.src = w.cut ? 'images/works/cut/thumb/' + base + '.png' : 'images/works/thumb/' + w.file;
    if (w.w && w.h) { img.width = w.w; img.height = w.h; }
    img.loading = 'lazy';
    img.alt = title + (w.section === 'photography' ? ' (photograph)' : ' (' + w.section + ')');
    var box = el('div', 'frame plate');
    box.appendChild(img);
    f.appendChild(box);
    f.appendChild(el('figcaption', 'tag', cap));
    host.appendChild(f);
  });

  /* ---------- lightbox ---------- */
  var figs = document.querySelectorAll('figure.work');
  var gallery = Array.prototype.filter.call(figs, function (f) { return !f.classList.contains('hero-img'); });
  var lb = document.getElementById('lightbox');
  var lbImg = lb && lb.querySelector('img');
  var lbCap = lb && lb.querySelector('.lb-cap');
  var lbCount = lb && lb.querySelector('.lb-count');
  var last = null, cur = -1, lbTimer = 0;

  function show(i) {
    cur = (i + gallery.length) % gallery.length;
    var f = gallery[cur];
    lbCap.textContent = f.dataset.cap || '';
    lbCount.textContent = (cur + 1) + ' / ' + gallery.length;
    lbImg.classList.remove('ready');
    var token = ++show.t;
    function put() {
      if (token !== show.t) return;
      if (f.classList.contains('missing')) {
        lbImg.removeAttribute('src');
        lbImg.alt = 'Image not available yet';
        lbImg.className = 'lb-missing ready';
        return;
      }
      lbImg.className = '';
      lbImg.alt = f.querySelector('img').alt;
      var done = function () { if (token === show.t) requestAnimationFrame(function () { lbImg.classList.add('ready'); }); };
      lbImg.onload = done; lbImg.onerror = done;
      lbImg.src = f.dataset.full;
      if (lbImg.complete && lbImg.naturalWidth) done();
    }
    setTimeout(put, lb.classList.contains('show') ? 120 : 0);
    // preload neighbours
    [1, -1].forEach(function (d) {
      var n = gallery[(cur + d + gallery.length) % gallery.length];
      if (n && n.dataset.full) { var p = new Image(); p.src = n.dataset.full; }
    });
  }
  show.t = 0;

  function open(f) {
    if (!lb) return;
    last = f;
    clearTimeout(lbTimer);
    var i = gallery.indexOf(f);
    if (i < 0) { // sequence cards open their gallery twin
      gallery.forEach(function (g, k) { if (i < 0 && g.dataset.full === f.dataset.full) i = k; });
    }
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    void lb.offsetWidth;
    lb.classList.add('show');
    show(Math.max(i, 0));
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.classList.remove('show');
    document.body.style.overflow = '';
    lbTimer = setTimeout(function () { lb.hidden = true; }, 260);
    if (last) last.focus({ preventScroll: true });
  }
  function step(d) { show(cur + d); }

  figs.forEach(function (f) {
    var img = f.querySelector('img');
    function miss() { f.classList.add('missing'); }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) miss();
    img.addEventListener('error', miss);
    f.tabIndex = 0;
    f.setAttribute('role', 'button');
    f.setAttribute('aria-label', 'Open ' + (f.dataset.cap || img.alt));
    f.addEventListener('click', function () { open(f); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(f); }
    });
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-close') || e.target.tagName === 'FIGURE') close();
      else if (e.target.classList.contains('lb-prev')) step(-1);
      else if (e.target.classList.contains('lb-next')) step(1);
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden || !lb.classList.contains('show')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') {
        var f = Array.prototype.slice.call(lb.querySelectorAll('button'));
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    var sx = null, sy = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx == null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------- photocopier effect: halftone resolve under a scanner bar, riso misprint on hover ---------- */
  var works2 = Array.prototype.slice.call(document.querySelectorAll('figure.work'));
  var heroFig = document.querySelector('figure.work.hero-img');
  if (heroFig) { var hf = heroFig.querySelector('.frame'); if (hf) hf.classList.add('plate', 'art-plate'); heroFig.classList.add('art'); }
  works2.forEach(function (f) { f.classList.add(f.classList.contains('photo') ? 'is-photo' : 'is-art'); });

  function addLayers(f) {
    if (f._lay) return; f._lay = true;
    var p = f.querySelector('.plate'), src = f.querySelector('.plate > img');
    if (!p || !src) return;
    ['r', 'b', 'g'].forEach(function (c) {
      var i = el('img', 'lay ' + c); i.alt = ''; i.setAttribute('aria-hidden', 'true'); i.src = src.currentSrc || src.src;
      p.insertBefore(i, src.nextSibling);
    });
  }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function halftone(cv, img, cell, photo) {
    var W = cv.width, H = cv.height, ctx = cv.getContext('2d');
    var cw = Math.ceil(W / cell), ch = Math.ceil(H / cell);
    var o = document.createElement('canvas'); o.width = cw; o.height = ch;
    var oc = o.getContext('2d'); oc.drawImage(img, 0, 0, cw, ch);
    var d = oc.getImageData(0, 0, cw, ch).data; // throws on file:// (tainted)
    ctx.clearRect(0, 0, W, H);
    if (photo) { ctx.fillStyle = '#141414'; ctx.fillRect(0, 0, W, H); }
    for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
      var k = (y * cw + x) * 4, a = d[k + 3] / 255, lum = (.3 * d[k] + .59 * d[k + 1] + .11 * d[k + 2]) / 255, v;
      if (photo) v = Math.max(.1, lum); else v = a;
      if (v < .05) continue;
      var r = cell * .74 * Math.sqrt(Math.min(1, v * 1.15));
      ctx.fillStyle = 'rgb(' + d[k] + ',' + d[k + 1] + ',' + d[k + 2] + ')';
      ctx.beginPath(); ctx.arc((x + .5 + ((y & 1) ? .25 : -.25)) * cell, (y + .5) * cell, r, 0, 6.2832); ctx.fill();
    }
  }
  function reveal(f) {
    if (f._done || f._run) return; f._run = true;
    var p = f.querySelector('.plate'), img = f.querySelector('.plate > img');
    if (!p || !img || f.classList.contains('missing')) { f._done = true; return; }
    var photo = f.classList.contains('is-photo');
    function finish() { img.style.clipPath = ''; img.style.opacity = ''; f.classList.remove('pre', 'scanning'); var c = p.querySelector('canvas'); if (c) c.remove(); f._done = true; f._run = false; }
    function go() {
      var cv = el('canvas'), sc = el('i', 'scan'), s = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(p.clientWidth * s); cv.height = Math.round(p.clientHeight * s);
      var ok = true;
      try { halftone(cv, img, 14 * s, photo); } catch (e) { ok = false; }
      if (!ok) { // no canvas access (file://): plain fade
        f.classList.remove('pre'); img.classList.add('fade-in'); f._done = true; return;
      }
      img.style.clipPath = 'inset(0 0 100% 0)'; img.style.opacity = 1; p.appendChild(cv); p.appendChild(sc); f.classList.add('scanning');
      var cells = [[0, 14], [240, 8]], si = 0, t0 = performance.now(), delay = 250, dur = 1100;
      (function tick(now) {
        var t = now - t0;
        while (si < cells.length - 1 && t >= cells[si + 1][0]) { si++; try { halftone(cv, img, cells[si][1] * s, photo); } catch (e) {} }
        var q = ease(Math.max(0, Math.min(1, (t - delay) / dur)));
        sc.style.top = (q * 100) + '%';
        img.style.clipPath = 'inset(0 0 ' + ((1 - q) * 100) + '% 0)';
        cv.style.clipPath = 'inset(' + (q * 100) + '% 0 0 0)';
        if (t - delay < dur) requestAnimationFrame(tick); else { sc.remove(); finish(); }
      })(performance.now());
    }
    if (img.complete && img.naturalWidth) go(); else { img.addEventListener('load', go, { once: true }); img.addEventListener('error', function () { f._done = true; f.classList.remove('pre'); }, { once: true }); }
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var f = en.target; setTimeout(function () { reveal(f); }, f._d || 0);
      });
    }, { threshold: .2 });
    works2.forEach(function (f, i) { f._d = (i % 3) * 140; f.classList.add('pre'); cio.observe(f); });
  }
  // misprint on hover (mouse) or keyboard focus
  if (!reduce) works2.forEach(function (f) {
    f.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { addLayers(f); void f.offsetWidth; f.classList.add('mis'); } });
    f.addEventListener('pointerleave', function () { f.classList.remove('mis'); });
    f.addEventListener('focus', function () { if (f.matches(':focus-visible')) { addLayers(f); void f.offsetWidth; f.classList.add('mis'); } });
    f.addEventListener('blur', function () { f.classList.remove('mis'); });
  });

  /* ---------- journal (from journal.js) ---------- */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(d) {
    var m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(d || '');
    if (!m) return 'date TBC';
    return (m[3] ? parseInt(m[3], 10) + ' ' : '') + (m[2] ? MONTHS[parseInt(m[2], 10) - 1] + ' ' : '') + m[1];
  }
  var entries = (window.JOURNAL || []).slice().sort(function (a, b) {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; // newest first
  });

  function photoEl(file, alt) {
    var wrap = el('span', 'jphoto');
    var img = el('img');
    img.src = 'images/' + file;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.addEventListener('error', function () { wrap.classList.add('missing'); });
    wrap.appendChild(img);
    return wrap;
  }

  // home page: 3 latest clippings
  var latest = document.getElementById('journal-latest');
  if (latest) {
    var count = parseInt(latest.dataset.count, 10) || 3;
    entries.slice(0, count).forEach(function (e, i) {
      var li = el('li', 'jclip');
      li.appendChild(el('span', 'datestamp', fmtDate(e.date)));
      if (e.photos && e.photos[0]) li.appendChild(photoEl(e.photos[0], e.title));
      li.appendChild(el('h3', null, e.title));
      li.appendChild(el('p', 'excerpt', e.excerpt));
      var a = el('a', null, 'read the entry →');
      a.href = 'run-club.html#' + e.slug;
      li.appendChild(a);
      latest.appendChild(li);
    });
  }

  // run-club.html: full logbook
  var log = document.getElementById('logbook');
  if (log) {
    entries.forEach(function (e, i) {
      var art = el('article', 'entry');
      art.id = e.slug;
      var d = el('details');
      var sum = el('summary');
      sum.appendChild(el('span', 'datestamp', fmtDate(e.date)));
      sum.appendChild(el('h2', null, e.title));
      sum.appendChild(el('span', 'more-hint', 'open / close'));
      d.appendChild(sum);
      var body = el('div', 'entry-body');
      body.innerHTML = e.body || '';
      if (e.photos && e.photos.length) {
        var ph = el('div', 'jphotos');
        e.photos.forEach(function (p) { ph.appendChild(photoEl(p, e.title)); });
        body.appendChild(ph);
      }
      if (e.link && e.link.href) {
        var a = el('a', 'ext', (e.link.label || 'Read more') + ' →');
        a.href = e.link.href; a.target = '_blank'; a.rel = 'noopener';
        body.appendChild(a);
      }
      if (e.tags && e.tags.length) {
        var t = el('p', 'tags mono small', e.tags.map(function (x) { return '#' + x; }).join('  '));
        body.appendChild(t);
      }
      d.appendChild(body);
      art.appendChild(d);
      log.appendChild(art);
    });
    function openHash() {
      var id = decodeURIComponent(location.hash.slice(1));
      var t = id && document.getElementById(id);
      if (t && t.querySelector('details')) {
        t.querySelector('details').open = true;
        t.scrollIntoView();
      }
    }
    window.addEventListener('hashchange', openHash);
    if (location.hash) openHash();
    else { var first = log.querySelector('details'); if (first) first.open = true; }
  }

  /* ---------- menu ---------- */
  var root = document.documentElement;
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  var backdrop = document.getElementById('menuBackdrop');
  function setMenu(on) {
    root.classList.toggle('menu-open', on);
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
    if (on) { menu.removeAttribute('inert'); } else { menu.setAttribute('inert', ''); }
  }
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var on = !root.classList.contains('menu-open');
      setMenu(on);
      if (on) menu.querySelector('a').focus({ preventScroll: true });
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    backdrop.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('click', function (e) {
      if (root.classList.contains('menu-open') && !menu.contains(e.target) && !btn.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('menu-open')) return;
      if (e.key === 'Escape') { setMenu(false); btn.focus(); }
      else if (e.key === 'Tab') {
        var f = [btn].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  /* ---------- scroll reveals (gentle fade-up only) ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = ['.sec-head', '.series', '.textcard', '.clippings li', '.jclip', '.entry', '.about', '.links li', '.jlabel'];
    var rvObs = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target;
        rvObs.unobserve(n);
        n.classList.remove('rv');
        n.classList.add('rv-in');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    targets.forEach(function (t) {
      document.querySelectorAll(t).forEach(function (n) {
        n.classList.add('rv');
        rvObs.observe(n);
      });
    });
  }

  /* ---------- one hand-drawn underline per section heading ---------- */
  document.querySelectorAll('.sec-head h2, .sec-head h1').forEach(function (h) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'uline');
    svg.setAttribute('viewBox', '0 0 200 12');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('class', 'crayon red');
    p.setAttribute('d', 'M3 7 C 40 3, 80 10, 120 6 S 175 5, 197 7');
    svg.appendChild(p);
    h.appendChild(svg);
  });
})();
