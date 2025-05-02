// ✅ SmartLinkSSR.tsx（SSR専用・useEffectなし）
import type { EmbedData } from "@/components/SmartLink";

interface Props {
  url: string;
  embed: EmbedData | null;
}

function safeText(input: unknown): string {
  return typeof input === "string" ? input : "";
}

export default function SmartLinkSSR({ url, embed }: Props) {
  try {
    if (!embed || typeof embed !== "object" || !("type" in embed)) {
      return <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">{url}</a>;
    }

    if (embed.type === "oembed" && typeof embed.html === "string") {
      return (
        <>
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 block mb-2">{url}</a>
          <div
            className={
              url.includes("youtube") || url.includes("vimeo")
                ? "relative w-full aspect-video my-4 max-w-none [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0 [&>iframe]:w-full [&>iframe]:h-full"
                : "my-4 w-full max-w-3xl overflow-x-auto [&>iframe]:w-full [&>iframe]:block"
            }
            dangerouslySetInnerHTML={{ __html: embed.html }}
          />
        </>
      );
    }

    if (embed.type === "ogp") {
      const title = safeText(embed.title);
      const desc = safeText(embed.description);
      const img = typeof embed.image === "string" ? embed.image : undefined;
      const link = typeof embed.url === "string" ? embed.url : url;

      return (
        <>
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 block mb-2">{url}</a>
          <a href={link} target="_blank" rel="noopener noreferrer" className="block my-4 w-full max-w-3xl rounded border border-border bg-muted/20 p-4 hover:bg-muted/40 transition">
            {img && <img src={img} alt={title} className="mb-2 max-h-48 w-full object-cover rounded" />}
            <div className="text-lg font-semibold">{title}</div>
            {desc && <div className="mt-1 text-sm text-foreground/70 line-clamp-2">{desc}</div>}
          </a>
        </>
      );
    }

    return <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">{url}</a>;
  } catch (err) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-red-500">{url} (embed error)</a>;
  }
}
