/*! Monitor Legislativo · © 2026 Fabián Belmar — C22, Centro de Estudios Públicos.
    Todos los derechos reservados (ver LICENSE). Huella: c22mon-4f8a2c71 */
/* Guardia contra el uso del Monitor dentro de sitios ajenos.

   Si la página se abre dentro de un marco (iframe) de un dominio que no es del
   C22 ni del CEP, no se muestra el Monitor: aparece un aviso con el enlace al
   original. Dentro de c22cepchile.cl, cepchile.cl, belmarfabian.github.io y en
   local funciona igual que siempre.

   Para saber quién la incrusta se usa location.ancestorOrigins (Chrome, Safari,
   Edge) y, si no existe, document.referrer. Si ninguno dice nada (p. ej. Firefox
   con una política de referrer estricta), no se bloquea: es preferible dejar
   pasar una copia que romper el Monitor en el sitio del C22.

   No impide copiar lo que el navegador ya muestra. Es una barrera más, junto con
   robots.txt (rastreadores de IA), la licencia y la marca en los gráficos. */
(function () {
  var PERMITIDOS = /(^|\.)c22cepchile\.cl$|(^|\.)cepchile\.cl$|(^|\.)belmarfabian\.github\.io$|^localhost$|^127\.0\.0\.1$/i;
  var enMarco;
  try { enMarco = window.self !== window.top; } catch (e) { enMarco = true; }
  if (!enMarco) return;

  var origen = '';
  try {
    if (location.ancestorOrigins && location.ancestorOrigins.length) origen = location.ancestorOrigins[0];
  } catch (e) {}
  if (!origen) origen = document.referrer || '';
  if (!origen) return;

  var host = '';
  try { host = new URL(origen).hostname; } catch (e) { return; }
  if (!host || PERMITIDOS.test(host)) return;

  // Marco ajeno: se oculta todo y se reemplaza por el aviso.
  var oculto = document.createElement('style');
  oculto.textContent = 'body > *:not(#c22-guardia){display:none!important}';
  (document.head || document.documentElement).appendChild(oculto);
  function avisar() {
    if (document.getElementById('c22-guardia')) return;
    var d = document.createElement('div');
    d.id = 'c22-guardia';
    d.setAttribute('style', 'font:15px/1.5 system-ui,sans-serif;color:#1B1C1E;padding:28px;max-width:560px;margin:0 auto');
    d.innerHTML = '<p style="margin:0 0 10px"><strong>Monitor Legislativo · C22-CEP</strong></p>' +
      '<p style="margin:0 0 14px">Este contenido no está autorizado para mostrarse en otro sitio.</p>' +
      '<p style="margin:0"><a href="https://c22cepchile.cl/monitor-legislativo/" target="_top" rel="noopener" ' +
      'style="color:#0A5CAB;font-weight:600">Ver el Monitor en c22cepchile.cl →</a></p>';
    document.body.appendChild(d);
  }
  if (document.body) avisar(); else document.addEventListener('DOMContentLoaded', avisar);
})();
