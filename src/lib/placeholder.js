import { site } from '../config/site.js';
import { esc } from './dom.js';

/**
 * Clearly marked "fill me in" boxes. They render only while an item is empty AND
 * `site.showPlaceholders` is true, and use a dashed amber style no real content uses.
 */
export const placeholdersOn = () => site.showPlaceholders === true;

/** Inline placeholder chip. `what` = what to add, `where` = file that holds it. */
export const ph = (what, where) =>
  placeholdersOn()
    ? `<span class="ph" role="note" data-placeholder="${esc(what)}"><b>Placeholder</b><span>${esc(what)}</span><i>${esc(where)}</i></span>`
    : '';

/** Larger figure-sized placeholder for a missing screenshot. */
export const phFigure = (what, where) =>
  placeholdersOn()
    ? `<figure class="ph ph-fig" role="note" data-placeholder="${esc(what)}"><b>Placeholder</b><span>${esc(what)}</span><i>${esc(where)}</i></figure>`
    : '';
