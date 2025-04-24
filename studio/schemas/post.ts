// studio/schemas/post.ts
import { defineType, defineField, defineArrayMember } from "sanity";
import slugify from "../utils/slugify";

export default defineType({
  name: "post",
  type: "document",
  title: "Post",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const slug =
            typeof value === "string"
              ? value
              : (value as { current?: string })?.current;
          if (!slug) return true;
          return /^[a-z0-9\-]+$/.test(slug)
            ? true
            : "スラッグは小文字の英数字とハイフンのみ使用できます";
        }),
    }),

    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "tag" }],
        }),
      ],
    }),

    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        defineArrayMember({ type: "block" }),

        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
              description:
                "代替テキストは、画像の内容を視覚に頼らないユーザーにも伝えます。",
            }),
          ],
        }),

        defineArrayMember({
          type: "code",
          title: "Code block",
          options: {
            withFilename: true,
          },
        }),
      ],
    }),

    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),

    defineField({
      name: "pubDate",
      type: "datetime",
      title: "Published at",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "modDate",
      type: "datetime",
      title: "Modified at",
    }),

    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured",
      validation: (Rule) =>
        Rule.custom((featured, context) => {
          const parent = context.parent as any;
          return featured && parent?.archived
            ? "Featured と Archived を同時に true にできません"
            : true;
        }),
    }),

    defineField({
      name: "archived",
      type: "boolean",
      title: "Archived",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((featured, context) => {
          const parent = context.parent as any;
          return featured && parent?.archived
            ? "Featured と Archived を同時に true にできません"
            : true;
        }),
    }),
  ],
});
