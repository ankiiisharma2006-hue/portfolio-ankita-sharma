/**
 * Builds a clean copy of the site in `site-upload/` that contains ONLY what the page uses.
 * public/assets/projects holds extra recordings that are not shown on the site (they stay
 * on your computer); this keeps them, and the old PNG copies, out of the published site.
 * Your originals and dist/ are never changed. Run with: npm run deploy
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { FOLDERS } from '../src/data/work.js';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const out = new URL('../site-upload/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
if (!existsSync(dist)) throw new Error('dist/ not found. Run "npm run build" first.');

const used = new Set(Object.values(FOLDERS));
const keepExt = new Set(['.webp', '.mp4']);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

cpSync(dist, out, {
  recursive: true,
  filter: (src) => {
    const rel = src.slice(dist.length).replace(/\\/g, '/');
    const m = rel.match(/^assets\/projects\/([^/]+)(?:\/(.+))?$/);
    if (!m) return true;
    if (!used.has(m[1])) return false; // a folder the page does not use
    return !m[2] || keepExt.has(extname(m[2]).toLowerCase()); // images/videos only
  },
});

const size = (d) => readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? size(join(d, e.name)) : statSync(join(d, e.name)).size), 0);
console.log(`\n✓ site-upload/ is ready (${(size(out) / 1048576).toFixed(0)} MB, was ${(size(dist) / 1048576).toFixed(0)} MB). Upload THIS folder.\n`);
