// Hunt Global — Sample 18 "Horizon" — a faithful rebuild of ova-investment.com's structure, pacing and motion
// (one long page: horizon-sky hero with a fixed curved band of photo cards that turns through the whole site,
// a word column under the band, full-screen portfolio chapters, a letter-by-letter manifesto word, a rising dome,
// a night sky and a contact close) carrying Hunt Global's own copy (huntglobal.co, verbatim), real imagery and brand
// (black/white, Hanken Grotesk, JetBrains Mono labels, blue #5B9BFF as the horizon). No numbering anywhere.
// Run: node build.mjs  → index.html, 404.html
import { writeFileSync } from 'node:fs';

const V = 12;
const MAIL = 'hello@huntglobal.co';
const amp = s => String(s).replace(/&(?!amp;|#|[a-z]+;)/g, '&amp;');
const AR = '<i class="ar" aria-hidden="true">↗</i>';

/* ---------- huntglobal.co copy (verbatim) ---------- */
const COMPANIES = [
  { id: 'biltflow', name: 'Biltflow', cat: 'Construction Intelligence', site: 'https://biltflow.com/', head: 'The AI operating system for construction.',
    desc: 'The AI operating system for construction — BiltFlow OS™ connects every team, document, estimate, and supplier into one intelligent agentic workflow, from site discovery to project closeout.' },
  { id: 'replaice', name: 'Replaice Technologies', cat: 'Technology and Engineering', site: 'https://replaice.ai/', head: 'Autonomous AI agents for enterprise growth.',
    desc: 'Autonomous AI Agents for enterprise growth — agentic CRM/ERP/HRMS/DMS systems, enterprise RAG (eRAG), AI Agent Workspace, LLM gateway.' },
  { id: 'huntjobs', name: 'HuntJobs', cat: 'AI · Talent Marketplace', site: 'https://huntjobs.ai/', head: 'AI-powered talent matching at scale.',
    desc: 'Your next opportunity, delivered in a heartbeat. An AI-powered jobs marketplace matching professionals with employers globally. Mobile apps available on the App Store and Google Play; used by candidates hired at major global companies.' },
  { id: 'northstar', name: 'Northstar Humanoids and Robotics', short: 'Northstar', cat: 'Humanoids · Robotics', site: null, head: 'Humanoids for industry.',
    desc: 'Humanoids for industry. Northstar builds humanoid robotics and operational intelligence for industrial environments, operating from Singapore, Bangalore and San Francisco — orchestrated and governed from Singapore.' },
  { id: 'tribe', name: 'Tribe', cat: 'Property and Lifestyle Technology', site: 'https://tribeapp.com.au/', head: 'The intelligent operating system for rental living.',
    desc: 'The AI-powered operating and lifestyle platform for modern rental communities - connecting leasing, residents, property teams and neighbourhood services through one intelligent experience.' }
];
const PRINCIPLES = [
  ['Permanent Capital', "We invest our own capital, ensuring complete alignment with our ventures. We don't dabble. We dominate."],
  ['Operational Depth', 'Our 120+ team works inside every venture. We build from within, we do not advise from the sidelines — forming companies, developing commercial models and scaling operating infrastructure.'],
  ['IP at the Core', 'With 39+ patents filed across our portfolio, we develop proprietary, patent-protected technology designed to compound into long-term structural advantage.'],
  ['Global by Design', 'We grow our core regions through autonomous products and partner with enterprises building their own AI — consistently governed from our Singapore headquarters.']
];
const WHO = "Singapore's Global Technology Holding Group. We build the companies that define industries. We invest our own capital, operate from within, and hold proprietary IP designed to compound.";
const HEART = [
  'Orchestrated from Singapore. Scaling globally across APAC, MENA, UK/Europe and North America.',
  'Our portfolio operates synchronously through a unified agentic framework. We partner with large enterprises across our key regions to build and deploy autonomous AI solutions, optimizing infrastructure and driving regional growth, all governed from our central HQ.',
  'Our presence across APAC, MENA, UK/Europe, and North America enables deep integration with regional enterprises.'
];
const SECS = [['portfolio', 'Portfolio'], ['operate', 'How we operate'], ['heart', 'The Heart'], ['contact', 'Contact']];

const MARK = `<svg viewBox="0 0 520 490" aria-hidden="true"><g transform="translate(0,490) scale(0.1,-0.1)"><path d="M2175 4409 c-16 -12 -115 -74 -220 -138 l-190 -118 -3 -1032 -2 -1031 -238 -1 c-130 -1 -304 -3 -387 -5 -82 -1 -162 0 -177 3 l-28 5 0 759 c0 418 -2 759 -4 759 -2 0 -62 -37 -133 -82 -71 -46 -165 -105 -211 -133 l-82 -50 0 -1321 0 -1321 217 -134 c119 -74 221 -135 225 -137 4 -2 9 302 10 675 l3 678 403 3 402 2 0 -347 c0 -192 3 -594 7 -895 l6 -548 217 0 217 0 6 422 c10 581 9 4008 0 4007 -5 0 -21 -9 -38 -20z"/><path d="M2612 2081 c1 -5 75 -72 162 -150 l159 -141 261 -2 c144 -1 329 -3 411 -3 83 -1 151 -4 153 -8 1 -4 2 -157 2 -339 l-1 -333 -237 -139 c-493 -290 -1207 -720 -1214 -730 -4 -6 -8 -62 -8 -123 l0 -113 264 0 264 0 358 218 c198 120 445 271 549 336 105 65 237 148 295 183 58 35 108 67 112 71 4 4 8 293 9 642 l2 635 -772 3 c-446 1 -771 -2 -769 -7z"/><path class="mk-acc" d="M2584 4256 c-55 -37 -64 -55 -64 -127 0 -53 21 -85 75 -119 30 -18 44 -21 88 -15 28 4 63 13 77 20 30 16 61 51 53 59 -30 30 243 -39 392 -99 702 -281 1214 -882 1374 -1610 58 -264 67 -638 22 -890 -104 -583 -417 -1089 -897 -1452 -16 -12 -24 -22 -18 -22 18 -1 154 106 261 205 382 354 627 834 699 1364 30 224 14 559 -37 800 -122 567 -497 1106 -1004 1444 -184 122 -411 226 -627 286 -134 37 -167 48 -152 49 14 1 2 64 -16 86 -15 19 -113 55 -148 55 -15 0 -50 -15 -78 -34z"/></g></svg>`;

const words = (t, cls = 'w') => t.split(/\s+/).map(w => `<span class="${cls}">${amp(w)}</span>`).join(' ');
const sky = cls => `<div class="sky ${cls}"><i class="sky__glow"></i><i class="sky__line"></i></div>`;
const pic = (k, alt = '') => `<picture><source media="(max-width:760px)" srcset="/assets/bg/${k}-m.webp?v=${V}"><img src="/assets/bg/${k}.webp?v=${V}" alt="${alt}" loading="lazy" decoding="async"></picture>`;

const head = (title, desc) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0B0D12">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%230B0D12'/%3E%3Crect x='12' y='12' width='16' height='16' fill='%235B9BFF' transform='rotate(45 20 20)'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/styles.css?v=${V}">
</head>`;

const band = Array.from({ length: 16 }, (_, i) => `<div class="card"><img src="/assets/band/b${String(i).padStart(2, '0')}.webp?v=${V}" alt="" decoding="async"></div>`).join('');

const index = `${head('Hunt Global — Building companies for an autonomous world', "Singapore's Global Technology Holding Group. Capital, technology and operating capability under one house — building companies for an autonomous world.")}
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="intro" data-intro aria-hidden="true">${sky('sky--intro')}<span class="intro__mark">${MARK}</span></div>

<header class="ui">
  <div class="ui__l"><a class="pill" href="#contact">Contact ${AR}</a><a class="pill pill--opt" href="#heart">About us <i class="ar" aria-hidden="true">↓</i></a></div>
  <span class="ui__c mono">Hunt Global · Singapore</span>
  <div class="ui__r">
    <span class="pill pill--sec" data-secname aria-hidden="true"></span>
    <button class="ui__menu" data-menu aria-expanded="false" aria-controls="menu"><span class="mono" data-menulabel>Menu</span><i aria-hidden="true"></i><span class="ui__logo">${MARK}<b>hunt global</b></span></button>
  </div>
</header>
<nav class="mnu" id="menu" aria-hidden="true" aria-label="Menu">
  ${sky('sky--menu')}
  <div class="mnu__in">${SECS.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</div>
  <div class="mnu__foot mono"><a href="mailto:${MAIL}">${MAIL}</a><span>Level 8, 2 Venture Drive, Singapore 608526</span></div>
</nav>

<!-- fixed layers: backgrounds (z0) → the band of cards (z1) → the page text (z2) -->
<div class="bgs" data-bgs aria-hidden="true">
  ${sky('sky--hero bg bg--hero')}
  ${COMPANIES.map(c => `<div class="bg bg--pf" data-pf="${c.id}">${pic(c.id)}<i class="shade"></i></div>`).join('')}
  <div class="bg bg--man">${pic('manifesto')}<i class="shade"></i></div>
  <div class="bg bg--dome"><i class="dome"></i></div>
  <div class="bg bg--night">${sky('sky--dusk')}<canvas class="stars" data-stars></canvas></div>
</div>
<div class="band" data-band aria-hidden="true"><div class="band__ring"><div class="band__track" data-track>${band}</div></div></div>

<main id="main">
<section class="s s--hero" data-sec="" aria-label="Hunt Global">
  <div class="stage">
    <div class="zone zone--top zone--c"><h1 class="h1 hero__t" data-fit data-max="96" data-min="30"><span class="ln"><span>Building companies</span></span><span class="ln"><span>for an autonomous world.</span></span></h1></div>
    <div class="zone zone--bot zone--c"><div class="col" data-col><p class="col__in">${words(WHO)}</p></div></div>
    <span class="hint mono" aria-hidden="true">Scroll</span>
  </div>
</section>

<section class="s s--pf" id="portfolio" data-sec="Portfolio" style="--n:${COMPANIES.length}" aria-label="Operating Companies">
  <div class="stage">
    <div class="zone zone--top">${COMPANIES.map((c, i) => `<p class="pf__intro${i ? '' : ' on'}" data-fit data-max="46" data-min="16">${words(c.desc)}</p>`).join('')}</div>
    <div class="zone zone--bot pf__bot">
      <div class="pf__metas">${COMPANIES.map((c, i) => `<div class="pf__meta${i ? '' : ' on'}"><h3 class="mono-b">${amp(c.name)}</h3><p>${amp(c.cat)}</p>${c.site ? `<a class="pill pill--ghost" href="${c.site}" target="_blank" rel="noopener">Visit website ${AR}</a>` : ''}</div>`).join('')}</div>
      <nav class="pf__nav" aria-label="Operating companies">${COMPANIES.map((c, i) => `<button type="button"${i ? '' : ' class="on"'}>${amp(c.short || c.name)}</button>`).join('')}</nav>
    </div>
  </div>
  <div class="sr-only">${COMPANIES.map(c => `<h3>${amp(c.name)}</h3><p>${amp(c.cat)}. ${amp(c.desc)}</p>`).join('')}</div>
</section>

<section class="s s--man" id="operate" data-sec="How we operate" aria-label="How we operate">
  <div class="stage">
    <div class="zone zone--top zone--c">
      <div class="man__head"><small class="mono">How we operate</small>
        <div class="man__rot" data-fit data-max="104" data-min="28">${PRINCIPLES.map(([t], i) => `<h2 class="man__t${i ? '' : ' on'}">${[...t].map((ch, j) => ch === ' ' ? '<span class="sp"> </span>' : `<span class="ch" style="--j:${j}">${amp(ch)}</span>`).join('')}</h2>`).join('')}</div>
      </div>
    </div>
    <div class="zone zone--bot man__bot">
      <div class="man__sig"><b>Hunt Global</b><span>Singapore HQ</span></div>
      <div class="man__cs">${PRINCIPLES.map(([, p], i) => `<p class="man__c${i ? "" : " on"}" data-fit data-max="17" data-min="12">${amp(p)}</p>`).join('')}</div>
    </div>
  </div>
  <ol class="sr-only">${PRINCIPLES.map(([t, p]) => `<li>${t}: ${amp(p)}</li>`).join('')}</ol>
</section>

<section class="s s--heart" id="heart" data-sec="The Heart" aria-label="The Heart">
  <div class="stage">
    <div class="zone zone--top zone--c"><div class="ab__head"><small class="mono">Operations</small><h2 class="h1" data-fit data-max="96" data-min="30">The Heart.</h2></div></div>
    <div class="zone zone--bot zone--c"><div class="ab__ps">${HEART.map((p, i) => `<p class="ab__p${i ? '' : ' on'}" data-fit data-max="22" data-min="14">${words(p)}</p>`).join('')}</div></div>
  </div>
</section>

<section class="s s--contact" id="contact" data-sec="Contact" aria-label="Contact">
  <div class="stage">
    <div class="zone zone--top zone--c"><h2 class="h1 ct__t" data-fit data-max="96" data-min="30"><span class="ln"><span>Let’s build</span></span><span class="ln"><span>what comes next.</span></span></h2></div>
    <div class="zone zone--bot zone--c ct__bot">
      <p class="ct__p" data-fit data-max="18" data-min="13">For investment opportunities, strategic partnerships and portfolio enquiries, speak with Hunt Global. Governed from Singapore.</p>
      <div class="ct__btns"><a class="pill pill--acc" href="mailto:${MAIL}?subject=${encodeURIComponent('Start a conversation')}">Start a conversation ${AR}</a><a class="pill" href="mailto:${MAIL}">${MAIL}</a></div>
      <footer class="ft mono"><span>Level 8, 2 Venture Drive, Singapore 608526</span><span>© 2026 Hunt Global PTE Ltd. All rights reserved.</span><a href="#main" class="ft__top" data-top>Back to top <i class="ar" aria-hidden="true">↑</i></a></footer>
    </div>
  </div>
</section>
</main>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="/assets/script.js?v=${V}" defer></script>
</body>
</html>
`;

const notFound = `${head('Not found — Hunt Global', 'Page not found.')}
<body class="nf">${sky('sky--hero bg bg--hero on')}<main class="nf__in"><span class="mono">Hunt Global</span><h1 class="h1">Page not found.</h1><a class="pill" href="/">Back home ${AR}</a></main></body></html>`;

writeFileSync('index.html', index);
writeFileSync('404.html', notFound);
console.log('built index.html, 404.html');
