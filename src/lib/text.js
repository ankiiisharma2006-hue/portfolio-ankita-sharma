import { esc } from './dom.js';

/**
 * Wrap each word in a masked span so headings can rise word by word.
 * Words wrapped in *asterisks* become <em> for the accent colour.
 * Output is plain text to crawlers and screen readers.
 */
export function split(text) {
  let i = 0;
  return text
    .split(' ')
    .map((tok) => {
      const em = /^\*(.+)\*([.,?!]*)$/.exec(tok);
      const inner = em ? `<em>${esc(em[1])}</em>${esc(em[2])}` : esc(tok);
      return `<span class="w"><i style="--wi:${i++}">${inner}</i></span>`;
    })
    .join(' ');
}
