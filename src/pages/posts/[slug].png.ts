import type { APIRoute } from "astro";
import { getPostBySlug } from "@/lib/sanity";
import { getSiteConfig } from "@/lib/getSiteConfig";
import { generateOgImageForPost } from "@/utils/generateOgImages";

export const prerender = false;

export async function getStaticPaths() {
  const { getPosts } = await import('@/lib/sanity');
  const posts = await getPosts();
  return posts.map(post => ({
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
