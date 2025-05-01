import { getClient } from "@/lib/sanity/client";
import { pageQuery } from "@/lib/sanity/queries";
import type { Page } from "@/lib/sanity/api/types";
import { normalizePage } from "@/lib/sanity/utils/helpers";

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const result = await getClient().fetch<Page | null>(pageQuery, { slug });
  return result ? normalizePage(result) : null;
}
