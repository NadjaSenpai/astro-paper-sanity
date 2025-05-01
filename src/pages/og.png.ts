import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

// prerender有効
export const prerender = true;

// ビルド時はSanityを使わず最低限の静的パスを返すことで安全にする
export async function getStaticPaths() {
  // エラー回避のため最低1件ダミーを設定する
  return [{ params: { slug: "site" } }];
}

export const GET: APIRoute = async () => {
  const { createClient } = await import("@sanity/client");
  const dotenv = await import("dotenv");
  dotenv.config();

  // Sanity Clientの生成（環境変数はVercel設定でセット済み）
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: "2025-04-21",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
  });

  const site = await client.fetch(`*[_type == "settings"][0]`);
  const png = await generateOgImageForSite({ site });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
