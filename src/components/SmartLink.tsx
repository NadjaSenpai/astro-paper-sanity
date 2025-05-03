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

            if (
              json.type === "oembed" &&
              isTwitter &&
              !document.querySelector('script[src*="platform.twitter.com/widgets.js"]')
            ) {
              const s = document.createElement("script");
              s.src = "https://platform.twitter.com/widgets.js";
              s.async = true;
              document.body.appendChild(s);
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
            className="mb-2 w-full object-cover rounded"
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
