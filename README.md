# Tharan Sathyadass — portfolio

Static site: no build step, no server. Open `index.html`, or publish as-is.

## Add or edit artworks — `works.js`
Each artwork is one line in `works.js`:
`{ id, file, section: 'charcoal'|'canvas'|'photography', series (photography only: 'godavari'|'streets'|'coast'), cover (optional), title, year, medium, w, h }`.
`w`/`h` are the pixel size of the thumbnail (they set the card shape and prevent layout shift).
Change `title` ("Untitled" = `// TODO title`; `// working title` = guessed); `year` and `medium` are optional (`''` hides).
Order in the file sets display order and catalogue number ("No. 004 — Title"; No. 001 is the hero in `index.html`).
Series headings are in `index.html` (`.series`).

## Images — `images/works/`
`images/works/<name>.jpg` (max 1600px, lightbox) and `images/works/thumb/<name>.jpg` (max 700px, grid). `file` in works.js is just `<name>.jpg`.
Hero cover is `images/works/charcoal-15.jpg` (set in `index.html`). Journal photos still use `images/<file>`.
Missing images show an "image pending" placeholder. Photography thumbs are B&W until hover.

## Add journal entries — `journal.js`
Kothanur Run Club journal, shown as the 3 latest clippings on the home page and in full on `run-club.html` (newest first).
Copy the commented SAMPLE TEMPLATE at the bottom of `journal.js`: `{ slug, date ('YYYY-MM-DD'), title, excerpt, body (HTML), photos: [], tags: [] }`.
Optional `link: { href, label }` for press links. Each entry has its own anchor, e.g. `run-club.html#press-indulge-express`.

## Publish on GitHub Pages
1. Push this folder to a GitHub repository (the `.nojekyll` file must stay).
2. Repo Settings, Pages, Source: "Deploy from a branch", pick `main` and `/ (root)` (or the folder holding `index.html`).
3. The site appears at `https://<user>.github.io/<repo>/`. All paths are relative, so it works under that sub-path.

## Open TODOs
Artwork titles, canvas paintings, series name for "Coast & city" (confirm with Ron), club founding date, Indulge Express URL, run club Instagram, ArtWave link.
