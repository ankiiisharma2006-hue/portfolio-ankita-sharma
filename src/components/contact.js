import { site } from '../config/site.js';
import { esc } from '../lib/dom.js';

/** Footer only. The site deliberately has no contact section, email, form or personal links. */
export function renderContact() {
  return `
  <footer class="foot inverse">
    <div class="wrap foot-in">
      <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
      <span>Project facts are from my own documentation.</span>
      <a href="#home">Back to top ↑</a>
    </div>
  </footer>`;
}

export function initContact() {}
