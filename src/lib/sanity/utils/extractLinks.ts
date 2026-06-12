export function extractLinks(blocks: any[]): string[] {
  const links: string[] = [];

  for (const block of blocks) {
    if (
      block._type === "block" &&
      Array.isArray(block.children) &&
      block.children.length === 1
    ) {
      const child = block.children[0];
      if (
        child &&
        typeof child === "object" &&
        child._type === "span" &&
        typeof child.text === "string"
      ) {
        const text = child.text.trim();
        if (text.match(/^https?:\/\/[^\s]+$/)) {
          links.push(text);
        }
      }
    }
  }

  return links;
}
