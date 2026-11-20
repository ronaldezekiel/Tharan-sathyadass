/* shared: SVG filters + works data. Paths are relative to /previews/<x>/ */
window.PV = (function(){
  var svg = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'+
  '<filter id="crayon" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" result="d"/><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.25" result="gA"/><feComposite in="d" in2="gA" operator="in"/></filter>'+
  '<filter id="inkbleed" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" result="d"/><feGaussianBlur in="d" stdDeviation="0.5" result="b"/><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="1" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.15" result="m"/><feComposite in="b" in2="m" operator="in"/></filter>'+
  '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', svg);
  var T='../../images/works/thumb/', F='../../images/works/', H='../../images/handwriting/';
  var works = [
    {n:'002',file:'charcoal-15.jpg',title:'Elephant',medium:'charcoal',w:511,h:700},
    {n:'003',file:'charcoal-04.jpg',title:'Woman with earrings',medium:'charcoal',w:663,h:700},
    {n:'004',file:'charcoal-16.jpg',title:'Leopard on a branch',medium:'charcoal',w:700,h:511},
    {n:'006',file:'charcoal-02.jpg',title:'Woman portrait',medium:'pen on graph paper',w:537,h:700},
    {n:'012',file:'godavari-21.jpg',title:'By the Godavari',medium:'photograph',w:525,h:700},
    {n:'031',file:'artwave-12.jpg',title:'Bombay Milk Centre',medium:'photograph',w:560,h:700},
    {n:'007',file:'charcoal-03.jpg',title:'Man in a turban',medium:'pen on graph paper',w:495,h:700},
    {n:'018',file:'godavari-12.jpg',title:'Boat, untitled',medium:'photograph',w:525,h:700}
  ];
  works.forEach(function(w){w.thumb=T+w.file;w.full=F+w.file;});
  return {
    works:works, H:H,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    fine: matchMedia('(pointer:fine)').matches,
    back:function(){document.body.insertAdjacentHTML('beforeend','<a class="pv-back" href="../index.html">&larr; all previews</a>');}
  };
})();
