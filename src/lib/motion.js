import { $, $$, reduced, finePointer } from './dom.js';

const phone = () => window.matchMedia('(max-width: 720px)').matches;

/** Fade/slide elements in as they enter the viewport. */
export function initReveal() {
  const targets = $$('[data-reveal], [data-split], .section');
  if (reduced() || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  targets.forEach((t) => io.observe(t));
}

/** Count-up for numeric values in [data-count]. */
export function initCounters() {
  const els = $$('[data-count]');
  const run = (el) => {
    const end = Number(el.dataset.count);
    if (reduced()) { el.textContent = end; return; }
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((e) => io.observe(e));
}

/** Thin progress bar tied to page scroll. */
export function initProgress() {
  const bar = $('#progress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)))})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/**
 * Scroll-linked drift for [data-parallax="speed"] elements.
 * Only elements currently on screen are updated; disabled on phones and for reduced motion.
 */
export function initParallax() {
  if (reduced()) return;
  const els = $$('[data-parallax]');
  const live = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target))), { rootMargin: '20% 0px' });
  els.forEach((e) => io.observe(e));
  let ticking = false;
  const update = () => {
    ticking = false;
    if (phone()) return;
    const vh = innerHeight;
    live.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const off = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around viewport centre
      el.style.setProperty('--py', `${(off * -Number(el.dataset.parallax) * 100).toFixed(1)}px`);
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/** Cursor-following light inside [data-spot] elements. */
export function initSpotlight() {
  if (!finePointer()) return;
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('[data-spot]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/** A soft ring that trails the pointer and grows over interactive elements. The native cursor stays. */
export function initCursor() {
  if (reduced() || !finePointer()) return;
  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);
  let x = -100, y = -100, rx = x, ry = y, on = false;
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!on) { on = true; ring.classList.add('on'); rx = x; ry = y; }
    ring.classList.toggle('hot', !!e.target.closest?.('a, button, [role="tab"], summary, input, textarea'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => ring.classList.remove('on'));
  (function loop() {
    rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();
}

/** Buttons lean a few pixels toward the pointer. */
export function initMagnetic() {
  if (reduced() || !finePointer()) return;
  $$('.btn').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) / r.width) * 8}px, ${((e.clientY - (r.top + r.height / 2)) / r.height) * 6}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}
