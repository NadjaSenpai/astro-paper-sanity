import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}

export const SANITY_PROJECT_ID = requireEnv("SANITY_PROJECT_ID");
export const SANITY_DATASET = requireEnv("SANITY_DATASET");
export const SANITY_API_TOKEN = requireEnv("SANITY_API_TOKEN");