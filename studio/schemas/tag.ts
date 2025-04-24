import type { Rule as RuleType } from "sanity";
import slugify from "../utils/slugify";

export default {
  name: "tag",
  type: "document",
  title: "Tag",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Tag Name",
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify,
      },
      validation: (Rule: RuleType) =>
        Rule.required().custom((value) => {
          const slug = typeof value === "string" ? value : (value as { current?: string })?.current;
          if (!slug) return true;
          const regex = /^[a-z0-9\-]+$/;
          return regex.test(slug) || "スラッグは小文字の英数字とハイフンのみ使用できます";
        }),
    },
  ],
};
