import { defineType, defineField } from "sanity";

export default defineType({
  name: "tag",
  type: "document",
  title: "Tag",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Tag Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((value: any) => {
          const regex = /^[a-z0-9\-]+$/;
          if (!value) return true; // Sanity側で required はチェック済み
          return regex.test(value)
            ? true
            : "Slug must only contain lowercase letters, numbers, and dashes.";
        }),
    }),
  ],
});
