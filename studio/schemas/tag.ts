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
          const current = typeof value === "string" ? value : value?.current;
          if (!current) return true;
          return /^[\p{L}\p{N}\-]+$/u.test(current)
            ? true
            : "Slug must only contain letters, numbers, and dashes.";
        }),
    }),
  ],
});
