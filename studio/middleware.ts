// studio/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// import.meta.env は Astro 用なので、process.env を使う（Vercelで自動展開される）
const username = process.env.BASIC_AUTH_USERNAME || "admin";
const password = process.env.BASIC_AUTH_PASSWORD || "password";

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedAuth =
    "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  if (authHeader === expectedAuth) {
    return NextResponse.next();
  }

  return new Response("Auth Required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected Area"',
    },
  });
}
