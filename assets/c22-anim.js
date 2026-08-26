/* ──────────────────────────────────────────────────────────────────────────
   Entradas al hacer scroll, copiadas del landing de c22cepchile.cl.

   Ese sitio usa AOS con tres variantes -fade-right, zoom-in y zoom-in-left-,
   retardos escalonados de 100 a 500 ms y curva ease. Aca se reproduce con
   IntersectionObserver: mismo resultado, sin cargar la libreria ni su hoja de
   estilos. Los estilos viven en c22-skin.css.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* El hero y su tarjeta quedan fuera: animar el encabezado se veia mal, y esa
     tarjeta tiene su propia animacion, la de las hojas pasando. */
  var GRUPOS = [
    ['.sec-title, .sec-label, .rarezas h2', 'c22anim-der'],
    ['.cards > .card', 'c22anim-zizq'],
    ['.rar, .fact, .p-card', 'c22anim-zoom'],
    ['.pulso .panel, .credito-apoyo', 'c22anim-zoom']
  ];

  function preparar() {
    GRUPOS.forEach(function (g) {
      var nodos = document.querySelectorAll(g[0]);
      Array.prototype.forEach.call(nodos, function (e, i) {
        if (e.classList.contains('c22anim')) return;
        e.classList.add('c22anim', g[1]);
        // el retardo se reinicia cada cuatro, que es el ancho de nuestras filas
        e.style.transitionDelay = ((i % 4) * 100) + 'ms';
      });
    });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('c22anim-ok');
        obs.unobserve(en.target);      // entra una vez y se queda
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    document.querySelectorAll('.c22anim').forEach(function (e) { obs.observe(e); });
  }

  // los bloques que dibuja el JS de datos aparecen despues del load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(preparar, 350); });
  } else { setTimeout(preparar, 350); }
})();
