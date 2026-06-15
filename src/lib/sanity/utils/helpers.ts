import type { Page, Post, CustomPortableTextBlock } from "@/lib/sanity/api/types";

type PortableTextBlocks = CustomPortableTextBlock[];

export function cleansePortableText(value: PortableTextBlocks = []) {
  return value.filter(block => typeof block._type === "string");
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
    console.warn("Invalid pubDate:", post.pubDate);
    throw new Error("Invalid pubDate: " + JSON.stringify(post));
  }

  const mod = post.modDate ? new Date(post.modDate) : undefined;
  if (mod && (isNaN(mod.getTime()) || !(mod instanceof Date))) {
    console.warn("Invalid modDate:", post.modDate);
  }

  return {
    ...post,
    content: cleansePortableText(post.content),
    pubDate: pub,
    modDate: mod,
    slug: typeof post.slug === "string" ? { current: post.slug } : post.slug,
  };
}
