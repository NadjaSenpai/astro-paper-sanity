// src/components/ImageWithModal.tsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { PortableTextImage } from "@portabletext/types";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "@/lib/sanity/client";

const builder = imageUrlBuilder({ projectId, dataset });
const imageBuilder = (src: PortableTextImage) => builder.image(src).auto("format");

export default function ImageWithModal({
  value,
}: {
  value: PortableTextImage & {
    alt?: string;
    caption?: string | null;
    alignment?: "left" | "center" | "right";
    width?: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const thumb = imageBuilder(value).width(600).url();
  const full  = imageBuilder(value).url();
  const align = value.alignment || "center";
  const justify =
    align === "right"
      ? "justify-end"
      : align === "left"
      ? "justify-start"
      : "justify-center";
  const style = value.width ? { width: `${value.width}px` } : undefined;

  // SSR/Client初回で同一のマークアップ
  const imgMarkup = (
    <figure className={`not-prose my-4 flex ${justify}`}>
      <img
        src={thumb}
        data-full-src={full}                         // ← ここを追加
        alt={value.alt || ""}
        loading="lazy"
        className="cursor-pointer max-w-full rounded transition-transform duration-200"
        style={style}
        onClick={() => setOpen((v) => !v)}
      />
      {value.caption && (
        <figcaption className="mt-2 text-center text-sm text-foreground/70">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );

  // クライアントでのみポータルを生成
  const overlay =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            style={{ opacity: open ? 1 : 0, transition: "opacity 200ms" }}
          >
            <img
              src={full}
              alt={value.alt || ""}
              className="max-h-[90vh] max-w-[90vw] transform transition-transform duration-200"
              style={{ transform: open ? "scale(1)" : "scale(0.95)" }}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {imgMarkup}
      {overlay}
    </>
  );
}
