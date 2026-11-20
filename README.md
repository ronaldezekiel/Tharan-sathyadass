# Tharan Sathyadass — portfolio

Static site: no build step, no server. Open `index.html`, or publish as-is.

## Add or edit artworks — `works.js`
Each artwork is one line in `works.js`:
`{ id, file, section: 'charcoal'|'canvas'|'photography', title, year, medium, shape: 'port'|'land'|'sq' }`.
Change `title` (currently "Untitled", marked `// TODO title`); `year` and `medium` are optional (leave `''` to hide).
Order in the file sets the display order and the catalogue number ("No. 004 — Title"; No. 001 is the cover in `index.html`).

## Add journal entries — `journal.js`
Kothanur Run Club journal, shown as the 3 latest clippings on the home page and in full on `run-club.html` (newest first).
Copy the commented SAMPLE TEMPLATE at the bottom of `journal.js`: `{ slug, date ('YYYY-MM-DD'), title, excerpt, body (HTML), photos: [], tags: [] }`.
Optional `link: { href, label }` for press links. Each entry has its own anchor, e.g. `run-club.html#press-indulge-express`.

## Images — `images/`
Put image files in `images/` and refer to them by file name only (in `works.js` `file`, or `journal.js` `photos`).
The cover is `images/image01.jpg` (set in `index.html`). Missing images show an "image pending" placeholder.

## Publish on GitHub Pages
1. Push this folder to a GitHub repository (the `.nojekyll` file must stay).
2. Repo Settings, Pages, Source: "Deploy from a branch", pick `main` and `/ (root)` (or the folder holding `index.html`).
3. The site appears at `https://<user>.github.io/<repo>/`. All paths are relative, so it works under that sub-path.

## Open TODOs
Artwork titles, charcoal vs canvas split, club founding date, Indulge Express URL, run club Instagram, ArtWave link.
