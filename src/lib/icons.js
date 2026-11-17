const s = (p, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;

export const icons = {
  arrowUpRight: s('<path d="M7 17 17 7M8 7h9v9"/>', 'class="go"'),
  arrowDown: s('<path d="M12 5v14M6 13l6 6 6-6"/>', 'class="down"'),
  arrowRight: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  close: s('<path d="M6 6l12 12M18 6 6 18"/>'),
  plus: s('<path d="M12 5v14M5 12h14"/>'),
  github: s('<path d="M9 19c-5 1.500-5-2.500-7-3m14 6v-3.870a3.370 3.370 0 0 0-.940-2.610c3.140-.350 6.440-1.540 6.440-7A5.440 5.440 0 0 0 20 4.770 5.070 5.070 0 0 0 19.910 1S18.730.650 16 2.480a13.380 13.380 0 0 0-7 0C6.270.650 5.090 1 5.090 1A5.070 5.070 0 0 0 5 4.770a5.440 5.440 0 0 0-1.500 3.780c0 5.420 3.300 6.610 6.440 7A3.370 3.370 0 0 0 9 18.130V22"/>'),
  linkedin: s('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>'),
  play: s('<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'),
  prev: s('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  bot: s('<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4.5M9 13v1.5M15 13v1.5M2 13v3M22 13v3"/><circle cx="12" cy="3.5" r="1"/>'),
  chat: s('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>'),
  app: s('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 14h3M8 17h6M15 14h3"/>'),
  site: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.800 2.600 4 5.600 4 9s-1.200 6.400-4 9c-2.800-2.600-4-5.600-4-9s1.200-6.400 4-9z"/>'),
  book: s('<path d="M4 5.500A2.500 2.500 0 0 1 6.500 3H20v15H6.500A2.500 2.500 0 0 0 4 20.500z"/><path d="M4 20.500A2.500 2.500 0 0 0 6.500 23H20v-5M9 8h7M9 11.500h5"/>'),
  flow: s('<rect x="3" y="4" width="6" height="5" rx="1.500"/><rect x="15" y="4" width="6" height="5" rx="1.500"/><rect x="9" y="15" width="6" height="5" rx="1.500"/><path d="M9 6.500h6M6 9v3h12V9M12 12v3"/>'),
  db: s('<ellipse cx="12" cy="5.500" rx="8" ry="3"/><path d="M4 5.500v13c0 1.700 3.600 3 8 3s8-1.300 8-3v-13M4 12c0 1.700 3.600 3 8 3s8-1.300 8-3"/>'),
  shield: s('<path d="M12 3 4.500 6v6c0 4.500 3.200 7.700 7.500 9 4.300-1.300 7.500-4.500 7.500-9V6z"/><path d="m8.800 12 2.400 2.400 4.200-4.600"/>'),
  check: s('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 12l2 2 4-4M9 17.500h6"/>'),
  mail: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
};
