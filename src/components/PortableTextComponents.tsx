import type { PortableTextComponentProps } from "@portabletext/react";
import type { ReactElement } from "react";
import type { EmbedData } from "@/components/SmartLink";
import CodeBlock from "@/components/CodeBlock";
import CodeBlockSSR from "@/components/CodeBlockSSR";
import ImageWithModal from "@/components/ImageWithModal";
import SmartLinkClient from "@/components/SmartLink";
import SmartLinkSSR from "@/components/SmartLinkSSR";
import { renderYouTube } from "@/utils/renderYouTube";

interface ComponentOptions {
  isSSR?: boolean;
  headingLink?: boolean;
  embedMap?: Record<string, EmbedData | null>;
}

export function createPortableTextComponents({
  isSSR = false,
  embedMap = {},
}: ComponentOptions) {
  return {
    types: {
      code: (props: any) => {
        const { code, language } = props.value as { code: string; language?: string };
        return isSSR
          ? <CodeBlockSSR code={code} language={language} />
          : <CodeBlock value={{ code, language }} />;
      },
      image: (props: any) => <ImageWithModal value={props.value} />,
      youtube: (props: any) => renderYouTube({ value: props.value }),
    },
    marks: {}, // renderMarks を使うならここに
    block: {
      normal: (props: PortableTextComponentProps<any>): ReactElement => {
        const { value, children } = props;
        if (
          value._type === "block" &&
          value.children?.length === 1 &&
          value.children[0]._type === "span" &&
          typeof value.children[0].text === "string" &&
          value.children[0].text.trim().match(/^https?:\/\/[^\s]+$/) &&
          (value.children[0].marks?.length ?? 0) === 0
        ) {
          const url = value.children[0].text.trim();
          return isSSR
            ? <SmartLinkSSR url={url} embed={embedMap[url] ?? null} />
            : <SmartLinkClient url={url} />;
        }
        return <p>{children}</p>;
      },
      h1: (props: PortableTextComponentProps<any>): ReactElement => <h1>{props.children}</h1>,
      h2: (props: PortableTextComponentProps<any>): ReactElement => <h2>{props.children}</h2>,
      h3: (props: PortableTextComponentProps<any>): ReactElement => <h3>{props.children}</h3>,
      h4: (props: PortableTextComponentProps<any>): ReactElement => <h4>{props.children}</h4>,
      blockquote: (props: PortableTextComponentProps<any>): ReactElement => (
        <blockquote>{props.children}</blockquote>
      ),
    },
  };
}
