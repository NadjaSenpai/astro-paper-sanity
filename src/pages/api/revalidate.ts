import type { APIRoute } from "astro";

const secret = import.meta.env.REVALIDATE_SECRET;

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json();
  const reqSecret = body.secret;
  const slug = body.slug;

  if (!reqSecret || reqSecret !== secret) {
    return new Response("❌ Invalid secret", { status: 401 });
  }

  if (!slug) {
    return new Response("❌ Missing slug", { status: 400 });
  }

  const runtime = (locals as any).runtime;

  try {
    const result = await runtime.revalidate(`/${slug}`);
    return new Response(`✅ Revalidated: /${slug} (${result.status})`);
  } catch (error: any) {
    // 明示的にエラー内容をレスポンスに出力！
    return new Response(`❌ Revalidation failed: ${error?.message || String(error)}`, {
      status: 500,
    });
  }
};
