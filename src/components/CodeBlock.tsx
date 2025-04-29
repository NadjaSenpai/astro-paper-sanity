import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

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

  const language = value.language || "plaintext";
  const code = value.code || "";

  if (!theme) return null;

  return (
    <div className="my-4 not-prose text-[unset] relative">
      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? nightOwl : oneLight}
        showLineNumbers
        wrapLongLines
        customStyle={{ background: "transparent", color: "inherit" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
