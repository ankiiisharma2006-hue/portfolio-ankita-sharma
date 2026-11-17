# Ankita Sharma — AI Automation Engineer portfolio

A static portfolio site (Vite, plain JavaScript). No server, no database, no contact form.
It contains no email address, links to personal profiles, location, employer names or dates.

## Run it

```bash
npm install
npm run dev        # preview at http://localhost:5173
```

## Publish it

```bash
npm run deploy     # builds, then creates site-upload/ with only the files the page uses
```

Drag the `site-upload` folder onto https://app.netlify.com/drop, or connect this repo to
Netlify / Vercel with build command `npm run build` and output directory `dist`.
(Use `site-upload` when uploading by hand: it leaves out unused media.)

After you have a public address, put it in `url` in `src/config/site.js` and redeploy.
That adds the link-preview tags.

## Where things are

| What | File |
|---|---|
| Name, title, description, public URL | `src/config/site.js` |
| Project text and facts | `src/data/work.js`, `src/data/projects.js` |
| Videos and pictures | `public/assets/projects/<project>/` |
| Services and Toolbox text | `src/components/about.js`, `src/data/skills.js` |

## Git: keep your personal email out of the history

Before the first commit, use GitHub's private address instead of your real one:

```bash
git init
git config user.name "Ankita Sharma"
git config user.email "<id>+<github-username>@users.noreply.github.com"
git add .
git commit -m "Initial portfolio"
```
(Find your no-reply address in GitHub → Settings → Emails.)
