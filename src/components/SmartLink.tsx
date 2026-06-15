"use client";

import { useEffect, useState } from "react";

export interface EmbedData {
  type: "oembed" | "ogp";
  html?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface Props {
  url: string;
}

export default function SmartLink({ url }: Props) {
  const [data, setData] = useState<EmbedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isTwitter = /(twitter|x)\.com/.test(url);
  const isMedia = /youtube\.com|youtu\.be|vimeo\.com/.test(url);

  useEffect(() => {
    let cancelled = false;

    async function fetchEmbed() {
      try {
        // クエリパラメータを組み立て
        const params = new URLSearchParams({ url });
        if (isTwitter) params.set("theme", "dark");

        // 相対パスのみで fetch
        const endpoint = `/api/fetch-embed?${params.toString()}`;
        console.log("[SmartLink] fetching", endpoint);

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Fetch Error: ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          if ((json.type === "oembed" && json.html) || json.type === "ogp") {
            json.html && (json.html = json.html.trim());
            setData(json as EmbedData);

            if (json.type === "oembed" && typeof json.html === "string") {
              // HTML 内の <script src="..."> は dangerouslySetInnerHTML で
              // そのまま挿入しても browser が実行しないので、ここで src を
              // 抽出して document.body に動的 append する。すでに同じ src が
              // ある場合は append をスキップ。
              const srcMatches = Array.from(
                (json.html as string).matchAll(
                  /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi
                )
              );
              const loads = srcMatches.map(m => {
                const src = m[1];
                if (document.querySelector(`script[src="${src}"]`)) {
                  return Promise.resolve();
                }
                return new Promise<void>(resolve => {
                  const s = document.createElement("script");
                  s.src = src;
                  s.async = true;
                  s.onload = () => resolve();
                  s.onerror = () => resolve();
                  document.body.appendChild(s);
                });
              });
              // Scripts が load されたら provider-specific hydrator を 1 度叩く
              // (既存 widget script が既に load 済みの 2 回目以降のために必要)
              Promise.all(loads).then(() => {
                if (cancelled) return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const w = window as any;
                w.twttr?.widgets?.load?.();
                w.instgrm?.Embeds?.process?.();
                // TikTok's embed.js auto-detects new .tiktok-embed elements,
                // so an explicit trigger isn't necessary.
              });
            }
          } else {
            setError("Unsupported embed type");
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("SmartLink fetch error", e);
          setError(e.message);
        }
      }
    }

    fetchEmbed();
    return () => {
      cancelled = true;
    };
  }, [url, isTwitter]);

  // エラー or ロード中
  if (error) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-red-500">
        {url} (embed error)
      </a>
    );
  }
  if (!data) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline opacity-50">
        {url}
      </a>
    );
  }

  // oEmbed
  if (data.type === "oembed" && data.html) {
    // Belt-and-suspenders: only inject HTML that contains either an
    // <iframe> (YouTube / Vimeo / Spotify / SoundCloud / Bandcamp /
    // Apple Music / CodePen / Figma) or an external <script src=> tag
    // (Twitter, TikTok, Instagram, GitHub Gist — all client-side
    // hydrators). fetch-embed.ts has already enforced the provider
    // host allowlist; this gate just catches obviously broken
    // responses, not adversarial ones.
    const html = data.html;
    const isSafeHtml =
      /<iframe\b/i.test(html) ||
      /<script\b[^>]*\bsrc=/i.test(html);
    if (!isSafeHtml) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
          {url}
        </a>
      );
    }
    return (
      <figure className="my-4">
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline block mb-2">
          {url}
        </a>
        <div
          className={
            isMedia
              ? "relative w-full aspect-video my-4 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
              : "my-4 w-full overflow-x-auto [&>iframe]:w-full"
          }
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      </figure>
    );
  }

  // OGP
  return (
    <figure className="my-4 max-w-3xl">
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline block mb-2">
        {url}
      </a>
      <a
        href={data.url || url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded border bg-muted/20 p-4 hover:bg-muted/40 transition"
      >
        {data.image && (
          <img
            src={data.image}
            alt={data.title || url}
            className="mb-2 w-full max-h-64 object-contain rounded bg-muted/20"
            loading="lazy"
          />
        )}
        <h3 className="text-lg font-semibold">{data.title}</h3>
        {data.description && (
          <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
            {data.description}
          </p>
        )}
      </a>
    </figure>
  );
}
