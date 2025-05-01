// src/lib/sanity/client.ts
export const projectId = import.meta.env.SANITY_PROJECT_ID!;
export const dataset = import.meta.env.SANITY_DATASET!;
export const apiVersion = "2025-05-01";
export const useCdn = true;
export const token = import.meta.env.SANITY_API_READ_TOKEN!;
