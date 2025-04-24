// studio/schemas/page.ts
import slugify from "../utils/slugify";

export default {
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Page Title",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "content",
      type: "array",
      title: "Content",
      of: [{ type: "block" }],
    },
    {
      name: "pubDate",
      type: "datetime",
      title: "Published at",
    },
  ],
};

