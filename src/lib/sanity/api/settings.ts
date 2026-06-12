import { createClient } from "@sanity/client";
import { settingsQuery } from "@/lib/sanity/queries";
import { defaultSiteConfig } from "@/config";
import type { SiteConfig } from "@/lib/sanity/api/types";
import { projectId, dataset, apiVersion, useCdn, token } from "@/lib/sanity/client";

export async function fetchSettings(): Promise<SiteConfig> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn, token });
  const data = await client.fetch<Partial<SiteConfig>>(settingsQuery);
  return {
    ...defaultSiteConfig,
    ...data,
  };
}
