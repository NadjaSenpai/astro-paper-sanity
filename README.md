
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

## Getting Started

Clone the repository:

```bash
git clone https://github.com/NadjaSenpai/astro-paper-sanity.git
cd astro-paper-sanity
```

Install dependencies:

```bash
npm install
```

Set up environment variables in `.env`:

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
```

Start development server:

```bash
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

- Original theme: [satnaing/astro-paper](https://github.com/satnaing/astro-paper)
- OG image generation: [satori](https://github.com/vercel/satori) + [resvg-js](https://github.com/yisibl/resvg-js)
- Static search: [Pagefind](https://pagefind.app)
- Icons: [Tabler Icons](https://tabler-icons.io)
- Syntax Highlighting: [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

- **Built with help from [ChatGPT 4o](https://openai.com/chatgpt)** ❤️
