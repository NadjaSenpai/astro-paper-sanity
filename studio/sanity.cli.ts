// sanity.cli.ts
import { defineCliConfig } from "sanity/cli";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // 開発中だけ .env を読む
}

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "production",
  },
});