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

  const isTwitter = url.includes("twitter.com") || url.includes("x.com");
  const isMedia = /youtube\.com|youtu\.be|vimeo\.com/.test(url);

  useEffect(() => {
    const fetchEmbed = async () => {
      const origin = window.location.origin;
      const params = new URLSearchParams({ url });
      if (isTwitter) params.set("theme", "dark");

      const endpoint = `${origin}/api/fetch-embed?${params.toString()}`;
      console.log("[SmartLink] fetching", endpoint);

      try {
        const res = await fetch(endpoint, { credentials: "same-origin" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if ((json.type === "oembed" && json.html) || json.type === "ogp") {
          setData(json as EmbedData);

          // ← Twitter 埋め込み用 widget.js の読み込み
          if (
            json.type === "oembed" &&
            isTwitter &&
            !document.querySelector('script[src*="platform.twitter.com/widgets.js"]')
          ) {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);
          }
        }
      } catch (err) {
        console.error("SmartLink fetch error", err);
        setData(null);
      }
    };

    fetchEmbed();
  }, [url, isTwitter]);

  // oEmbed
  if (data?.type === "oembed" && data.html) {
    return (
      <>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline block mb-2"
        >
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
      </>
    );
  }

  // OGP
  if (data?.type === "ogp") {
    return (
      <>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline block mb-2"
        >
          {url}
        </a>
        <a
          href={data.url || url}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-4 max-w-3xl rounded border bg-muted/20 p-4 hover:bg-muted/40 transition"
        >
          {data.image && (
            <img
              src={data.image}
              alt={data.title}
              className="mb-2 w-full object-cover rounded"
            />
          )}
          <div className="text-lg font-semibold">{data.title}</div>
          <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
            {data.description}
          </p>
        </a>
      </>
    );
  }

  // フォールバック
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
      {url}
    </a>
  );
}
