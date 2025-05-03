// src/components/CodeBlock.tsx
"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeBlock = ({ value }: { value: { code: string; language?: string } }) => {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as "light" | "dark";
    setTheme(current);

    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme") as "light" | "dark";
      if (t && t !== theme) setTheme(t);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (theme) {
      attachCopyButtons();
    }
  }, [theme]);

  const language = value.language || "plaintext";
  const code = value.code || "";

  if (!theme) return null;

  return (
    <div className="relative my-4 rounded-lg border group bg-gray-200 dark:bg-gray-900">
      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? materialDark : materialLight}
        showLineNumbers
        wrapLongLines
        customStyle={{ background: "transparent", border: "none", color: "inherit" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

// --- ✨ コピーボタン処理 ---
function attachCopyButtons() {
  const copyButtonLabel = "Copy";
  const codeBlocks = Array.from(document.querySelectorAll("pre"));

  for (const codeBlock of codeBlocks) {
    if (codeBlock.querySelector(".copy-code")) continue; // すでにボタンあるならスキップ

    const wrapper = codeBlock.parentElement;
    if (!wrapper) continue;

    const copyButton = document.createElement("button");
    copyButton.className =
      "copy-code absolute right-3 top-2 rounded bg-muted px-2 py-1 text-xs leading-4 text-foreground font-medium";
    copyButton.innerHTML = copyButtonLabel;

    wrapper.style.position = "relative"; // wrapperにrelative設定
    wrapper.appendChild(copyButton);

    copyButton.addEventListener("click", async () => {
      await copyCode(codeBlock, copyButton);
    });
  }
}

async function copyCode(block: HTMLElement, button: HTMLElement) {
  const code = block.querySelector("code");
  if (!code) return;

  let finalText = code.textContent || "";
  finalText = finalText.trim();

  const lines = finalText.split("\n");

  const cleanedLines = lines.map((line, index) => {
    const expectedLineNumber = (index + 1).toString();
    if (line.startsWith(expectedLineNumber)) {
      // もし行の先頭に「行番号」がぴったりくっついてたら、削除
      return line.slice(expectedLineNumber.length);
    }
    return line;
  });

  const finalCleanedText = cleanedLines.join("\n");

  await navigator.clipboard.writeText(finalCleanedText.trim());

  button.innerText = "Copied!";
  setTimeout(() => {
    button.innerText = "Copy";
  }, 700);
}
