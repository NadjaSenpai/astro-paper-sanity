import type { PortableTextBlock } from "@portabletext/types";

export interface PortableTextCodeBlock {
  _type: "code";
  code: string;
  language: string;
  filename?: string;
  [key: string]: any;
}

export type CustomPortableTextBlock = PortableTextBlock | PortableTextCodeBlock;

export interface Tag {
  _id: string;
  title: string;
  slug: { current: string };
}

export interface Post {
  title: string;
  slug: { current: string };
  pubDate: string;
  modDate?: string;
  tags?: Tag[];
  description?: string;
  featured?: boolean;
  archived?: boolean;
  ogImage?: string;
  content?: CustomPortableTextBlock[];
}

export interface Page {
  title: string;
  slug: { current: string };
  pubDate: string;
  content?: CustomPortableTextBlock[];
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  profile?: string;
  email?: string;
  twitter?: string;
  github?: string;
  ogImage?: string;
  message?: PortableTextBlock[];
  content?: PortableTextBlock[];
  website?: string;
  dynamicOgImage?: boolean;
}
