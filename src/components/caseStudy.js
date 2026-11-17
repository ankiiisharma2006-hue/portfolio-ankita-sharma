import { flagship } from '../data/projects.js';
import { videoCaseStudy as cs } from '../data/caseStudy.js';
import { icons } from '../lib/icons.js';
import { esc, $, $$ } from '../lib/dom.js';
import { renderExplorer, initExplorers } from './explorer.js';

const resultKey = (r) => ({ Pass: 'pass', 'Pass with note': 'note', Partial: 'partial', Pending: 'pending' }[r] || 'pending');

const toc = [
  ['overview', 'Overview'],
  ['arch', 'Architecture'],
  ['explorer', 'Workflow explorer'],
  ['data', 'Data & retrieval'],
  ['controls', 'Grounding controls'],
  ['decisions', 'Decisions'],
  ['issues', 'Issues resolved'],
  ['tests', 'Test report'],
  ['limits', 'Limits & next'],
];

function body() {
  return `
  <section id="cs-overview" class="cs-sec">
    <p class="cs-lede">${esc(cs.lede)}</p>
    <p class="cs-docnote mono">${esc(cs.docNote)}</p>
    <dl class="facts facts-cs">
      ${flagship.facts.map((x) => `<div><dt class="mono">${esc(x.label)}</dt><dd>${esc(x.value)}</dd><p class="mono">${esc(x.note)}</p></div>`).join('')}
    </dl>
    <h3>The problem</h3>
    <p class="cs-p">${esc(flagship.problem)}</p>
    <h3>My part</h3>
    <p class="cs-p">I built both n8n workflows end to end: form and chat triggers, URL validation, transcript fetch, chunking and timestamp maths, the Supabase table and match function, the embedding and insert steps, the prompt, and the code that builds citations and source links. I also tested it, recorded what failed, and wrote the documentation this page is drawn from.</p>
  </section>

  <section id="cs-arch" class="cs-sec">
    <h3>Architecture</h3>
    <p class="cs-p">Workflow A writes to a single table and Workflow B reads from it. The two never call each other, so ingestion can be re-run or fixed without touching the chat.</p>
    <figure class="plate">
      <div class="plate-frame frame">
        <i class="cm a"></i><i class="cm b"></i><i class="cm c"></i><i class="cm d"></i>
        <button class="plate-btn" data-zoom data-mat data-group="arch" data-cap="Architecture diagram from the project documentation" data-src="${flagship.figure.full}" data-alt="${esc(flagship.figure.alt)}" aria-label="Enlarge the architecture diagram">
          <img src="${flagship.figure.src}" alt="${esc(flagship.figure.alt)}" width="2233" height="1490" loading="lazy" decoding="async" />
          <span class="plate-zoom mono">Enlarge ${icons.plus}</span>
        </button>
      </div>
      <figcaption class="mono"><span>Fig. 01</span>${esc(flagship.figure.caption)} Amber boxes call an external service; green boxes use Gemini embeddings.</figcaption>
    </figure>
  </section>

  <section id="cs-explorer" class="cs-sec">
    <h3>Workflow explorer</h3>
    <p class="cs-p">Select a node to see what it does. Names and descriptions follow the documented node reference.</p>
    ${renderExplorer('video', cs.workflows)}
  </section>

  <section id="cs-data" class="cs-sec">
    <h3>Data model &amp; retrieval</h3>
    <div class="cs-two">
      <div>
        <p class="cs-p">One dedicated table keeps this project apart from any other data in the Supabase project.</p>
        <table class="cs-table" aria-label="video_chunks columns">
          <thead><tr><th>Column</th><th>Type</th><th>Content</th></tr></thead>
          <tbody>${cs.dataModel.columns.map(([a, b, c]) => `<tr><td class="mono">${a}</td><td class="mono">${b}</td><td>${esc(c)}</td></tr>`).join('')}</tbody>
        </table>
        <p class="cs-p cs-small">${esc(cs.dataModel.note)}</p>
      </div>
      <div>
        <p class="cs-p">Retrieval has two modes, chosen from the wording of the question.</p>
        <ul class="modes">${cs.retrieval.map((r) => `<li><b>${esc(r.mode)}</b><span>${esc(r.text)}</span></li>`).join('')}</ul>
      </div>
    </div>
  </section>

  <section id="cs-controls" class="cs-sec">
    <h3>Grounding &amp; safety controls</h3>
    <p class="cs-p">The prompt asks the model to behave. The code checks that it did.</p>
    <ul class="pairs pairs-wide">${cs.controls.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul>
  </section>

  <section id="cs-decisions" class="cs-sec">
    <h3>Technical decisions</h3>
    <ol class="decisions">${cs.decisions.map((d, i) => `<li><span class="mono">0${i + 1}</span><div><h4>${esc(d.title)}</h4><p>${esc(d.body)}</p></div></li>`).join('')}</ol>
  </section>

  <section id="cs-issues" class="cs-sec">
    <h3>Issues I hit and how they were resolved</h3>
    <ul class="pairs pairs-wide">${cs.issues.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul>
  </section>

  <section id="cs-tests" class="cs-sec">
    <h3>Test report</h3>
    <p class="cs-p">Selected rows from the documented test report. Results are shown as recorded, including partial and pending ones.</p>
    <div class="table-scroll"><table class="cs-table tests" aria-label="Selected test results">
      <thead><tr><th>ID</th><th>Test</th><th>Observed</th><th>Result</th></tr></thead>
      <tbody>${cs.tests.map((t) => `<tr><td class="mono">${esc(t.id)}</td><td>${esc(t.label)}</td><td>${esc(t.observed)}</td><td><span class="res" data-r="${resultKey(t.result)}">${esc(t.result)}</span></td></tr>`).join('')}</tbody>
    </table></div>
  </section>

  <section id="cs-limits" class="cs-sec">
    <h3>Known limitations</h3>
    <ul class="bul">${cs.limits.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    <h3>What I’d do next</h3>
    <ul class="bul">${cs.next.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    <a class="cs-next" href="#rag-pdf" data-next><span class="label">Next project</span><b>PDF Question-Answering RAG Agent</b>${icons.arrowRight}</a>
  </section>`;
}

export function renderCase() {
  return `
  <div class="case inverse" id="case" role="dialog" aria-modal="true" aria-labelledby="case-title" hidden>
    <div class="case-bar">
      <div class="wrap case-bar-in">
        <span class="mono case-crumb">Case study · ${flagship.index}</span>
        <button class="case-close btn ghost" id="case-close" aria-label="Close case study">Close ${icons.close}</button>
      </div>
    </div>
    <div class="case-scroll" id="case-scroll" tabindex="-1">
      <header class="case-head wrap">
        <span class="chip" data-s="prototype">Working prototype</span>
        <h2 id="case-title">${esc(flagship.name)}</h2>
        <p class="mono">${esc(flagship.kicker)}</p>
      </header>
      <div class="wrap case-grid">
        <nav class="case-toc" aria-label="Case study sections">
          ${toc.map(([id, l], i) => `<button data-goto="cs-${id}"><span class="mono">0${i + 1}</span>${l}</button>`).join('')}
        </nav>
        <div class="case-body">${body()}</div>
      </div>
    </div>
  </div>`;
}

export function initCase() {
  const root = $('#case');
  const scroller = $('#case-scroll');
  const lanes = { video: cs.workflows };
  initExplorers(root, lanes);
  let opener = null;
  let openedByNav = false;

  const shell = () => [$('#main'), $('#nav'), $('#rail')].filter(Boolean);
  const open = () => {
    if (!root.hidden) return;
    opener = document.activeElement;
    root.hidden = false;
    shell().forEach((n) => (n.inert = true));
    document.body.classList.add('case-open');
    requestAnimationFrame(() => root.classList.add('on'));
    scroller.scrollTop = 0;
    scroller.focus({ preventScroll: true });
    document.title = `${flagship.name} — case study`;
  };
  const hide = () => {
    root.classList.remove('on');
    document.body.classList.remove('case-open');
    shell().forEach((n) => (n.inert = false));
    setTimeout(() => { root.hidden = true; }, 700);
    document.title = document.documentElement.dataset.title;
    opener?.focus?.({ preventScroll: true });
  };
  const sync = (fromEvent) => {
    const m = location.hash.match(/^#\/case\/([\w-]+)$/);
    if (m && m[1] === flagship.slug) { if (root.hidden) openedByNav = fromEvent === true; open(); }
    else if (!root.hidden) hide();
  };
  const close = () => {
    if (openedByNav && history.length > 1) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); hide(); }
  };

  // The overlay opens from the point that was clicked
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#/case"]');
    if (!a) return;
    const r = a.getBoundingClientRect();
    root.style.setProperty('--cx', `${r.left + r.width / 2}px`);
    root.style.setProperty('--cy', `${r.top + r.height / 2}px`);
  }, true);

  // Table of contents follows the section in view
  const toc = $$('[data-goto]', root);
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) toc.forEach((b) => b.classList.toggle('active', b.dataset.goto === en.target.id));
  }), { root: scroller, rootMargin: '-15% 0px -75% 0px' });
  $$('.cs-sec', root).forEach((sec) => spy.observe(sec));

  // Continue to the next project
  $('[data-next]', root).addEventListener('click', (e) => {
    e.preventDefault();
    const go = () => document.getElementById('rag-pdf')?.scrollIntoView({ block: 'start' });
    if (openedByNav && history.length > 1) { history.back(); setTimeout(go, 750); }
    else { history.replaceState(null, '', location.pathname + location.search); hide(); setTimeout(go, 750); }
  });

  addEventListener('hashchange', () => sync(true));
  // Some history moves (back to an entry whose URL was rewritten with replaceState) fire popstate only
  addEventListener('popstate', () => sync(true));
  $('#case-close').addEventListener('click', close);
  addEventListener('keydown', (e) => e.key === 'Escape' && !root.hidden && close());
  $$('[data-goto]', root).forEach((b) =>
    b.addEventListener('click', () => {
      const t = document.getElementById(b.dataset.goto);
      scroller.scrollTo({ top: t.offsetTop - 90, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    })
  );
  // Keep focus inside the dialog
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$('button, a[href], [tabindex="0"], summary', root).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  sync(false);
}
