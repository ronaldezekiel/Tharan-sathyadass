/* ------------------------------------------------------------------
   journal.js — Kothanur Run Club journal. Newest date is shown first.
   Fields:
     slug    : unique, url-safe id (used for the #anchor on run-club.html)
     date    : 'YYYY-MM-DD' or 'YYYY-MM' ('' = unknown, shown as "date TBC", listed last)
     title, excerpt (short, shown on the home page), body (HTML string)
     photos  : ['file.jpg', ...] from images/ (optional)
     tags    : ['events', 'socials', ...] (optional)
     link    : optional external link { href, label } (leave href '' if not known yet)
   ------------------------------------------------------------------ */
window.JOURNAL = [
  {
    slug: 'press-indulge-express',
    date: '2025-10',
    title: 'Indulge Express: “putting Kothanur on the Map”',
    excerpt: 'Kothanur Run Club featured in Indulge Express, October 2025.',
    body: '<p>Kothanur Run Club was featured in <em>Indulge Express</em> in October 2025, in a piece titled “putting Kothanur on the Map”.</p>',
    photos: [],
    tags: ['press'],
    link: { href: 'https://www.indulgexpress.com/events/bangalore/2025/Oct/10/this-weekend-run-club-traces-how-a-small-jog-with-friends-turned-kothanur-into-the-place-to-be', label: 'Read the article' }
  },
  {
    slug: 'how-it-started',
    date: '', // TODO: founding date unknown
    title: 'How it started',
    excerpt: 'Kothanur Run Club is a youth-led social fitness collective, co-founded by Tharan. The runs are about connection, not competition.',
    body: '<p>Kothanur Run Club is a youth-led social fitness collective, co-founded by Tharan Sathyadass.</p><p>The community runs are about connection, not competition.</p>',
    photos: [],
    tags: ['about']
  }

  /* ---- SAMPLE TEMPLATE (delete the comment markers to use; add a comma after the previous entry) ----
  ,{
    slug: 'sample-sunday-run',          // unique, lowercase-with-dashes
    date: '2026-01-18',
    title: 'Sample: Sunday long run',
    excerpt: 'One or two lines that appear on the home page.',
    body: '<p>Full write-up goes here. Basic HTML is fine.</p><p>Second paragraph.</p>',
    photos: ['run-2026-01-18.jpg'],     // files in images/
    tags: ['events', 'socials']
  }
  ---- END SAMPLE ---- */
];
