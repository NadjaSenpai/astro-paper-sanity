// src/components/CodeBlock.tsx
"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import materialLight from "react-syntax-highlighter/dist/esm/styles/prism/material-light";

interface CodeBlockProps {
  value: {
    code: string;
    language?: string;
  };
}

export default function CodeBlock({ value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Copy ボタンの DOM マニピュレーションは不要になったので useEffect は空でOK
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {
      // コピー失敗時のエラーハンドリング（任意）
      console.error("コピーに失敗しました");
    }
  };

  return (
    <div className="relative my-4 rounded-lg border border-border bg-gray-200 dark:bg-gray-900 group">
      {/* Copy ボタン */}
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 z-10 rounded bg-muted px-2 py-1 text-xs font-medium text-foreground"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={value.language ?? "plaintext"}
        style={materialLight}
        showLineNumbers
        wrapLongLines
        customStyle={{
          backgroundColor: "transparent",
          border: "none",
          margin: 0,
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
}
