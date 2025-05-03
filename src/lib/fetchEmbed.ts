// src/lib/fetchEmbed.ts
import type { EmbedData } from "@/components/SmartLink";

export async function fetchEmbed(url: string): Promise<EmbedData | null> {
  try {
    const res = await fetch(
      `/api/fetch-embed?url=${encodeURIComponent(url)}`,
      { credentials: "same-origin" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.type === "oembed" || json.type === "ogp") {
      return json as EmbedData;
    }
  } catch (err) {
    console.warn("[fetchEmbed] failed:", url, err);
  }
  return null;
}
