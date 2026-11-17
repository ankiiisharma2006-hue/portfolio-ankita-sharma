import { esc } from '../lib/dom.js';

/** Technologies grouped by the role they play. rows: [[role, text], ...] */
export function renderStack(rows) {
  return `<dl class="stack">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}
