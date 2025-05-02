import React from "react";
import type { PortableTextBlock } from "@portabletext/types";
import type { EmbedData } from "@/components/SmartLink";
import PortableTextRendererSSR from "@/components/PortableTextRendererSSR";
import PortableTextRendererClient from "@/components/PortableTextRendererClient";

interface Props {
  value: PortableTextBlock[];
  embedMap?: Record<string, EmbedData>;
  headingLink?: boolean;
}

export default function PortableTextRendererIsland({
  value,
  embedMap = {},
  headingLink = true,
}: Props) {
  const isClient = typeof window !== "undefined";
  return isClient ? (
    <PortableTextRendererClient value={value} headingLink={headingLink} />
  ) : (
    <PortableTextRendererSSR
      value={value}
      embedMap={embedMap}
      headingLink={headingLink}
    />
  );
}