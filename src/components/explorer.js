import { esc, $, $$ } from '../lib/dom.js';

/**
 * Interactive workflow explorer. Lanes come straight from the documentation's node tables.
 * lanes: [{ id, title, note, nodes: [{ name, type, text }] }]
 */
export function renderExplorer(uid, lanes, { source = 'Redrawn from the node reference in the project documentation.' } = {}) {
  const tabs = lanes.length > 1
    ? `<div class="ex-tabs" role="tablist" aria-label="Workflow">${lanes
        .map((l, i) => `<button role="tab" id="${uid}-tab-${l.id}" aria-selected="${i === 0}" aria-controls="${uid}-panel-${l.id}" tabindex="${i === 0 ? 0 : -1}" data-lane="${l.id}">${esc(l.title)}</button>`)
        .join('')}</div>`
    : '';
  const panels = lanes
    .map(
      (l, i) => `
    <div class="ex-panel" role="tabpanel" id="${uid}-panel-${l.id}" aria-labelledby="${uid}-tab-${l.id}" ${i ? 'hidden' : ''}>
      <p class="ex-note">${esc(l.note)}</p>
      <ol class="ex-nodes">
        ${l.nodes
          .map(
            (n, j) => `<li><button class="ex-node" aria-pressed="${j === 0}" data-i="${j}">
              <span class="ex-n mono">${String(j + 1).padStart(2, '0')}</span>
              <span class="ex-name">${esc(n.name)}</span>
              <span class="ex-type mono">${esc(n.type)}</span>
            </button></li>`
          )
          .join('')}
      </ol>
      <div class="ex-detail" aria-live="polite">
        <span class="ex-type mono">${esc(l.nodes[0].type)}</span>
        <h4>${esc(l.nodes[0].name)}</h4>
        <p>${esc(l.nodes[0].text)}</p>
      </div>
    </div>`
    )
    .join('');
  return `<div class="explorer" data-explorer data-uid="${uid}">${tabs}${panels}<p class="ex-src mono">${esc(source)}</p></div>`;
}

export function initExplorers(root, lanesByUid) {
  $$('[data-explorer]', root).forEach((ex) => {
    const lanes = lanesByUid[ex.dataset.uid];
    if (!lanes || ex.dataset.ready) return;
    ex.dataset.ready = '1';
    const tabs = $$('[role="tab"]', ex);
    const panels = $$('[role="tabpanel"]', ex);

    const show = (idx) => {
      tabs.forEach((t, i) => { t.setAttribute('aria-selected', String(i === idx)); t.tabIndex = i === idx ? 0 : -1; });
      panels.forEach((p, i) => (p.hidden = i !== idx));
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(i));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        show(next); tabs[next].focus();
      });
    });

    panels.forEach((p, pi) => {
      const detail = $('.ex-detail', p);
      $$('.ex-node', p).forEach((b) => {
        b.addEventListener('click', () => {
          $$('.ex-node', p).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          const n = lanes[pi].nodes[Number(b.dataset.i)];
          detail.innerHTML = `<span class="ex-type mono">${esc(n.type)}</span><h4>${esc(n.name)}</h4><p>${esc(n.text)}</p>`;
        });
      });
    });
  });
}
