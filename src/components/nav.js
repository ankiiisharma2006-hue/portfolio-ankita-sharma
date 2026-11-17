import { site } from '../config/site.js';
import { $, $$, reduced } from '../lib/dom.js';

export const sections = [
  ['home', 'Home'],
  ['projects', 'Work'],
  ['about', 'Services'],
  ['skills', 'Toolbox'],
  ['experience', 'Experience'],
];

export function renderNav() {
  const links = sections
    .map(([id, label]) => `<a href="#${id}" data-link="${id}">${label}</a>`)
    .join('');
  return `
  <div id="progress" aria-hidden="true"></div>
  <header class="nav" id="nav">
    <div class="nav-in wrap">
      <a class="brand" href="#home" data-link="home" aria-label="${site.name}, back to top">
        <span class="brand-name">${site.name}</span>
        <span class="brand-role mono">${site.role}</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        ${links}
        <span class="nav-ind" aria-hidden="true"></span>
      </nav>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="sheet"><i></i><i></i></button>
    </div>
  </header>
  <div class="sheet" id="sheet" hidden>
    <nav aria-label="Mobile">
      ${sections.map(([id, label]) => `<a href="#${id}" data-link="${id}">${label}</a>`).join('')}
    </nav>
  </div>`;
}

export function initNav() {
  const nav = $('#nav');
  const ind = $('.nav-ind');
  const desktopLinks = $$('.nav-links a');
  const burger = $('#burger');
  const sheet = $('#sheet');

  const moveInd = (id) => {
    const a = desktopLinks.find((l) => l.dataset.link === id);
    if (!a) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1;
    ind.style.width = `${a.offsetWidth}px`;
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  };

  let current = 'home';
  const setActive = (id) => {
    current = id;
    $$('[data-link]').forEach((l) => l.classList.toggle('active', l.dataset.link === id));
    $$('[data-link]').forEach((l) => (l.dataset.link === id ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
    moveInd(id);
  };

  // Active section from scroll position
  const secs = sections.map(([id]) => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: '-42% 0px -52% 0px' }
  );
  secs.forEach((s) => io.observe(s));
  setActive('home');
  addEventListener('resize', () => moveInd(current));
  document.fonts?.ready.then(() => moveInd(current));

  // Header surface after first scroll
  const onScroll = () => nav.classList.toggle('solid', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth in-page navigation without disturbing the case-study hash
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    closeSheet();
    target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', location.pathname + location.search);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  function closeSheet() {
    sheet.hidden = true;
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  burger.addEventListener('click', () => {
    const open = sheet.hidden;
    sheet.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && !sheet.hidden && closeSheet());
}
