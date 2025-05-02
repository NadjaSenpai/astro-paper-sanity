// src/components/PortableTextRendererSSR.tsx
import { PortableText } from "@portabletext/react";
import { createPortableTextComponents } from "@/components/PortableTextComponents";
import type { EmbedData } from "@/components/SmartLink";

interface Props {
  value: any[];
  headingLink?: boolean;
  embedMap: Record<string, EmbedData>;
}

export default function PortableTextRendererSSR({
  value,
  headingLink = true,
  embedMap,
}: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText
        value={value}
        components={createPortableTextComponents({
          headingLink,
          isSSR: true,
          embedMap,
        })}
      />
    </div>
  );
}
