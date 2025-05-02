// src/components/CodeBlock.tsx
"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface CodeBlockProps {
  value: { code: string; language?: string };
}

export default function CodeBlock({ value }: CodeBlockProps) {
  const [theme, setTheme] = useState<any>(null);

  // 1) クライアントマウント後に ESM 版テーマを動的 import
  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/prism/darcula")
      .then((mod) => setTheme(mod.default))
      .catch(() => {
        // フォールバック
        import("react-syntax-highlighter/dist/esm/styles/prism/tomorrow")
          .then((m2) => setTheme(m2.default));
      });
  }, []);

  // 2) Copyボタン付与
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll("pre.code-block-wrapper"));
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

  // テーマが読み込まれるまで何もレンダリングしない
  if (!theme) return null;

  return (
    <pre className="code-block-wrapper my-4 not-prose bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
      <SyntaxHighlighter
        language={value.language ?? "plaintext"}
        style={theme}
        showLineNumbers
        wrapLongLines
        customStyle={{ background: "transparent", border: "none", margin: 0 }}
      >
        {value.code}
      </SyntaxHighlighter>
    </pre>
  );
}
