function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy env.example to .env and fill in your Sanity project details.`
    );
  }
  return value;
}

export const projectId = requireEnv(
  "SANITY_PROJECT_ID",
  import.meta.env.SANITY_PROJECT_ID
);
export const dataset = import.meta.env.SANITY_DATASET || "production";
export const apiVersion = import.meta.env.SANITY_API_VERSION || "2025-05-03";
export const useCdn = import.meta.env.SANITY_USE_CDN === "true";
export const token = import.meta.env.SANITY_API_TOKEN;
