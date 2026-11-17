import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/projects.css';
import './styles/work.css';
import './styles/case.css';
import './styles/sections.css';

import { renderApp } from './app.js';
import { initNav } from './components/nav.js';
import { initProjects } from './components/projects.js';
import { initCase } from './components/caseStudy.js';
import { initLightbox } from './components/lightbox.js';
import { initContact } from './components/contact.js';
import { runLoader } from './components/loader.js';
import { initHero } from './components/hero.js';
import { initReveal, initCounters, initProgress, initParallax, initSpotlight, initMagnetic } from './lib/motion.js';
import { $ } from './lib/dom.js';

document.documentElement.classList.add('js');
document.documentElement.dataset.title = document.title;

// The production build ships prerendered markup; in dev the page is rendered here.
const app = $('#app');
if (!app.dataset.prerendered) app.innerHTML = renderApp();

runLoader();
initNav();
initProjects();
initLightbox();
initCase();
initContact();
initReveal();
initCounters();
initProgress();
initHero();
initParallax();
initSpotlight();
initMagnetic();
