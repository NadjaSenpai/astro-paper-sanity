// src/components/CodeBlock.tsx
"use client";

import { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

interface CodeBlockProps {
  value: { code: string; language?: string };
}

export default function CodeBlock({ value }: CodeBlockProps) {
  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll("pre.code-block-wrapper")
    );
    for (const pre of blocks) {
      if (pre.querySelector(".copy-code")) continue;
      pre.classList.add("relative");

      const btn = document.createElement("button");
      btn.className =
        "copy-code absolute right-3 top-2 z-10 rounded bg-muted px-2 py-1 text-xs font-medium text-foreground";
      btn.innerText = "Copy";
      pre.appendChild(btn);

      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const codeEl = pre.querySelector("code");
        if (!codeEl) return;
        const clone = codeEl.cloneNode(true) as HTMLElement;
        // 行番号スパンを削除
        clone
          .querySelectorAll('span[class*="line-number"]')
          .forEach((el) => el.remove());
        let text = (clone.textContent || "").replace(/^\n+|\n+$/g, "");
        text = text
          .split("\n")
          .map((line) => line.replace(/^\d+\s/, ""))
          .join("\n");
        await navigator.clipboard.writeText(text);
        btn.innerText = "Copied!";
        setTimeout(() => (btn.innerText = "Copy"), 700);
      });
    }
  }, []);

  return (
    <pre className="code-block-wrapper my-4 not-prose">
      <SyntaxHighlighter
        language={value.language ?? "plaintext"}
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
        customStyle={{
          border: "none",
          margin: 0,
          // ── color は指定しない！
        }}
      >
        {value.code}
      </SyntaxHighlighter>
    </pre>
  );
}