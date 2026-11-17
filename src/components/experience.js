import { esc } from '../lib/dom.js';
import { split } from '../lib/text.js';
import { icons } from '../lib/icons.js';

/** Experience facts are limited to what the documentation and recordings support. No employer or dates are shown. */
const job = {
  role: 'AI Automation Engineer',
  summary:
    'Building retrieval-augmented generation systems, agents and AI workflows in n8n, and writing up what worked and what did not.',
  points: [
    'Diagnosed integration faults: credential and retired-model errors, empty embeddings, shared-table contamination, prompt template clashes and silent n8n node failures.',
    'Documented each system with architecture, test reports, known limitations and next steps, keeping secrets out of the write-ups.',
    'Built and recorded working prototypes for a Drive-synced knowledge base, a Gmail draft agent with Telegram review, a human-confirmed restaurant order agent and an invoice follow-up agent with an approval queue.',
  ],
  outputs: [
    { s: 'prototype', label: 'Working prototype', name: 'Timestamped AI Video Knowledge Assistant', note: 'Two n8n workflows, a pgvector table, Gemini embeddings and a Groq answer model. Documented as v1.0 on 13 October 2026.', href: '#/case/video-assistant', cta: 'Case study' },
    { s: 'complete', label: 'Working build', name: 'PDF Question-Answering RAG Agent', note: 'Google Drive PDF into a Supabase vector store, answered by a Gemini agent with Postgres chat memory.', href: '#rag-pdf', cta: 'View project' },
    { s: 'complete', label: 'Working build', name: 'AI invoice follow-up agent', note: 'Overdue invoices from a database, follow-up emails proposed by an agent, and a Gmail draft only after a person approves.', href: '#invoice-agent', cta: 'View project' },
    { s: 'prototype', label: 'Working prototypes', name: 'Three more systems on screen', note: 'Drive-synced knowledge base, email drafts with Telegram review, and a restaurant order agent.', href: '#drive-rag', cta: 'See all work' },
  ],
  tech: ['n8n', 'Google Gemini', 'Groq', 'Supabase', 'pgvector', 'PostgreSQL', 'JavaScript', 'SQL', 'Google Drive'],
};

export function renderExperience() {
  return `
  <section class="section experience" id="experience" aria-labelledby="exp-title">
    <div class="wrap">
      <div class="exp-grid">
        <div class="exp-main">
          <p class="eyebrow" data-reveal>Experience</p>
          <h2 id="exp-title" data-split>${split(job.role)}</h2>
          <p class="exp-meta mono" data-reveal>${['AI automation', 'RAG', 'agents'].join(' · ')}</p>
          <p class="exp-sum" data-reveal>${esc(job.summary)}</p>
          <ul class="bul bul-lg" data-reveal>${job.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <ul class="tags" data-reveal>${job.tech.map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
        </div>
        <div class="exp-out">
          <h3 class="label" data-reveal>Selected outputs</h3>
          <ol>
            ${job.outputs
              .map(
                (o, i) => `
              <li data-reveal style="--d:${i}">
                <a href="${o.href}" data-spot>
                  <span class="chip" data-s="${o.s}">${o.label}</span>
                  <b>${esc(o.name)}</b>
                  <span class="o-note">${esc(o.note)}</span>
                  <span class="o-cta mono">${o.cta} ${icons.arrowRight}</span>
                </a>
              </li>`
              )
              .join('')}
          </ol>
        </div>
      </div>
    </div>
  </section>`;
}
