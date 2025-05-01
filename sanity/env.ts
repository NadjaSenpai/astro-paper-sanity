export const projectId = process.env.SANITY_PROJECT_ID!;
export const dataset = process.env.SANITY_DATASET!;
export const apiVersion = process.env.SANITY_API_VERSION || "2025-04-24";
export const useCdn = process.env.SANITY_USE_CDN === "true";
export const token = process.env.SANITY_API_READ_TOKEN;