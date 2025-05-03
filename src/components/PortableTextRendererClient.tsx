// src/components/PortableTextRendererClient.tsx
"use client";

import { ReactElement } from "react";
import { PortableText } from "@portabletext/react";
import { createPortableTextComponents } from "./PortableTextComponents";

interface Props {
  value: any[];
}

export default function PortableTextRendererClient({ value }: Props): ReactElement {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText
        value={value}
        components={createPortableTextComponents()}
      />
    </div>
  );
}
