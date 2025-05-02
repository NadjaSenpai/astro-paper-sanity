// src/components/ImageWithModal.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "@/lib/sanity/client";

interface ImageWithModalProps {
  value: {
    asset: { _id?: string; url: string };
    alt?: string;
    caption?: string | null;
    alignment?: "left" | "center" | "right";
    width?: number;
    // その他 Portable Text のイメージフィールドも含める
    [key: string]: any;
  };
}

const builder = imageUrlBuilder({ projectId, dataset });
// ビルダーだけ返すユーティリティ
function imageBuilder(source: any) {
  return builder.image(source).auto("format");
}

export default function ImageWithModal({ value }: ImageWithModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // クライアントマウント後にモーダル用ポータルを有効化
  useEffect(() => {
    setMounted(true);
  }, []);

  // サムネイルとフルサイズの URL をビルダーから生成
  const thumbSrc = imageBuilder(value).width(600).url();
  const fullSrc = imageBuilder(value).url();

  // alignment と width の反映
  const align = value.alignment ?? "center";
  const justifyClass =
    align === "right"
      ? "justify-end"
      : align === "left"
      ? "justify-start"
      : "justify-center";
  const style = value.width ? { width: `${value.width}px` } : undefined;

  // SSR/初回レンダー時に同じマークアップを出力
  const imgMarkup = (
    <figure className={`not-prose my-4 flex ${justifyClass}`}>
      <img
        src={thumbSrc}
        data-full-src={fullSrc}
        alt={value.alt ?? ""}
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

  // クライアントのみ document.body にポータルを張る
  const overlay =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            style={{ opacity: open ? 1 : 0, transition: "opacity 200ms ease" }}
          >
            <img
              src={fullSrc}
              alt={value.alt ?? ""}
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
