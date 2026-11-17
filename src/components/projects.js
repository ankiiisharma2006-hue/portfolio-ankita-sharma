import { flagship, secondary, statusLabels } from '../data/projects.js';
import { driveRag, emailRag, restaurant, invoice, catalog, A, FOLDERS } from '../data/work.js';
import { icons } from '../lib/icons.js';
import { split } from '../lib/text.js';
import { esc, $, $$, reduced } from '../lib/dom.js';
import { renderFlowDiagram, initFlowDiagram } from './flowDiagram.js';
import { renderStack } from './stack.js';
import { renderFlow } from './flow.js';
import { renderVideo, renderFig, initVideos } from './media.js';

const chip = (s) => `<span class="chip" data-s="${s}">${statusLabels[s]}</span>`;
const tags = (arr) => `<ul class="tags">${arr.map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>`;
const bullets = (arr) => `<ul class="bul">${arr.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

const head = (p, cls = '') => `
  <header class="art-head ${cls}">
    <div class="spread-meta"><span class="idx mono">${p.index}</span>${chip(p.status)}<span class="label">${esc(p.kicker)}</span></div>
    <h3 id="${p.slug}-t" data-split>${split(p.name)}</h3>
    <p class="spread-sum" data-reveal>${esc(p.summary)}</p>
  </header>`;

function facts(list) {
  return `<dl class="facts">${list
    .map((x, i) => {
      const num = /^\d+$/.test(x.value);
      return `<div data-reveal style="--d:${i}"><dt class="label">${esc(x.label)}</dt><dd><span ${num ? `data-count="${x.value}"` : ''}>${esc(x.value)}</span></dd><p class="mono">${esc(x.note)}</p></div>`;
    })
    .join('')}</dl>`;
}

/* Tabs: one component for the PDF and Email case studies */
function tabs(uid, items) {
  return `
  <div class="tabs" data-tabs>
    <div class="tab-list" role="tablist" aria-label="${esc(uid)} views">
      ${items.map((t, i) => `<button role="tab" id="${uid}-t${i}" aria-selected="${i === 0}" aria-controls="${uid}-p${i}" tabindex="${i === 0 ? 0 : -1}">${esc(t.label)}</button>`).join('')}
    </div>
    ${items.map((t, i) => `<div role="tabpanel" id="${uid}-p${i}" aria-labelledby="${uid}-t${i}" class="tab-panel" ${i ? 'hidden' : ''}>${t.html}</div>`).join('')}
  </div>`;
}

/* 01 · Editorial showcase: film first, then the numbers, then the proof */
function art1() {
  const f = flagship, folder = FOLDERS[f.slug];
  return `
  <article class="art art-1" id="${f.slug}" aria-labelledby="${f.slug}-t" data-work>
    ${head(f, 'wide')}
    <div class="art-film" data-reveal>
      ${renderVideo(folder, { file: 'timestamped-ai-video-assistant-walkthrough.mp4', poster: 'poster.webp', duration: '0:58', label: 'Timestamped AI video knowledge assistant walkthrough' }, { caption: 'Walkthrough of the working prototype, edited from my screen recordings. Private details are cropped or blurred.' })}
    </div>
    ${facts(f.facts)}
    <div class="trio">
      <section data-reveal><h4 class="label">The problem</h4><p>${esc(f.problem)}</p></section>
      <section data-reveal style="--d:1"><h4 class="label">The approach</h4><p>${esc(f.approach)}</p></section>
      <section data-reveal style="--d:2"><h4 class="label">My contribution</h4><p>${esc(f.contribution)}</p></section>
    </div>
    <div class="gallery gallery-wide" data-reveal>${tabs('video', f.evidence.map((e, i) => ({
      label: i ? 'Workflow B · answer a question' : 'Workflow A · index a video',
      html: renderFig({ src: A(folder, e.src), w: i ? 3000 : 3300, h: i ? 1757 : 1364, alt: e.alt, cap: e.caption + ' Screenshot of the n8n canvas, enlarged and sharpened.', group: 'video', tag: i ? 'Workflow B' : 'Workflow A' }),
    })))}</div>
    <div class="spread-foot">
      <div data-reveal>
        <h4 class="label">Why the answers can be trusted</h4>
        <ul class="checks">${f.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      </div>
      <div data-reveal style="--d:1">
        <h4 class="label">Stack</h4>
        ${renderStack(f.stack)}
        <a class="btn primary go-case" href="#/case/${f.slug}" data-case="${f.slug}">Open the full case study ${icons.arrowUpRight}</a>
      </div>
    </div>
  </article>`;
}

/* 02 · Split screen: narrative pinned left, interactive evidence right */
function art2() {
  const s = secondary, folder = FOLDERS[s.slug];
  const ev = s.evidence;
  const views = [
    { label: 'Pipelines', html: renderFlowDiagram(s.pipelines, 'Redrawn from the node reference in the project documentation. Select a node for detail.') },
    { label: 'Workflow canvas', html: renderFig({ src: A(folder, ev[0].src), w: 3000, h: 2012, alt: ev[0].alt, cap: ev[0].caption + ' Screenshot of the n8n canvas, enlarged and sharpened.', group: 'pdf', tag: 'Canvas' }) },
    { label: 'Answer from the PDF', html: renderFig({ src: A(folder, ev[1].src), w: 3336, h: 1623, alt: ev[1].alt, cap: ev[1].caption + ' The answer comes from the ingested PDF.', group: 'pdf', tag: 'Chat' }) },
  ];
  return `
  <article class="art art-2" id="${s.slug}" aria-labelledby="${s.slug}-t" data-work>
    <div class="split">
      <div class="split-copy">
        <div class="spread-meta"><span class="idx mono">${s.index}</span>${chip(s.status)}</div>
        <h3 id="${s.slug}-t" data-split>${split(s.name)}</h3>
        <p class="label" data-reveal>${esc(s.kicker)}</p>
        <p class="spread-sum" data-reveal>${esc(s.summary)}</p>
        <div class="note-block" data-reveal><span class="label">The problem</span><p>${esc(s.problem)}</p></div>
        <div class="note-block" data-reveal><span class="label">My contribution</span><p>${esc(s.contribution)}</p></div>
      </div>
      <div class="split-evidence" data-reveal>${tabs('pdf', views)}</div>
    </div>
    <div class="duo-more">
      <div class="sec-more" data-reveal>
        <details><summary><span>Issues hit and how they were resolved</span>${icons.plus}</summary>
          <ul class="pairs">${s.resolved.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul></details>
        <details><summary><span>What was tested</span>${icons.plus}</summary>${bullets(s.tested)}</details>
        <details><summary><span>Planned improvements</span>${icons.plus}</summary>${bullets(s.next)}</details>
      </div>
      <div data-reveal style="--d:1"><h4 class="label stack-h">Stack</h4>${renderStack(s.stack)}</div>
    </div>
  </article>`;
}

/* 03 · Annotated workflow: numbered points on the real canvas */
function art3() {
  const d = driveRag;
  const n = d.notes[0];
  return `
  <article class="art art-3" id="${d.slug}" aria-labelledby="${d.slug}-t" data-work>
    ${head(d)}
    <div class="annot" data-annot>
      <div class="annot-stage">
        <div class="annot-canvas">
          <img src="${A(d.folder, d.figure.file)}" width="${d.figure.w}" height="${d.figure.h}" alt="${esc(d.figure.alt)}" loading="lazy" decoding="async" />
          ${d.notes.map((x, i) => `<button class="hot" type="button" style="left:${x.x}%;top:${x.y}%" data-i="${i}" aria-pressed="${i === 0}" aria-label="Point ${i + 1}: ${esc(x.t)}"><span>${i + 1}</span></button>`).join('')}
        </div>
        <button class="annot-zoom mono" type="button" data-zoom data-src="${A(d.folder, d.figure.file)}" data-alt="${esc(d.figure.alt)}" data-cap="n8n workflow canvas for the Drive-synced knowledge base" data-group="drive">Enlarge ${icons.plus}</button>
      </div>
      <div class="annot-side">
        <ol class="annot-tabs" aria-label="Points on the canvas">
          ${d.notes.map((x, i) => `<li><button type="button" data-i="${i}" aria-pressed="${i === 0}"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${esc(x.t)}</button></li>`).join('')}
        </ol>
        <div class="annot-detail" aria-live="polite"><span class="label">Point 1 of ${d.notes.length}</span><h4>${esc(n.t)}</h4><p>${esc(n.b)}</p></div>
      </div>
    </div>
    <div class="pair">
      <div class="pair-media" data-reveal>
        ${renderVideo(d.folder, d.video, { caption: d.recording })}
      </div>
      <div class="pair-copy">
        <div data-reveal><h4 class="label">What the recording shows</h4>${bullets(d.shows)}</div>
        <div data-reveal style="--d:1"><h4 class="label">Specified in the brief</h4>${bullets(d.specified)}</div>
      </div>
    </div>
    <div class="spread-foot">
      <div data-reveal><h4 class="label">The problem</h4><p class="plain">${esc(d.problem)}</p></div>
      <div data-reveal style="--d:1"><h4 class="label">Stack</h4>${renderStack(d.stack)}</div>
    </div>
  </article>`;
}

/* 04 · Interactive gallery: the same email, seen where a person reviews it */
function art4() {
  const e = emailRag;
  const views = e.gallery.map((g) => ({
    label: g.tab,
    html: renderFig({ src: A(e.folder, g.file), w: g.w, h: g.h, alt: g.alt, cap: g.cap, group: 'email', tag: g.tab }),
  }));
  return `
  <article class="art art-4" id="${e.slug}" aria-labelledby="${e.slug}-t" data-work>
    ${head(e)}
    <div class="gallery" data-reveal>${tabs('email', views)}</div>
    <div class="pair pair-rev">
      <div class="pair-media" data-reveal>
        ${renderVideo(e.folder, e.video, { caption: 'Five seconds: a categorised email, its draft in Telegram, and the Gmail draft.', cls: 'vid-sm' })}
        <p class="plain note-small">${esc(e.note)}</p>
      </div>
      <div class="pair-copy">
        <div data-reveal><h4 class="label">Flow</h4>${renderFlow(e.flow, e.gate)}</div>
        <div data-reveal style="--d:1"><h4 class="label">What it does</h4>${bullets(e.points)}</div>
      </div>
    </div>
    <div class="spread-foot">
      <div data-reveal><h4 class="label">The problem</h4><p class="plain">${esc(e.problem)}</p></div>
      <div data-reveal style="--d:1"><h4 class="label">Stack</h4>${renderStack(e.stack)}</div>
    </div>
  </article>`;
}

/* 05 · Full-width application demonstration on a dark band */
function art5() {
  const r = restaurant;
  return `
  <article class="art art-5" id="${r.slug}" aria-labelledby="${r.slug}-t" data-work>
    ${head(r)}
    <div class="demo inverse">
      <div class="demo-in">
        <div class="demo-bar">
          <div><span class="label">Application screens · sample data</span><h4 class="demo-title">The guest side, then the staff side</h4></div>
          <div class="rail-ctl">
            <span class="rail-count mono" aria-live="polite"><b data-cur>1</b> / ${r.slides.length}</span>
            <button type="button" class="rail-btn" data-dir="-1" aria-label="Previous screen">${icons.prev}</button>
            <button type="button" class="rail-btn" data-dir="1" aria-label="Next screen">${icons.arrowRight}</button>
          </div>
        </div>
        <div class="rail" data-rail tabindex="0" aria-label="Application screens, scroll sideways">
          <ol class="rail-track">
            ${r.slides.map((s, i) => `<li class="rail-item">${renderFig({ src: A(r.folder, s.file), w: s.w, h: s.h, alt: s.alt, cap: s.cap, group: 'restaurant', tag: `${String(i + 1).padStart(2, '0')} · ${s.t}`, cls: 'rail-fig' })}</li>`).join('')}
          </ol>
        </div>
        <div class="rules3">
          ${r.rules.map(([t, b], i) => `<div data-reveal style="--d:${i}"><span class="mono">0${i + 1}</span><h4>${esc(t)}</h4><p>${esc(b)}</p></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="spread-foot">
      <div data-reveal>
        <h4 class="label">The problem</h4><p class="plain">${esc(r.problem)}</p>
        <h4 class="label gap">Tools named in the brief</h4>${tags(r.specifiedTools)}
        <h4 class="label gap">Tested so far</h4>${bullets(r.tested)}
      </div>
      <div data-reveal style="--d:1">
        <h4 class="label">Specified flow</h4>${renderFlow(r.flow, r.gate)}
        <h4 class="label gap">Stack</h4>${renderStack(r.stack)}
      </div>
    </div>
  </article>`;
}

/* 06 · Film first, then four rules and three views */
function art6() {
  const v = invoice;
  return `
  <article class="art art-6" id="${v.slug}" aria-labelledby="${v.slug}-t" data-work>
    ${head(v, 'wide')}
    <div class="art-film" data-reveal>
      ${renderVideo(v.folder, v.video, { caption: 'Walkthrough edited from two screen recordings (15 and 16 October 2026). Sample customers and invoices; one email address blurred.' })}
    </div>
    ${facts(v.facts)}
    <div class="rules4">
      <h4 class="label">Four rules you can read off the screen</h4>
      <ol>${v.rules.map(([t, b], i) => `<li data-reveal style="--d:${i}"><span class="mono">0${i + 1}</span><h4>${esc(t)}</h4><p>${esc(b)}</p></li>`).join('')}</ol>
    </div>
    <div class="views">
      ${v.views.map((x, i) => renderFig({ src: A(v.folder, x.file), w: x.w, h: x.h, alt: x.alt, cap: x.cap, group: 'invoice', tag: x.t, cls: `view v${i}`, reveal: true })).join('')}
    </div>
    <div class="spread-foot">
      <div data-reveal>
        <h4 class="label">The problem</h4><p class="plain">${esc(v.problem)}</p>
        <h4 class="label gap">Two recordings, two versions</h4>
        <dl class="versions">${v.versions.map(([d, t]) => `<div><dt class="mono">${esc(d)}</dt><dd>${esc(t)}</dd></div>`).join('')}</dl>
      </div>
      <div data-reveal style="--d:1"><h4 class="label">Stack</h4>${renderStack(v.stack)}</div>
    </div>
  </article>`;
}

function renderIndex() {
  const items = catalog(flagship, secondary);
  return `
  <aside class="work-index" aria-label="Projects" data-index>
    <p class="label">Index</p>
    <ol>
      ${items.map((p) => `<li><a href="#${p.slug}" data-ix="${p.slug}"><span class="mono">${p.index}</span><b>${esc(p.name)}</b><i class="dot" data-s="${p.status}" title="${statusLabels[p.status]}"></i></a></li>`).join('')}
    </ol>
    <div class="ix-bar" aria-hidden="true"><i></i></div>
  </aside>`;
}

export function renderProjects() {
  return `
  <section class="section projects work" id="projects" aria-labelledby="projects-title">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow" data-reveal>Selected work</p>
        <h2 id="projects-title" data-split>${split('Six systems, each shown as it ran.')}</h2>
        <p data-reveal>Every project carries what its documentation or recording supports: each labelled a working build or a working prototype. Videos and pictures are edited from my own screen recordings, with private details cropped or blurred.</p>
      </div>
      <div class="work-layout">
        ${renderIndex()}
        <div class="work-list">
          ${art1()}${art2()}${art3()}${art4()}${art5()}${art6()}
        </div>
      </div>
    </div>
  </section>`;
}

export function initProjects() {
  const root = document.getElementById('projects');
  if (!root) return;
  initFlowDiagram(root, secondary.pipelines);
  initVideos(root);

  /* Tabs */
  $$('[data-tabs]', root).forEach((t) => {
    const tabsEl = $$('[role="tab"]', t), panels = $$('[role="tabpanel"]', t);
    const show = (i) => {
      tabsEl.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      panels.forEach((p, j) => { p.hidden = j !== i; if (j === i) { p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); } });
    };
    tabsEl.forEach((b, i) => {
      b.addEventListener('click', () => show(i));
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabsEl.length) % tabsEl.length;
        show(n); tabsEl[n].focus();
      });
    });
  });

  /* Annotated canvas */
  $$('[data-annot]', root).forEach((a) => {
    const hot = $$('.hot', a), chips = $$('.annot-tabs button', a), detail = $('.annot-detail', a);
    const set = (i) => {
      const n = driveRag.notes[i];
      hot.forEach((h, j) => h.setAttribute('aria-pressed', String(i === j)));
      chips.forEach((c, j) => c.setAttribute('aria-pressed', String(i === j)));
      detail.innerHTML = `<span class="label">Point ${i + 1} of ${driveRag.notes.length}</span><h4>${esc(n.t)}</h4><p>${esc(n.b)}</p>`;
      detail.classList.remove('swap'); void detail.offsetWidth; detail.classList.add('swap');
    };
    [...hot, ...chips].forEach((b) => b.addEventListener('click', () => set(Number(b.dataset.i))));
  });

  /* Horizontal rail */
  $$('[data-rail]', root).forEach((rail) => {
    const items = $$('.rail-item', rail), cur = rail.parentElement.querySelector('[data-cur]');
    const go = (dir) => {
      const w = items[0].getBoundingClientRect().width + 28;
      rail.scrollBy({ left: dir * Math.max(w, rail.clientWidth * 0.6), behavior: reduced() ? 'auto' : 'smooth' });
    };
    rail.parentElement.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.dir))));
    rail.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    let tick = false;
    const upd = () => {
      tick = false;
      const left = rail.getBoundingClientRect().left;
      let best = 0, d = Infinity;
      items.forEach((it, i) => { const x = Math.abs(it.getBoundingClientRect().left - left); if (x < d) { d = x; best = i; } });
      if (cur) cur.textContent = String(best + 1);
    };
    rail.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  });

  /* Sticky index: follow the project in view and fill a progress line */
  const ix = $('[data-index]', root);
  if (ix && 'IntersectionObserver' in window) {
    const links = $$('[data-ix]', ix), arts = $$('[data-work]', root), bar = $('.ix-bar i', ix);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle('active', l.dataset.ix === e.target.id));
    }), { rootMargin: '-30% 0px -60% 0px' });
    arts.forEach((a) => io.observe(a));
    let tk = false;
    const prog = () => {
      tk = false;
      const r = root.getBoundingClientRect(), total = r.height - innerHeight;
      bar.style.transform = `scaleY(${Math.min(1, Math.max(0, -r.top / Math.max(1, total)))})`;
    };
    addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(prog); } }, { passive: true });
    prog();
  }
}
