import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset, apiVersion } from "@/lib/sanity/client";

export function urlFor(source: any) {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });
  const builder = imageUrlBuilder(client);
  return builder.image(source);
}
