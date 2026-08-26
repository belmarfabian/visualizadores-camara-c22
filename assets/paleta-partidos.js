/* ──────────────────────────────────────────────────────────────
   Paleta oficial de partidos — misma que se usa en los PDFs del
   W-NOMINATE en data/ranking_wnominate_*.pdf y en R_juan_*.
   Calibrada para distinguir los 18 partidos del periodo 2026-2030
   sin que se mezclen los azules de la derecha ni los rojos de la
   izquierda.

   API: window.PALETA_PARTIDOS_OFICIAL — mapa partido completo → hex
        window.aplicarPaletaOficial(deputies, key='partido') — override
   ────────────────────────────────────────────────────────────── */
window.PALETA_PARTIDOS_OFICIAL = {
  'Partido Comunista':                    '#8B0000', // rojo oscuro
  'Partido Socialista':                   '#E53935', // rojo brillante
  'Partido Por la Democracia':            '#FF9800', // naranja
  'Partido Radical de Chile':             '#795548', // marron
  'Frente Amplio':                        '#1B5E20', // verde oscuro
  'Federación Regionalista Verde Social': '#4CAF50', // verde
  'Partido Acción Humanista':             '#FFC107', // ambar
  'Partido Demócrata Cristiano':          '#03A9F4', // azul claro
  'Partido Demócratas Chile':             '#9C27B0', // purpura
  'Partido Liberal de Chile':             '#E91E63', // rosa
  'Partido de la Gente':                  '#D500F9', // magenta electrico (destacado)
  'Renovación Nacional':                  '#4FC3F7', // celeste
  'Evolución Política':                   '#26A69A', // verde agua (teal)
  'Unión Demócrata Independiente':        '#EF5350', // rojo salmon intenso
  'Partido Republicano':                  '#1565C0', // azul rey
  'Partido Nacional Libertario':          '#FFEB3B', // amarillo brillante
  'Partido Social Cristiano':             '#FF5722', // naranja rojizo
  'Independientes':                       '#9E9E9E', // gris medio
  'Independiente':                        '#9E9E9E', // alias
};

window.aplicarPaletaOficial = function (deputies, key) {
  const PAL = window.PALETA_PARTIDOS_OFICIAL;
  const k = key || 'partido';
  let n = 0;
  for (const d of deputies || []) {
    const c = PAL[d[k]];
    if (c) { d.color = c; n++; }
  }
  return n;
};
