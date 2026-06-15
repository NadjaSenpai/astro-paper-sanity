# astro-paper-sanity

An Astro blog starter that uses [Sanity](https://www.sanity.io) as the
headless CMS, based on [satnaing/astro-paper](https://github.com/satnaing/astro-paper).

The original AstroPaper theme stores posts as local Markdown files. This
fork swaps the content layer for Sanity Studio while keeping AstroPaper's
design, navigation, OG-image pipeline, and Pagefind search intact.

Live sample: <https://astro-paper-sanity.pages.dev>

## Features

- Headless CMS integration with Sanity (Portable Text content)
- Astro 6 + React 19 + Tailwind CSS 4
- Dark mode, tag pages, archive, pagination
- Dynamic OG image generation via satori + resvg-js
- Static client-side search via Pagefind
- Syntax highlighting via Shiki
- RSS feed and social links
- Icons from Tabler Icons
- Deployed on Cloudflare Pages

## Architecture

- The Astro frontend and Sanity Studio are deployed as separate apps.
- Astro reads content from a dedicated Sanity project at build time
  (with optional CDN cache).
- Studio is excluded from search engines via `robots.txt` and can be
  password-protected at the hosting layer.
- Sanity deploy hooks trigger on-demand rebuilds.
- Two React islands are used for interactive client-side components.

## Getting Started

### Prerequisites

- Node.js >= 22.12
- pnpm >= 10 (declared as `packageManager` in `package.json`)

### 1. Clone and install

```bash
git clone https://github.com/NadjaSenpai/astro-paper-sanity.git
cd astro-paper-sanity
pnpm install
```

### 2. Configure Sanity credentials

Copy `env.example` to `.env` for the Astro frontend, and to `studio/.env`
for the Studio app. Fill in your Sanity project ID and dataset.

```bash
cp env.example .env
cp env.example studio/.env
```

Environment variables are split by access scope:

- Server-only (never exposed to the browser): `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`
- Public / client-safe: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`

### 3. Run locally

```bash
# Astro frontend (default: http://localhost:4321)
pnpm dev

# Sanity Studio (separate process, default: http://localhost:3333)
cd studio && pnpm dev
```

## Scripts

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `pnpm dev`      | Run the Astro dev server                          |
| `pnpm build`    | `astro check` + production build + Pagefind index |
| `pnpm preview`  | Serve the production build locally                |
| `pnpm format`   | Format the codebase with Prettier                 |
| `pnpm lint`     | Run ESLint                                        |

## Deployment

This template targets **Cloudflare Pages** exclusively (via `functions/` for
Cloudflare Pages Functions).

Connect the repository to Cloudflare Pages via the dashboard git integration.
Cloudflare will auto-build on each push to `main`; no `wrangler.toml` or
manual deploy step is needed.

Set environment variables in the Cloudflare Pages dashboard under
**Settings > Environment variables**. Add them to both the **Production** and
**Preview** scopes so that PR preview deployments also have access.

CI on GitHub (`.github/workflows/ci.yml`) runs `astro check` and ESLint
on every push and pull request.

## License

MIT. See [LICENSE](./LICENSE).

The base theme is licensed under MIT by
[Sat Naing](https://github.com/satnaing/astro-paper/blob/main/LICENSE).

## Credits

- Base theme: [satnaing/astro-paper](https://github.com/satnaing/astro-paper)
- OG image generation: [satori](https://github.com/vercel/satori),
  [resvg-js](https://github.com/yisibl/resvg-js)
- Static search: [Pagefind](https://pagefind.app)
- Icons: [Tabler Icons](https://tabler-icons.io)
- Syntax highlighting: [Shiki](https://shiki.style)
