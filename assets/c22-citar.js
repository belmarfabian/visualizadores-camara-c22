/*! Monitor Legislativo · © 2026 Fabián Belmar — C22, Centro de Estudios Públicos. Todos los derechos reservados (ver LICENSE). Huella: c22mon-4f8a2c71 */
/* «Cómo citar» en todas las pestañas, con botón para copiar la cita.
   La cita es la misma de la portada (bloque «Cómo citar» de «Sobre el
   proyecto»): si cambia allá, hay que cambiarla aquí. En la portada solo se
   agrega el botón; en las pestañas se agrega el recuadro antes del pie. */
(function () {
  var CITA = 'Belmar, F., Rozas, J., Henríquez, P. y Mascareño, A. (2026). Monitor Legislativo [plataforma de visualización]. C22, Centro de Estudios Públicos. https://c22cepchile.cl/monitor-legislativo/';
  var NOTA = 'Los datos de origen son públicos y vienen de las API de datos abiertos de la Cámara de Diputadas y Diputados y del Senado.';

  function copiar(texto, boton) {
    function listo(ok) {
      var antes = boton.getAttribute('data-txt') || boton.textContent;
      boton.setAttribute('data-txt', antes);
      boton.textContent = ok ? 'Cita copiada' : 'Selecciónala y cópiala';
      setTimeout(function () { boton.textContent = antes; }, 2200);
    }
    function aMano() {   // dentro del marco del sitio del C22 el portapapeles puede estar bloqueado
      var t = document.createElement('textarea');
      t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(t); listo(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { listo(true); }, aMano);
    } else aMano();
  }

  function boton() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'c22-citar-btn'; b.textContent = 'Copiar cita';
    b.addEventListener('click', function () { copiar(CITA, b); });
    return b;
  }

  function armar() {
    var enPortada = document.querySelector('.citar-col .cita');
    if (enPortada) {
      if (!enPortada.parentNode.querySelector('.c22-citar-btn')) enPortada.parentNode.insertBefore(boton(), enPortada.nextSibling);
      return;
    }
    if (document.querySelector('.c22-citar')) return;
    var caja = document.createElement('section');
    caja.className = 'c22-citar';
    caja.setAttribute('aria-label', 'Cómo citar');
    caja.innerHTML = '<span class="c22-citar-lab">Cómo citar</span>' +
      '<p class="c22-citar-txt">Belmar, F., Rozas, J., Henríquez, P. y Mascareño, A. (2026). <i>Monitor Legislativo</i> ' +
      '[plataforma de visualización]. C22, Centro de Estudios Públicos. https://c22cepchile.cl/monitor-legislativo/</p>' +
      '<p class="c22-citar-nota">' + NOTA + '</p>';
    caja.insertBefore(boton(), caja.querySelector('.c22-citar-nota'));
    var pie = [].filter.call(document.body.children, function (e) { return e.tagName === 'FOOTER'; })[0];
    if (pie) document.body.insertBefore(caja, pie); else document.body.appendChild(caja);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', armar); else armar();
})();
