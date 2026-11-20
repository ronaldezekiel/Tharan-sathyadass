/* ------------------------------------------------------------------
   works.js — every artwork on the site lives here. Edit titles here.
   Order = display order and catalogue number (No. 002, 003, ... ; No. 001 is the cover).
   file    : image name; the site loads images/works/thumb/<file> in the grid and images/works/<file> (1600px) in the lightbox
   section : 'charcoal' | 'canvas' | 'photography'
   series  : photography only: 'godavari' | 'streets' | 'coast' (series titles live in index.html)
   title   : shown as  "No. 004 — <title>"   ("// working title" = guessed, please confirm)
   year, medium : optional, hidden when empty ('')
   w, h    : pixel size of the thumb (sets card shape, avoids layout shift). Re-run image prep if you swap a file.
   cover   : true = shown larger, first in its series
   ------------------------------------------------------------------ */
window.WORKS = [
  { id:'w02', file:'charcoal-15.jpg', section:'charcoal', title:'Elephant', year:'', medium:'charcoal', w:511, h:700 }, // working title
  { id:'w03', file:'charcoal-04.jpg', section:'charcoal', title:'Woman with earrings', year:'', medium:'charcoal', w:663, h:700 }, // working title
  { id:'w04', file:'charcoal-16.jpg', section:'charcoal', title:'Leopard on a branch', year:'', medium:'charcoal', w:700, h:511 }, // working title
  { id:'w05', file:'charcoal-06.jpg', section:'charcoal', title:'Leopard resting', year:'', medium:'charcoal', w:700, h:525 }, // working title
  { id:'w06', file:'charcoal-02.jpg', section:'charcoal', title:'Woman portrait', year:'', medium:'pen', w:537, h:700 }, // working title
  { id:'w07', file:'charcoal-03.jpg', section:'charcoal', title:'Man in a turban', year:'', medium:'pen', w:495, h:700 }, // working title
  { id:'w08', file:'charcoal-07.jpg', section:'charcoal', title:'Cow', year:'', medium:'ink', w:482, h:700 }, // working title
  { id:'w09', file:'charcoal-08.jpg', section:'charcoal', title:'Elephant, line sketch', year:'', medium:'ink', w:495, h:700 }, // working title
  { id:'w10', file:'charcoal-17.jpg', section:'charcoal', title:'Clouds', year:'', medium:'print', w:700, h:511 }, // working title
  { id:'w11', file:'charcoal-11.jpg', section:'canvas', title:'Building with dogs', year:'', medium:'watercolour', w:525, h:700 }, // working title
  { id:'w12', file:'godavari-21.jpg', section:'photography',series:'godavari',cover:true, title:'By the Godavari (cover)', year:'', medium:'', w:525, h:700 }, // working title
  { id:'w13', file:'godavari-07.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w14', file:'godavari-08.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w15', file:'godavari-09.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w16', file:'godavari-10.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w17', file:'godavari-11.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w18', file:'godavari-12.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w19', file:'godavari-13.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w20', file:'godavari-14.jpg', section:'photography',series:'godavari', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w21', file:'godavari-01.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w22', file:'godavari-02.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w23', file:'godavari-03.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w24', file:'godavari-04.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:700, h:525 }, // TODO title
  { id:'w25', file:'godavari-05.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w26', file:'godavari-06.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:700, h:525 }, // TODO title
  { id:'w27', file:'godavari-15.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w28', file:'godavari-16.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w29', file:'godavari-17.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:394, h:700 }, // TODO title
  { id:'w30', file:'godavari-18.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w31', file:'godavari-19.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:700, h:394 }, // TODO title
  { id:'w32', file:'godavari-22.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w33', file:'godavari-23.jpg', section:'photography',series:'streets', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w34', file:'artwave-01.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w35', file:'artwave-02.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w36', file:'artwave-03.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w37', file:'artwave-04.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w38', file:'artwave-05.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w39', file:'artwave-06.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w40', file:'artwave-07.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:700, h:525 }, // TODO title
  { id:'w41', file:'artwave-08.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:700, h:525 }, // TODO title
  { id:'w42', file:'artwave-09.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:700, h:525 }, // TODO title
  { id:'w43', file:'artwave-10.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:700, h:525 }, // TODO title
  { id:'w44', file:'artwave-11.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:525, h:700 }, // TODO title
  { id:'w45', file:'artwave-12.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 }, // TODO title
  { id:'w46', file:'artwave-13.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:700, h:700 }, // TODO title
  { id:'w47', file:'artwave-14.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 }, // TODO title
  { id:'w48', file:'artwave-17.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 }, // TODO title
  { id:'w49', file:'artwave-18.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 }, // TODO title
  { id:'w50', file:'artwave-21.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 }, // TODO title
  { id:'w51', file:'artwave-23.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 }, // TODO title
  { id:'w52', file:'artwave-24.jpg', section:'photography',series:'coast', title:'Untitled', year:'', medium:'', w:560, h:700 } // TODO title
];
