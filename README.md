# Tharan Sathyadass — portfolio

Static site: no build step, no server. Open `index.html`, or publish as-is.

## Add or edit artworks — `works.js`
Each artwork is one line in `works.js`:
`{ id, file, section: 'charcoal'|'photography', series (photography only: 'godavari'|'streets'|'coast'), cover (optional), title, year, medium, w, h }`.
`w`/`h` are the pixel size of the thumbnail (they set the card shape and prevent layout shift).
Change `title` ("Untitled" = `// TODO title`; `// working title` = guessed); `year` and `medium` are optional (`''` hides).
Order in the file sets display order and catalogue number ("No. 004 — Title"; No. 001 is the hero in `index.html`).
Series headings are in `index.html` (`.series`).

## Pages
`index.html` (temporary landing: name + links), `art.html` (white page, charcoal/ink cut-outs), `photos.html` (near-black page, colour photos by series), `run-club.html` (Work: projects + Kothanur Run Club journal). All share `styles.css` and `script.js`; the "+" menu and about/contact footer are repeated in each page's HTML.
One paper colour (`--paper:#f7f6f2`) is used for the page, menu and lightbox; the photography page is `--dark:#141414`.

## Images — `images/works/`
Photos: `images/works/<name>.jpg` (max 1600px, lightbox) and `images/works/thumb/<name>.jpg` (max 700px, grid).
Charcoal/ink/watercolour (`cut:true` in works.js): transparent PNGs, paper knocked out so the drawing sits on the page: `images/works/cut/<name>.png` (1600px) and `images/works/cut/thumb/<name>.png` (700px). `file` in works.js stays `<name>.jpg`; the site swaps in the PNG. Art grid sizes come from `span` (columns out of 12) in works.js.
Missing images show an "image pending" placeholder.

## Add journal entries — `journal.js`
Kothanur Run Club journal, shown as the 3 latest clippings on the home page and in full on `run-club.html` (newest first).
Copy the commented SAMPLE TEMPLATE at the bottom of `journal.js`: `{ slug, date ('YYYY-MM-DD'), title, excerpt, body (HTML), photos: [], tags: [] }`.
Optional `link: { href, label }` for press links. Each entry has its own anchor, e.g. `run-club.html#press-indulge-express`.

## Interactivity (vanilla JS/CSS, `script.js` + `styles.css`)
Calm by design: gentle fade-up reveals; "Photocopier" effect on every artwork/photo: it resolves from coarse halftone dots under a scanner light bar when it first enters view, and on mouse hover (or keyboard focus) shows a subtle riso misprint (red/blue/green offset 3-4px, snaps back). The halftone needs canvas pixel access, so it works over http(s) (GitHub Pages); over file:// it falls back to a plain fade. Plain lightbox (paper backdrop, prev/next/arrow keys/swipe, caption, counter). Accents: crayon underline per heading, handwriting, signature, "+" menu, pinned corner bits. `prefers-reduced-motion` turns the effects off.

## Publish on GitHub Pages
1. Push this folder to a GitHub repository (the `.nojekyll` file must stay).
2. Repo Settings, Pages, Source: "Deploy from a branch", pick `main` and `/ (root)` (or the folder holding `index.html`).
3. The site appears at `https://<user>.github.io/<repo>/`. All paths are relative, so it works under that sub-path.

## Open TODOs
Artwork titles, club founding date, Indulge Express URL, run club Instagram, ArtWave link.
