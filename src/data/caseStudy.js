/** Case study for the Timestamped AI Video Knowledge Assistant. Source: its project documentation v1.0 (13 Oct 2026). */
export const videoCaseStudy = {
  lede:
    'Two n8n workflows that share one Supabase table. Workflow A turns a YouTube transcript into timestamped, embedded passages. Workflow B answers questions from those passages and builds the source links in code.',
  docNote: 'Documentation v1.0 · 13 October 2026 · status recorded by the author: working prototype',
  workflows: [
    {
      id: 'A',
      title: 'Workflow A — video ingestion',
      note: 'Input: one YouTube link through an n8n form. Output: the video’s passages stored and verified in video_chunks.',
      nodes: [
        { name: 'Submit YouTube URL', type: 'Form Trigger', text: 'Collects one link.' },
        { name: 'Validate URL', type: 'Code', text: 'Extracts the video ID from watch, youtu.be, shorts, embed and live links. Rejects everything else, including playlists and channels, with a plain message.' },
        { name: 'URL Valid?', type: 'IF', text: 'Stops invalid links.' },
        { name: 'Get Video Title', type: 'HTTP Request', text: 'Reads the title from YouTube oEmbed. Falls back to “YouTube video” plus the ID if it fails.' },
        { name: 'Fetch Transcript', type: 'HTTP Request', text: 'Calls the Supadata API for the transcript with timestamps. Header-auth credential; retries up to three times.' },
        { name: 'Build Chunks', type: 'Code', text: 'Cleans text, builds passages of about 500 characters with 80 overlap, and calculates start and end seconds from the transcript offsets. Turns API errors into clear messages (rejected key, rate limit, no captions).' },
        { name: 'Chunks OK?', type: 'IF', text: 'Stops if no usable transcript came back.' },
        { name: 'Delete Old Chunks', type: 'Supabase', text: 'Deletes existing rows for the same video ID only, so re-indexing never creates duplicates. Runs only after a good transcript.' },
        { name: 'Insert Chunks', type: 'Vector Store', text: 'One Gemini embedding per passage, stored with video_id, title, url, start/end seconds, chunk index, language and ingested_at.' },
        { name: 'Count Stored Chunks', type: 'Supabase', text: 'Reads back the rows stored for this video.' },
        { name: 'Verify Storage', type: 'Code', text: 'Compares the expected passage count with the stored count and produces the success or failure message.' },
      ],
    },
    {
      id: 'B',
      title: 'Workflow B — question answering',
      note: 'Input: a question typed in the n8n chat. Output: an answer with clickable timestamps and a sources list.',
      nodes: [
        { name: 'Chat Trigger', type: 'Chat Trigger', text: 'Receives the question.' },
        { name: 'Prepare Question', type: 'Code', text: 'Trims the question, finds a pasted YouTube link (to limit the search to that video) and detects summary-style questions, including misspelled ones.' },
        { name: 'Retrieve Chunks', type: 'Vector Store', text: 'Embeds the question and calls match_video_chunks. Limit is 10 for normal questions and 200 for summaries.' },
        { name: 'Build Context', type: 'Code', text: 'Selects passages, puts them in video order, gives them ids (S1, S2…) and prepares the model input with their real timestamps.' },
        { name: 'Has Evidence?', type: 'IF', text: 'If nothing relevant was found, sends a plain reply without calling the model.' },
        { name: 'LLM Chain + Groq', type: 'LLM Chain', text: 'Writes the answer using a fixed system prompt that forbids invented facts, quotes and times.' },
        { name: 'Append Sources', type: 'Code', text: 'Removes citations that match no real source, turns each remaining one into a clickable timestamp, lists only cited passages and adds a footer.' },
      ],
    },
  ],
  dataModel: {
    table: 'video_chunks',
    columns: [
      ['id', 'bigserial', 'Row number (primary key)'],
      ['content', 'text', 'The passage text, about 500 characters'],
      ['metadata', 'jsonb', 'video_id, title, url, start/end seconds, chunk_index, language, ingested_at'],
      ['embedding', 'vector', '3072 numbers with the current model; no fixed size on the column'],
    ],
    note:
      'match_video_chunks(query_embedding, match_count, filter) returns the closest passages using cosine distance. Row Level Security is on with no public policies; only the service role key held inside n8n can read or write the table.',
  },
  retrieval: [
    { mode: 'Normal question', text: 'The 10 passages closest in meaning are used, shown in video order. A pasted video link restricts the passages to that video.' },
    { mode: 'Summary question', text: 'Triggered by words like summary, overview, main points or recap (spelling mistakes allowed). All passages are read, 16 are picked evenly across the video, and the reply opens with a line stating how many passages the outline is built from.' },
  ],
  controls: [
    ['Wrong timestamps', 'Times are calculated when indexing and links are built in code. The model may not write times; a note is added if it does.'],
    ['Fake citations', 'Citations to ids that do not exist are removed and odd bracket styles are normalised.'],
    ['Evidence not sufficient', 'A fixed marker produces a short “not found” reply and suppresses the sources list.'],
    ['Misleading sources list', 'Only passages that were actually cited are listed.'],
    ['Instructions hidden in a transcript', 'Passages are labelled untrusted data and the prompt says not to follow them.'],
    ['Silent ingestion failure', 'Stored row count is compared with the expected count; the run status is not trusted.'],
    ['Model failure', 'Fallback reply lists the top three passages so the user can still check the video.'],
    ['Secrets', 'Keys live only in the n8n credential manager; the model is told never to output credentials.'],
  ],
  decisions: [
    {
      title: 'Passage size: 800 → 500 characters',
      body: 'The first version produced 34 passages of roughly 50 seconds, and a timestamp link could land up to 50 seconds before the topic. Reducing to 500 characters with 80 overlap gave 57 passages averaging 31 seconds.',
    },
    {
      title: 'Summary mode for vague questions',
      body: 'Searching for “main points” returned passages covering only about 23% of the video, with a gap from 3:48 to 10:06. Summary mode reads all passages and samples evenly; on the test video 16 passages cover about 41% and the reply says so.',
    },
    {
      title: 'Dedicated table instead of a shared one',
      body: 'Unrelated rows surfaced as “Video undefined” because the search read a shared table. A separate video_chunks table and match function fixed it; 34 existing video rows were migrated.',
    },
    {
      title: 'Groq for chat after Gemini chat models failed',
      body: 'Several Gemini chat models had been retired for new users and returned 404s. Embeddings stay on Gemini; the answer model moved to Groq.',
    },
  ],
  issues: [
    ['Valid link rejected as “not a valid URL”', 'The URL class is unavailable in the Code-node sandbox. Replaced with regular-expression validation.'],
    ['“vector must have at least 1 dimension”', 'Empty embedding from the wrong credential or model. Fixed the selection; the count check now catches this case.'],
    ['“No Respond to Webhook node found”', 'Form waited for a response node that some paths never reached. Removed the ending pages.'],
    ['LLM chain failed on the prompt', 'Curly braces are read as template variables. Removed them from the prompt.'],
    ['Product name transcribed as “NN”', 'Speech-to-text error. Added a name-fix rule to the prompt.'],
  ],
  tests: [
    { id: 'I1', label: 'Index the test video', observed: '57 passages from 0 s to 1218 s (20:18), average 31 s.', result: 'Pass' },
    { id: 'I2', label: 'Re-index the same video', observed: 'Table held 57 rows afterwards, not 91.', result: 'Pass' },
    { id: 'C1', label: 'Ask about pricing (not in the video)', observed: 'Short “not found” reply, no sources; stored text had no matching rows.', result: 'Pass' },
    { id: 'C2', label: 'Ask about Python (not in the video)', observed: 'Not-found reply; stored text has 0 mentions.', result: 'Pass' },
    { id: 'C4', label: 'Problem solved for non-programmers', observed: 'Cited 1:11 and 2:28; both matched stored passages. Wording slightly stronger than the text, so a rule was added.', result: 'Pass with note' },
    { id: 'C5', label: 'What is a system message and why', observed: 'Definition supported. The “why” sentence was not found in either cited passage; a rule was added, not yet re-tested.', result: 'Partial' },
    { id: 'C8', label: 'Misspelled “main pionts of video”', observed: 'Understood. 16 passages from 0:23 to 19:18, coverage line added, 10 merged points in video order.', result: 'Pass' },
    { id: 'I3–I6', label: 'Invalid link, playlist, identical re-submit, second video', observed: 'Not yet run.', result: 'Pending' },
    { id: 'C9–C10', label: 'Unrelated request, follow-up, two videos', observed: 'Not yet run.', result: 'Pending' },
  ],
  limits: [
    'One link per form submission.',
    'Links open at the start of a ~30-second passage, so the detail may sit in the next one.',
    'Normal questions use the 10 closest passages; “not found” means not in the retrieved parts.',
    'Transcript only — slides and on-screen demos are not analysed, and the reply says so.',
    'The model can still add detail: one unsupported sentence and one mis-linked detail were seen in testing.',
    'No conversation memory in Workflow B as built; follow-ups are untested.',
    'Search compares every stored passage (3072-d vectors): instant at a few hundred, slower at tens of thousands.',
    'Free-plan limits apply to Supadata, Gemini, Groq and Supabase.',
  ],
  next: [
    'Run the pending tests and record the results.',
    'Add conversation memory to the Q&A workflow.',
    'Batch ingestion for many links (designed, not deployed).',
    'A second pass comparing each sentence with its cited passage.',
  ],
};
