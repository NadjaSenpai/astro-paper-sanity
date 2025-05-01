import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;

  if (!runtime?.revalidate) {
    return new Response("❌ runtime.revalidate not available", { status: 500 });
  }

  await runtime.revalidate("/posts/test-slug");
  return new Response("✅ Revalidation succeeded");
};
