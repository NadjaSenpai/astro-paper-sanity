// PortableTextRenderer.tsx
import { PortableText } from "@portabletext/react";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";

interface Props {
  value: any[];
  headingLink?: boolean;
}

export default function PortableTextRenderer({ value, headingLink = true }: Props) {
  return (
    <PortableText
      value={value}
      components={{
        types: {},
        marks: renderMarks,
        block: (props) => renderBlock({ ...props, headingLink }),
      }}
    />
  );
}
