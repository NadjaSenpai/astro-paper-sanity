import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import PostOgTemplate from "@/utils/og-templates/post";
import SiteOgTemplate from "@/utils/og-templates/site";
import type { Post } from "@/lib/sanity/api/types";
import type { SiteConfig } from "@/lib/sanity/api/types";
import fonts from "@/utils/og-fonts";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  return resvg.render().asPng();
}

// 型を明確に分離 ✅
interface GenerateOgImageForPostInput {
  post: Post;
  site: SiteConfig;
}

interface GenerateOgImageForSiteInput {
  site: SiteConfig;
}

export async function generateOgImageForPost({ post, site }: GenerateOgImageForPostInput) {
  const postComponent = (
    <PostOgTemplate
      title={post.title ?? ""}
      pubDate={post.pubDate} // ✅ 追加！
      modDate={post.modDate} // ✅ 追加！
      siteTitle={site.title}
      siteAuthor={site.author}
    />
  );

  const svg = await satori(postComponent, {
    width: 1200,
    height: 630,
    fonts,
    embedFont: true,
  });
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite({ site }: GenerateOgImageForSiteInput) {
  const siteComponent = (
    <SiteOgTemplate
      title={site.title}
      siteTitle={site.title}
      siteAuthor={site.author}
      siteDescription={site.description}
    />
  );

  const svg = await satori(siteComponent, {
    width: 1200,
    height: 630,
    fonts,
    embedFont: true,
  });
  return svgBufferToPngBuffer(svg);
}
