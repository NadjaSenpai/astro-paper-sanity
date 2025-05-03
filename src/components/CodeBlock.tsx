"use client";

import { useState, lazy, Suspense } from "react";

interface CodeBlockProps {
  value: { code: string; language?: string };
}

// Prism とスタイルを動的読み込み
const LazyHighlighter = lazy(async () => {
  const mod = await import("react-syntax-highlighter");
  const styleMod = await import(
    "react-syntax-highlighter/dist/esm/styles/prism/material-light"
  );
  return {
    default: (props: any) => (
      <mod.Prism
        // Prism 側の枠線を消す
        customStyle={{ border: "none", backgroundColor: "transparent" }}
        style={styleMod.default}
        {...props}
      />
    ),
  };
});

export default function CodeBlock({ value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Suspense
      fallback={
        <div className="my-4 rounded-lg bg-gray-200 dark:bg-gray-900 p-4">
          Loading…
        </div>
      }
    >
      <div className="relative my-4 rounded-lg border border-border bg-gray-200 dark:bg-gray-900 group">
        {/* Copy ボタン */}
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 z-10 rounded bg-muted px-2 py-1 text-xs font-medium text-foreground"
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <LazyHighlighter
          language={value.language ?? "plaintext"}
          showLineNumbers
          wrapLongLines
        >
          {value.code}
        </LazyHighlighter>
      </div>
    </Suspense>
  );
}
