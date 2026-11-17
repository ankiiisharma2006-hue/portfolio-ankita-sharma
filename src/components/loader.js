import { site } from '../config/site.js';
import { reduced } from '../lib/dom.js';

/**
 * Optional intro splash. Switched off: a recruiter should see content immediately.
 * Set INTRO to true to bring back a short first-visit intro (skipped for reduced motion and repeat visits).
 */
const INTRO = false;

export function runLoader() {
  const done = () => { document.body.classList.add('ready'); };
  let seen = false;
  try { seen = sessionStorage.getItem('intro') === '1'; } catch { /* storage may be blocked */ }
  if (!INTRO || reduced() || seen) return done();

  const el = document.createElement('div');
  el.className = 'loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="loader-in"><span class="loader-mark">${site.initials}</span><span class="loader-line"><i></i></span></div>`;
  document.body.append(el);
  document.body.classList.add('loading');

  setTimeout(() => {
    el.classList.add('out');
    document.body.classList.remove('loading');
    done();
    try { sessionStorage.setItem('intro', '1'); } catch { /* ignore */ }
    setTimeout(() => el.remove(), 500);
  }, 550);
}
