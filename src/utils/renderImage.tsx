import { useState } from "react";
import { urlFor } from "@/lib/sanity/utils/image";

export function renderImage({ value }: { value: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!value?.asset?._ref) return null;

  const imageUrl = urlFor(value).url();

  return (
    <>
      <img
        src={imageUrl}
        alt={value.alt || ""}
        className={`my-6 cursor-pointer mx-auto ${
          value.alignment === "left"
            ? "ml-0 mr-auto"
            : value.alignment === "right"
            ? "ml-auto mr-0"
            : "mx-auto"
        }`}
        style={{
          maxWidth: value.width ? `${value.width}px` : "100%",
        }}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={imageUrl}
            alt={value.alt || ""}
            className="transition-transform duration-300 ease-in-out scale-100 hover:scale-105 max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}
    </>
  );
}
