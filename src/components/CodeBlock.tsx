import { ReactElement } from "react";

interface CodeBlockProps {
  // Shiki が生成済みの HTML。未指定時はプレーン <pre> でフォールバック。
  html?: string;
  value: { code: string; language?: string };
}

export default function CodeBlock({ html, value }: CodeBlockProps): ReactElement {
  if (html) {
    return <div className="my-4" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div className="my-4">
      <pre className="overflow-x-auto rounded-lg border bg-gray-200 p-4 dark:bg-gray-900">
        <code>{value.code}</code>
      </pre>
    </div>
  );
}
