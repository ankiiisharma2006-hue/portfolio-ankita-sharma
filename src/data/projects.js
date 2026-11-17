const BASE = import.meta.env?.BASE_URL ?? './';

/**
 * Project facts come from the supplied documentation and screen recordings only.
 * status: 'prototype' | 'complete' | 'brief'
 *   prototype — built and tested, with documented gaps
 *   complete  — a working build; the docs record a basic end-to-end check
 *   brief     — an assigned scope that is documented as a specification; the
 *               supplied files do not describe a finished build. Change the
 *               status (and add detail) here once a build is documented.
 */
export const statusLabels = {
  prototype: 'Working prototype',
  complete: 'Working build',
  brief: 'Scoped brief',
};

/**
 * Screenshots shown as evidence.
 *   evidence    — screenshots: put the image in public/assets/ and set src + alt + caption
 */
export const flagship = {
  slug: 'video-assistant',
  evidence: [
    { key: 'canvas', label: 'n8n workflow canvas (Workflow A)', src: 'workflow-a-index.webp', alt: 'n8n canvas of Workflow A, which indexes a video.', caption: 'Workflow A, index a video.' },
    { key: 'canvas-b', label: 'n8n workflow canvas (Workflow B)', src: 'workflow-b-answer.webp', alt: 'n8n canvas of Workflow B, which answers a question.', caption: 'Workflow B, answer a question.' },
  ],
  index: '01',
  status: 'prototype',
  name: 'Timestamped AI Video Knowledge Assistant',
  kicker: 'n8n · Gemini embeddings · Groq · Supabase pgvector',
  summary:
    'Paste a YouTube link, index its transcript, then ask questions in chat. Every answer is written only from the transcript and carries clickable timestamps that open the video at the right moment.',
  problem:
    'Long videos are hard to search. A plain chatbot would answer from general knowledge and invent timestamps. This system had to stay inside the transcript, say so when the video does not cover a question, and point to real moments.',
  approach:
    'Two n8n workflows share one Supabase table. Ingestion turns a transcript into timestamped, embedded passages. Q&A retrieves the closest passages, writes an answer from them alone, and builds the source links in code.',
  contribution:
    'Built and tested both workflows: URL validation, transcript fetch, chunking and timestamp maths, the pgvector table and match function, the prompt, and the code that checks citations and builds links. Wrote the test report and documentation.',
  facts: [
    { value: '57', label: 'passages indexed', note: 'one 20-minute test video' },
    { value: '0:00–20:18', label: 'transcript span covered', note: 'start/end second stored per passage' },
    { value: '31 s', label: 'average passage length', note: 'after cutting size from 800 to 500 characters' },
    { value: '3072', label: 'embedding dimensions', note: 'gemini-embedding-001' },
  ],
  highlights: [
    'Two n8n workflows share one Supabase table: ingestion and Q&A never call each other.',
    'Timestamps are calculated in code from transcript offsets. The model is told never to write a time, and code checks for it.',
    'Questions the video does not cover return a short “not found” reply with no sources.',
    'A summary mode samples 16 passages evenly across the video and states how many it used.',
  ],
  stack: [
    ['Orchestration', 'n8n (form trigger, chat trigger, Code, IF, HTTP, Supabase and LLM Chain nodes)'],
    ['Models', 'Gemini embeddings (gemini-embedding-001) · Groq chat model'],
    ['Storage & retrieval', 'Supabase · PostgreSQL · pgvector · Row Level Security'],
    ['External APIs', 'Supadata (transcripts) · YouTube oEmbed (titles)'],
    ['Code', 'JavaScript in Code nodes · SQL for the table and match function'],
  ],
  figure: {
    src: `${BASE}assets/video-assistant-architecture-full.webp`,
    full: `${BASE}assets/video-assistant-architecture-full.webp`,
    alt: 'Architecture diagram. Workflow A ingests a YouTube link through validation, transcript fetch, chunking, deletion of old chunks, embedding and a verified count into Supabase. Workflow B embeds a question, retrieves chunks, builds context, calls a Groq model and appends clickable timestamps.',
    caption: 'Architecture diagram from the project documentation (Figure 1).',
  },
};

export const secondary = {
  slug: 'rag-pdf',
  evidence: [
    { key: 'canvas', label: 'n8n workflow canvas (ingestion + chat)', src: 'workflow.webp', alt: 'n8n canvas of the PDF ingestion and chat workflows.', caption: 'Ingestion and chat workflow.' },
    { key: 'chat', label: 'A question answered from the PDF', src: 'answer.webp', alt: 'A question answered from the PDF in the n8n chat.', caption: 'A question answered from the PDF.' },
  ],
  index: '02',
  status: 'complete',
  name: 'PDF Question-Answering RAG Agent',
  kicker: 'n8n · Gemini · Supabase Vector Store · Postgres memory',
  summary:
    'An n8n workflow that ingests a PDF from Google Drive, stores its embeddings in Supabase, and answers questions in a chat interface using retrieved passages and conversation memory.',
  problem:
    'Answers should come from the project’s own document rather than the model’s general knowledge, and follow-up questions should keep their context within a chat session.',
  contribution:
    'Built the ingestion and chat workflows in n8n, connected the Gemini credential, fixed the credential and model-access errors above, and ran both pipelines end to end.',
  stack: [
    ['Orchestration', 'n8n (manual trigger, chat trigger, AI Agent)'],
    ['Source', 'Google Drive (PDF download)'],
    ['Models', 'Gemini embeddings · Gemini chat model'],
    ['Storage & memory', 'Supabase Vector Store · Postgres chat memory'],
  ],
  pipelines: [
    {
      id: 'ingest',
      title: 'Ingestion pipeline',
      note: 'Run manually when a document needs to be ingested or refreshed.',
      nodes: [
        { name: 'Manual trigger', type: 'Trigger', text: 'Starts the document ingestion workflow on demand.' },
        { name: 'Download File', type: 'Google Drive', text: 'Downloads the target PDF from Google Drive.' },
        { name: 'Default Data Loader', type: 'Loader', text: 'Reads the downloaded PDF and extracts its text content.' },
        { name: 'Gemini Embeddings', type: 'Embeddings', text: 'Converts the text into vector embeddings. The configured model produces 3072-dimensional vectors.' },
        { name: 'Supabase Vector Store', type: 'Storage', text: 'Stores the document chunks and their embeddings in the Supabase PostgreSQL vector database.' },
      ],
    },
    {
      id: 'chat',
      title: 'AI chat pipeline',
      note: 'Runs on every question from the n8n chat interface.',
      nodes: [
        { name: 'Chat trigger', type: 'Trigger', text: 'Receives the user’s question from the n8n chat interface and starts the workflow.' },
        { name: 'AI Agent', type: 'Agent', text: 'Coordinates the user query, the vector search tool, conversation memory and the Gemini model.' },
        { name: 'Postgres Chat Memory', type: 'Memory', text: 'Stores and retrieves conversation history for the active session so follow-ups keep context.' },
        { name: 'Supabase vector search', type: 'Retrieval', text: 'Embeds the question with Gemini and searches the vector store for the most relevant chunks.' },
        { name: 'Gemini Chat Model', type: 'LLM', text: 'Combines the question with the retrieved context to write the final answer.' },
      ],
    },
  ],
  resolved: [
    ['Gemini API / credential access error', 'Created a fresh Gemini API key and updated the n8n credential.'],
    ['Gemini model access error', 'Switched to an available chat model supported by the project.'],
    ['PDF content missing from the chat agent', 'Completed the ingestion workflow so the PDF landed in the vector store.'],
  ],
  tested: [
    'Gemini credential connects and the chat model responds.',
    'Ingestion workflow executed successfully.',
    'Chat tested with a question about the ingested PDF; the vector-search component retrieved document content.',
  ],
  next: [
    'Support multiple PDFs and metadata filtering',
    'Handle document updates and deletion',
    'Add evaluation questions and source/page references',
  ],
};
