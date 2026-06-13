import type { V6PostEntry } from "@/lib/sanity/adapter";

type GroupKey = string | number | symbol;
type GroupFunction<T> = (item: T, index?: number) => GroupKey;

export function getPostsByGroupCondition(
  posts: V6PostEntry[],
  groupFunction: GroupFunction<V6PostEntry>
) {
  const result: Record<GroupKey, V6PostEntry[]> = {};

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i];
    const groupKey = groupFunction(item, i);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}
