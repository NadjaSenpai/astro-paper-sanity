// src/pages/api/fetch-embed.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { parse } from "node-html-parser";

export const GET: APIRoute = async ({ url }) => {
  // デバッグ用ログ（Vercel の function logs で確認してみてください）
  console.log("[fetch-embed] incoming URL:", url.toString());

  // url は絶対 URL オブジェクトなので、searchParams がそのまま使えます
  const rawUrl = url.searchParams.get("url");
  const theme  = url.searchParams.get("theme") ?? "dark";

  if (!rawUrl) {
    console.warn("[fetch-embed] missing url param");
    return new Response(
      JSON.stringify({ error: true, message: "Missing 'url' parameter" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  // ───── YouTube ─────
  if (/youtu\.be\/|youtube\.com\/watch/.test(rawUrl)) {
    try {
      const parsed = new URL(rawUrl);
      let id: string | null = null;
      if (parsed.hostname.includes("youtube.com")) {
        id = parsed.searchParams.get("v");
      }
      if (!id && parsed.hostname.includes("youtu.be")) {
        id = parsed.pathname.slice(1);
      }
      if (id) {
        const html = `
          <div class="relative w-full aspect-video my-4">
            <iframe class="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/${id}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>`;
        return new Response(JSON.stringify({ type: "oembed", html }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch (e) {
      console.error("YouTube parse error:", e);
    }
  }

  // ───── Twitter/X ─────
  if (/twitter\.com|x\.com/.test(rawUrl)) {
    try {
      const api = `https://publish.twitter.com/oembed?url=${encodeURIComponent(rawUrl)}&theme=${theme}`;
      const res = await fetch(api);
      if (res.ok) {
        const { html } = await res.json();
        return new Response(JSON.stringify({ type: "oembed", html }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch (e) {
      console.error("Twitter oEmbed failed:", e);
    }
  }

  // ───── Vimeo ─────
  if (/vimeo\.com/.test(rawUrl)) {
    try {
      const api = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(rawUrl)}`;
      const res = await fetch(api);
      if (res.ok) {
        const { html } = await res.json();
        return new Response(JSON.stringify({ type: "oembed", html }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch (e) {
      console.error("Vimeo oEmbed failed:", e);
    }
  }

  // ───── SoundCloud ─────
  if (/soundcloud\.com/.test(rawUrl)) {
    try {
      const api = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(rawUrl)}`;
      const res = await fetch(api);
      if (res.ok) {
        const { html } = await res.json();
        return new Response(JSON.stringify({ type: "oembed", html }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch (e) {
      console.error("SoundCloud oEmbed failed:", e);
    }
  }

  // ───── Spotify ─────
  if (/open\.spotify\.com/.test(rawUrl)) {
    const m = rawUrl.match(/open\.spotify\.com\/(track|album|playlist)\/(\w+)/);
    if (m) {
      const [, kind, id] = m;
      const html = `
        <div class="my-4 max-w-3xl">
          <iframe
            src="https://open.spotify.com/embed/${kind}/${id}"
            width="100%" height="380" frameborder="0"
            allow="encrypted-media" allowfullscreen>
          </iframe>
        </div>`;
      return new Response(JSON.stringify({ type: "oembed", html }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
  }

  // ───── OGP フォールバック ─────
  try {
    const htmlText = await fetch(rawUrl, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.text());
    const root = parse(htmlText);
    const get = (prop: string) =>
      root.querySelector(`meta[property="${prop}"]`)?.getAttribute("content")?.trim() || "";
    const getLink = (rel: string) =>
      root.querySelector(`link[rel="${rel}"]`)?.getAttribute("href")?.trim() || "";

    const title       = get("og:title");
    const image       = get("og:image")    || getLink("image_src");
    const description = get("og:description");
    const finalUrl    = get("og:url")      || rawUrl;

    if (title || image) {
      return new Response(JSON.stringify({
        type: "ogp",
        title,
        image,
        description,
        url: finalUrl,
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
  } catch (e) {
    console.error("OGP fallback failed:", e);
  }

  // ───── 最終フォールバック ─────
  return new Response(
    JSON.stringify({ error: true, message: "Unable to embed content" }),
    {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
};
