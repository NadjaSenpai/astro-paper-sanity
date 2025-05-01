import { getClient } from "@/lib/sanity/client";
import { settingsQuery } from "@/lib/sanity/queries";
import { defaultSiteConfig } from "@/config";
import type { SiteConfig } from "@/lib/sanity/api/types";

export async function getSiteConfig(): Promise<SiteConfig> {
  const sanityData = await getClient().fetch<Partial<SiteConfig>>(settingsQuery);
  return {
    ...defaultSiteConfig,
    ...sanityData,
  };
}
