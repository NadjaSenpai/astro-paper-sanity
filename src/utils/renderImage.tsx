// src/utils/renderImage.tsx
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "@/lib/sanity/client";

const builder = imageUrlBuilder({ projectId, dataset });
const imageBuilder = (source: any) => builder.image(source).auto("format");

export function renderImage({
  value,
}: {
  value: any & {
    asset: { url: string };
    alt?: string;
    caption?: string | null;
    alignment?: string;
    width?: number;
  };
}) {
  const { asset, alt, caption, alignment, width } = value;
  const thumbUrl = imageBuilder(asset).width(600).url();
  const fullUrl  = imageBuilder(asset).url();

  // alignment を Tailwind クラスに変換
  const justifyClass =
    alignment === "right"
      ? "justify-end"
      : alignment === "left"
      ? "justify-start"
      : "justify-center";
  const style = width ? { width: `${width}px` } : undefined;

  return (
    <figure className={`not-prose my-4 flex ${justifyClass}`}>
      <img
        src={thumbUrl}
        data-full-src={fullUrl}
        alt={alt ?? ""}
        loading="lazy"
        className="cursor-pointer max-w-full rounded transition-transform duration-200"
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
