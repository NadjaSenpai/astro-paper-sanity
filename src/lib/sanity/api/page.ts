import { createClient } from "@sanity/client";
import { pageQuery } from "@/lib/sanity/queries";
import type { Page } from "@/lib/sanity/api/types";
import { normalizePage } from "@/lib/sanity/utils/helpers";
import { projectId, dataset, apiVersion, useCdn, token } from "@/lib/sanity/client";

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn, token });
  const result = await client.fetch<Page | null>(pageQuery, { slug });
  return result ? normalizePage(result) : null;
}
