import dotenv from "dotenv";
dotenv.config();

export const projectId = process.env.SANITY_PROJECT_ID!;
export const dataset = process.env.SANITY_DATASET!;
export const apiVersion = "2023-01-01";
export const useCdn = true;