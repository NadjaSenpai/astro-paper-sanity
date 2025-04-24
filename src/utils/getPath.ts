import slugify from "@/utils/slugify";

type PathInput =
  | { type: "post"; slug: string | { current: string } }
  | { type: "tag"; slug: string | { current: string } }
  | { type: "page"; slug?: string | { current: string } };

export function getPath(input: PathInput): string {
  const rawSlug =
    typeof input.slug === "string"
      ? input.slug
      : input.slug?.current ?? "";

  const safeSlug = slugify(rawSlug);

  switch (input.type) {
    case "post":
      return `/posts/${safeSlug}`;
    case "tag":
      return `/tags/${safeSlug}`;
    case "page":
      return safeSlug ? `/${safeSlug}` : "/";
    default:
      return "/";
  }
}