// functions/api/fetch-embed.ts
import { parse } from "node-html-parser";

// ─── SSRF guard ───────────────────────────────────────────────────────────────
function validateOutboundUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Disallowed URL");
  }

  const host = parsed.hostname;
  if (!host) throw new Error("Disallowed URL");

  // Reject loopback and private ranges
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1"
  ) throw new Error("Disallowed URL");

  // Reject link-local / metadata
  // Pure numeric hosts that look like IPs
  const ipv4Match = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const [, a, b, , ] = ipv4Match.map(Number);
    if (
      a === 10 ||                                          // 10.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) ||               // 172.16.0.0/12
      (a === 192 && b === 168) ||                        // 192.168.0.0/16
      (a === 169 && b === 254) ||                        // 169.254.0.0/16
      a === 127                                           // 127.0.0.0/8
    ) throw new Error("Disallowed URL");
  }

  // Reject pure-numeric hostnames (e.g. decimal IP representations)
  if (/^\d+$/.test(host)) throw new Error("Disallowed URL");

  // Reject IPv6 private / link-local (fc00::/7 and fe80::/10)
  const lowerHost = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (lowerHost.startsWith("fc") || lowerHost.startsWith("fd") || lowerHost.startsWith("fe8") || lowerHost.startsWith("fe9") || lowerHost.startsWith("fea") || lowerHost.startsWith("feb")) {
    throw new Error("Disallowed URL");
  }

  return parsed;
}

// Workers runtime forbids constructing Response objects in module top
// level (it counts as a randomness-bearing operation). Build a fresh
// Response inside the handler each time instead.
function disallowedResponse(): Response {
  return new Response(
    JSON.stringify({ error: true, message: "Disallowed URL" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

// ─── Body size-limited reader ─────────────────────────────────────────────────
// When the upstream response exceeds `max` bytes, stop reading and return
// what we already have. OGP meta tags live in <head>, which on real product
// pages (Amazon etc.) typically arrives in the first few hundred KiB even
// when the full HTML is much larger; aborting outright would lose them.
async function readLimited(response: Response, max: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let result = "";
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    result += decoder.decode(value, { stream: true });
    if (total > max) {
      reader.cancel();
      break;
    }
  }
  result += decoder.decode();
  return result;
}

const MAX_BODY = 1024 * 1024; // 1 MiB

// ─── Provider allowlist for branch entry hosts ───────────────────────────────
// Every branch that calls an upstream oEmbed API or hosts a hand-built
// iframe whose `src` includes the inbound URL goes through this check first,
// so we never expose a path where any URL string can reach those providers.
const ALLOWED_EMBED_HOSTS = [
  "twitter.com",
  "x.com",
  "soundcloud.com",
  "bandcamp.com",
  "music.apple.com",
  "codepen.io",
  "figma.com",
  "tiktok.com",
  "instagram.com",
];

function isAllowedOembedHost(hostname: string): boolean {
  return ALLOWED_EMBED_HOSTS.some(
    h => hostname === h || hostname.endsWith("." + h)
  );
}

export async function onRequestGet(context: {
  request: Request;
}): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);
  console.log("[fetch-embed] incoming URL:", url.toString());

  const rawUrl = url.searchParams.get("url");
  const theme  = url.searchParams.get("theme") ?? "dark";

  if (!rawUrl) {
    return new Response(
      JSON.stringify({ error: true, message: "Missing 'url' parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate the inbound URL before any branch processes it
  let parsedRawUrl: URL;
  try {
    parsedRawUrl = validateOutboundUrl(rawUrl);
  } catch {
    return disallowedResponse();
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
      if (id && /^[A-Za-z0-9_-]{6,32}$/.test(id)) {
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
  // publish.twitter.com/oembed is now flaky / gated, so we synthesise the
  // widget bootstrap markup ourselves. Twitter's own widgets.js then
  // hydrates the blockquote into a full tweet card. Same approach as
  // YouTube / Vimeo / Spotify: avoid the outbound oEmbed dependency.
  if (/twitter\.com|x\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    const safeTheme = theme === "dark" ? "dark" : "light";
    const html = `
      <blockquote class="twitter-tweet" data-theme="${safeTheme}">
        <a href="${rawUrl}">${rawUrl}</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
    return new Response(JSON.stringify({ type: "oembed", html }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  // ─── Vimeo ───
  // Vimeo's oEmbed API is unreliable from Cloudflare Pages Functions
  // (Cloudflare-to-Cloudflare traffic gets bot-challenged), so synthesise
  // the iframe directly from the video ID. Same approach as YouTube/Spotify.
  if (/vimeo\.com/.test(rawUrl)) {
    const m = rawUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) {
      const id = m[1];
      if (/^\d+$/.test(id)) {
        const html = `
          <div class="relative w-full aspect-video my-4">
            <iframe
              class="absolute inset-0 w-full h-full"
              src="https://player.vimeo.com/video/${id}"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
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
  }

  // ─── SoundCloud ───
  if (/soundcloud\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    try {
      const api = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(rawUrl)}`;
      const res = await fetch(api, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.startsWith("application/json")) throw new Error("Unexpected content-type");
        const body = await readLimited(res, MAX_BODY);
        const { html } = JSON.parse(body);
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
    // open.spotify.com/{track|album|playlist|episode|show}/{id} の前に
    // /intl-ja/ などのロケールプレフィックスが入るケースを許容する。
    const m = rawUrl.match(
      /open\.spotify\.com\/(?:intl-[a-z]{2,3}\/)?(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/
    );
    if (m) {
      const [, kind, id] = m;
      if (/^[A-Za-z0-9]+$/.test(id)) {
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
  }

  // ─── Bandcamp ───
  // Public, stable oEmbed API. Same pattern as SoundCloud.
  if (/bandcamp\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    try {
      const api = `https://bandcamp.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`;
      const res = await fetch(api, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.startsWith("application/json")) throw new Error("Unexpected content-type");
        const body = await readLimited(res, MAX_BODY);
        const { html } = JSON.parse(body);
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

  // ─── Apple Music ───
  // music.apple.com/{country}/album/{slug}/{id} ⇒ embed.music.apple.com/...
  if (/music\.apple\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    const embedSrc = rawUrl.replace(/^https:\/\/music\.apple\.com\//, "https://embed.music.apple.com/");
    const html = `
      <div class="my-4 max-w-3xl">
        <iframe
          src="${embedSrc}"
          width="100%"
          height="450"
          frameborder="0"
          allow="autoplay *; encrypted-media *; clipboard-write"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
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

  // ─── CodePen ───
  // codepen.io/{user}/(pen|full)/{slug} ⇒ codepen.io/{user}/embed/{slug}
  if (/codepen\.io/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    const m = rawUrl.match(/codepen\.io\/([^/]+)\/(?:pen|full|details)\/([A-Za-z0-9]+)/);
    if (m) {
      const [, user, slug] = m;
      if (/^[A-Za-z0-9_-]+$/.test(user) && /^[A-Za-z0-9]+$/.test(slug)) {
        const html = `
          <div class="my-4 max-w-3xl">
            <iframe
              src="https://codepen.io/${user}/embed/${slug}?height=400&default-tab=result"
              width="100%"
              height="400"
              loading="lazy"
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
  }

  // ─── Figma ───
  // Any figma.com URL can be embedded through the official embed endpoint.
  if (/figma\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    const html = `
      <div class="my-4 max-w-3xl">
        <iframe
          src="https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(rawUrl)}"
          width="100%"
          height="450"
          frameborder="0"
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

  // ─── TikTok ───
  // blockquote + widgets.js (TikTok's official client-side hydration).
  if (/tiktok\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    const m = rawUrl.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    const videoId = m && /^\d+$/.test(m[1]) ? m[1] : "";
    const html = `
      <blockquote class="tiktok-embed" cite="${rawUrl}"${videoId ? ` data-video-id="${videoId}"` : ""}>
        <a href="${rawUrl}">${rawUrl}</a>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>`;
    return new Response(JSON.stringify({ type: "oembed", html }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  // ─── Instagram ───
  // blockquote + embed.js (Instagram's official client-side hydration).
  if (/instagram\.com/.test(rawUrl)) {
    if (!isAllowedOembedHost(parsedRawUrl.hostname)) {
      return disallowedResponse();
    }
    const html = `
      <blockquote class="instagram-media" data-instgrm-permalink="${rawUrl}" data-instgrm-version="14">
        <a href="${rawUrl}">${rawUrl}</a>
      </blockquote>
      <script async src="https://www.instagram.com/embed.js"></script>`;
    return new Response(JSON.stringify({ type: "oembed", html }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  // ─── OGP / 多段フォールバック ───
  // og:* → twitter:* → <title> / <meta name="description"> → 画像系の最終手段
  // (Amazon など OGP メタを出さないサイト向け)
  try {
    const ogpRes = await fetch(rawUrl, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja,en;q=0.8",
      },
    });
    const ogpCt = ogpRes.headers.get("content-type") ?? "";
    if (!ogpCt.startsWith("text/html") && !ogpCt.startsWith("application/xhtml+xml")) {
      throw new Error("Unexpected content-type");
    }
    const htmlText = await readLimited(ogpRes, MAX_BODY);
    const root = parse(htmlText);

    const metaProp = (prop: string) =>
      root.querySelector(`meta[property="${prop}"]`)?.getAttribute("content")?.trim() ||
      "";
    const metaName = (name: string) =>
      root.querySelector(`meta[name="${name}"]`)?.getAttribute("content")?.trim() || "";
    const linkRel = (rel: string) =>
      root.querySelector(`link[rel="${rel}"]`)?.getAttribute("href")?.trim() || "";

    const title =
      metaProp("og:title") ||
      metaName("twitter:title") ||
      root.querySelector("title")?.text?.trim() ||
      "";

    const description =
      metaProp("og:description") ||
      metaName("twitter:description") ||
      metaName("description") ||
      "";

    let image =
      metaProp("og:image") ||
      metaName("twitter:image") ||
      metaName("twitter:image:src") ||
      linkRel("image_src") ||
      "";

    // それでも画像が無ければ <img> の中で「商品っぽい」ものを探す
    if (!image) {
      const candidate =
        root.querySelector("#landingImage") ||           // Amazon 商品ページ
        root.querySelector("img[data-old-hires]") ||     // Amazon の高解像度版
        root.querySelector("article img") ||
        root.querySelector("main img") ||
        root.querySelector("img");
      image =
        candidate?.getAttribute("data-old-hires")?.trim() ||
        candidate?.getAttribute("src")?.trim() ||
        "";
    }

    // 相対パスを絶対化
    if (image && !/^https?:\/\//.test(image)) {
      try {
        image = new URL(image, rawUrl).toString();
      } catch {
        image = "";
      }
    }

    const finalUrl = metaProp("og:url") || rawUrl;

    if (title || image) {
      return new Response(
        JSON.stringify({ type: "ogp", title, image, description, url: finalUrl }),
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
    console.warn("[fetch-embed] ogp fallback failed:", err);
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
  )
}
