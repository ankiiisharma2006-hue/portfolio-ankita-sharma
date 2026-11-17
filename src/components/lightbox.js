import { $, $$ } from '../lib/dom.js';
import { icons } from '../lib/icons.js';

export function renderLightbox() {
  return `
  <div class="lb inverse" id="lb" role="dialog" aria-modal="true" aria-label="Enlarged image" hidden>
    <div class="lb-bar">
      <span class="mono lb-t" id="lb-t"></span>
      <div class="lb-tools">
        <button class="mono" id="lb-prev" aria-label="Previous image">${icons.prev}</button>
        <button class="mono" id="lb-next" aria-label="Next image">${icons.arrowRight}</button>
        <button class="mono" data-z="fit" aria-pressed="true">Fit</button>
        <button class="mono" data-z="full" aria-pressed="false">Actual size</button>
        <button class="mono" id="lb-x" aria-label="Close enlarged image">Close</button>
      </div>
    </div>
    <div class="lb-view" id="lb-view" tabindex="0"><img id="lb-img" alt="" /></div>
    <p class="lb-hint mono" id="lb-hint">Drag to pan at actual size · Arrow keys to step · Esc to close</p>
  </div>`;
}

export function initLightbox() {
  const lb = $('#lb'), view = $('#lb-view'), img = $('#lb-img'), title = $('#lb-t');
  const prev = $('#lb-prev'), next = $('#lb-next');
  let opener = null, items = [], idx = 0;

  const mode = (m) => {
    lb.dataset.mode = m;
    $$('[data-z]', lb).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.z === m)));
    img.style.width = m === 'full' && img.naturalWidth ? `${img.naturalWidth}px` : '';
    view.scrollTo(0, 0);
  };
  const show = (i) => {
    idx = (i + items.length) % items.length;
    const b = items[idx];
    img.src = b.dataset.src;
    img.alt = b.dataset.alt || '';
    img.classList.toggle('mat', b.hasAttribute('data-mat'));
    title.textContent = `${items.length > 1 ? `${idx + 1} / ${items.length} · ` : ''}${b.dataset.cap || ''}`;
    prev.hidden = next.hidden = items.length < 2;
    mode('fit');
  };
  const open = (btn) => {
    opener = btn;
    const g = btn.dataset.group;
    items = g ? $$(`[data-zoom][data-group="${g}"]`) : [btn];
    show(Math.max(0, items.indexOf(btn)));
    lb.hidden = false;
    document.body.classList.add('lb-open');
    requestAnimationFrame(() => lb.classList.add('on'));
    $('#lb-x').focus();
  };
  const close = () => {
    lb.classList.remove('on');
    document.body.classList.remove('lb-open');
    setTimeout(() => { lb.hidden = true; img.removeAttribute('src'); }, 320);
    opener?.focus?.({ preventScroll: true });
  };

  document.addEventListener('click', (e) => {
    const z = e.target.closest('[data-zoom]');
    if (z) open(z);
  });
  $('#lb-x').addEventListener('click', close);
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  img.addEventListener('load', () => { if (lb.dataset.mode === 'full') mode('full'); });
  $$('[data-z]', lb).forEach((b) => b.addEventListener('click', () => mode(b.dataset.z)));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === view) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
    if (e.key === 'ArrowRight' && items.length > 1) show(idx + 1);
    if (e.key === 'ArrowLeft' && items.length > 1) show(idx - 1);
    if (e.key === 'Tab') {
      const f = $$('button', lb).filter((x) => !x.hidden), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);

  // Drag to pan at actual size
  let drag = null;
  view.addEventListener('pointerdown', (e) => {
    if (lb.dataset.mode !== 'full') return;
    drag = { x: e.clientX, y: e.clientY, sl: view.scrollLeft, st: view.scrollTop };
    view.setPointerCapture(e.pointerId); view.classList.add('drag');
  });
  view.addEventListener('pointermove', (e) => {
    if (!drag) return;
    view.scrollLeft = drag.sl - (e.clientX - drag.x);
    view.scrollTop = drag.st - (e.clientY - drag.y);
  });
  const end = () => { drag = null; view.classList.remove('drag'); };
  view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
}
