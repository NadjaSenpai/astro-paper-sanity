// src/components/PortableTextRendererIsland.tsx
import PortableTextRendererClient from "@/components/PortableTextRendererClient";
import PortableTextRendererSSR from "@/components/PortableTextRendererSSR";
import type { EmbedData } from "@/components/SmartLink";

interface Props {
  value: any[];
  headingLink?: boolean;
  embedMap: Record<string, EmbedData>;
}

export default function PortableTextRendererIsland({
  value,
  headingLink = true,
  embedMap,
}: Props) {
  // SSR のみ、クライアントのみを切り分ける場合は typeof window で検出
  if (typeof window === "undefined") {
    return (
      <PortableTextRendererSSR
        value={value}
        headingLink={headingLink}
        embedMap={embedMap}
      />
    );
  } else {
    return (
      <PortableTextRendererClient
        value={value}
        headingLink={headingLink}
        embedMap={embedMap}
      />
    );
  }
}
