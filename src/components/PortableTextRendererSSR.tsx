// src/components/PortableTextRendererClient.tsx
"use client";
import { ReactElement } from "react";
import type { EmbedData } from "@/components/SmartLink";
import { PortableText } from "@portabletext/react";
import { createPortableTextComponents } from "@/components/PortableTextComponents";

interface Props {
  value: any[];
  embedMap?: Record<string, EmbedData | null>;
}

export default function PortableTextRendererClient({
  value,
  embedMap,
}: Props): ReactElement {
  return (
    <div className="prose">
      <PortableText
        value={value}
        components={createPortableTextComponents({ isSSR: false, embedMap })}
      />
    </div>
  );
}
