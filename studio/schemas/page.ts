import { defineType, defineField, defineArrayMember } from "sanity";
import slugify from "../utils/slugify";
import type { Rule as RuleType } from "sanity";

export default defineType({
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    defineField({ name: "title", type: "string", title: "Page Title", validation: (Rule: RuleType) => Rule.required() }),
    defineField({ name: "slug", type: "slug", title: "Slug", options: { source: "title", maxLength: 96, slugify }, validation: (Rule: RuleType) => Rule.required() }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        defineArrayMember({ type: "block",
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [], // 👈 リンク無効化
          }, }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({ name: "alt", type: "string", title: "Alternative text" }),
            defineField({
              name: "alignment",
              type: "string",
              title: "Alignment",
              options: { list: [ { title: "Left", value: "left" }, { title: "Center", value: "center" }, { title: "Right", value: "right" } ], layout: "radio" },
            }),
            defineField({
              name: "width",
              type: "number",
              title: "Image Width (px)",
              description: "オプション：ピクセル単位で幅を指定できます",
            }),
          ],
        }),
        defineArrayMember({ type: "code", options: { withFilename: true } }),
        defineArrayMember({
          type: "object",
          name: "youtube",
          title: "YouTube Embed",
          fields: [
            defineField({
              name: "url",
              type: "url",
              title: "YouTube URL",
              validation: (Rule: RuleType) => Rule.uri({
                scheme: ["https"],
                allowRelative: false,
              }),
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "pubDate", type: "datetime", title: "Published at" }),
  ],
});