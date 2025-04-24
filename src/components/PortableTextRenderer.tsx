// src/components/PortableTextRenderer.tsx
import { PortableText } from "@portabletext/react";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";
import CodeBlock from "@/components/CodeBlock";

const PortableTextRenderer = ({ value }: { value: any }) => {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          code: CodeBlock, // ← 必要なものだけ types に入れる
        },
        block: renderBlock,
        marks: renderMarks,
      }}
    />
  );
};

export default PortableTextRenderer;
