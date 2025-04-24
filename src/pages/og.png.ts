import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";
import { getSiteConfig } from "@/lib/getSiteConfig";

export const prerender = true;

export const GET: APIRoute = async () => {
  const site = await getSiteConfig();
  const png = await generateOgImageForSite({ site });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
