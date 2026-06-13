import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://astro-paper-sanity.pages.dev/",
    title: "Astro Paper Sanity",
    description:
      "An Astro 6 + Sanity blog starter. Fork of satnaing/astro-paper with Sanity Studio as the content layer.",
    author: "Your Name",
    profile: "https://example.com",
    ogImage: "default-og.jpg",
    lang: "ja",
    timezone: "Asia/Tokyo",
    dir: "ltr",
  },
  posts: {
    perPage: 5,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/NadjaSenpai/astro-paper-sanity",
    },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    {
      name: "mail",
      url: "mailto:?subject=See%20this%20post&body=",
    },
  ],
});
