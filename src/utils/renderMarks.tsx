import type { PortableTextMarkComponent } from "@portabletext/react";

export const renderMarks: Record<string, PortableTextMarkComponent> = {
  link: ({ children, value }) => (
    <a
      href={value?.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline"
    >
      {children}
    </a>
  ),
};