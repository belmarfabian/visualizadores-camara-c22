/* ──────────────────────────────────────────────────────────────────────────
   Piel C22. Sustituye la cabecera y el pie propios del Monitor por una
   replica de los de c22cepchile.cl, de modo que el visitante que llega desde
   el sitio del C22 no perciba un cambio de pagina.

   El menu del C22 vive en MENU_C22: si el sitio cambia una entrada, se toca
   aqui y las cinco paginas del Monitor quedan al dia.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  var SITIO = 'https://c22cepchile.cl';

  var MENU_C22 = [
    { txt: 'Sobre C22',              url: SITIO + '/sobre-c22/' },
    { txt: 'Personas',               url: SITIO + '/personas/' },
    { txt: 'Análisis Online',        url: SITIO + '/analisis-online/' },
    { txt: 'Notas de investigación', url: SITIO + '/categorias_publicaciones/notas-de-investigacion/' },
    { txt: 'Publicaciones',          url: SITIO + '/publicaciones/' },
    { txt: 'Eventos y Noticias',     url: SITIO + '/eventos-y-noticias/' }
  ];

  // Secciones del propio Monitor. 'ruta' es relativa a la raiz de docs/.
  var MENU_MONITOR = [
    { txt: 'Portada',      ruta: '' },
    { txt: 'Hemiciclo',    ruta: 'hemiciclo/' },
    { txt: 'Votaciones',   ruta: 'votaciones/' },
    { txt: 'Discurso',     ruta: 'discurso/' },
    { txt: 'Legisladores', ruta: 'legisladores/' }
  ];

  // La raiz de docs/ y la carpeta de assets se deducen de la ruta de este
  // script, para que funcione igual en la portada y en los visualizadores.
  var miSrc = (document.currentScript && document.currentScript.src) || '';
  var ASSETS = miSrc.replace(/[^/]*$/, '');
  var RAIZ = ASSETS.replace(/assets\/$/, '');

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  }
  function enlace(url, texto, clase) {
    var a = el('a', clase, texto);
    a.href = url;
    return a;
  }

  // Que seccion del Monitor es esta, para marcarla como actual.
  function seccionActual() {
    var p = location.pathname.replace(/index\.html$/, '');
    for (var i = MENU_MONITOR.length - 1; i >= 0; i--) {
      var r = MENU_MONITOR[i].ruta;
      if (r && p.indexOf('/' + r) !== -1) return MENU_MONITOR[i].txt;
    }
    return 'Portada';
  }

  function cabecera() {
    var h = el('header', 'c22skin-head');

    var logo = enlace(SITIO, null, 'c22skin-logo');
    var img = el('img'); img.src = ASSETS + 'logo-color.svg'; img.alt = 'C22';
    logo.appendChild(img);
    h.appendChild(logo);

    var nav = el('nav', 'c22skin-nav');
    nav.setAttribute('aria-label', 'Secciones de C22');
    MENU_C22.forEach(function (m) { nav.appendChild(enlace(m.url, m.txt)); });
    var aqui = enlace(RAIZ, 'Monitor', 'c22skin-aqui');
    aqui.setAttribute('aria-current', 'page');
    nav.appendChild(aqui);
    h.appendChild(nav);

    h.appendChild(enlace(SITIO + '/contacto/', 'Contacto', 'c22skin-contacto'));

    // El buscador del C22 es una pildora que lleva a la busqueda del sitio.
    var buscar = enlace(SITIO + '/?s=', 'Buscar', 'c22skin-buscar');
    buscar.setAttribute('aria-label', 'Buscar en el sitio de C22');
    h.appendChild(buscar);

    var cep = enlace('https://www.cepchile.cl', null, 'c22skin-cep');
    cep.target = '_blank'; cep.rel = 'noopener';
    var icep = el('img'); icep.src = ASSETS + 'logo-cep-color.svg'; icep.alt = 'Centro de Estudios Públicos';
    cep.appendChild(icep);
    h.appendChild(cep);
    return h;
  }

  function subBarra() {
    var s = el('nav', 'c22skin-sub');
    s.setAttribute('aria-label', 'Secciones del Monitor Legislativo');
    s.appendChild(el('span', 'c22skin-rotulo', 'Monitor Legislativo'));
    var actual = seccionActual();
    MENU_MONITOR.forEach(function (m) {
      var a = enlace(RAIZ + m.ruta, m.txt, m.txt === actual ? 'c22skin-aqui' : null);
      if (m.txt === actual) a.setAttribute('aria-current', 'page');
      s.appendChild(a);
    });
    return s;
  }

  function columna(titulo, items) {
    var d = el('div');
    d.appendChild(el('h4', null, titulo));
    var ul = el('ul');
    items.forEach(function (it) {
      var li = el('li');
      if (it.url) { li.appendChild(enlace(it.url, it.txt)); }
      else { li.textContent = it.txt; }
      ul.appendChild(li);
    });
    d.appendChild(ul);
    return d;
  }

  function pie() {
    var f = el('footer', 'c22skin-foot');
    var g = el('div', 'c22skin-grid');

    var marcas = el('div', 'c22skin-marcas');
    var i1 = el('img'); i1.className = 'c22'; i1.src = ASSETS + 'logo-blanco.svg'; i1.alt = 'C22';
    var i2 = el('img'); i2.className = 'cep'; i2.src = ASSETS + 'logo-cep-blanco.svg'; i2.alt = 'Centro de Estudios Públicos';
    marcas.appendChild(i1); marcas.appendChild(i2);
    g.appendChild(marcas);

    var menu = columna('C22', MENU_C22.map(function (m) { return { txt: m.txt, url: m.url }; })
      .concat([{ txt: 'Contacto', url: SITIO + '/contacto/' }]));
    menu.className = 'c22skin-menu';
    g.appendChild(menu);

    var donde = el('div');
    donde.appendChild(el('h4', null, 'Encuéntranos'));
    var dir = el('div', 'c22skin-dir');
    dir.innerHTML = 'Centro de Estudios Públicos,<br>Monseñor Sótero Sanz 162, Providencia,<br>Santiago de Chile. 7500011<br><br>+56 22 328 2400<br>';
    dir.appendChild(enlace('mailto:c22@cepchile.cl', 'c22@cepchile.cl'));
    donde.appendChild(dir);
    var sig = el('h4', null, 'Síguenos');
    sig.style.marginTop = '26px';
    donde.appendChild(sig);
    var redes = el('div', 'c22skin-redes');
    [['X / Twitter', 'https://twitter.com/cepchile'],
     ['Instagram', 'https://www.instagram.com/cepchile'],
     ['LinkedIn', 'https://www.linkedin.com/company/centro-de-estudios-p%C3%BAblicos'],
     ['YouTube', 'https://www.youtube.com/channel/UCBNm3ldq_kNdQexDGJDWOeQ']
    ].forEach(function (r) {
      var a = enlace(r[1], r[0]);
      a.target = '_blank'; a.rel = 'noopener';
      redes.appendChild(a);
    });
    donde.appendChild(redes);
    g.appendChild(donde);

    var asociados = columna('Sitios asociados', [
      { txt: 'Centro de Estudios Públicos', url: 'https://www.cepchile.cl' },
      { txt: 'Revista Estudios Públicos', url: 'https://estudiospublicos.cl/index.php/cep/index' },
      { txt: 'Monitor Constitucional', url: SITIO }
    ]);
    asociados.className = 'c22skin-menu';
    g.appendChild(asociados);

    f.appendChild(g);

    var legal = el('div', 'c22skin-legal');
    legal.appendChild(el('span', null, 'Monitor Legislativo · C22 — Centro de Estudios Públicos'));
    legal.appendChild(el('span', null, 'Datos de la API de datos abiertos del Congreso Nacional'));
    f.appendChild(legal);
    return f;
  }

  function aplicar() {
    var cuerpo = document.body;
    if (!cuerpo || document.querySelector('.c22skin-head')) return;

    // Retira las piezas propias del Monitor: cinta, barra de marca y pie.
    var hijos = Array.prototype.slice.call(cuerpo.children).filter(function (e) {
      return !/^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT)$/.test(e.tagName);
    });
    hijos.slice(0, 4).forEach(function (e) {
      var cinta = !!e.querySelector('img[src*="ribbon.svg"]');
      var barra = !!e.querySelector('img[src*="logo-color.svg"], img[src*="logo-cep-color.svg"]');
      if (cinta || barra) e.classList.add('c22skin-fuera');
    });
    var pies = document.querySelectorAll('footer');
    if (pies.length) {
      var p = pies[pies.length - 1];
      p.classList.add('c22skin-fuera');
      var previo = p.previousElementSibling;
      if (previo && previo.querySelector && previo.querySelector('img[src*="ribbon.svg"]')) {
        previo.classList.add('c22skin-fuera');
      }
    }

    document.documentElement.classList.add('c22-skin');
    cuerpo.insertBefore(subBarra(), cuerpo.firstChild);
    cuerpo.insertBefore(cabecera(), cuerpo.firstChild);
    cuerpo.appendChild(pie());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicar);
  } else { aplicar(); }
})();
