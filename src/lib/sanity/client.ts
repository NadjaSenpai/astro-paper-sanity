// src/lib/sanity/client.ts
export const projectId   = import.meta.env.SANITY_PROJECT_ID!;
export const dataset     = import.meta.env.SANITY_DATASET!;
export const apiVersion  = import.meta.env.SANITY_API_VERSION!;
export const useCdn      = true;
export const token       = import.meta.env.SANITY_TOKEN;