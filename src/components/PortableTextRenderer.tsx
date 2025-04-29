import { useEffect } from "react";
import { PortableText } from "@portabletext/react";
import CodeBlock from "@/components/CodeBlock";
import { renderBlock } from "@/utils/renderBlock";
import { renderImage } from "@/utils/renderImage";
import { renderMarks } from "@/utils/renderMarks";
import { renderYouTube } from "@/utils/renderYouTube";

interface Props {
  value: any[];
  headingLink?: boolean;
}

export default function PortableTextRenderer({ value, headingLink = true }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("🧪 attachCopyButtons start!");

      const blocks = Array.from(document.querySelectorAll("pre"));
      console.log("🧱 found", blocks.length, "code blocks");

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
              // 行番号（だけ）を消して、そのまま後ろのインデント含めて残す
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
    }, 500); // PortableText描画後を待つ

    return () => clearTimeout(timeout);
  }, []);

  return (
    <PortableText
      value={value}
      components={{
        types: {
          code: ({ value }) => <CodeBlock value={value} />,
          image: ({ value }) => renderImage({ value }),
          youtube: ({ value }) => renderYouTube({ value }),
        },
        marks: renderMarks,
        block: ({ value, children }) => renderBlock({ value, children, headingLink }),
      }}
    />
  );
}
