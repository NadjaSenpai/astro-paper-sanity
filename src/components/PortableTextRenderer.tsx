import { useEffect } from "react";
import { PortableText } from "@portabletext/react";
import CodeBlock from "@/components/CodeBlock";
import { renderBlock } from "@/utils/renderBlock";
import { renderMarks } from "@/utils/renderMarks";
import { renderImage } from "@/utils/renderImage";
import { renderYouTube } from "@/utils/renderYouTube";

interface Props {
  value: any[];
  headingLink?: boolean;
}

export default function PortableTextRenderer({ value, headingLink = true }: Props) {
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
          text = text.trim();

          const lines = text.split("\n");

          const cleanedLines = lines.map((line, index) => {
            const expectedLineNumber = (index + 1).toString();
            if (line.startsWith(expectedLineNumber)) {
              return line.slice(expectedLineNumber.length);
            }
            return line;
          });

          const finalCleanedText = cleanedLines.join("\n");

          await navigator.clipboard.writeText(finalCleanedText.trim());

          button.innerText = "Copied!";
          setTimeout(() => {
            button.innerText = "Copy";
          }, 1000);
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
          block: ((props: any) => renderBlock({ ...props, headingLink })) as (props: any) => JSX.Element,
        }}
      />
    </div>
  );
}
