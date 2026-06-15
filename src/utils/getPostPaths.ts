import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/**
 * Sanity ベース fork では post の slug.current がそのまま URL になる。
 * Content Collections 由来の filePath / id 解析は不要。
 */

export function getPostSlug(
  id: string,
  _filePath?: string | undefined
): string {
  return `/${id}`;
}

export function getPostUrl(
  id: string,
  _filePath: string | undefined = undefined,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `posts/${id}`);
}
