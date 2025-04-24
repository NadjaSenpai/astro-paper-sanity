import { defineType, defineField } from "sanity";

export default defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "profile",
      title: "Author Profile",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: Rule =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "email").error(
          "有効なメールアドレスを入力してください"
        ),
    }),
    defineField({
      name: "twitter",
      title: "Twitter",
      type: "url",
    }),
    defineField({
      name: "github",
      title: "GitHub",
      type: "url",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "message",
      title: "Top Message",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
