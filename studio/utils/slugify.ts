// studio/utils/slugify.ts

/**
 * スラッグに使用可能な形式へ文字列を変換します。
 * Unicode正規化（NFKD）＋発音記号や濁点の削除、スペースや記号の整理を行います。
 */
export default function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]+/g, "") // ← アンダースコア禁止に！
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}


