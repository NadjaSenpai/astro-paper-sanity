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

  // 👇 runtimeの型が明示されていないので any で逃がす
  const runtime = (locals as any).runtime;

  try {
    const result = await runtime.revalidate(`/${slug}`);
    return new Response(`✅ Revalidated: /${slug} (${result.status})`);
  } catch (error) {
    return new Response("❌ Revalidation failed", { status: 500 });
  }
};
