function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy env.example to studio/.env and fill in your Sanity project details.`
    );
  }
  return value;
}

export const projectId = requireEnv(
  "SANITY_STUDIO_PROJECT_ID",
  import.meta.env.SANITY_STUDIO_PROJECT_ID
);
export const dataset = import.meta.env.SANITY_STUDIO_DATASET || "production";
export const apiVersion =
  import.meta.env.SANITY_STUDIO_API_VERSION || "2025-05-03";
