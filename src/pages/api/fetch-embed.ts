// src/pages/api/fetch-embed.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { parse } from "node-html-parser";

export const GET: APIRoute = async ({ request }) => {
  // ─── ベース URL を決める ───
  // 開発 (astro dev) 時は localhost:3000、それ以外はヘッダーから組み立て
  const dev = import.meta.env.DEV;
  const base = dev
    ? "http://localhost:3000"
    : `${request.headers.get("x-forwarded-proto") ?? "https"}://${request.headers.get("host")}`;

  // request.url は絶対パス or クエリ付きパスなので、base を添えて new URL
  const urlObj = new URL(request.url, base);
  const rawUrl = urlObj.searchParams.get("url");
  const theme  = urlObj.searchParams.get("theme") ?? "dark";

  if (!rawUrl) {
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

  // ─── YouTube ───
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
            <iframe
              class="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/${id}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>`;
        return new Response(JSON.stringify({ type: "oembed", html }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch {
      // fallthrough
    }
  }

  // ─── Twitter/X ───
  if (/twitter\.com|x\.com/.test(rawUrl)) {
    try {
      const api = `https://publish.twitter.com/oembed?url=${encodeURIComponent(
        rawUrl
      )}&theme=${theme}`;
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
    } catch {
      // fallthrough
    }
  }

  // ─── Vimeo ───
  if (/vimeo\.com/.test(rawUrl)) {
    try {
      const api = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
        rawUrl
      )}`;
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
    } catch {
      // fallthrough
    }
  }

  // ─── SoundCloud ───
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
    } catch {
      // fallthrough
    }
  }

  // ─── Spotify ───
  if (/open\.spotify\.com/.test(rawUrl)) {
    const m = rawUrl.match(/open\.spotify\.com\/(track|album|playlist)\/(\w+)/);
    if (m) {
      const [, kind, id] = m;
      const html = `
        <div class="my-4 max-w-3xl">
          <iframe
            src="https://open.spotify.com/embed/${kind}/${id}"
            width="100%"
            height="380"
            frameborder="0"
            allow="encrypted-media"
            allowfullscreen
          ></iframe>
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

  // ─── OGP フォールバック ───
  try {
    const text = await fetch(rawUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const root = parse(text);

    const get = (prop: string) =>
      root.querySelector(`meta[property="${prop}"]`)?.getAttribute("content")?.trim() ||
      "";
    const getLink = (rel: string) =>
      root.querySelector(`link[rel="${rel}"]`)?.getAttribute("href")?.trim() || "";

    const title       = get("og:title");
    const image       = get("og:image") || getLink("image_src");
    const description = get("og:description");
    const ogUrl       = get("og:url") || rawUrl;

    if (title || image) {
      return new Response(
        JSON.stringify({ type: "ogp", title, image, description, url: ogUrl }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }
  } catch {
    // fallthrough
  }

  // ─── 全フォールバック ───
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
