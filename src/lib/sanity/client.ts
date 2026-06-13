function readSsrEnv(name: string): string | undefined {
  // process.env is only defined in Node / SSR. Browsers don't have it.
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return undefined;
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy env.example to .env and fill in both the ` +
        `SANITY_* (server) and PUBLIC_SANITY_* (client) values.`
    );
  }
  return value;
}

// projectId / dataset / apiVersion / useCdn end up in the React island
// bundle (PortableText -> ImageWithModal builds Sanity image URLs in the
// browser), so they need a value at runtime in both environments:
//   - SSR / build:  process.env.SANITY_* (set by Cloudflare Pages / Vercel)
//   - CSR / browser: import.meta.env.PUBLIC_SANITY_* (inlined by Vite at
//                    build time; PUBLIC_ prefix is what makes it client-safe)
//
// SANITY_API_TOKEN is intentionally server-only. Never expose it as PUBLIC_*.
export const projectId = requireEnv(
  "SANITY_PROJECT_ID",
  readSsrEnv("SANITY_PROJECT_ID") || import.meta.env.PUBLIC_SANITY_PROJECT_ID
);
export const dataset =
  readSsrEnv("SANITY_DATASET") ||
  import.meta.env.PUBLIC_SANITY_DATASET ||
  "production";
export const apiVersion =
  readSsrEnv("SANITY_API_VERSION") ||
  import.meta.env.PUBLIC_SANITY_API_VERSION ||
  "2025-05-03";
export const useCdn =
  (readSsrEnv("SANITY_USE_CDN") || import.meta.env.PUBLIC_SANITY_USE_CDN) ===
  "true";
export const token = readSsrEnv("SANITY_API_TOKEN");
