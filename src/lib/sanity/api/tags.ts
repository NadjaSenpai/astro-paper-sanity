import { client } from "@/lib/sanity/client";
import type { Tag } from "@/lib/sanity/api/types";

export async function getTags(): Promise<Tag[]> {
  const query = `*[_type == "tag"]{_id, title, slug}`;
  return client.fetch(query);
}
