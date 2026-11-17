/**
 * Lists what is still empty (only the public site URL, which is added after hosting).
 * Runs at the end of `npm run build`. Exit code is always 0; run `npm run check` to fail instead.
 */
import { site } from '../src/config/site.js';
import { flagship, secondary } from '../src/data/projects.js';

const todo = [];
const need = (ok, what, file) => !ok && todo.push([what, file]);
const SITE = 'src/config/site.js';
need(site.url, 'Public site URL (for link previews)', SITE);
for (const [name, p] of [['Video assistant', flagship], ['PDF RAG agent', secondary]]) {
  p.evidence.forEach((e) => need(e.src, `${name}: ${e.label}`, 'src/data/projects.js'));
}

if (!todo.length) console.log('\n✓ All personal details are filled in.\n');
else {
  console.log(`\n⚠  ${todo.length} item(s) still need your input${site.showPlaceholders ? ' (shown as amber PLACEHOLDER boxes on the site)' : ' (placeholders are hidden: showPlaceholders is false)'}:`);
  todo.forEach(([w, f]) => console.log(`   • ${w}  →  ${f}`));
  console.log('');
  if (process.argv.includes('--strict')) process.exit(1);
}
