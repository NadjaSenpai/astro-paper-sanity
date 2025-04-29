import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Site Description", type: "text" }),
    defineField({ name: "website", title: "Website URL", type: "url" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "profile", title: "Author Profile", type: "image", options: { hotspot: true } }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "twitter", title: "Twitter", type: "url" }),
    defineField({ name: "github", title: "GitHub", type: "url" }),
    defineField({ name: "ogImage", title: "OG Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "message",
      type: "array",
      title: "Top Message",
      of: [
        defineArrayMember({ type: "block" }),
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
              validation: (Rule) => Rule.uri({
                scheme: ["https"],
                allowRelative: false,
              }),
            }),
          ],
        }),
      ],
    }),
  ],
});