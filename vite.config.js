import { defineConfig } from 'vite';
import { site } from './src/config/site.js';

/**
 * Site address: SITE_URL env var wins, otherwise `site.url` from src/config/site.js.
 * When set, the build adds canonical + absolute Open Graph URLs (social crawlers need absolute URLs).
 */
const siteUrl = (process.env.SITE_URL || site.url || '').replace(/\/$/, '');
const sameAs = [];

export default defineConfig({
  base: './', // relative, so the build works from any folder or static host
  build: { target: 'es2020', cssMinify: true },
  plugins: [
    {
      name: 'site-meta',
      transformIndexHtml(html) {
        // Structured data is generated from the config so it only ever contains what you filled in.
        const person = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: site.name,
          jobTitle: site.role,
          knowsAbout: ['n8n', 'Retrieval-augmented generation', 'Large language models', 'Supabase', 'pgvector'],
          ...(sameAs.length && { sameAs }),
          ...(siteUrl && { url: `${siteUrl}/` }),
        };
        html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(person)}</script>`);
        if (!siteUrl) return html;
        const tags = [
          `<link rel="canonical" href="${siteUrl}/" />`,
          `<meta property="og:url" content="${siteUrl}/" />`,
          `<meta property="og:image" content="${siteUrl}/og.png" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta name="twitter:image" content="${siteUrl}/og.png" />`,
        ].join('\n    ');
        return html.replace('</head>', `    ${tags}\n  </head>`).replace('content="summary"', 'content="summary_large_image"');
      },
    },
  ],
});
