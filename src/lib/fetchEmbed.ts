// src/lib/fetchEmbed.ts
import type { EmbedData } from "@/components/SmartLink";

export async function fetchEmbed(url: string): Promise<EmbedData | null> {
  try {
    // SSR なら絶対 URL を、それ以外は相対パスを使う
    const base = import.meta.env.SSR
      ? import.meta.env.SITE ?? ""    // astro.config の site: https://… が入る
      : "";
    const endpoint = `${base}/api/fetch-embed?url=${encodeURIComponent(url)}`;

    const res = await fetch(endpoint, { credentials: "same-origin" });
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
