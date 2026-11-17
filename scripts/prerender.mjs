/**
 * Build-time prerender: writes the rendered page into dist/index.html so crawlers, link
 * previews and no-JS visitors get real content. The browser bundle then hydrates in place.
 * Run automatically by `npm run build`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderApp } from '../src/app.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'index.html');
const html = await readFile(dist, 'utf8');
if (!html.includes('<div id="app"></div>')) throw new Error('prerender: #app placeholder not found');

await writeFile(dist, html.replace('<div id="app"></div>', `<div id="app" data-prerendered="true">${renderApp()}</div>`));
console.log('prerendered dist/index.html');
