import dotenv from "dotenv";
dotenv.config();

const config = {
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-04-21",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
};

export default config;
