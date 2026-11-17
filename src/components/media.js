import { esc, $$ } from '../lib/dom.js';
import { icons } from '../lib/icons.js';
import { A } from '../data/work.js';

/**
 * Video: a poster with a play button. Nothing loads until it is pressed (preload none),
 * nothing autoplays, and the browser's own controls take over once it plays.
 */
export function renderVideo(folder, v, { caption = '', cls = '' } = {}) {
  return `
  <figure class="vid ${cls}" data-vid>
    <div class="vid-frame">
      <video preload="none" playsinline controls poster="${A(folder, v.poster)}" width="1920" height="1080" aria-label="${esc(v.label)}">
        <source src="${A(folder, v.file)}" type="video/mp4" />
      </video>
      <button class="vid-play" type="button" aria-label="Play: ${esc(v.label)}">
        <span class="vid-disc">${icons.play}</span>
        <span class="vid-lab mono">Play walkthrough · ${esc(v.duration)}</span>
      </button>
    </div>
    ${caption ? `<figcaption class="mono"><span>Video</span>${esc(caption)}</figcaption>` : ''}
  </figure>`;
}

/** Image in a frame that opens the lightbox. `group` links images so the lightbox can step through them. */
export function renderFig({ src, w, h, alt, cap, group = '', cls = '', eager = false, tag = '', reveal = false }) {
  return `
  <figure class="fig ${cls}" style="--ar:${(w / h).toFixed(4)}" ${reveal ? 'data-reveal' : ''}>
    <button class="fig-btn" type="button" data-zoom data-src="${src}" data-alt="${esc(alt)}" data-cap="${esc(cap)}" data-group="${group}" aria-label="Enlarge: ${esc(cap)}">
      <img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
      <span class="fig-zoom mono">Enlarge ${icons.plus}</span>
    </button>
    ${cap ? `<figcaption class="mono">${tag ? `<span>${esc(tag)}</span>` : ''}${esc(cap)}</figcaption>` : ''}
  </figure>`;
}

export function initVideos(root = document) {
  const all = $$('[data-vid]', root);
  all.forEach((fig) => {
    const v = fig.querySelector('video');
    const btn = fig.querySelector('.vid-play');
    v.controls = false; // the play button is the first control; native controls appear once playing
    const start = () => { v.controls = true; fig.classList.add('playing'); v.play().catch(() => { v.controls = true; }); };
    btn.addEventListener('click', start);
    v.addEventListener('play', () => {
      fig.classList.add('playing'); v.controls = true;
      all.forEach((o) => { if (o !== fig) o.querySelector('video').pause(); });
    });
    v.addEventListener('ended', () => { fig.classList.remove('playing'); v.controls = false; v.load(); });
  });
}
