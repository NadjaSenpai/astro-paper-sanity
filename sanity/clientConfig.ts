import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2025-05-01",
  token: process.env.SANITY_API_TOKEN,
});

export default client;