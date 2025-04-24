import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity/client";

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
