"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark, materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  value: { code: string; language?: string };
}

export default function CodeBlock({ value }: CodeBlockProps) {
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

  if (!theme) return null;

  return (
    <div className="relative my-4 rounded-lg border group bg-gray-200 dark:bg-gray-900">
      <SyntaxHighlighter
        language={value.language ?? "plaintext"}
        style={theme === "dark" ? materialDark : materialLight}
        showLineNumbers
        wrapLongLines
        customStyle={{ background: "transparent", border: "none", color: "inherit" }}
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
}

// --- コピー用ボタン付与 ---
function attachCopyButtons() {
  document.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-code")) return;
    const wrapper = pre.parentElement;
    if (!wrapper) return;
    wrapper.style.position = "relative";
    const btn = document.createElement("button");
    btn.className =
      "copy-code absolute right-3 top-2 rounded bg-muted px-2 py-1 text-xs font-medium text-foreground";
    btn.innerText = "Copy";
    wrapper.appendChild(btn);
    btn.addEventListener("click", async () => {
      const codeEl = pre.querySelector("code");
      if (!codeEl) return;
      const text = codeEl.textContent?.trim() || "";
      await navigator.clipboard.writeText(text);
      btn.innerText = "Copied!";
      setTimeout(() => (btn.innerText = "Copy"), 700);
    });
  });
}
