// src/components/SmartLinkSSR.tsx
import type { EmbedData } from "./SmartLink";

interface Props {
  url: string;
  embed: EmbedData | null;
}

export default function SmartLinkSSR({ url, embed }: Props) {
  if (!embed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
        {url}
      </a>
    );
  }

  if (embed.type === "oembed" && embed.html) {
    return (
      <>
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline block mb-2">
          {url}
        </a>
        <div
          className="my-4 w-full max-w-3xl"
          dangerouslySetInnerHTML={{ __html: embed.html }}
        />
      </>
    );
  }

  return (
    <>
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline block mb-2">
        {url}
      </a>
      <a
        href={embed.url || url}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-4 max-w-3xl rounded border bg-muted/20 p-4 hover:bg-muted/40 transition"
      >
        {embed.image && (
          <img src={embed.image} alt={embed.title} className="mb-2 w-full object-cover rounded" />
        )}
        <div className="text-lg font-semibold">{embed.title}</div>
        <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
          {embed.description}
        </p>
      </a>
    </>
  );
}
