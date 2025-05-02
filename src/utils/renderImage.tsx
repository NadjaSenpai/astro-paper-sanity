// src/utils/renderImage.tsx
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { PortableTextImage } from "@portabletext/types";
import { projectId, dataset } from "@/lib/sanity/client";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function renderImage({
  value,
}: {
  value: PortableTextImage & {
    alignment?: "left" | "center" | "right";
    width?: number;
    alt?: string;
    caption?: string | null;
  };
}) {
  const { alignment = "center", width, alt, caption } = value;

  // 🖼 画像 URL
  const src = urlFor(value)
    .auto("format")
    .width(width ?? 600)
    .url();

  // 🧭 alignment 別に justify-* を切り替え
  const justifyClass =
    alignment === "right"
      ? "justify-end"
      : alignment === "left"
      ? "justify-start"
      : "justify-center";

  // 🎨 style で幅を固定する場合
  const style = width ? { width: `${width}px` } : undefined;

  return (
    <figure
      className={`not-prose my-4 flex ${justifyClass}`}
      // figure 自体はフル幅のブロックです
    >
      <img
        src={src}
        data-full-src={value.asset.url}
        alt={alt || ""}
        loading="lazy"
        className="max-w-full rounded"
        style={style}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-foreground/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
