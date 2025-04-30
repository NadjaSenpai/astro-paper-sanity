export const prerender = false;
import { parse } from "node-html-parser";

const providers = [
  { keyword: "youtube.com", endpoint: "https://www.youtube.com/oembed?url=" },
  { keyword: "youtu.be", endpoint: "https://www.youtube.com/oembed?url=" },
  { keyword: "twitter.com", endpoint: "https://publish.twitter.com/oembed?url=" },
  { keyword: "x.com", endpoint: "https://publish.twitter.com/oembed?url=" },
  { keyword: "soundcloud.com", endpoint: "https://soundcloud.com/oembed?format=json&url=" },
  { keyword: "vimeo.com", endpoint: "https://vimeo.com/api/oembed.json?url=" },
  { keyword: "open.spotify.com", endpoint: "https://open.spotify.com/oembed?url=" },
];

export async function GET({ url }: { url: URL }) {
  const rawUrl = url.searchParams.get("url");
  const theme = url.searchParams.get("theme") || "dark";

  if (!rawUrl) {
    return new Response(JSON.stringify({
      error: true,
      message: "Missing 'url' parameter"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const provider = providers.find(p => rawUrl.includes(p.keyword));
  if (provider) {
    try {
      let endpointUrl = provider.endpoint + encodeURIComponent(rawUrl);

      // Twitterだけthemeつける
      if (
        (provider.keyword === "twitter.com" || provider.keyword === "x.com") &&
        theme
      ) {
        endpointUrl += `&theme=${theme}`;
      }

      const res = await fetch(endpointUrl);
      if (res.ok) {
        const data = await res.json();
        return new Response(JSON.stringify({ type: "oembed", html: data.html }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      console.error("oEmbed fetch failed", err);
    }
  }

  // fallback: OGP metadata
  try {
    const html = await fetch(rawUrl, {
      headers: {
        // 💡 Amazon対策：普通のブラウザっぽく偽装
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    }).then((res) => res.text());

    const root = parse(html);

    const getMeta = (prop: string) =>
      root.querySelector(`meta[property="${prop}"]`)?.getAttribute("content")?.trim() || "";

    const getLink = (rel: string) =>
      root.querySelector(`link[rel="${rel}"]`)?.getAttribute("href")?.trim() || "";

    const ogpTitle = getMeta("og:title");
    const ogpImage = getMeta("og:image") || getLink("image_src"); // ← 💡代替手段
    const ogpDesc = getMeta("og:description");
    const ogpUrl = getMeta("og:url") || rawUrl;

    if (!ogpTitle && !ogpImage) {
      return new Response(
        JSON.stringify({
          error: true,
          message: "OGP metadata not found",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        type: "ogp",
        title: ogpTitle,
        image: ogpImage,
        description: ogpDesc,
        url: ogpUrl,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("OGP fallback fetch failed", err);
    return new Response(
      JSON.stringify({
        error: true,
        message: "Failed to fetch OGP",
      }),
      { status: 500 }
    );
  }
}