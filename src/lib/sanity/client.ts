// src/lib/sanity/client.ts
export const projectId   = import.meta.env.SANITY_PROJECT_ID || "bwyjt9uz";
export const dataset     = import.meta.env.SANITY_DATASET || "production";
export const apiVersion  = import.meta.env.SANITY_API_VERSION || "2025-05-03";
export const useCdn      = true;
export const token       = import.meta.env.SANITY_TOKEN;