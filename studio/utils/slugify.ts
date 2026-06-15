// studio/utils/slugify.ts
import kebabcase from "lodash.kebabcase";

/**
 * スラッグに使用可能な形式へ文字列を変換します。
 * 非ASCIIを含む場合は lodash.kebabcase でそのまま保持し、
 * ASCII のみの場合は Unicode正規化（NFKD）＋発音記号削除を行います。
 */

const hasNonAscii = (s: string) => /[^\x00-\x7F]/.test(s);

export default function slugify(input: string): string {
  if (hasNonAscii(input)) {
    return kebabcase(input);
  }
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
