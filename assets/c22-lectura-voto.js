/* Lectura de una votación: quién perdió, votos inesperados y el proyecto completo.
   Todo se calcula en el navegador con los datos que la página ya carga
   (seats con dim1 y coalition, heatmap persona x votación, votes).
   Códigos del heatmap: 1 a favor, 0 en contra, 2 abstención, -1 no votó. */
(function () {
  /* Grupos para «Quién ganó y quién perdió».
     Cámara: el pacto inscrito para las parlamentarias de 2025, por partido
     (mismo mapa que pipeline/pactos.py; fuentes: Cooperativa 16-ago-2025,
     El Dínamo 17-nov-2025). Quien no tiene partido no entra.
     Senado: oposición y oficialismo; «Otros» (dos independientes) no es un
     grupo que vote junto y no se muestra. */
  var PACTO_2025 = {
    'Frente Amplio': 'Unidad por Chile', 'Partido Comunista': 'Unidad por Chile',
    'Partido Socialista': 'Unidad por Chile', 'Partido Por la Democracia': 'Unidad por Chile',
    'Partido Radical de Chile': 'Unidad por Chile', 'Partido Liberal de Chile': 'Unidad por Chile',
    'Partido Demócrata Cristiano': 'Unidad por Chile',
    'Federación Regionalista Verde Social': 'Verdes, Regionalistas y Humanistas',
    'Partido Acción Humanista': 'Verdes, Regionalistas y Humanistas',
    'Partido de la Gente': 'Partido de la Gente',
    'Unión Demócrata Independiente': 'Chile Grande y Unido', 'Renovación Nacional': 'Chile Grande y Unido',
    'Evolución Política': 'Chile Grande y Unido', 'Partido Demócratas Chile': 'Chile Grande y Unido',
    'Partido Republicano': 'Cambio por Chile', 'Partido Nacional Libertario': 'Cambio por Chile',
    'Partido Social Cristiano': 'Cambio por Chile'
  };
  var PACTOS = ['Unidad por Chile', 'Verdes, Regionalistas y Humanistas', 'Partido de la Gente', 'Chile Grande y Unido', 'Cambio por Chile'];
  var BLOQUES_SEN = ['Oposición', 'Oficialismo'];

  function esSenado(H) { return H.seats.some(function (s) { return 'region' in s; }); }
  function grupos(H) { return esSenado(H) ? BLOQUES_SEN : PACTOS; }
  function grupoDe(H, s) {
    if (esSenado(H)) return BLOQUES_SEN.indexOf(s.coalition) >= 0 ? s.coalition : null;
    return PACTO_2025[s.partido] || null;
  }

  function votoDe(H, s, j) {
    var k = H.deputyIdx[s.id];
    return k === undefined ? -1 : H.heatmap[k][j];
  }

  function boletinDe(v) {
    if (v.boletin) return String(v.boletin);
    var m = /(\d{4,5}-\d{2})/.exec(v.descripcion || '');
    return m ? m[1] : null;
  }

  function opcionGanadora(v) {
    // El resultado manda (hay quórums especiales): aprobado = ganó el sí.
    if (/aprob/i.test(v.resultado || '')) return 1;
    if (/rechaz/i.test(v.resultado || '')) return 0;
    return null;
  }

  /* Posición de cada grupo: mayoría entre sí y no. */
  function bloques(H, j) {
    var out = {}, gs = grupos(H);
    gs.forEach(function (b) { out[b] = { si: 0, no: 0, ab: 0, au: 0, n: 0 }; });
    H.seats.forEach(function (s) {
      var b = out[grupoDe(H, s)]; if (!b) return;
      var x = votoDe(H, s, j); b.n++;
      if (x === 1) b.si++; else if (x === 0) b.no++; else if (x === 2) b.ab++; else b.au++;
    });
    var gana = opcionGanadora(H.votes[j]);
    gs.forEach(function (k) {
      var b = out[k];
      b.pos = b.si > b.no ? 1 : b.no > b.si ? 0 : null;
      b.perdio = gana !== null && b.pos !== null && b.pos !== gana;
    });
    return out;
  }

  /* Derrotas acumuladas por grupo en todo el período (se calcula una vez). */
  var cache = new WeakMap();
  function derrotas(H) {
    if (cache.has(H)) return cache.get(H);
    var r = {}, gs = grupos(H);
    gs.forEach(function (b) { r[b] = { perdio: 0, tomo: 0 }; });
    for (var j = 0; j < H.votes.length; j++) {
      var bl = bloques(H, j);
      gs.forEach(function (b) {
        if (bl[b].pos !== null && opcionGanadora(H.votes[j]) !== null) {
          r[b].tomo++; if (bl[b].perdio) r[b].perdio++;
        }
      });
    }
    cache.set(H, r);
    return r;
  }

  /* Clasificación óptima en una dimensión (Poole): el punto de corte sobre dim1
     que mejor separa el sí del no. Quien queda del lado contrario votó distinto
     de lo que predice su posición. APRE = reducción proporcional del error
     respecto de predecir que todos votan con la mayoría. */
  function inesperados(H, j) {
    var pts = [];
    H.seats.forEach(function (s, i) {
      var x = votoDe(H, s, j);
      if ((x === 1 || x === 0) && typeof s.dim1 === 'number') pts.push({ i: i, d: s.dim1, v: x });
    });
    var nSi = pts.filter(function (p) { return p.v === 1; }).length, nNo = pts.length - nSi;
    var minoria = Math.min(nSi, nNo);
    if (minoria === 0) return { errores: [], apre: null, minoria: 0 };
    pts.sort(function (a, b) { return a.d - b.d; });
    // Errores si el sí queda a la izquierda del corte k: no's a la izquierda + sí's a la derecha.
    var best = { err: Infinity };
    var siIzq = 0, noIzq = 0;
    for (var k = 0; k <= pts.length; k++) {
      if (k > 0) { if (pts[k - 1].v === 1) siIzq++; else noIzq++; }
      var errA = noIzq + (nSi - siIzq);   // sí a la izquierda
      var errB = siIzq + (nNo - noIzq);   // sí a la derecha
      if (errA < best.err) best = { err: errA, k: k, siIzq: true };
      if (errB < best.err) best = { err: errB, k: k, siIzq: false };
    }
    var errores = [];
    pts.forEach(function (p, idx) {
      var izq = idx < best.k;
      var esperado = (izq === best.siIzq) ? 1 : 0;
      if (p.v !== esperado) errores.push(p.i);
    });
    return { errores: errores, apre: (minoria - best.err) / minoria, minoria: minoria };
  }

  function mismoBoletin(H, j) {
    var b = boletinDe(H.votes[j]);
    if (!b) return [];
    var r = [];
    H.votes.forEach(function (v, i) { if (boletinDe(v) === b) r.push(i); });
    return r.sort(function (a, c) { return (H.votes[a].fecha || '').localeCompare(H.votes[c].fecha || '') || a - c; });
  }

  window.C22LecturaVoto = {
    grupos: grupos, esSenado: esSenado, bloques: bloques, derrotas: derrotas,
    inesperados: inesperados, mismoBoletin: mismoBoletin, boletinDe: boletinDe
  };
})();
