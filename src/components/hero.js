import { site } from '../config/site.js';
import { flagship, secondary } from '../data/projects.js';
import { catalog, A } from '../data/work.js';
import { icons } from '../lib/icons.js';
import { esc, $, $$, reduced } from '../lib/dom.js';

/**
 * Hero: one claim, one proof. The stage on the right cycles through real evidence from the six
 * projects (video posters, workflow canvases, application screens). Nothing here is illustrative.
 */
const pipe = ['Trigger', 'Retrieve', 'Generate', 'Check', 'Act'];

export function renderHero() {
  const items = catalog(flagship, secondary);
  const first = items[0];

  return `
  <section class="hero section" id="home" aria-labelledby="hero-title">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow" data-reveal><span class="live" aria-hidden="true"></span>${esc(site.role)}</p>
        <h1 id="hero-title">
          <span class="line" style="--d:0"><span>AI automation,</span></span>
          <span class="line" style="--d:1"><span>built to be</span></span>
          <span class="line" style="--d:2"><span><em>checked.</em></span></span>
        </h1>
        <p class="hero-sub" data-reveal style="--d:3">
          I build AI agents, the web interfaces around them and the automation behind them, from n8n workflows and RAG systems to chat and approval screens. I write down what passed, what failed and what is still untested.
        </p>
        <div class="hero-cta" data-reveal style="--d:4">
          <a class="btn primary" href="#projects">Explore the work ${icons.arrowDown}</a>
          <a class="btn" href="#about">What I build ${icons.arrowDown}</a>
        </div>
        <div class="pipe" data-reveal style="--d:5" aria-label="The shape of most of these builds: trigger, retrieve, generate, check, act">
          <span class="label">The shape of the builds</span>
          <ol>${pipe.map((p, i) => `<li style="--i:${i}"><i></i><span class="mono">${p}</span></li>`).join('')}</ol>
        </div>
      </div>

      <div class="stage" data-stage data-reveal style="--d:2" role="group" aria-roledescription="carousel" aria-label="Evidence from the six projects">
        <div class="stage-frame" data-parallax="0.035">
          <ol class="stage-slides">
            ${items.map((p, i) => `<li class="slide${i === 0 ? ' on' : ''}" data-i="${i}" ${i ? 'aria-hidden="true"' : ''}>
              <button type="button" class="slide-btn" data-zoom data-group="hero" data-src="${A(p.folder, p.img)}" data-alt="${esc(p.name)}: ${esc(p.kind)}" data-cap="${esc(p.index)} · ${esc(p.name)} · ${esc(p.kind)}" aria-label="Enlarge: ${esc(p.name)}" ${i ? 'tabindex="-1"' : ''}>
                <img src="${A(p.folder, p.img)}" width="${p.w}" height="${p.h}" alt="${esc(p.name)}: ${esc(p.kind)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
              </button>
            </li>`).join('')}
          </ol>
        </div>
        <div class="stage-cap">
          <span class="mono stage-n"><b data-n>01</b> / 0${items.length}</span>
          <div class="stage-t" aria-live="polite"><b data-name>${esc(first.name)}</b><span class="mono" data-kind>${esc(first.kind)}</span></div>
          <a class="link" href="#${first.slug}" data-open>Open ${icons.arrowRight}</a>
        </div>
        <div class="stage-tabs" role="tablist" aria-label="Choose a project">
          ${items.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-i="${i}" aria-label="${esc(p.index)} ${esc(p.name)}"><span class="mono">${p.index}</span><i></i></button>`).join('')}
        </div>
      </div>
    </div>
    <div class="wrap">
      <dl class="hero-bar" data-reveal style="--d:5">
        <div><dt>Documented work</dt><dd>6 systems · 4 video walkthroughs</dd></div>
        <div><dt>Working with</dt><dd>n8n · Gemini · Groq · Supabase pgvector</dd></div>
        <div><dt>Status</dt><dd>Video assistant verified on one 20-minute video; more tests pending</dd></div>
      </dl>
    </div>
  </section>`;
}

export function initHero() {
  const stage = $('[data-stage]');
  if (!stage) return;
  const items = catalog(flagship, secondary);
  const slides = $$('.slide', stage), tabs = $$('[role="tab"]', stage);
  const n = $('[data-n]', stage), name = $('[data-name]', stage), kind = $('[data-kind]', stage), open = $('[data-open]', stage);
  let i = 0, timer = null, hover = false;
  const DUR = 6500;

  const go = (k) => {
    i = (k + slides.length) % slides.length;
    slides.forEach((s, j) => { s.classList.toggle('on', j === i); s.setAttribute('aria-hidden', String(j !== i)); const b = s.querySelector('button'); if (j === i) b.removeAttribute('tabindex'); else b.tabIndex = -1; });
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === i)); });
    n.textContent = String(i + 1).padStart(2, '0');
    name.textContent = items[i].name;
    kind.textContent = items[i].kind;
    open.setAttribute('href', `#${items[i].slug}`);
  };
  const stop = () => { clearTimeout(timer); timer = null; stage.classList.remove('run'); };
  const loop = () => {
    stop();
    if (reduced() || hover || document.hidden) return;
    void stage.offsetWidth;
    stage.classList.add('run');
    timer = setTimeout(() => { go(i + 1); loop(); }, DUR);
  };
  tabs.forEach((t, j) => t.addEventListener('click', () => { go(j); loop(); }));
  stage.addEventListener('pointerenter', () => { hover = true; stop(); });
  stage.addEventListener('pointerleave', () => { hover = false; loop(); });
  stage.addEventListener('focusin', () => { hover = true; stop(); });
  stage.addEventListener('focusout', () => { hover = false; loop(); });
  document.addEventListener('visibilitychange', loop);
  // Only run while the hero is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) loop(); else stop(); }), { threshold: 0.25 }).observe(stage);
  } else loop();
}
