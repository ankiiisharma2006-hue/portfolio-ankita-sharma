import { skillGroups } from '../data/skills.js';
import { split } from '../lib/text.js';
import { esc } from '../lib/dom.js';

export function renderSkills() {
  return `
  <section class="section skills" id="skills" aria-labelledby="skills-title">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow" data-reveal>Toolbox</p>
        <h2 id="skills-title" data-split>${split('What I’ve actually *used*.')}</h2>
        <p data-reveal style="--d:1">Each item shows where it appears in my documented work. No percentage bars: a skill is not a progress meter.</p>
      </div>
      <div class="toolbox">
        ${skillGroups
          .map(
            (g, gi) => `
          <section class="tb-row" data-reveal style="--d:${gi % 2}" aria-labelledby="sk-${g.id}">
            <header>
              <h3 id="sk-${g.id}">${esc(g.title)}</h3>
              <p>${esc(g.blurb)}</p>
            </header>
            <ul>
              ${g.items.map(([n, d]) => `<li><b>${esc(n)}</b> ${esc(d)}</li>`).join('')}
            </ul>
          </section>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}
