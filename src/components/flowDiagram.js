import { esc, $, $$ } from '../lib/dom.js';

/**
 * Horizontal workflow diagram: nodes joined by arrows, one lane per pipeline.
 * Click a node to read what it does. Lanes come from the documentation's node tables.
 */
export function renderFlowDiagram(lanes, source) {
  const first = lanes[0].nodes[0];
  return `
  <div class="fd" data-fd>
    ${lanes
      .map(
        (l, li) => `
      <section class="fd-lane" aria-label="${esc(l.title)}">
        <header><span class="label">${esc(l.title)}</span><span class="fd-note">${esc(l.note)}</span></header>
        <ol class="fd-nodes" style="--n:${l.nodes.length}">
          ${l.nodes
            .map(
              (n, i) => `<li><button class="fd-node" data-l="${li}" data-i="${i}" aria-pressed="${li === 0 && i === 0}">
                <span class="fd-n mono">${String(i + 1).padStart(2, '0')}</span>
                <b>${esc(n.name)}</b>
                <span class="fd-t mono">${esc(n.type)}</span>
              </button></li>`
            )
            .join('')}
        </ol>
      </section>`
      )
      .join('')}
    <div class="fd-detail" aria-live="polite">
      <span class="label">${esc(first.type)}</span>
      <h4>${esc(first.name)}</h4>
      <p>${esc(first.text)}</p>
    </div>
    <p class="fd-src mono">${esc(source)}</p>
  </div>`;
}

export function initFlowDiagram(root, lanes) {
  $$('[data-fd]', root).forEach((fd) => {
    const detail = $('.fd-detail', fd);
    $$('.fd-node', fd).forEach((b) =>
      b.addEventListener('click', () => {
        $$('.fd-node', fd).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        const n = lanes[Number(b.dataset.l)].nodes[Number(b.dataset.i)];
        detail.innerHTML = `<span class="label">${esc(n.type)}</span><h4>${esc(n.name)}</h4><p>${esc(n.text)}</p>`;
        detail.classList.remove('swap'); void detail.offsetWidth; detail.classList.add('swap');
      })
    );
  });
}
