import { SITE } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/cart", "/checkout", "/wishlist"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
