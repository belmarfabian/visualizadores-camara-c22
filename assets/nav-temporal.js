/* ──────────────────────────────────────────────────────────────
   mountNavTemporal — navegador temporal compartido.
   Uso:
     const nav = mountNavTemporal({
       container: document.getElementById('miSlot'),
       items: [{ id, fecha: 'YYYY-MM-DD', label }],
       current: 'idActual',           // opcional
       onChange: (id) => { ... },     // callback al cambiar
       mode: 'interactive',           // o 'decorative'
       hint: 'texto opcional debajo',
     });
   API devuelta: { setCurrent(id), update({items, hint}) }
   ────────────────────────────────────────────────────────────── */
window.mountNavTemporal = function ({ container, items, current, onChange, mode, hint } = {}) {
  if (!container) throw new Error('mountNavTemporal: container requerido');
  mode = mode || 'interactive';
  items = (items || []).slice().sort((a, b) =>
    (b.fecha || '').localeCompare(a.fecha || '')
  );
  let state = { current: current ?? (items[0]?.id) };

  // Render inicial
  container.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'nav-temp';
  root.dataset.mode = mode;

  // Fila principal
  const row = document.createElement('div');
  row.className = 'nav-temp__row';
  const btnPrev = document.createElement('button');
  btnPrev.className = 'nav-temp__btn';
  btnPrev.type = 'button';
  btnPrev.setAttribute('aria-label', 'Anterior');
  btnPrev.innerHTML = '&#9664;';
  const select = document.createElement('select');
  select.className = 'nav-temp__select';
  // Rótulo estático para el modo decorativo (rango de fechas, no interactivo)
  const label = document.createElement('div');
  label.className = 'nav-temp__label';
  const btnNext = document.createElement('button');
  btnNext.className = 'nav-temp__btn';
  btnNext.type = 'button';
  btnNext.setAttribute('aria-label', 'Siguiente');
  btnNext.innerHTML = '&#9654;';
  if (mode === 'decorative') {
    // En modo decorativo NO es un selector: mostramos un rótulo de rango
    // estático en vez de un dropdown que parece interactivo y no responde.
    row.append(label);
  } else {
    row.append(btnPrev, select, btnNext);
  }
  root.appendChild(row);

  // Hint opcional
  const hintEl = document.createElement('div');
  hintEl.className = 'nav-temp__hint';
  root.appendChild(hintEl);

  // Barra temporal
  const bar = document.createElement('div');
  bar.className = 'nav-temp__bar';
  const track = document.createElement('div');
  track.className = 'nav-temp__track';
  bar.appendChild(track);
  const axis = document.createElement('div');
  axis.className = 'nav-temp__axis';
  bar.appendChild(axis);
  root.appendChild(bar);
  container.appendChild(root);

  // Helpers
  const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const MESES_LARGOS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function fmtCorta(s) {
    if (!s) return '';
    const [y, m, d] = s.split('-');
    return `${parseInt(d)} ${MESES[parseInt(m) - 1]} ${y}`;
  }

  // Construir
  function build() {
    // Dropdown
    select.innerHTML = items.map(it =>
      `<option value="${it.id}">${fmtCorta(it.fecha)} · ${it.label || ''}</option>`
    ).join('');
    if (state.current != null) select.value = state.current;

    // Ticks como circulos: agrupamos por dia y el tamaño depende del count
    if (items.length > 0) {
      const tMin = Date.parse(items[items.length - 1].fecha);
      const tMax = Date.parse(items[0].fecha);
      const span = Math.max(1, tMax - tMin);
      // Agrupar items por dia (fecha YYYY-MM-DD) para calcular densidad
      const dayKey = (iso) => (iso || '').slice(0, 10);
      const byDay = new Map();
      for (const it of items) {
        const k = dayKey(it.fecha);
        if (!byDay.has(k)) byDay.set(k, []);
        byDay.get(k).push(it);
      }
      // Histograma de frecuencia: una barra por semana (mejor que dots sueltos
      // para leer el ritmo de la actividad legislativa). Click en una barra
      // salta a la votacion mas reciente de esa semana.
      const WEEK = 7 * 86400000;
      const bucketOf = t => Math.floor((t - tMin) / WEEK);
      const nWeeks = bucketOf(tMax) + 1;
      const weeks = new Map();               // idx de semana -> { count, items[] }
      for (const it of items) {
        const bi = bucketOf(Date.parse(it.fecha));
        if (!weeks.has(bi)) weeks.set(bi, { count: 0, items: [] });
        const wk = weeks.get(bi); wk.count++; wk.items.push(it);
      }
      const maxCount = Math.max(1, ...[...weeks.values()].map(wk => wk.count));
      const curIt = items.find(x => x.id === state.current);
      const curWeek = curIt ? bucketOf(Date.parse(curIt.fecha)) : -1;
      const barW = 100 / nWeeks;
      let barsHtml = '';
      for (const [bi, wk] of weeks) {
        const left = bi * barW;
        const h = Math.max(10, (wk.count / maxCount) * 100);   // % de la altura del track
        const isCur = bi === curWeek && mode !== 'decorative';
        const col = isCur ? 'var(--dark)' : 'var(--text-2)';
        const wkStart = new Date(tMin + bi * WEEK);
        const tip = `Semana del ${wkStart.getDate()} ${MESES[wkStart.getMonth()]} · ${wk.count} votaci${wk.count === 1 ? 'ón' : 'ones'}`;
        barsHtml += `<span class="nav-temp__bar-item" data-id="${wk.items[0].id}" title="${tip}" style="left:${left}%;width:${Math.max(0.5, barW - 0.6)}%;height:${h}%;background:${col};opacity:${isCur ? 1 : 0.5}"></span>`;
      }
      track.innerHTML = barsHtml;

      // Eje mes-año: extremos + un mes intermedio si el rango es largo
      const fmtAxis = iso => {
        const [y, m] = iso.split('-');
        return `${MESES[parseInt(m) - 1]} ${y.slice(2)}`;
      };
      const isoMin = items[items.length - 1].fecha;
      const isoMax = items[0].fecha;
      const meses = [fmtAxis(isoMin)];
      // Mes intermedio si la distancia > 30 dias
      if (span > 30 * 86400000) {
        const mid = new Date(tMin + span / 2);
        meses.push(`${MESES[mid.getMonth()]} ${String(mid.getFullYear()).slice(2)}`);
      }
      meses.push(fmtAxis(isoMax));
      axis.innerHTML = meses.map(m => `<span>${m}</span>`).join('');

      // Rótulo de rango para el modo decorativo (no interactivo)
      if (mode === 'decorative') {
        label.textContent = `${fmtCorta(isoMin)} – ${fmtCorta(isoMax)}`;
      }
    }

    // Boton estado (items DESC: prev=mas antiguo va a idx+1; next=mas nuevo va a idx-1)
    const idx = items.findIndex(x => x.id === state.current);
    btnPrev.disabled = idx < 0 || idx >= items.length - 1;
    btnNext.disabled = idx <= 0;

    hintEl.textContent = hint || '';
    hintEl.style.display = (hint && hint.length) ? 'block' : 'none';
  }
  build();

  // Eventos
  function setCurrent(id, fire) {
    if (id == null) return;
    state.current = id;
    build();
    if (fire && typeof onChange === 'function') onChange(id);
  }
  select.addEventListener('change', e => setCurrent(e.target.value, true));
  // items esta ordenado por fecha DESC (mas reciente en index 0):
  // ◀ retrocede en el tiempo  = sumar al index
  // ▶ avanza en el tiempo     = restar al index
  btnPrev.addEventListener('click', () => {
    const idx = items.findIndex(x => x.id === state.current);
    if (idx >= 0 && idx < items.length - 1) setCurrent(items[idx + 1].id, true);
  });
  btnNext.addEventListener('click', () => {
    const idx = items.findIndex(x => x.id === state.current);
    if (idx > 0) setCurrent(items[idx - 1].id, true);
  });
  if (mode === 'interactive') {
    track.addEventListener('click', e => {
      const bar = e.target.closest('.nav-temp__bar-item');
      if (bar) {
        setCurrent(bar.dataset.id, true);
        return;
      }
      // Click en zona vacia: encontrar el tick mas cercano
      const rect = track.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (items.length === 0) return;
      const tMin = Date.parse(items[items.length - 1].fecha);
      const tMax = Date.parse(items[0].fecha);
      const span = Math.max(1, tMax - tMin);
      let best = items[0], bestDist = Infinity;
      for (const it of items) {
        const itPct = ((Date.parse(it.fecha) - tMin) / span) * 100;
        const d = Math.abs(itPct - pct);
        if (d < bestDist) { bestDist = d; best = it; }
      }
      setCurrent(best.id, true);
    });
  }

  return {
    setCurrent: (id) => setCurrent(id, false),
    update: ({ items: newItems, hint: newHint } = {}) => {
      if (newItems) items = newItems.slice().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
      if (typeof newHint === 'string') hint = newHint;
      build();
    },
  };
};
