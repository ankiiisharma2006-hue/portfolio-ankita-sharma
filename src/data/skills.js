/** Only tools that appear in the documentation or recordings as used. */
export const skillGroups = [
  {
    id: 'ai',
    title: 'AI & LLM',
    blurb: 'Models are tools inside a controlled system, not the source of truth.',
    items: [
      ['Google Gemini', 'Embeddings (gemini-embedding-001) and chat model'],
      ['Groq chat models', 'Answer generation in the video assistant and the Drive-synced agent'],
      ['Prompt engineering', 'Grounding rules, answer cases, injection resistance'],
      ['AI agents', 'n8n AI Agent with memory and a vector-search tool; tool-calling agents with human approval'],
      ['LLM chains', 'Basic LLM Chain with a fixed system message'],
      ['Grounding & citation checks', 'Source ids validated in code'],
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    blurb: 'n8n workflows built node by node, then debugged through Executions.',
    items: [
      ['n8n', 'Video assistant (two workflows), PDF RAG agent, Drive-synced knowledge base, email draft agent'],
      ['Form & chat triggers', 'Link submission and question input'],
      ['Code, IF and HTTP nodes', 'Validation, branching, retries'],
      ['API integrations', 'Supadata, YouTube oEmbed, Google Drive, Gmail, Telegram'],
      ['Credential management', 'Keys kept in the n8n credential store'],
      ['Execution debugging', 'Tracing silent failures'],
    ],
  },
  {
    id: 'rag',
    title: 'RAG & Data',
    blurb: 'Retrieval designed around the question, not just the nearest vector.',
    items: [
      ['Retrieval-augmented generation', 'Ingestion and chat pipelines'],
      ['Embeddings & chunking', 'Gemini 3072-d vectors with 500-character chunks; Hugging Face embeddings in the Drive-synced base'],
      ['Supabase', 'Vector store, Row Level Security, service role, a separate schema for an invoice app'],
      ['pgvector', 'Cosine similarity via a custom match function'],
      ['PostgreSQL', 'Chat memory and metadata in jsonb'],
      ['Metadata filtering', 'Per-video filters and safe re-indexing'],
    ],
  },
  {
    id: 'dev',
    title: 'Development',
    blurb: 'Small, readable code where deterministic logic beats a prompt.',
    items: [
      ['JavaScript', 'n8n Code nodes: chunking, citations, link building'],
      ['SQL', 'Table, video-id index and similarity-search function for pgvector'],
      ['Regular expressions', 'URL validation across five YouTube link forms'],
      ['Web interfaces', 'Chat, approvals queue and dashboards around the agent (invoice and restaurant apps)'],
      ['Websites', 'Responsive HTML, CSS and JavaScript pages, like this portfolio'],
      ['Technical documentation', 'Test reports with known limitations'],
    ],
  },
];

