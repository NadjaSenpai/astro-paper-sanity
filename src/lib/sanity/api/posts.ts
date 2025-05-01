import { client } from "@/lib/sanity/client";
import type { Post } from "@/lib/sanity/api/types";
import { normalizePost } from "@/lib/sanity/utils/helpers";

export async function getPosts(): Promise<Post[]> {
  const query = `
  *[_type == "post"] | order(pubDate desc){
    title,
    slug,
    pubDate,
    modDate,
    tags[]->{ title, slug },
    description,
    featured,
    archived,
    ogImage,
    content
  }
`;
  const result = await client.fetch(query);
  return result.map(normalizePost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
  *[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    pubDate,
    modDate,
    tags[]->{ title, slug },
    description,
    featured,
    archived,
    ogImage,
    content
  }
`;
  const result = await client.fetch(query, { slug });
  return result ? normalizePost(result) : null;
}
