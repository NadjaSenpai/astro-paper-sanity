import { createClient } from "@sanity/client";
import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

export const prerender = true;

export async function getStaticPaths() {
  const { getPosts } = await import('@/lib/sanity');
  const posts = await getPosts();
  return posts.map(post => ({
    params: { slug: post.slug.current },
  }));
}

export const GET: APIRoute = async () => {
  const client = createClient({
    projectId: import.meta.env.SANITY_PROJECT_ID || "bwyjt9uz",
    dataset: import.meta.env.SANITY_DATASET || "production",
    apiVersion: "2025-04-21",
    useCdn: true,
    token: import.meta.env.SANITY_API_TOKEN,
  });

  const site = await client.fetch(`*[_type == "settings"][0]`);
  const png = await generateOgImageForSite({ site });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};