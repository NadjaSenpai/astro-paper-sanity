
# astro-paper-sanity

This is a customized blog project built with [Astro](https://astro.build) and [Sanity](https://www.sanity.io), based on [satnaing/astro-paper](https://github.com/satnaing/astro-paper). This version adapts AstroPaper to use Sanity as a headless CMS.

## Features

- 🧠 Headless CMS integration with **Sanity**
- 📄 Markdown-like content using **Portable Text**
- ⚡ Blazing-fast performance with **Astro**
- 🎨 Fully customizable **Tailwind CSS** styling
- 🌗 Dark mode support
- 🔍 Tag pages, archives, pagination
- 🖼️ Dynamic OG image generation using **satori** + **resvg-js**
- 🔎 Static search powered by **Pagefind**
- 🔗 RSS feed, social links
- 🖌️ Icons from **Tabler Icons**
- 💻 Syntax highlighting with **react-syntax-highlighter** and **Prism**

## Hosting Strategy

- 🔸 **Astro frontend** and **Sanity Studio** are hosted **separately** on Vercel
- 🔸 Astro pulls data from a **dedicated Sanity project**
- 🔸 Studio is **restricted** from indexing (via `robots.txt`) or can be password protected if needed
- 🔸 Deploy hooks and webhooks allow **on-demand rebuilds**

## Lighthouse Score

<p align="center">
  <a href="https://pagespeed.web.dev/analysis/https-astro-paper-sanity-vercel-app/anc6hbygml?form_factor=desktop&category=performance&category=accessibility&category=best-practices&category=seo&hl=en-US">
    <img width="710" alt="AstroPaper Lighthouse Score" src="lighthouse.svg">
  <a>
</p>

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NadjaSenpai/astro-paper-sanity.git
cd astro-paper-sanity
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `sanity/env.ts` and `studio/env.ts`

These files should define the required `projectId`, `dataset`, etc. Since `import.meta.env` is only available in Node/Vite environments, we fallback to custom `env.ts` files like this:

```ts
// sanity/env.ts
export const projectId = "your_project_id";
export const dataset = "production";
export const apiVersion = "2025-04-24";
export const useCdn = true;
export const token = "your_read_token";
```

**Important:**  
These files are `.gitignore`-d and **must be created manually** in both `sanity/` and `studio/` folders.

### 4. Start development

```bash
# For Astro (frontend)
npm run dev

# For Studio (inside /studio directory)
cd studio
npm run dev
```

## Scripts

| Command         | Description                       |
|----------------|-----------------------------------|
| `npm run dev`   | Start local development server    |
| `npm run build` | Build the site for production     |
| `npm run preview` | Preview the production build    |
| `npm run format` | Format code with Prettier        |

## Acknowledgements

- Theme base: [satnaing/astro-paper](https://github.com/satnaing/astro-paper)
- OG image generation: [satori](https://github.com/vercel/satori) + [resvg-js](https://github.com/yisibl/resvg-js)
- Static search: [Pagefind](https://pagefind.app)
- Icons: [Tabler Icons](https://tabler-icons.io)
- Syntax Highlighting: [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

---

🚀 Built with help from [ChatGPT 4o](https://openai.com/chatgpt)
