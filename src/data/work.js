const BASE = import.meta.env?.BASE_URL ?? './';

/** Path to a processed project asset in public/assets/projects/<folder>/ */
export const A = (folder, file) => `${BASE}assets/projects/${folder}/${file}`;

export const FOLDERS = {
  'video-assistant': 'timestamped-ai-video-knowledge-assistant',
  'rag-pdf': 'pdf-question-answering-rag-agent',
  'drive-rag': 'drive-synced-rag-knowledge-base',
  'email-rag-draft': 'email-classifier-with-rag-draft-replies',
  'restaurant-agent': 'restaurant-order-agent-webapp',
  'invoice-agent': 'invoice-follow-up-agent',
};

/**
 * Projects 03–06. Every statement comes from the supplied task documents or from what the
 * recordings and screenshots show. Things a brief asks for but no recording shows are listed
 * separately as "specified", never as done.
 */
export const driveRag = {
  slug: 'drive-rag',
  folder: FOLDERS['drive-rag'],
  index: '03',
  status: 'prototype',
  name: 'Drive-synced RAG knowledge base',
  kicker: 'n8n · Google Drive · Hugging Face embeddings · Groq · Supabase vector store',
  summary:
    'Company documents sit in one shared Google Drive folder. An n8n workflow turns each new file into searchable chunks in Supabase, and a chat agent answers only by searching them.',
  problem:
    'A knowledge base that is loaded once goes stale. Files added, changed or removed in Drive have to show up in what the assistant can retrieve, and the answers should come from those files, not from the model.',
  recording:
    'Screen recording of a test run on a sample company. The shared folder holds a PDF, a Google Doc and a Markdown file. Asked who the company’s directors are, the agent replied with names taken from those documents.',
  video: { file: 'drive-synced-rag-knowledge-base-walkthrough.mp4', poster: 'poster.webp', duration: '0:54', label: 'Drive-synced knowledge base walkthrough' },
  figure: { file: 'workflow.webp', w: 3744, h: 2438, alt: 'n8n canvas. A Google Drive trigger and a file download feed a Supabase vector store through a data loader, a text splitter and Hugging Face embeddings. Below, a chat message goes to an AI Agent that uses a Groq chat model and a Supabase vector store tool.' },
  notes: [
    { x: 14.5, y: 20.5, t: 'Drive trigger and download', b: 'A new file in the shared folder starts the run, and the file is downloaded.' },
    { x: 85, y: 40, t: 'Loader and text splitter', b: 'The file’s text is loaded and cut into chunks with a recursive character splitter.' },
    { x: 35.5, y: 36.5, t: 'Embeddings', b: 'A Hugging Face embeddings model turns each chunk into a vector.' },
    { x: 58.5, y: 20.5, t: 'Supabase vector store', b: 'Chunks and their vectors are saved, ready to be searched by meaning.' },
    { x: 47.8, y: 50, t: 'Chat message and AI Agent', b: 'A chat message starts a second path. An AI Agent decides when to search.' },
    { x: 29.5, y: 66.5, t: 'Groq chat model', b: 'The model writes the reply from what the agent retrieves.' },
    { x: 68, y: 59.5, t: 'Vector store as a tool', b: 'The agent searches the same Supabase store, with the same embeddings model.' },
  ],
  shows: [
    'A shared Drive folder called RAG-Knowledge-Base with a PDF, a Google Doc and a Markdown file.',
    'The ingestion path: Drive trigger, download, loader, splitter, embeddings, Supabase store.',
    'Clean-up branches on the canvas: an updated-file trigger and a scheduled folder search, each ending in a Supabase “Delete a row” step.',
    'A live question in the n8n chat, answered from the Drive documents.',
  ],
  specified: [
    'Supports PDF, TXT and Markdown files.',
    'On update: find every chunk for that file, remove it, then process the new version.',
    'Each chunk keeps Drive file ID, filename, type, source URL and last-updated time.',
    'Lifecycle to verify: add, retrieve, update, retrieve, delete, confirm removal. The recording shows the add and ask steps.',
  ],
  stack: [
    ['Orchestration', 'n8n (Drive trigger, schedule trigger, chat trigger, AI Agent)'],
    ['Source', 'Google Drive'],
    ['Models', 'Hugging Face embeddings · Groq chat model'],
    ['Storage & retrieval', 'Supabase vector store'],
  ],
};

export const emailRag = {
  slug: 'email-rag-draft',
  folder: FOLDERS['email-rag-draft'],
  index: '04',
  status: 'prototype',
  name: 'Email classifier with RAG draft replies',
  kicker: 'n8n · Gmail · LLM classification · Supabase RAG · Telegram',
  summary:
    'Read incoming Gmail, work out its category and, for selected categories only, draft a reply from the knowledge base. The draft is saved in Gmail and sent to Telegram, where a person reviews it and chooses whether to send.',
  problem:
    'Replies should be useful and grounded in the knowledge base, but nothing should be sent without a person reading it first.',
  video: { file: 'task3-email-draft-telegram-review.mp4', poster: 'poster.webp', duration: '0:05', label: 'Email draft and Telegram review, short clip' },
  gallery: [
    { key: 'overview', tab: 'Overview', file: 'overview.webp', w: 3296, h: 1810, alt: 'Two Telegram messages, a Support email and a Policy email, each with a drafted reply, and the matching Gmail draft.', cap: 'Test emails categorised as Support and Policy, with their draft replies in Telegram and the Gmail draft.' },
    { key: 'telegram', tab: 'Telegram review', file: 'telegram.webp', w: 3000, h: 1858, alt: 'A Telegram message showing the email category, subject and drafted reply with a Send Email button.', cap: 'The category, the subject and the drafted reply arrive in Telegram with a Send Email button under the message.' },
    { key: 'gmail', tab: 'Gmail draft', file: 'gmail.webp', w: 3000, h: 2284, alt: 'A Gmail draft reply to a customer asking about concurrency and a custom discount.', cap: 'The same reply is also saved as a Gmail draft under the customer’s message.' },
  ],
  flow: ['Gmail trigger', 'Classify', 'Selected category?', 'Retrieve knowledge', 'Generate reply', 'Gmail draft', 'Telegram review'],
  gate: 6,
  points: [
    'The category is identified automatically. The test screenshots show Support and Policy emails.',
    'A draft is created only for selected categories, such as Product Enquiry, New Partnership, Policy or Support.',
    'The reply must not invent information the knowledge base does not support.',
    'Each draft is posted to Telegram with a Send Email button and also saved as a Gmail draft. Nothing is sent without a person choosing to.',
  ],
  stack: [
    ['Orchestration', 'n8n'],
    ['Mail', 'Gmail trigger and Gmail draft'],
    ['Review', 'Telegram message with a Send Email button'],
    ['Knowledge', 'Supabase RAG knowledge base, LLM classification and reply'],
  ],
  note: 'Telegram tweak requests are not shown in the recordings, so they are not claimed here.',
};

export const restaurant = {
  slug: 'restaurant-agent',
  folder: FOLDERS['restaurant-agent'],
  index: '05',
  status: 'prototype',
  name: 'AI restaurant order agent',
  kicker: 'Web app · LLM tool calling · menu database · allergen answers from menu data',
  summary:
    'A restaurant web app built around one rule: the AI proposes, a person confirms. A guest chats with a dining assistant at their table, and the assistant prepares a bill that the guest checks and confirms or cancels.',
  problem:
    'Letting an LLM write straight to an orders database is unsafe. Every change has to go through defined tools and an explicit confirmation step, and allergen answers must come from menu data, not from what a model remembers.',
  slides: [
    { file: '04-proposal-and-bill.webp', w: 2052, h: 1049, t: 'Guest ordering page', alt: 'A restaurant ordering page with an AI Dining Assistant open at Table 10, showing a bill with Confirm order and Cancel buttons.', cap: 'The ordering page with the AI Dining Assistant open at Table 10. The assistant has prepared a bill and waits for Confirm or Cancel.' },
    { file: '05-confirm.webp', w: 680, h: 1016, t: 'Proposal, not an order', alt: 'Chat where a guest writes i wanta lemonade and the assistant prepares a proposal for 1 Lemonade with a bill to confirm or cancel.', cap: 'A typed request becomes a proposal and a bill. The reply says to use the buttons on the screen to confirm or cancel.' },
    { file: '06-did-you-mean.webp', w: 680, h: 1015, t: 'Did you mean…?', alt: 'A dialog asking Did you mean Lemonade, with Yes and No buttons, for the text i wanta lemonde.', cap: 'A misspelt request is matched to a menu item and checked with the guest before anything is prepared.' },
    { file: '07-allergen.webp', w: 680, h: 852, t: 'Allergens from the menu', alt: 'Chat answer to i am allergic to dairy, listing dishes that contain milk and dishes listed as free of milk.', cap: 'An allergy question is answered from the menu’s own allergen data, with dishes that contain milk and dishes listed as free of it.' },
    { file: '01-owner-dashboard.webp', w: 1418, h: 745, t: 'Owner dashboard', alt: 'Owner dashboard with revenue, orders, active orders and a seven-day revenue chart.', cap: 'Owner dashboard: revenue, orders, active orders and a seven-day revenue chart, here with sample data.' },
    { file: '02-kitchen.webp', w: 1418, h: 747, t: 'Kitchen command center', alt: 'Kitchen board with columns New orders, Cooking, Ready and Served, and a Start Cooking button on a new order.', cap: 'Kitchen command center. Orders move across New, Cooking, Ready and Served.' },
    { file: '03-menu-manager.webp', w: 1418, h: 750, t: 'Menu manager', alt: 'Menu manager listing dishes with prices, dietary tags and allergen labels, and Hide, Edit and Delete buttons.', cap: 'Menu manager. Each dish carries its dietary tag and allergens, and changes show to guests and to the assistant straight away.' },
    { file: '08-table-qr.webp', w: 573, h: 788, t: 'Table QR cards', alt: 'Printable cards for tables 5 to 8, each with a QR code.', cap: 'Printable table cards. Scanning one opens the menu for that table.' },
  ],
  rules: [
    ['Propose', 'The assistant turns a request into a proposed order and bill. Nothing is saved yet.'],
    ['Confirm', 'The guest presses Confirm order or Cancel. Only Confirm touches the order.'],
    ['Ground', 'Allergen answers are built from the menu’s data.'],
  ],
  specifiedTools: ['search_menu()', 'get_item_details()', 'create_order()', 'update_order()', 'apply_discount()'],
  flow: ['Staff request', 'AI agent', 'Menu lookup', 'Proposed action', 'Human confirms', 'Database action'],
  gate: 4,
  tested: [
    'The brief’s test list: normal orders, item and quantity changes, discounts, unavailable and unknown items, allergen questions, confirmation and cancellation.',
    'Screenshots show a proposal and confirm, a misspelt item, and an allergen question. The other cases are not shown.',
  ],
  stack: [
    ['Interface', 'Guest ordering page with chat, owner dashboard, kitchen board, menu manager'],
    ['Agent', 'LLM with defined tools, human confirmation before any change'],
    ['Data', 'Menu database with allergen data'],
  ],
};

export const invoice = {
  slug: 'invoice-agent',
  folder: FOLDERS['invoice-agent'],
  index: '06',
  status: 'complete',
  name: 'AI invoice follow-up agent',
  kicker: 'Web app · LLM agent with tools · Supabase Postgres · Gmail drafts',
  summary:
    'Ask in plain words which invoices are overdue. The agent reads the database, proposes a follow-up email for each one and waits for a person to approve it. Approval creates a Gmail draft.',
  problem:
    'Chasing late invoices is repetitive, but a wrong figure or an unreviewed email costs trust. The numbers must come from the database, and a person must stay in charge of anything that leaves the building.',
  video: { file: 'invoice-follow-up-agent-walkthrough.mp4', poster: 'poster.webp', duration: '1:05', label: 'Invoice follow-up agent walkthrough' },
  facts: [
    { value: '13', label: 'overdue invoices', note: 'found in the sample data' },
    { value: '10', label: 'drafts proposed', note: 'none created before approval' },
    { value: '6', label: 'approval states', note: 'proposed to drafted, in the schema' },
    { value: '3', label: 'screens in one page', note: 'chat, results, approvals' },
  ],
  views: [
    { file: 'overview.webp', w: 3273, h: 2195, t: 'Chat, results, approvals', alt: 'The app with a chat on the left, invoice results in the middle and an approvals queue on the right showing an email proposal.', cap: 'One page: a chat with the agent, exact invoice figures from the database, and the approvals queue.' },
    { file: 'approval-states.webp', w: 3000, h: 2397, t: 'Proposal, then draft', alt: 'Two approval cards. One reads Draft created and says it has not been sent. The other reads AI proposal, nothing has been created yet.', cap: 'Each card says what has and has not happened. “Draft created… NOT been sent” against “AI proposal. Nothing has been created yet.”' },
    { file: 'gmail-draft.webp', w: 3000, h: 2186, t: 'The Gmail draft', alt: 'A Gmail compose window with the recipient, subject and body of a friendly payment reminder.', cap: 'After approval the email waits in Gmail as a draft, including the person’s edit.' },
  ],
  rules: [
    ['Figures from the database', 'Invoice results show exact figures straight from the database, not from the AI’s wording.'],
    ['Overdue is calculated', 'It is never stored. It is worked out from unpaid status and a due date before today.'],
    ['Proposal or done', 'A proposal says nothing has been created yet. After approval the card says a draft was created, not sent.'],
    ['A person approves', 'Nothing reaches Gmail until a person approves it. Drafts can be edited, approved or rejected.'],
  ],
  versions: [
    ['15 October 2026', 'Draft-only. The page states that emails are never sent. Approval creates a Gmail draft.'],
    ['16 October 2026', 'A later recording adds “Approve and send email”, behind a “Send this email now?” confirmation, with the send time and Gmail message id kept on the card.'],
  ],
  stack: [
    ['Interface', 'Web app: chat, results table, approvals queue'],
    ['Agent', 'LLM agent with two tools: Query invoices and Prepare follow-up drafts'],
    ['Data', 'Supabase Postgres, in its own schema, not exposed through the public data API'],
    ['Mail', 'Gmail draft creation (and send, in the later version)'],
  ],
};

/** The six projects in display order, for the hero, the index and the experience section. */
export const catalog = (flagship, secondary) => [
  { slug: flagship.slug, index: flagship.index, name: flagship.name, status: flagship.status, kind: 'Video walkthrough', folder: FOLDERS[flagship.slug], img: 'poster.webp', w: 1600, h: 900 },
  { slug: secondary.slug, index: secondary.index, name: secondary.name, status: secondary.status, kind: 'Workflow canvas', folder: FOLDERS[secondary.slug], img: 'workflow.webp', w: 3000, h: 2012 },
  { slug: driveRag.slug, index: driveRag.index, name: driveRag.name, status: driveRag.status, kind: 'Video walkthrough', folder: driveRag.folder, img: 'poster.webp', w: 1600, h: 900 },
  { slug: emailRag.slug, index: emailRag.index, name: emailRag.name, status: emailRag.status, kind: 'Review in Telegram and Gmail', folder: emailRag.folder, img: 'overview.webp', w: 3296, h: 1810 },
  { slug: restaurant.slug, index: restaurant.index, name: restaurant.name, status: restaurant.status, kind: 'Application screens', folder: restaurant.folder, img: '04-proposal-and-bill.webp', w: 2052, h: 1049 },
  { slug: invoice.slug, index: invoice.index, name: invoice.name, status: invoice.status, kind: 'Video walkthrough', folder: invoice.folder, img: 'poster.webp', w: 1600, h: 900 },
];
