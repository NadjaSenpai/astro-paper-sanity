// src/components/PortableTextComponents.tsx
"use client";

import { ReactElement } from "react";
import type { PortableTextComponentProps } from "@portabletext/react";
import CodeBlock from "@/components/CodeBlock";
import ImageWithModal from "@/components/ImageWithModal";
import SmartLink from "@/components/SmartLink";
import { renderYouTube } from "@/utils/renderYouTube";

export function createPortableTextComponents(): Record<string, any> {
  return {
    types: {
      code: (props: any): ReactElement => {
        const { code, language } = props.value as { code: string; language?: string };
        return <CodeBlock value={{ code, language }} />;
      },
      image: (props: any): ReactElement => <ImageWithModal value={props.value} />,
      youtube: (props: any): ReactElement => renderYouTube({ value: props.value }),
    },
    marks: {},
    block: {
      // プレーンな URL 行は SmartLink に
      normal: (props: PortableTextComponentProps<any>): ReactElement => {
        const { value, children } = props;
        if (
          value._type === "block" &&
          Array.isArray(value.children) &&
          value.children.length === 1 &&
          value.children[0]._type === "span" &&
          typeof value.children[0].text === "string" &&
          value.children[0].text.trim().match(/^https?:\/\/[^\s]+$/) &&
          (value.children[0].marks?.length ?? 0) === 0
        ) {
          const url = value.children[0].text.trim();
          return <SmartLink url={url} />;
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
