import { useEffect, ReactElement } from "react";
import { PortableText } from "@portabletext/react";
import CodeBlock from "@/components/CodeBlock";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";
import { renderImage } from "@/utils/renderImage";
import { renderYouTube } from "@/utils/renderYouTube";

interface Props {
  value: any[];
  headingLink?: boolean;
  embedMap: Record<string, any>;
}

export default function PortableTextRendererClient({ value, headingLink = true, embedMap }: Props): ReactElement {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const blocks = Array.from(document.querySelectorAll("pre"));
      for (const block of blocks) {
        if (block.querySelector(".copy-code")) continue;
        const wrapper = block.parentElement;
        if (!wrapper) continue;

        wrapper.classList.add("relative");

        const button = document.createElement("button");
        button.className =
          "copy-code absolute right-3 top-2 z-10 rounded bg-muted px-2 py-1 text-xs text-foreground font-medium";
        button.innerText = "Copy";

        wrapper.appendChild(button);

        button.addEventListener("click", async () => {
          const codeElement = block.querySelector("code");
          if (!codeElement) return;
          let text = codeElement.textContent ?? "";
          const lines = text.trim().split("\n");
          const cleaned = lines.map((line, i) => line.replace(new RegExp(`^${i + 1}`), ""));
          await navigator.clipboard.writeText(cleaned.join("\n").trim());
          button.innerText = "Copied!";
          setTimeout(() => (button.innerText = "Copy"), 1000);
        });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText
        value={value}
        components={{
          types: {
            code: (props) => <CodeBlock value={props.value} />,
            image: (props) => renderImage({ value: props.value }),
            youtube: (props) => renderYouTube({ value: props.value }),
          },
          marks: renderMarks,
          block: ((props: any) => renderBlock({ ...props, headingLink, embedMap })) as (props: any) => ReactElement,
        }}
      />
    </div>
  );
}
