 
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

   
  var GRUPOS = [
    ['.sec-title, .sec-label, .rarezas h2', 'c22anim-der'],
    ['.cards > .card', 'c22anim-zizq'],
    ['.rar, .fact, .p-card', 'c22anim-zoom'],
    ['.pulso .panel, .credito-apoyo', 'c22anim-zoom']
  ];

   
  function escalonar(nodos) {
    var filas = {};
    Array.prototype.forEach.call(nodos, function (e) {
      var y = Math.round((e.getBoundingClientRect().top + window.pageYOffset) / 8) * 8;
      (filas[y] = filas[y] || []).push(e);
    });
    Object.keys(filas).forEach(function (y) {
      filas[y].sort(function (a, b) {
        return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
      });
      filas[y].forEach(function (e, k) {
        e.style.transitionDelay = Math.min(k * 90, 540) + 'ms';
      });
    });
  }

  function preparar() {
    GRUPOS.forEach(function (g) {
      var nodos = document.querySelectorAll(g[0]);
      Array.prototype.forEach.call(nodos, function (e) {
        if (e.classList.contains('c22anim')) return;
        e.classList.add('c22anim', g[1]);
      });
      escalonar(nodos);
    });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('c22anim-ok');
        obs.unobserve(en.target);      
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    document.querySelectorAll('.c22anim').forEach(function (e) { obs.observe(e); });

    
    
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        GRUPOS.forEach(function (g) {
          var pend = [];
          document.querySelectorAll(g[0]).forEach(function (e) {
            if (!e.classList.contains('c22anim-ok')) pend.push(e);
          });
          if (pend.length) escalonar(pend);
        });
      }, 200);
    });
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(preparar, 350); });
  } else { setTimeout(preparar, 350); }
})();
