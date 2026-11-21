/* Hunt Global — "Horizon" (ova-investment.com structure). No WebGL. Lag-free rules:
   geometry is measured on load/resize only; each scroll frame works from scrollY; only transform/opacity change;
   the band drifts only on desktop and only while the tab is visible. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const html = document.documentElement, body = document.body;

  let lenis = null;
  if (!RM && FINE && window.Lenis) { try { lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true }); } catch (e) { lenis = null; } }
  window.hgLenis = lenis; // lets test scripts jump instantly
  const goTo = y => lenis ? lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });

  /* menu + anchors */
  const mbtn = $('[data-menu]'), mnu = $('#menu'), mlabel = $('[data-menulabel]');
  const setMenu = o => { body.classList.toggle('menu-open', o); mbtn.setAttribute('aria-expanded', o); mnu.setAttribute('aria-hidden', !o); mlabel.textContent = o ? 'Close' : 'Menu'; if (lenis) o ? lenis.stop() : lenis.start(); else body.style.overflow = o ? 'hidden' : ''; };
  mbtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1), t = id ? document.getElementById(id) : null;
    if (!t) return; e.preventDefault(); setMenu(false);
    // land where the section's content is fully in, not at its very first pixel
    goTo(t.getBoundingClientRect().top + scrollY + (id === 'main' ? 0 : innerHeight * 0.05));
  }));

  /* intro: once per session */
  const intro = $('[data-intro]'), band = $('[data-band]');
  let seen = false; try { seen = sessionStorage.getItem('hgo-intro') === '1'; } catch (e) {}
  const showBand = () => band.classList.add('on');
  if (!intro) showBand();
  else if (RM || seen) { body.classList.add('no-intro'); showBand(); }
  else { lenis && lenis.stop(); setTimeout(() => { intro.classList.add('gone'); lenis && lenis.start(); showBand(); try { sessionStorage.setItem('hgo-intro', '1'); } catch (e) {} }, 1800); }

  /* ---------- text that always fits its zone (never cut, never under the band) ---------- */
  function fitAll() {
    $$('[data-fit]').forEach(el => {
      const par = el.parentElement, max = +el.dataset.max, min = +el.dataset.min;
      let A = par.clientHeight;
      for (const s of par.children) { if (s === el) continue; const cs = getComputedStyle(s); if (cs.position === 'absolute' || cs.display === 'none') continue; A -= s.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom) + (parseFloat(getComputedStyle(par).rowGap) || 0); }
      A *= 0.94; // slack for phones whose screen height changes while the address bar hides
      const W = par.clientWidth;
      let lo = min, hi = max, best = min;
      for (let k = 0; k < 11; k++) {
        const mid = (lo + hi) / 2; el.style.fontSize = mid + 'px';
        const wide = el.scrollWidth > el.clientWidth + 1 || [...el.querySelectorAll(".man__t")].some(n => { const k = n.children; return k[k.length - 1].getBoundingClientRect().right - k[0].getBoundingClientRect().left > n.clientWidth - 8; });
        if (el.offsetHeight <= A && !wide && el.offsetWidth <= W + 1) { best = mid; lo = mid; } else hi = mid;
      }
      el.style.fontSize = best.toFixed(1) + 'px';
    });
  }

  /* ---------- sections ---------- */
  const S = {}; $$('.s').forEach(s => { const k = s.className.match(/s--(\w+)/)[1]; S[k] = { el: s, t: 0, h: 1, stage: $('.stage', s), live: null }; });
  const prog = k => { const s = S[k]; return clamp((scrollY - s.t) / Math.max(1, s.h - vh)); };
  const inSec = (k, y) => y >= S[k].t - vh * 0.5 && y < S[k].t + S[k].h - vh * 0.5;
  let vw = innerWidth, vh = innerHeight;

  /* backgrounds */
  const bgs = $('[data-bgs]'), L = { hero: $('.bg--hero', bgs), pf: $$('.bg--pf', bgs), man: $('.bg--man', bgs), dome: $('.bg--dome', bgs), night: $('.bg--night', bgs) };
  const domeEl = $('.dome', bgs);
  let bgKey = '';
  const setBg = key => { if (key === bgKey) return; bgKey = key; L.hero.classList.toggle('on', key === 'hero'); L.pf.forEach((b, i) => b.classList.toggle('on', key === 'pf' + i)); L.man.classList.toggle('on', key === 'man'); L.dome.classList.toggle('on', key === 'dome'); L.night.classList.toggle('on', key === 'night'); };

  /* hero word column */
  const colIn = $('[data-col] .col__in'), colW = colIn ? $$('.w', colIn) : []; let colN = -1, lineH = 26;
  const heroT = $('.hero__t'), hint = $('.hint');
  /* portfolio */
  const pf = { intros: $$('.pf__intro'), metas: $$('.pf__meta'), nav: $$('.pf__nav button'), cur: -1, lit: -1 };
  pf.words = pf.intros.map(p => $$('.w', p));
  pf.nav.forEach((b, i) => b.addEventListener('click', () => goTo(S.pf.t + (S.pf.h - vh) * (i + 0.45) / pf.intros.length)));
  /* manifesto */
  const man = { t: $$('.man__t'), c: $$('.man__c'), cur: -1 };
  /* heart */
  const ab = { p: $$('.ab__p'), cur: -1, lit: -1 }; ab.words = ab.p.map(p => $$('.w', p));
  /* header section pill */
  const secName = $('[data-secname]'); let secCur = null;

  /* ---------- the band ---------- */
  const cards = $$('.card', band); let R = 900, D = 280, SP = 14, TOTAL = 200, LIM = 50, cw = 240;
  function sizeBand() {
    cw = cards[0].offsetWidth || 240;
    // a wide, flat cylinder: across the screen the cards only change size a little (like OVA's gentle arc)
    R = Math.max(vw * 0.95, cw * 3.2); D = R * 0.21;
    SP = (cw * 1.1 / R) * 180 / Math.PI; TOTAL = SP * cards.length;
    LIM = Math.min(TOTAL / 2 - SP / 2, Math.asin(clamp((vw / 2 + cw) / R, 0, 1)) * 180 / Math.PI + 2);
    cards.forEach(c => { c._v = null; c._k = null; });
  }
  let drift = 0;
  const track = $('[data-track]', band);
  // The whole cylinder turns with ONE transform per frame. A card only gets a new transform when it wraps
  // round to the other end of the ring, and only flips visibility when it crosses the (off-screen) edge.
  function placeBand(y) {
    const off = (y / Math.max(1, vh)) * 13 + drift;
    track.style.transform = `translate3d(0,0,${(R - D).toFixed(0)}px) rotateY(${off.toFixed(3)}deg)`;
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const k = Math.floor((off - i * SP + TOTAL / 2) / TOTAL);           // which lap of the ring this card is on
      const th = i * SP + k * TOTAL, a = th - off, vis = Math.abs(a) <= LIM;
      if (c._k !== k || c._R !== R) { c.style.transform = `rotateY(${(-th).toFixed(3)}deg) translate3d(0,0,${(-R).toFixed(0)}px)`; c._k = k; c._R = R; }
      if (vis !== c._v) { c.style.visibility = vis ? 'visible' : 'hidden'; c._v = vis; }
    }
  }

  /* ---------- stars ---------- */
  function drawStars() {
    const cv = $('[data-stars]'); if (!cv) return;
    const d = Math.min(1.5, devicePixelRatio || 1), w = cv.offsetWidth, h = cv.offsetHeight; if (!w || !h) return;
    cv.width = w * d; cv.height = h * d; const g = cv.getContext('2d'); g.scale(d, d);
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0, n = Math.round(w * h / 2400); i < n; i++) { const x = rnd() * w, yy = Math.pow(rnd(), 1.3) * h; g.globalAlpha = (1 - yy / h) * (0.25 + rnd() * 0.75); g.fillStyle = rnd() > 0.93 ? '#cfe0ff' : '#fff'; g.beginPath(); g.arc(x, yy, rnd() * 0.9 + 0.2, 0, 6.283); g.fill(); }
  }

  /* ---------- one scroll frame ---------- */
  function onScroll(y) {
    placeBand(y);
    for (const k in S) { const s = S[k], live = y >= s.t - 2 && y <= s.t + s.h - vh + 2; if (live !== s.live) { s.live = live; s.stage.classList.toggle("live", live); } }
    // which section are we in
    let key = 'hero', sec = '';
    if (inSec('pf', y)) { key = 'pf'; sec = 'Portfolio'; } else if (inSec('man', y)) { key = 'man'; sec = 'How we operate'; } else if (inSec('heart', y)) { key = 'heart'; sec = 'The Heart'; } else if (y >= S.contact.t - vh * 0.5) { key = 'contact'; sec = 'Contact'; }
    if (sec !== secCur) { secCur = sec; secName.textContent = sec; body.classList.toggle('has-sec', !!sec); }

    // hero
    const hp = prog('hero');
    if (key === 'hero') setBg(hp > 0.88 ? 'none' : 'hero');
    if (y < S.hero.t + S.hero.h) {
      const n = Math.round(clamp((hp - 0.04) / 0.72) * colW.length);
      if (n !== colN) { colW.forEach((w, i) => w.classList.toggle('on', i < n)); colN = n; colIn.style.setProperty('--colY', (-Math.max(0, n - 3) * lineH).toFixed(0) + 'px'); }
      const o = (1 - clamp((hp - 0.84) / 0.1)).toFixed(3); heroT.style.opacity = o; colIn.parentNode.style.opacity = o;
      hint.style.opacity = (1 - clamp(hp * 10)).toFixed(2);
    }
    // portfolio
    if (key === 'pf') {
      const n = pf.intros.length, p = prog('pf') * n * 0.9999, i = Math.min(n - 1, Math.floor(p)), local = p - i;
      setBg('pf' + i);
      if (i !== pf.cur) { [pf.intros, pf.metas, pf.nav].forEach(l => l.forEach((el, j) => el.classList.toggle('on', j === i))); pf.cur = i; pf.lit = -1; }
      const ws = pf.words[i], lit = Math.round(clamp((local - 0.04) / 0.6) * ws.length);
      if (lit !== pf.lit) { ws.forEach((w, j) => w.classList.toggle('on', j < lit)); pf.lit = lit; }
    }
    // manifesto
    if (key === 'man') {
      setBg('man');
      const n = man.t.length, i = Math.min(n - 1, Math.floor(prog('man') * n * 0.9999));
      if (i !== man.cur) { man.t.forEach((t, j) => { t.classList.toggle('on', j === i); t.classList.toggle('past', j < i); }); man.c.forEach((c, j) => c.classList.toggle('on', j === i)); man.cur = i; }
    }
    // the heart: the dome rises, then the night
    if (key === 'heart') {
      const p = prog('heart');
      setBg(p < 0.62 ? 'dome' : 'night');
      domeEl.style.transform = `translate3d(0,${(-clamp(p / 0.5) * vh * 0.62).toFixed(0)}px,0)`;
      const n = ab.p.length, sp = clamp((p - 0.08) / 0.9) * n * 0.9999, i = Math.min(n - 1, Math.floor(sp)), local = sp - i;
      if (i !== ab.cur) { ab.p.forEach((el, j) => el.classList.toggle('on', j === i)); ab.cur = i; ab.lit = -1; }
      const ws = ab.words[i], lit = Math.round(clamp(local / 0.7) * ws.length);
      if (lit !== ab.lit) { ws.forEach((w, j) => w.classList.toggle('on', j < lit)); ab.lit = lit; }
    }
    if (key === 'contact') setBg('night');
  }

  let lastY = -1, lastT = performance.now(), hidden = false;
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
  function frame(now) {
    const dt = Math.min(64, now - lastT); lastT = now;
    lenis && lenis.raf(now);
    const y = scrollY;
    if (FINE && !RM && !hidden) { drift += dt * 0.0016; placeBand(y); }   // slow drift on desktop only
    if (y !== lastY) { lastY = y; onScroll(y); }
    requestAnimationFrame(frame);
  }

  function measure() {
    vw = innerWidth; vh = innerHeight;
    Object.values(S).forEach(s => { s.t = s.el.getBoundingClientRect().top + scrollY; s.h = s.el.offsetHeight; });
    fitAll(); sizeBand(); drawStars();
    lineH = colW[0] ? colW[0].offsetHeight : 26; colN = -1; lastY = -1;
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(measure);
  measure();
  let lastW = vw;
  addEventListener('resize', () => { clearTimeout(measure._t); measure._t = setTimeout(() => { if (innerWidth !== lastW || Math.abs(innerHeight - vh) > 120) { lastW = innerWidth; measure(); } else { vh = innerHeight; lastY = -1; } }, 150); });
  addEventListener('load', measure);
  requestAnimationFrame(frame);
})();
