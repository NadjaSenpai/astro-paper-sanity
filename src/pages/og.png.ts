import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";


export const GET: APIRoute = async () => {
  const { createClient } = await import("@sanity/client");

  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: "2025-04-21",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
  });

  const site = await client.fetch(`*[_type == "settings"][0]`);
  const png = await generateOgImageForSite({ site });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
