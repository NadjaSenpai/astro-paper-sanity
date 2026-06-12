import type { PortableTextMarkComponentProps } from "@portabletext/react";

export const renderMarks = {
  link: ({ value, children }: PortableTextMarkComponentProps<any>) => {
    const href = value?.href?.trim?.();

    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};