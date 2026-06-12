import type { Post } from "@/lib/sanity/api/types";

/**
 * 指定した条件で投稿をフィルタリング
 * @param key フィールド名（例: "archived", "featured"）
 * @param value 比較値（true/falseなど）
 * @param posts 投稿配列（デフォルトで getPosts() を使ってもOK）
 */
import { getPosts } from "@/lib/sanity/api/posts";

export async function getPostsByGroupCondition(
  key: keyof Post,
  value: unknown
): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post[key] === value);
}
