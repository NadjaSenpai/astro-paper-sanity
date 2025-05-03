// src/pages/api/fetch-embed.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { parse } from "node-html-parser";

const providers = [
  { keyword: "youtube.com",      endpoint: "https://www.youtube.com/oembed?url=" },
  { keyword: "youtu.be",         endpoint: "https://www.youtube.com/oembed?url=" },
  { keyword: "twitter.com",      endpoint: "https://publish.twitter.com/oembed?url=" },
  { keyword: "x.com",            endpoint: "https://publish.twitter.com/oembed?url=" },
  { keyword: "soundcloud.com",   endpoint: "https://soundcloud.com/oembed?format=json&url=" },
  { keyword: "vimeo.com",        endpoint: "https://vimeo.com/api/oembed.json?url=" },
  { keyword: "open.spotify.com", endpoint: "https://open.spotify.com/oembed?url=" },
];

export const GET: APIRoute = async ({ url }) => {
  // Astro v5: context.url を使ってクエリを取得
  const rawUrl = url.searchParams.get("url");
  const theme  = url.searchParams.get("theme") ?? "dark";

  if (!rawUrl) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "Missing 'url' parameter",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  // 1) oEmbed プロバイダーで展開
  const provider = providers.find((p) => rawUrl.includes(p.keyword));
  if (provider) {
    try {
      let endpointUrl = provider.endpoint + encodeURIComponent(rawUrl);
      if ((provider.keyword === "twitter.com" || provider.keyword === "x.com") && theme) {
        endpointUrl += `&theme=${theme}`;
      }
      const res = await fetch(endpointUrl);
      if (res.ok) {
        const data = await res.json();
        return new Response(
          JSON.stringify({ type: "oembed", html: data.html }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store, max-age=0",
            },
          }
        );
      }
    } catch (err) {
      console.error("oEmbed fetch failed:", err);
    }
  }

  // 2) oEmbed NG → ページ HTML を取って OGP メタデータをスクレイピング
  try {
    const pageHtml = await fetch(rawUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const root = parse(pageHtml);

    const meta = (prop: string) =>
      root.querySelector(`meta[property="${prop}"]`)?.getAttribute("content")?.trim() || "";
    const link = (rel: string) =>
      root.querySelector(`link[rel="${rel}"]`)?.getAttribute("href")?.trim() || "";

    const ogpTitle = meta("og:title");
    const ogpImage = meta("og:image") || link("image_src");
    const ogpDesc  = meta("og:description");
    const ogpUrl   = meta("og:url") || rawUrl;

    if (!ogpTitle && !ogpImage) {
      return new Response(
        JSON.stringify({ error: true, message: "OGP metadata not found" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        type: "ogp",
        title:       ogpTitle,
        image:       ogpImage,
        description: ogpDesc,
        url:         ogpUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("OGP fallback failed:", err);
    return new Response(
      JSON.stringify({ error: true, message: "Failed to fetch OGP" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
};
