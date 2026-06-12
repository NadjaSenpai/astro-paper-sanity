export default function getUniqueTags(posts: any[]) {
  const tagsMap = new Map();

  for (const post of posts) {
    if (!post.tags) continue;

    for (const tag of post.tags) {
      if (typeof tag === "object" && tag.slug?.current && tag.title) {
        tagsMap.set(tag.slug.current, tag.title);
      }
    }
  }

  return Array.from(tagsMap.entries()).map(([tag, tagName]) => ({
    tag,
    tagName,
  }));
}