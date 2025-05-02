import type { EmbedData } from "@/components/SmartLink";

export async function fetchEmbed(url: string): Promise<EmbedData | null> {
  try {
    const endpoint =
      import.meta.env.SSR
        ? `http://localhost:4321/api/fetch-embed?url=${encodeURIComponent(url)}`
        : `/api/fetch-embed?url=${encodeURIComponent(url)}`;

    const res = await fetch(endpoint);
    const json = await res.json();

    if (
      typeof json === "object" &&
      (json.type === "oembed" || json.type === "ogp")
    ) {
      return json as EmbedData;
    }

    return null;
  } catch (err) {
    console.warn("[fetchEmbed] failed:", url, err);
    return null;
  }
}