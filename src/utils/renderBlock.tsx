import type { ReactNode, ReactElement } from "react";
import type { PortableTextComponentProps } from "@portabletext/react";
import type { EmbedData } from "@/components/SmartLink";
import SmartLinkClient from "@/components/SmartLink";
import SmartLinkSSR from "@/components/SmartLinkSSR";

interface CustomBlockProps extends PortableTextComponentProps<any> {
  headingLink?: boolean;
  children?: ReactNode;
  isSSR?: boolean;
  embedMap?: Record<string, EmbedData>;
}

export function renderBlock(props: CustomBlockProps): ReactElement {
  const { value, children, headingLink, isSSR = false, embedMap = {} } = props;

  if (
    value._type === "block" &&
    value.children?.length === 1 &&
    value.children[0]?._type === "span" &&
    typeof value.children[0].text === "string" &&
    value.children[0].text.trim().match(/^https?:\/\/[^\s]+$/) &&
    (value.children[0].marks?.length ?? 0) === 0
  ) {
    const url = value.children[0].text.trim();
    return isSSR ? (
      <SmartLinkSSR url={url} embed={embedMap[url] ?? null} />
    ) : (
      <SmartLinkClient url={url} />
    );
  }

  const Tag =
    value.style === "h1"
      ? "h1"
      : value.style === "h2"
      ? "h2"
      : value.style === "h3"
      ? "h3"
      : value.style === "h4"
      ? "h4"
      : value.style === "blockquote"
      ? "blockquote"
      : "p";

  const id =
    headingLink && Tag === "h2"
      ? value.children?.[0]?.text
          ?.toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "-") ?? undefined
      : undefined;

  return <Tag id={id}>{children}</Tag>;
}
