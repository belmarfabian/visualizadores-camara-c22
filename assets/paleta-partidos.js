 
window.PALETA_PARTIDOS_OFICIAL = {
  'Partido Comunista':                    '#8B0000', 
  'Partido Socialista':                   '#E53935', 
  'Partido Por la Democracia':            '#FF9800', 
  'Partido Radical de Chile':             '#795548', 
  'Frente Amplio':                        '#1B5E20', 
  'Federación Regionalista Verde Social': '#4CAF50', 
  'Partido Acción Humanista':             '#FFC107', 
  'Partido Demócrata Cristiano':          '#03A9F4', 
  'Partido Demócratas Chile':             '#9C27B0', 
  'Partido Liberal de Chile':             '#E91E63', 
  'Partido de la Gente':                  '#D500F9', 
  'Renovación Nacional':                  '#4FC3F7', 
  'Evolución Política':                   '#26A69A', 
  'Unión Demócrata Independiente':        '#EF5350', 
  'Partido Republicano':                  '#1565C0', 
  'Partido Nacional Libertario':          '#FFEB3B', 
  'Partido Social Cristiano':             '#FF5722', 
  'Independientes':                       '#9E9E9E', 
  'Independiente':                        '#9E9E9E', 
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
