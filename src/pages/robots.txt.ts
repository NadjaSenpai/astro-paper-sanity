import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site); // 必要に応じて "sitemap.xml"
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
