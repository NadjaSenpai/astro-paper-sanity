interface Props {
  code: string;
  language?: string;
}

export default function CodeBlockSSR({ code, language = "plaintext" }: Props) {
  return (
    <pre className="my-4 not-prose overflow-x-auto bg-muted/20 p-4 rounded">
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
}
