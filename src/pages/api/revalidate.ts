import type { APIRoute } from "astro";

const secret = import.meta.env.REVALIDATE_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const reqSecret = body.secret;
  const slug = body.slug;

  if (!reqSecret || reqSecret !== secret) {
    return new Response("❌ Invalid secret", { status: 401 });
  }

  if (!slug) {
    return new Response("❌ Missing slug", { status: 400 });
  }

  try {
    const result = await (Astro as any).revalidate(`/${slug}`);
    return new Response(`✅ Revalidated: /${slug} (${result.status})`);
  } catch (error: any) {
    return new Response(`❌ Revalidation failed: ${error.message}`, { status: 500 });
  }
};
