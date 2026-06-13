import { codeToHtml } from "shiki";

export type HighlightedCodeMap = Record<string, string>;

interface CodeBlock {
  _type: string;
  _key?: string;
  code?: string;
  language?: string;
}

// Sanity の Portable Text blocks から code ブロックを抽出し、
// _key -> Shiki 生成HTML のマップを返す（ビルド時に呼ぶ）。
export async function highlightCodeBlocks(
  blocks: unknown[] | null | undefined
): Promise<HighlightedCodeMap> {
  const map: HighlightedCodeMap = {};
  if (!Array.isArray(blocks)) return map;

  for (const block of blocks as CodeBlock[]) {
    if (!block || block._type !== "code" || typeof block.code !== "string") continue;
    const key = block._key;
    if (!key) continue;
    const trimmedLang = block.language?.trim();
    const lang = trimmedLang ? trimmedLang : "plaintext";
    try {
      map[key] = await codeToHtml(block.code, {
        lang,
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false, // CSS変数(--shiki / --shiki-dark)を出力させる
      });
    } catch (err) {
      // 未対応言語などは plaintext で再試行（原因をビルドログに残す）
      console.warn(
        `[highlightCodeBlocks] block ${key} (lang: ${lang}) のハイライトに失敗、plaintextで再試行:`,
        err
      );
      map[key] = await codeToHtml(block.code, {
        lang: "plaintext",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      });
    }
  }
  return map;
}
