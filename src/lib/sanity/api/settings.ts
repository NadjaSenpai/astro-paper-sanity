import { client } from "@/lib/sanity/client";
import { settingsQuery } from "@/lib/sanity/queries";
import { defaultSiteConfig } from "@/config";
import type { SiteConfig } from "@/lib/sanity/api/types";

export async function fetchSettings(): Promise<SiteConfig> {
  const data = await client.fetch<Partial<SiteConfig>>(settingsQuery);
  return {
    ...defaultSiteConfig,
    ...data,
  };
}
