"use client";

import { ReactElement } from "react";
import { PortableText } from "@portabletext/react";
import { createPortableTextComponents } from "@/components/PortableTextComponents";

interface Props {
  value: any[];
  headingLink?: boolean;
  embedMap: Record<string, any>;
}

export default function PortableTextRendererClient({
  value,
  headingLink = true,
  embedMap,
}: Props): ReactElement {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText
        value={value}
        components={createPortableTextComponents({
          headingLink,
          isSSR: false,
          embedMap,
        })}
      />
    </div>
  );
}
