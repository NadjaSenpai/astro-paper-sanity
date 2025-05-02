// src/components/CodeBlockSSR.tsx
"use client";

import { useState, useEffect } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// テーマは ESM 版を使います
import materialLight from "react-syntax-highlighter/dist/esm/styles/prism/material-light";
import materialDark  from "react-syntax-highlighter/dist/esm/styles/prism/material-dark";

interface CodeBlockSSRProps {
  code: string;
  language?: string;
}

export default function CodeBlockSSR({ code, language }: CodeBlockSSRProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // ⏳ クライアントマウント後にのみ言語登録
    Promise.all([
      import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
      import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
      import("react-syntax-highlighter/dist/esm/languages/prism/tsx"),
    ]).then(([jsMod, tsMod, tsxMod]) => {
      const js  = jsMod.default;
      const ts  = tsMod.default;
      const tsx = tsxMod.default;
      SyntaxHighlighter.registerLanguage("javascript", js);
      SyntaxHighlighter.registerLanguage("typescript", ts);
      SyntaxHighlighter.registerLanguage("tsx", tsx);
    });

    // Tailwind の dark クラス切り替えを監視
    const root = document.documentElement;
    const update = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    update();
    const obs = new MutationObserver((muts) => {
      muts.forEach((m) => {
        if (m.attributeName === "class") update();
      });
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const prismStyle = theme === "dark" ? materialDark : materialLight;

  return (
    <pre className="code-block-wrapper my-4 not-prose text-[unset] relative">
      <SyntaxHighlighter
        language={language ?? "plaintext"}
        style={prismStyle}
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
