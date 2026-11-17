/** Page markup. Pure string rendering, so it runs in the browser and in the build-time prerender. */
import { renderNav } from './components/nav.js';
import { renderHero } from './components/hero.js';
import { renderAbout } from './components/about.js';
import { renderProjects } from './components/projects.js';
import { renderCase } from './components/caseStudy.js';
import { renderSkills } from './components/skills.js';
import { renderExperience } from './components/experience.js';
import { renderContact } from './components/contact.js';
import { renderLightbox } from './components/lightbox.js';

export function renderApp() {
  return `
  <a class="skip" href="#main">Skip to content</a>
  ${renderNav()}
  <main id="main">
    ${renderHero()}
    ${renderProjects()}
    ${renderAbout()}
    ${renderSkills()}
    ${renderExperience()}
    ${renderContact()}
  </main>
  ${renderCase()}
  ${renderLightbox()}`;
}
