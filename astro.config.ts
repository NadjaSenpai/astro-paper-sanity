import { defineConfig, envField, fontProviders, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import config from "./astro-paper.config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  site: config.site.url,
  integrations: [
    react(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false ||
        !page.endsWith("/archives/"),
    }),
  ],
  // i18n は astro-paper v6 から借用しているが、Sanity Portable Text 自体が
  // 1 言語想定なので default 1 locale だけ宣言してプレフィックスを抑止する。
  i18n: {
    locales: [config.site.lang ?? "en"],
    defaultLocale: config.site.lang ?? "en",
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    // tailwindcss() の型は @tailwindcss/vite が同梱する vite の Plugin 型で、
    // Astro 6 が要求する vite Plugin 型と minor verison ずれでぶつかる。
    // ランタイム挙動は問題ないので any キャストで吸収する。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
    ssr: {
      noExternal: ["@resvg/resvg-js"],
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
