import rss from "@astrojs/rss";
import { getSiteConfig } from "@/lib/getSiteConfig";
import { getPosts } from "@/lib/sanity";
import type { Post } from "@/lib/sanity/api/types"; // ← ここ追加

const site = await getSiteConfig();

export const GET = async () => {
  const posts: Post[] = await getPosts(); // ← ここで型付け

  return rss({
    title: site.title,
    description: site.description,
    site: site.website ?? "https://example.com", // fallbackあり
    items: posts
      .filter(post => post?.pubDate && post?.slug?.current)
      .map(post => ({
        title: post.title,
        description: post.description || "",
        pubDate: new Date(post.pubDate),
        link: `${site.website ?? "https://example.com"}/posts/${post.slug.current}`,
      })),
  });  
}