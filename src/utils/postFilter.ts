import type { Post } from "@/lib/sanity/api/types"

export default function postFilter(post: Partial<Post>): boolean {
  if (!post?.pubDate) return false;

  const pubDate = new Date(post.pubDate);
  if (isNaN(pubDate.getTime())) return false;

  return pubDate <= new Date();
}
