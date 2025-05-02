import { useEffect, useRef, useState } from "react";

export interface EmbedData {
  type: "oembed" | "ogp";
  html?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface SmartLinkProps {
  url: string;
}

export default function SmartLink({ url }: SmartLinkProps) {
  const [data, setData] = useState<EmbedData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isTwitter = url.includes("twitter.com") || url.includes("x.com");
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = url.includes("vimeo.com");

  useEffect(() => {
    const theme = "dark";

    const fetchUrl = `/api/fetch-embed?url=${encodeURIComponent(url)}${
      isTwitter ? `&theme=${theme}` : ""
    }`;

    const fetchEmbed = async () => {
      try {
        const res = await fetch(fetchUrl);
        const json = await res.json();

        if (json?.type === "oembed" && json.html) {
          setData({ type: "oembed", html: json.html });

          if (
            isTwitter &&
            !document.querySelector('script[src*="platform.twitter.com/widgets.js"]')
          ) {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);
          }
        } else if (json?.type === "ogp") {
          setData(json);
        }
      } catch (err) {
        console.error("SmartLink fetch error", err);
      }
    };

    fetchEmbed();
  }, [url]);

  // ✅ oEmbed 成功時
  if (data?.type === "oembed" && data.html) {
    return (
      <>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 block mb-2"
        >
          {url}
        </a>
        <div
          ref={containerRef}
          className={
            isYouTube || isVimeo
              ? "relative w-full aspect-video my-4 max-w-none [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0 [&>iframe]:w-full [&>iframe]:h-full"
              : "my-4 w-full max-w-3xl overflow-x-auto [&>iframe]:w-full [&>iframe]:block"
          }
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      </>
    );
  }

  // ✅ OGP 成功時
  if (data?.type === "ogp") {
    return (
      <>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 block mb-2"
        >
          {url}
        </a>
        <a
          href={data.url || url}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-4 w-full max-w-3xl rounded border border-border bg-muted/20 p-4 hover:bg-muted/40 transition"
        >
          {data.image && (
            <img
              src={data.image}
              alt={data.title || ""}
              className="mb-2 max-h-48 w-full object-cover rounded"
            />
          )}
          <div className="text-lg font-semibold">{data.title}</div>
          {data.description && (
            <div className="mt-1 text-sm text-foreground/70 line-clamp-2">{data.description}</div>
          )}
        </a>
      </>
    );
  }

  // ✅ それ以外（fetch失敗や未対応）のとき：ふつうのリンク表示
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:opacity-80"
    >
      {url}
    </a>
  );
}
