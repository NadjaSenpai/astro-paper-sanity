// src/components/portableTextComponents.tsx
import CodeBlock from "@/components/CodeBlock";
import CodeBlockSSR from "@/components/CodeBlockSSR";
import ImageWithModal from "@/components/ImageWithModal";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";
import { renderYouTube } from "@/utils/renderYouTube";
import type { EmbedData } from "@/components/SmartLink";

interface ComponentOptions {
  headingLink?: boolean;
  isSSR?: boolean;
  embedMap?: Record<string, EmbedData>;
}

export function createPortableTextComponents({
  headingLink = true,
  isSSR = false,
  embedMap = {},
}: ComponentOptions) {
  return {
    types: {
      code(props: any) {
        if (isSSR) {
          const { code, language } = props.value as { code: string; language?: string };
          return <CodeBlockSSR code={code} language={language} />;
        }
        return <CodeBlock value={props.value} />;
      },
      image(props: any) {
        // SSR でも Client でも常に ImageWithModal を使う
        return <ImageWithModal value={props.value} />;
      },
      youtube(props: any) {
        return renderYouTube({ value: props.value });
      },
    },
    marks: renderMarks,
    block(props: any) {
      return renderBlock({ ...props, headingLink, isSSR, embedMap });
    },
  };
}
