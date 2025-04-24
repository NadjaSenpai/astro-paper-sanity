import type { Page, Post } from "@/lib/sanity/api/types";
import type { PortableTextBlock } from "@portabletext/types";

export function cleansePortableText(value: PortableTextBlock[] = []) {
  return value.filter(block =>
    block._type === "block" ||
    block._type === "image" ||
    block._type === "code"
  );
}

export function normalizePage(page: any): Page {
  return {
    ...page,
    slug: typeof page.slug === "string" ? { current: page.slug } : page.slug,
  };
}

export function normalizePost(post: any): Post {
  const pub = new Date(post.pubDate);
  if (!(pub instanceof Date) || isNaN(pub.getTime())) {
    console.warn("⚠️ pubDate が無効です:", post.pubDate);
    throw new Error("❌ pubDate が不正: " + JSON.stringify(post));
  }

  const mod = post.modDate ? new Date(post.modDate) : undefined;
  if (mod && (isNaN(mod.getTime()) || !(mod instanceof Date))) {
    console.warn("⚠️ modDate が無効です:", post.modDate);
  }

  return {
    ...post,
    pubDate: pub,
    modDate: mod,
    slug: typeof post.slug === "string" ? { current: post.slug } : post.slug,
  };
}
