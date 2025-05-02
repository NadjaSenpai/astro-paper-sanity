// src/components/CodeBlockSSR.tsx
"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// vscDarkPlus テーマをインポート
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

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
