 
(function () {
  'use strict';

  var S = { id: 'pagina', steps: [], i: 0, active: false, els: null };

  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }

  
  function ensureDom() {
    if (S.els) return S.els;
    var catch_ = el('div', 'c22-tour-catch');
    var spot = el('div', 'c22-tour-spot');
    var pop = el('div', 'c22-tour-pop');
    pop.innerHTML =
      '<button class="c22-tour-skip" type="button">Saltar ✕</button>' +
      '<div class="c22-tour-eyebrow"></div>' +
      '<h3 class="c22-tour-title"></h3>' +
      '<p class="c22-tour-text"></p>' +
      '<div class="c22-tour-foot">' +
        '<div class="c22-tour-dots"></div>' +
        '<div class="c22-tour-nav">' +
          '<button class="c22-tour-btn2 c22-tour-prev" type="button">Anterior</button>' +
          '<button class="c22-tour-btn2 c22-tour-next" type="button">Siguiente</button>' +
        '</div>' +
      '</div>';
    S.els = {
      catch: catch_, spot: spot, pop: pop,
      eyebrow: pop.querySelector('.c22-tour-eyebrow'),
      title: pop.querySelector('.c22-tour-title'),
      text: pop.querySelector('.c22-tour-text'),
      dots: pop.querySelector('.c22-tour-dots'),
      prev: pop.querySelector('.c22-tour-prev'),
      next: pop.querySelector('.c22-tour-next'),
      skip: pop.querySelector('.c22-tour-skip')
    };
    S.els.skip.addEventListener('click', end);
    S.els.prev.addEventListener('click', prev);
    S.els.next.addEventListener('click', next);
    return S.els;
  }

  function lsKey() { return 'c22tour:' + S.id; }

  function place(rect) {
    var e = S.els, pop = e.pop, spot = e.spot;
    var vw = window.innerWidth, vh = window.innerHeight;
    if (!rect) {                      
      spot.style.opacity = '0';
      spot.style.width = spot.style.height = '0';
      pop.style.left = Math.round((vw - pop.offsetWidth) / 2) + 'px';
      pop.style.top = Math.round((vh - pop.offsetHeight) / 2) + 'px';
      return;
    }
    var pad = 6;
    spot.style.opacity = '1';
    spot.style.top = (rect.top - pad) + 'px';
    spot.style.left = (rect.left - pad) + 'px';
    spot.style.width = (rect.width + pad * 2) + 'px';
    spot.style.height = (rect.height + pad * 2) + 'px';

    var pw = pop.offsetWidth, ph = pop.offsetHeight, gap = 16;
    var below = vh - rect.bottom, above = rect.top;
    var top, left;
    if (below > ph + gap || below > above) {        
      top = rect.bottom + gap;
    } else {                                         
      top = rect.top - ph - gap;
    }
    left = rect.left + rect.width / 2 - pw / 2;      
    left = Math.max(12, Math.min(left, vw - pw - 12));
    top = Math.max(12, Math.min(top, vh - ph - 12));
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
  }

  function reposition() {
    if (!S.active) return;
    var step = S.steps[S.i];
    var node = step && step.el ? document.querySelector(step.el) : null;
    place(node ? node.getBoundingClientRect() : null);
  }

  function render() {
    var e = ensureDom(), step = S.steps[S.i];
    e.eyebrow.textContent = 'Guía · paso ' + (S.i + 1) + ' de ' + S.steps.length;
    e.title.textContent = step.title || '';
    e.text.innerHTML = step.text || '';
    
    e.dots.innerHTML = '';
    for (var k = 0; k < S.steps.length; k++) {
      var d = el('span', 'c22-tour-dot' + (k === S.i ? ' on' : ''));
      e.dots.appendChild(d);
    }
    e.prev.style.visibility = S.i === 0 ? 'hidden' : 'visible';
    e.next.textContent = S.i === S.steps.length - 1 ? 'Entendido' : 'Siguiente';

    
    if (typeof step.before === 'function') { try { step.before(); } catch (err) {} }

    var node = step.el ? document.querySelector(step.el) : null;
    if (node) node.scrollIntoView({ block: 'center', inline: 'nearest' });
    
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var n = step.el ? document.querySelector(step.el) : null;
        place(n ? n.getBoundingClientRect() : null);
        e.pop.classList.add('is-in');
      });
    });
  }

  function goTo(i) {
    if (i < 0 || i >= S.steps.length) { return end(); }
    S.i = i;
    S.els.pop.classList.remove('is-in');
    render();
  }
  function next() { goTo(S.i + 1); }
  function prev() { goTo(S.i - 1); }

  function onKey(ev) {
    if (!S.active) return;
    if (ev.key === 'Escape') end();
    else if (ev.key === 'ArrowRight') next();
    else if (ev.key === 'ArrowLeft') prev();
  }

  function start() {
    if (!S.steps.length) return;
    var e = ensureDom();
    S.active = true; S.i = 0;
    document.body.appendChild(e.catch);
    document.body.appendChild(e.spot);
    document.body.appendChild(e.pop);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    document.addEventListener('keydown', onKey);
    render();
  }

  function end() {
    if (!S.els) return;
    S.active = false;
    var e = S.els;
    [e.catch, e.spot, e.pop].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
    document.removeEventListener('keydown', onKey);
    try { localStorage.setItem(lsKey(), '1'); } catch (err) {}
  }

  
  var API = {
    
    define: function (id, steps, opts) {
      S.id = id || 'pagina'; S.steps = steps || [];
      var delay = (opts && opts.delay) || 700;
      var seen = false;
      try { seen = localStorage.getItem(lsKey()) === '1'; } catch (err) {}
      if (!seen && opts && opts.auto) {
        window.addEventListener('load', function () { setTimeout(start, delay); });
      }
    },
    restart: function () { end(); start(); },   
    start: start, next: next, prev: prev, end: end,
    isActive: function () { return S.active; }
  };
  window.C22Tour = API;
})();
