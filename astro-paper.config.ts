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
    // Uncomment and fill in your handles to expose more social links
    // in the hero section and footer.
    // { name: "x",        url: "https://x.com/your_handle" },
    // { name: "linkedin", url: "https://www.linkedin.com/in/your_handle/" },
    // { name: "mail",     url: "mailto:your_email@example.com" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    {
      name: "mail",
      url: "mailto:?subject=See%20this%20post&body=",
    },
    // Uncomment to add more share targets on post pages.
    // { name: "whatsapp",  url: "https://wa.me/?text=" },
    // { name: "facebook",  url: "https://www.facebook.com/sharer.php?u=" },
    // { name: "telegram",  url: "https://t.me/share/url?url=" },
    // { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
  ],
});
