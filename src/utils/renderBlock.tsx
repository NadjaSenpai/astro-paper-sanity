import type { PortableTextBlock } from "@portabletext/types";
import slugify from "@/utils/slugify";
import React from "react";

// JSX.IntrinsicElements のためにこれを import
import type { JSX } from "react"; // ← これ追加！

export function renderBlock({
  children,
  value,
  headingLink = true,
}: {
  children: React.ReactNode;
  value: PortableTextBlock;
  headingLink?: boolean;
}) {
  if (isEmpty(children)) return null;

  const text = Array.isArray(children)
    ? children.map((c) => (typeof c === "string" ? c : "")).join("")
    : typeof children === "string"
    ? children
    : "";
  const id = slugify(text);

  const renderHeading = (
    Tag: keyof JSX.IntrinsicElements,
    className: string
  ) => (
    <Tag
      id={headingLink ? id : undefined}
      className={`${className} ${headingLink ? "group" : ""}`}
    >
      {children}
      {headingLink && (
        <a
          href={`#${id}`}
          className="heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-hidden="true"
        >
          #
        </a>
      )}
    </Tag>
  );

  switch (value.style) {
    case "h1":
      return renderHeading("h1", "text-4xl font-bold mb-4");
    case "h2":
      return renderHeading("h2", "text-3xl font-bold mb-3");
    case "h3":
      return renderHeading("h3", "text-2xl font-bold mb-2");
    case "h4":
      return renderHeading("h4", "text-xl font-bold mb-1");
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
          {children}
        </blockquote>
      );
    default:
      return <p className="mb-4">{children}</p>;
  }
}

function isEmpty(children: React.ReactNode) {
  if (Array.isArray(children)) {
    return children.every(
      (c) => typeof c === "string" && (c.trim() === "" || c.trim() === "#")
    );
  }
  return typeof children === "string" && (children.trim() === "" || children.trim() === "#");
}
