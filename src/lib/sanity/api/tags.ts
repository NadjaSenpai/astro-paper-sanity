import { getClient } from "@/lib/sanity/client";
import type { Tag } from "@/lib/sanity/api/types";

export async function getTags(): Promise<Tag[]> {
  const query = `*[_type == "tag"]{_id, title, slug}`;
  return getClient().fetch(query);
}
