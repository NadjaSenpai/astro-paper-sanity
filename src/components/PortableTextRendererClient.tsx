// src/components/PortableTextRendererClient.tsx
"use client";

import { ReactElement } from "react";
import { PortableText } from "@portabletext/react";
import { createPortableTextComponents } from "./PortableTextComponents";
import type { HighlightedCodeMap } from "@/lib/highlight/highlightCodeBlocks";

interface Props {
  value: any[];
  highlightedCode?: HighlightedCodeMap;
}

export default function PortableTextRendererClient({
  value,
  highlightedCode = {},
}: Props): ReactElement {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText
        value={value}
        components={createPortableTextComponents(highlightedCode)}
      />
    </div>
  );
}
