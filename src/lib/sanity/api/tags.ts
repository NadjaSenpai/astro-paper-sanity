import { createClient } from "@sanity/client";
import type { Tag } from "@/lib/sanity/api/types";
import { projectId, dataset, apiVersion, useCdn, token } from "@/lib/sanity/client";

export async function getTags(): Promise<Tag[]> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn, token });
  const query = `*[_type == "tag"]{_id, title, slug}`;
  return client.fetch(query);
}
