import CodeBlock from "@/components/CodeBlock";
import CodeBlockSSR from "@/components/CodeBlockSSR";
import ImageWithModal from "@/components/ImageWithModal";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";
import { renderYouTube } from "@/utils/renderYouTube";
import type { PortableTextComponentProps } from "@portabletext/react";
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
      code: (props: any) => {
        const { code, language } = props.value as { code: string; language?: string };
        return isSSR
          ? <CodeBlockSSR code={code} language={language} />
          : <CodeBlock value={{ code, language }} />;
      },
      image: (props: any) => <ImageWithModal value={props.value} />,
      youtube: (props: any) => renderYouTube({ value: props.value }),
    },
    marks: renderMarks,
    // ← ここをオブジェクトに！
    block: {
      // 通常の段落 & URL スマートリンクもここで拾う
      normal: (props: PortableTextComponentProps<any>) =>
        renderBlock({ ...props, headingLink, isSSR, embedMap }),
      // 見出しも全部 renderBlock に投げるなら…
      h1: (props: PortableTextComponentProps<any>) => renderBlock({ ...props, headingLink, isSSR, embedMap }),
      h2: (props: PortableTextComponentProps<any>) => renderBlock({ ...props, headingLink, isSSR, embedMap }),
      h3: (props: PortableTextComponentProps<any>) => renderBlock({ ...props, headingLink, isSSR, embedMap }),
      h4: (props: PortableTextComponentProps<any>) => renderBlock({ ...props, headingLink, isSSR, embedMap }),
      blockquote: (props: PortableTextComponentProps<any>) => renderBlock({ ...props, headingLink, isSSR, embedMap }),
    },
  };
}
