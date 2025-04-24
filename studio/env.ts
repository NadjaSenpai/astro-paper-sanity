export const sanityConfig = {
  projectId: import.meta.env.SANITY_PROJECT_ID ?? "bwyjt9uz",
  dataset: import.meta.env.SANITY_DATASET ?? "production",
  apiVersion: import.meta.env.SANITY_API_VERSION ?? "2025-04-24",
  useCdn: import.meta.env.SANITY_USE_CDN === "true",
  token: import.meta.env.SANITY_API_TOKEN,
};