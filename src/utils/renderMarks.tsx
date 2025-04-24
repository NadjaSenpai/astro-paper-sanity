import type { PortableTextMarkComponent } from "@portabletext/react";

export const renderMarks: Record<string, PortableTextMarkComponent<any>> = {
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="bg-muted px-1 rounded text-sm">{children}</code>
  ),
  underline: ({ children }) => <u>{children}</u>,
  strike: ({ children }) => <s>{children}</s>,
  link: ({ children, value }) => (
    <a
      href={value?.href}
      className="text-accent hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};
