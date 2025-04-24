import type { APIRoute } from "astro";
import { getPostBySlug, getPosts } from "@/lib/sanity";
import { getSiteConfig } from "@/lib/getSiteConfig";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import type { Post } from "@/lib/sanity/api/types";

export const prerender = true;

export async function getStaticPaths() {
  const site = await getSiteConfig();
  if (!site.dynamicOgImage) return [];

  const posts = await getPosts();
  return posts
    .filter((post: Post) => post.slug?.current && !post.ogImage)
    .map((post: Post) => ({
      params: { slug: post.slug.current },
    }));
}

export const GET: APIRoute = async ({ params }) => {
  const site = await getSiteConfig();

  if (!site.dynamicOgImage || !params?.slug) {
    return new Response("Not found", { status: 404 });
  }

  const post = await getPostBySlug(params.slug);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const png = await generateOgImageForPost({ post, site });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
