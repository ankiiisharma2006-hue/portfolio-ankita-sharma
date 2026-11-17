import { split } from '../lib/text.js';
import { esc } from '../lib/dom.js';
import { icons } from '../lib/icons.js';

/**
 * Capabilities. Each one points at a project on this site where it can be seen running,
 * so nothing here is a claim without something to open.
 */
const caps = [
  { i: 'bot', t: 'AI agents that use tools', b: 'LLM agents that query a database, look things up and prepare an action for a person to approve.', href: '#invoice-agent', ev: 'Invoice follow-up agent' },
  { i: 'chat', t: 'Chat and approval screens', b: 'A chat beside live results and an approvals queue, so people see what the agent proposes before anything happens.', href: '#invoice-agent', ev: 'Invoice follow-up agent' },
  { i: 'app', t: 'Web apps around the agent', b: 'Guest ordering page, kitchen view, owner dashboard and menu manager built around an AI dining assistant.', href: '#restaurant-agent', ev: 'Restaurant order agent' },
  { i: 'site', t: 'Websites and landing pages', b: 'Responsive, content-first sites that explain a product or a body of work clearly. This portfolio is one.', href: '#home', ev: 'This portfolio' },
  { i: 'book', t: 'Knowledge assistants (RAG)', b: 'Assistants that answer only from your videos, PDFs or Drive files, and point back to the source.', href: '#/case/video-assistant', ev: 'Timestamped video assistant' },
  { i: 'flow', t: 'Workflow automation', b: 'Triggers, schedules, Gmail, Telegram and Drive steps wired into one flow: mostly n8n, with code where it needs it.', href: '#email-rag-draft', ev: 'Email classifier with drafts' },
  { i: 'db', t: 'Data and integrations', b: 'Supabase and Postgres tables, vector search, Google Drive, Gmail and Telegram connected cleanly.', href: '#drive-rag', ev: 'Drive-synced knowledge base' },
  { i: 'shield', t: 'A person stays in charge', b: 'Nothing is sent until someone confirms it: Telegram review, an approvals queue, confirm or cancel.', href: '#email-rag-draft', ev: 'Email classifier with drafts' },
  { i: 'check', t: 'Tested and documented', b: 'Test reports with passes, partial results and what is still untested, plus architecture notes.', href: '#/case/video-assistant', ev: 'Video assistant case study' },
];

const principles = [
  {
    t: 'Let code own the facts',
    b: 'In the video assistant the model never writes a timestamp. Times are computed from transcript offsets and the links are built in code, with a check that flags any time the model invents.',
    ev: 'Video Assistant · Append Sources node',
  },
  {
    t: 'Don’t trust a green run',
    b: 'n8n can report success while a node set to continue on error has failed. Each ingestion compares the expected and stored row counts before it reports anything as done.',
    ev: 'Video Assistant · Verify Storage node',
  },
  {
    t: 'Write down what isn’t tested',
    b: 'My documentation lists passes, partial results and pending tests side by side, including the one sentence a model added that its cited passage did not support.',
    ev: 'Video Assistant · test C5, pending tests',
  },
];

export function renderAbout() {
  return `
  <section class="section about band" id="about" aria-labelledby="about-title">
    <div class="wrap">
      <header class="cap-head">
        <p class="eyebrow" data-reveal>Services</p>
        <div>
          <h2 id="about-title" data-split>${split('I build AI agents, the *interfaces* around them, and the automation behind them.')}</h2>
          <p class="cap-sub" data-reveal style="--d:1">Not a wall of tool logos. Each capability below opens a project where you can see it running.</p>
        </div>
      </header>

      <ul class="cap-grid">
        ${caps
          .map(
            (c, i) => `
        <li data-reveal style="--d:${i % 3}">
          <a class="cap" href="${c.href}"${c.href.startsWith('#/case') ? ` data-case="video-assistant"` : ''}>
            <span class="cap-ic" aria-hidden="true">${icons[c.i]}</span>
            <h3>${esc(c.t)}</h3>
            <p>${esc(c.b)}</p>
            <span class="cap-go mono">${esc(c.ev)} ${icons.arrowRight}</span>
          </a>
        </li>`
          )
          .join('')}
      </ul>

      <div class="about-grid how">
        <div class="about-intro">
          <p class="eyebrow" data-reveal>How I work</p>
          <h3 class="how-h" data-split>${split('Whatever I build has to be *checkable.*')}</h3>
          <p class="about-p" data-reveal style="--d:1">
            Most of the real engineering is unglamorous: a retired model returning 404s, a vector with no dimensions, a prompt broken by curly braces, a summary that covered 23% of a video. For each one I wrote down why it happened and kept the check that would catch it again.
          </p>
        </div>
        <ol class="principles">
          ${principles
            .map(
              (p, i) => `
            <li data-reveal style="--d:${i}">
              <span class="p-n mono">0${i + 1}</span>
              <div>
                <h3>${p.t}</h3>
                <p>${p.b}</p>
                <span class="p-ev">Evidence: ${p.ev}</span>
              </div>
            </li>`
            )
            .join('')}
        </ol>
      </div>
    </div>
  </section>`;
}
