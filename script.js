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
    var host = document.querySelector('.collage[data-section="' + w.section + '"]');
    if (!host) return;
    var n = counters[w.section] = (counters[w.section] || 0) + 1;
    var title = w.title || 'Untitled';
    var cap = 'No. ' + pad(i + 2) + ' — ' + title; // No. 001 is the cover
    var meta = [w.year, w.medium].filter(Boolean).join(', ');
    var f = el('figure', 'work ' + (w.shape || 'land') + ' ' + rot[(n - 1) % rot.length]);
    f.dataset.full = 'images/' + w.file;
    f.dataset.cap = cap + (meta ? ' (' + meta + ')' : '');
    var img = el('img');
    img.src = 'images/' + w.file;
    img.alt = title + (w.section === 'photography' ? ' (photograph)' : ' (' + w.section + ')');
    f.appendChild(img);
    if (n % 2 === 1 || w.section !== 'photography') f.appendChild(el('span', 'tape ' + (n % 2 ? 't1' : 't2')));
    f.appendChild(el('figcaption', 'tag', cap));
    var scrib = host.querySelector('.scrib');
    host.insertBefore(f, scrib);
  });

  var figs = document.querySelectorAll('figure.work');
  var lb = document.getElementById('lightbox');
  var lbImg = lb && lb.querySelector('img');
  var lbCap = lb && lb.querySelector('figcaption');
  var last = null;

  function open(f) {
    if (!lb) return;
    last = f;
    lbCap.textContent = f.dataset.cap || '';
    if (f.classList.contains('missing')) {
      lbImg.removeAttribute('src');
      lbImg.alt = 'Image not available yet';
      lbImg.className = 'lb-missing';
    } else {
      lbImg.className = '';
      lbImg.alt = f.querySelector('img').alt;
      lbImg.src = f.dataset.full;
    }
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (last) last.focus();
  }

  // Missing image -> placeholder box
  figs.forEach(function (f) {
    var img = f.querySelector('img');
    function miss() { f.classList.add('missing'); }
    if (img.complete && img.naturalWidth === 0) miss();
    img.addEventListener('error', miss);
    f.tabIndex = 0;
    f.setAttribute('role', 'button');
    f.addEventListener('click', function () { open(f); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(f); }
    });
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) close();
    });
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
})();
