function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy env.example to .env and fill in your Sanity project details.`
    );
  }
  return value;
}

// Read from process.env so that the values are picked up from both a local
// .env file (loaded by dotenv in astro.config.ts) and from build-time
// environment variables set by hosting providers like Cloudflare Pages and
// Vercel. import.meta.env would only see values written into the .env file.
export const projectId = requireEnv(
  "SANITY_PROJECT_ID",
  process.env.SANITY_PROJECT_ID
);
export const dataset = process.env.SANITY_DATASET || "production";
export const apiVersion = process.env.SANITY_API_VERSION || "2025-05-03";
export const useCdn = process.env.SANITY_USE_CDN === "true";
export const token = process.env.SANITY_API_TOKEN;
