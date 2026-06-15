import type { Post } from "@/lib/sanity/api/types";

/**
 * Sanity の Post を v6 (Content Collections 由来) の component / utility が期待する
 * `{ id, filePath, data: {...} }` shape に揃える adapter。
 *
 * v6 の Card / Datetime / getSortedPosts / getUniqueTags / postFilter は
 * `entry.data.title`, `entry.data.pubDatetime`, `entry.data.tags` 等を参照する。
 * Sanity の post はそれぞれ別の field 名 (pubDate, slug.current, tags[].title) なので
 * ここで一度だけ詰め替える。
 *
 * `sanity` field には元の Post を保持しておき、Portable Text 等が必要な箇所で
 * 取り出せるようにする。
 */
export interface V6PostEntry {
  id: string;
  filePath: string;
  /**
   * NOTE: per-post `author` is not modelled in the Sanity Post schema and is
   * intentionally absent here. Consumers that need an author name should fall
   * back to `config.site.author`.
   */
  data: {
    title: string;
    description: string;
    pubDatetime: Date;
    modDatetime: Date | null;
    tags: string[];
    featured: boolean;
    draft: boolean;
    ogImage: string | undefined;
  };
  sanity: Post;
}

export function sanityPostToV6(post: Post): V6PostEntry {
  return {
    id: post.slug.current,
    filePath: `src/content/posts/${post.slug.current}.md`,
    data: {
      title: post.title,
      description: post.description ?? "",
      pubDatetime: new Date(post.pubDate),
      modDatetime: post.modDate ? new Date(post.modDate) : null,
      tags: post.tags?.map(t => t.title) ?? [],
      featured: post.featured ?? false,
      draft: post.archived ?? false,
      ogImage: post.ogImage,
    },
    sanity: post,
  };
}

export function sanityPostsToV6(posts: Post[]): V6PostEntry[] {
  return posts.map(sanityPostToV6);
}
