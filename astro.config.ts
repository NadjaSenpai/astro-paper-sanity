import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  output: "static",
  outDir: "./dist",
  site: process.env.SITE || "https://astro-paper-sanity.pages.dev",
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@sanity/clientConfig": path.resolve("./sanity/clientConfig.ts"),
      },
    },
    assetsInclude: ["**/*.ttf"],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"], // ← resvg はプリバンドルさせない
    },
    ssr: {
      noExternal: [
        "@resvg/resvg-js",        // ← resvg のネイティブモジュールを除外
        "@sanity/clientConfig",
      ],
      external: ["@resvg/resvg-js"]
    },
    plugins: [
      {
        name: "ignore-node-files",
        enforce: "pre",
        resolveId(source) {
          if (source.endsWith(".node")) return source;
          return null;
        },
        load(id) {
          if (id.endsWith(".node")) {
            return `export default ${JSON.stringify(id)};`; // 文字列として読み込ませる
          }
          return null;
        },
      },
    ],
    css: {
    //  postcss: "./postcss.config.cjs",
    },
    build: {
      chunkSizeWarningLimit: 1024, // 単位 KB。例: 1MBまで許容
    }
  },
});
