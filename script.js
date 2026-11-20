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
  var rot = ['r-l', 'r-r', 'r-l2', 'r-r'];
  var counters = {};
  works.forEach(function (w, i) {
    var host = document.querySelector(w.series ? '.collage[data-series="' + w.series + '"]' : '.collage[data-section="' + w.section + '"]');
    if (!host) return;
    var key = w.series || w.section;
    var n = counters[key] = (counters[key] || 0) + 1;
    var title = w.title || 'Untitled';
    var cap = 'No. ' + pad(i + 2) + ' — ' + title; // No. 001 is the cover
    var meta = [w.year, w.medium].filter(Boolean).join(', ');
    var f = el('figure', 'work ' + ((w.w >= w.h * 1.05 ? 'land' : w.h >= w.w * 1.05 ? 'port' : 'sq')) + ' ' + rot[(n - 1) % rot.length] + (w.cover ? ' cover' : ''));
    if (w.w && w.h) f.style.setProperty('--ar', w.w + ' / ' + w.h);
    f.dataset.full = 'images/works/' + w.file;
    f.dataset.cap = cap + (meta ? ' (' + meta + ')' : '');
    var img = el('img');
    img.src = 'images/works/thumb/' + w.file;
    if (w.w && w.h) { img.width = w.w; img.height = w.h; }
    img.loading = 'lazy';
    img.alt = title + (w.section === 'photography' ? ' (photograph)' : ' (' + w.section + ')');
    f.appendChild(img);
    if (n % 2 === 1 || w.section !== 'photography') f.appendChild(el('span', 'tape ' + (n % 2 ? 't1' : 't2')));
    f.appendChild(el('figcaption', 'tag', cap));
    var scrib = host.querySelector('.scrib');
    host.insertBefore(f, scrib);
  });

  /* ---------- selected-works sequence (built from works.js) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seq = document.getElementById('selected');
  var SEQ = [ // file, left %, width (vw cap), speed, number side
    ['charcoal-15.jpg', 6, '20vw', 1.00],
    ['charcoal-04.jpg', 56, '21vw', 1.28],
    ['charcoal-16.jpg', 28, '27vw', 0.92],
    ['godavari-21.jpg', 68, '19vw', 1.42],
    ['godavari-12.jpg', 12, '19vw', 1.10],
    ['godavari-17.jpg', 44, '17vw', 1.34],
    ['artwave-03.jpg', 72, '19vw', 0.96],
    ['artwave-12.jpg', 22, '19vw', 1.22]
  ];
  var seqItems = [];
  var seqHost = document.getElementById('seqItems');
  if (seq && seqHost) {
    SEQ.forEach(function (c, i) {
      var idx = -1;
      works.forEach(function (w, k) { if (w.file === c[0]) idx = k; });
      if (idx < 0) return;
      var w = works[idx];
      var title = w.title || 'Untitled';
      var cap = 'No. ' + pad(idx + 2) + ' — ' + title;
      var item = el('div', 'seq-item' + (c[1] > 48 ? ' num-l' : ''));
      item.style.setProperty('--x', c[1] + '%');
      item.style.setProperty('--w', c[2]);
      item.style.setProperty('--arn', (w.w / w.h).toFixed(3));
      var f = el('figure', 'work ' + (w.w >= w.h * 1.05 ? 'land' : 'port') + ' ' + rot[i % rot.length]);
      f.style.setProperty('--ar', w.w + ' / ' + w.h);
      f.dataset.full = 'images/works/' + w.file;
      f.dataset.cap = cap;
      var img = el('img');
      img.src = 'images/works/thumb/' + w.file;
      img.width = w.w; img.height = w.h; img.loading = 'lazy';
      img.alt = title + (w.section === 'photography' ? ' (photograph)' : ' (' + w.section + ')');
      f.appendChild(img);
      f.appendChild(el('span', 'tape t1'));
      f.appendChild(el('span', 'tape t2'));
      f.appendChild(el('figcaption', 'tag', cap));
      item.appendChild(f);
      var num = el('span', 'seq-num', (i < 9 ? '0' : '') + (i + 1));
      num.setAttribute('aria-hidden', 'true');
      item.appendChild(num);
      seqHost.appendChild(item);
      seqItems.push({ el: item, s: 0, speed: c[3] });
    });
  }

  /* ---------- lightbox ---------- */
  var figs = document.querySelectorAll('figure.work');
  var gallery = Array.prototype.filter.call(figs, function (f) { return !f.closest('#selected'); });
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
  var tilt = ['r-l', 'r-r', 'r-l2'];

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
      var li = el('li', 'jclip ' + tilt[i % 3]);
      li.appendChild(el('span', 'tape ' + (i % 2 ? 't2' : 't1')));
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
      var art = el('article', 'entry ' + tilt[i % 3]);
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

  /* ---------- intro cleanup ---------- */
  var introOn = root.classList.contains('intro-on');
  if (introOn) setTimeout(function () { root.classList.remove('intro-on'); }, 1350);
  var t0 = Date.now();
  function startDelay() { return (introOn && Date.now() - t0 < 1300) ? Math.max(0, 1.0 - (Date.now() - t0) / 1000) : 0; }

  /* ---------- scroll reveals + scribbles ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = [
      ['.sec-head', 'up'], ['figure.work:not(.hero-img)', 'drop'],
      ['.series', 'rise'], ['.textcard', 'rise'], ['.clippings li', 'rise'], ['.jclip', 'rise'],
      ['.entry', 'rise'], ['.about', 'rise'], ['.links li', 'rise'], ['.jlabel', 'rise']
    ];
    var rvObs = new IntersectionObserver(function (list) {
      var batch = 0;
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target;
        rvObs.unobserve(n);
        n.style.setProperty('--d', (startDelay() + batch * 0.07).toFixed(2) + 's');
        batch++;
        n.classList.remove('rv');
        n.classList.add('rv-in');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (t) {
      document.querySelectorAll(t[0]).forEach(function (n) {
        if (n.closest('#selected')) return;
        n.dataset.rv = t[1];
        n.classList.add('rv');
        rvObs.observe(n);
      });
    });

    var scObs = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sv = en.target;
        scObs.unobserve(sv);
        var d = startDelay();
        setTimeout(function () { sv.classList.remove('sc-pre'); sv.classList.add('sc-draw'); }, d * 1000 + 60);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('svg.scrib, svg.arrow, .oval svg').forEach(function (sv) {
      sv.querySelectorAll('.crayon').forEach(function (p) { p.setAttribute('pathLength', '1'); });
      sv.classList.add('sc-pre');
      scObs.observe(sv);
    });
  }

  /* ---------- custom cursor label ---------- */
  if (window.matchMedia('(pointer: fine) and (hover: hover)').matches && !reduce) {
    var cur2 = el('div', 'cursor');
    cur2.setAttribute('aria-hidden', 'true');
    cur2.appendChild(el('span', null, 'view'));
    document.body.appendChild(cur2);
    root.classList.add('has-cursor');
    var cx = 0, cy = 0, cq = false;
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      var on = !!(e.target.closest && e.target.closest('figure.work')) && (!lb || lb.hidden);
      cur2.classList.toggle('on', on);
      if (!cq) { cq = true; requestAnimationFrame(function () { cur2.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; cq = false; }); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cur2.classList.remove('on'); });
  }

  /* ---------- scroll sequence driver ---------- */
  if (seq && !reduce && seqItems.length) {
    seq.classList.add('is-anim');
    var nameBox = document.getElementById('seqName');
    var nameSpan = nameBox.firstElementChild;
    var vw = 0, vh = 0, D = 1, nameW = 0, wide = true, ticking = false;
    function measure() {
      vw = window.innerWidth; vh = window.innerHeight;
      wide = vw >= 760;
      D = Math.max(1, seq.offsetHeight - vh);
      nameW = nameSpan.getBoundingClientRect().width;
      var run = D - vh * 0.8;
      seqItems.forEach(function (it, i) { it.s = i / (seqItems.length - 1) * run; });
      update();
    }
    function update() {
      ticking = false;
      var r = seq.getBoundingClientRect();
      var sc = Math.min(Math.max(-r.top, 0), D);
      var p = sc / D;
      var x0 = vw * 0.03, x1 = vw * 0.97 - nameW;
      nameBox.style.transform = 'translate3d(' + (x0 + (x1 - x0) * p).toFixed(1) + 'px,0,0)';
      if (wide) {
        for (var i = 0; i < seqItems.length; i++) {
          var it = seqItems[i];
          var y = vh * 1.1 + it.speed * (it.s - sc);
          it.el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
        }
      } else if (seqItems[0].el.style.transform) {
        seqItems.forEach(function (it) { it.el.style.transform = ''; });
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  }
})();
