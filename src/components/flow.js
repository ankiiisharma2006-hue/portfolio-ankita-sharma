import { esc } from '../lib/dom.js';

/** Linear step flow. `gate` marks the index of the human-in-the-loop step. */
export function renderFlow(steps, gate) {
  return `<ol class="flow" aria-label="Specified flow">
    ${steps
      .map((s, i) => `<li class="${i === gate ? 'gate' : ''}">
          <span class="flow-n mono">${String(i + 1).padStart(2, '0')}</span>
          <span class="flow-t">${esc(s)}</span>
          ${i === gate ? '<span class="flow-g mono">Human gate</span>' : ''}
        </li>`)
      .join('')}
  </ol>`;
}
