// src/components/ImageWithModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "@/lib/sanity/client";

const builder = imageUrlBuilder({ projectId, dataset });
const urlFor = (source: any) => builder.image(source).auto("format");

export default function ImageWithModal({
  value,
}: {
  value: {
    asset: { _ref?: string; url?: string };
    alt?: string;
    caption?: string | null;
    alignment?: "left" | "center" | "right";
    width?: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const thumbUrl = urlFor(value).width(600).url();
  const fullUrl = urlFor(value).url();
  const justify =
    value.alignment === "right"
      ? "justify-end"
      : value.alignment === "left"
      ? "justify-start"
      : "justify-center";
  const style = value.width ? { width: `${value.width}px` } : undefined;

  const imgFigure = (
    <figure className={`not-prose my-4 flex ${justify}`}>
      <img
        src={thumbUrl}
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

  // クライアントマウント後にポータルでモーダルを出す
  const modal =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            style={{ opacity: open ? 1 : 0, transition: "opacity 200ms ease" }}
          >
            <img
              src={fullUrl}
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
      {imgFigure}
      {modal}
    </>
  );
}
