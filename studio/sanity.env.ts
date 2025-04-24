import * as dotenv from "dotenv";
dotenv.config();

export const sanityConfig = {
  projectId: process.env.SANITY_PROJECT_ID || "", // .env から取得
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-04-24",
};
