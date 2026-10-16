/*! Monitor Legislativo · © 2026 Fabián Belmar — C22, Centro de Estudios Públicos. Todos los derechos reservados (ver LICENSE). Huella: c22mon-4f8a2c71 */
/* Marca del Monitor dentro de cada gráfico: «Monitor Legislativo · C22-CEP ·
   c22cepchile.cl», en letra chica abajo a la derecha, en una franja propia, para que una captura
   conserve la autoría. Los gráficos se dibujan en distintos momentos (al
   cambiar de pestaña o de período), así que se revisa cada vez que cambia la
   página. El hemiciclo ya trae la suya. Tamaño fijo en pantalla: ~10,5 px. */
(function () {
  var TEXTO = 'Monitor Legislativo · C22-CEP · c22cepchile.cl';
  var NS = 'http://www.w3.org/2000/svg';
  // La marca va en una franja propia bajo el gráfico (se alarga el viewBox),
  // así nunca tapa ejes, etiquetas ni puntos. Se guarda el viewBox original
  // para rehacerla si cambia el ancho de la pantalla.
  function marcarSvg(s) {
    if (s.id === 'hemicycle' || s.querySelector('#c22-marca')) return;
    if (s.closest('nav, header, footer, .c22skin-ico, .c22-citar')) return;
    var vb = s.viewBox && s.viewBox.baseVal;
    if (!vb || vb.width < 200) return;                 // iconos
    var r = s.getBoundingClientRect();
    if (r.width < 260 || r.height < 120) return;       // oculto o muy chico: se revisa después
    var esc = r.width / vb.width;
    var previa = s.querySelector('text.c22-marca');
    if (previa) {
      var vb0 = previa.getAttribute('data-vb0'), vbm = previa.getAttribute('data-vb');
      var e0 = parseFloat(previa.getAttribute('data-esc')) || esc;
      if (s.getAttribute('viewBox') === vbm && Math.abs(esc / e0 - 1) < 0.15) return;
      if (s.getAttribute('viewBox') === vbm) s.setAttribute('viewBox', vb0);
      previa.parentNode.removeChild(previa);
      vb = s.viewBox.baseVal; esc = r.width / vb.width;
    }
    var original = vb.x + ' ' + vb.y + ' ' + vb.width + ' ' + vb.height;
    var franja = 18 / esc;
    var alto = s.getAttribute('height');
    var nuevo = vb.x + ' ' + vb.y + ' ' + vb.width + ' ' + (vb.height + franja).toFixed(1);
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('class', 'c22-marca');
    t.setAttribute('x', (vb.x + vb.width - 8 / esc).toFixed(1));
    t.setAttribute('y', (vb.y + vb.height + franja - 6 / esc).toFixed(1));
    t.setAttribute('text-anchor', 'end');
    t.setAttribute('font-size', (10.5 / esc).toFixed(1));
    t.setAttribute('font-family', 'Montserrat, system-ui, sans-serif');
    t.setAttribute('font-weight', '600');
    t.setAttribute('fill', '#7D8F92');
    t.setAttribute('fill-opacity', '0.9');
    t.setAttribute('pointer-events', 'none');
    t.setAttribute('data-vb0', original);
    t.setAttribute('data-vb', nuevo);
    t.setAttribute('data-esc', esc.toFixed(4));
    t.textContent = TEXTO;
    s.setAttribute('viewBox', nuevo);
    if (alto && /^[\d.]+$/.test(alto)) s.setAttribute('height', (parseFloat(alto) * (vb.height + franja) / vb.height).toFixed(1));
    s.appendChild(t);
  }
  // Bloques hechos en HTML (no SVG): la tarjeta de partidos de la portada, la
  // lista de Rankings y la ficha de cada legislador. En la tarjeta la marca va
  // adentro; en las otras dos, justo después, para que no la borre cada
  // redibujo ni quede entre filas.
  var TARJETAS = [['#cardRankPartidos', false], ['#rankLista', true], ['#fichaCuerpo', true]];
  function marcarHtml(par) {
    var c = document.querySelector(par[0]);
    if (!c) return;
    var fuera = par[1];
    var hay = fuera ? (c.nextElementSibling && c.nextElementSibling.classList.contains('c22-marca-html') ? c.nextElementSibling : null)
                    : c.querySelector('.c22-marca-html');
    if (!c.children.length) { if (hay && fuera) hay.parentNode.removeChild(hay); return; }
    if (hay) return;
    var d = document.createElement('div');
    d.className = 'c22-marca-html';
    d.textContent = TEXTO;
    if (fuera) c.parentNode.insertBefore(d, c.nextSibling); else c.appendChild(d);
  }
  var pend = null;
  function revisar() {
    pend = null;
    [].forEach.call(document.querySelectorAll('svg'), marcarSvg);
    TARJETAS.forEach(marcarHtml);
  }
  function programar() { if (!pend) pend = setTimeout(revisar, 250); }
  function iniciar() {
    revisar();
    if (window.MutationObserver) new MutationObserver(programar).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', programar);
    document.addEventListener('click', programar, true);
    var n = 0, t = setInterval(function () { revisar(); if (++n > 10) clearInterval(t); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
