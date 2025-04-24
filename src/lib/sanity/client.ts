import { createClient } from "@sanity/client";

export const projectId = import.meta.env.SANITY_PROJECT_ID!;
export const dataset = import.meta.env.SANITY_DATASET!;
export const apiVersion = "2025-04-23";
export const useCdn = false;
export const token = import.meta.env.SANITY_API_READ_TOKEN;

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    token,
  });