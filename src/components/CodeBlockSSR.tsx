// src/components/CodeBlockSSR.tsx
"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// ESM 版を使うと軽量です
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";

// vscDarkPlus テーマをインポート
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

// 言語登録
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("tsx", tsx);

interface CodeBlockSSRProps {
  code: string;
  language?: string;
}

export default function CodeBlockSSR({ code, language }: CodeBlockSSRProps) {
  return (
    <pre className="code-block-wrapper my-4 not-prose text-[unset] relative">
      <SyntaxHighlighter
        language={language ?? "plaintext"}
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
        customStyle={{
          background: "transparent",
          border: "none",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </pre>
  );
}
