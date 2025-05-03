// src/components/CodeBlockSSR.tsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";

interface CodeBlockSSRProps {
  code: string;
  language?: string;
}

export default function CodeBlockSSR({ code, language }: CodeBlockSSRProps) {
  return (
    <pre className="code-block-wrapper my-4 not-prose bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
      <SyntaxHighlighter
        language={language ?? "plaintext"}
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </pre>
  );
}
