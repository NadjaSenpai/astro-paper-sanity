// PortableTextRenderer.tsx
import { PortableText } from "@portabletext/react";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";
import CodeBlock from "@/components/CodeBlock"; // ← これ追加

interface Props {
  value: any[];
  headingLink?: boolean;
}

export default function PortableTextRenderer({ value, headingLink = true }: Props) {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          code: CodeBlock, // ← ここ追加！！
        },
        marks: renderMarks,
        block: (props) => renderBlock({ ...props, headingLink }),
      }}
    />
  );
}
