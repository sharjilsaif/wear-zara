import { getAllProductIds } from "@/lib/catalog";
import { SHOP_CATEGORIES, SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  // A sitemap without product URLs is better than a failed build if the DB is briefly unreachable.
  const products = await getAllProductIds().catch((error) => {
    console.error("Sitemap: could not load products", error);
    return [];
  });

  const staticRoutes = ["", "/shop", "/about", "/contact", "/faq", "/track-order", "/shipping", "/returns", "/size-guide", "/careers", "/privacy", "/terms", "/cookies", "/login", "/signup"].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = SHOP_CATEGORIES.map((category) => ({
    url: `${SITE.url}/shop?category=${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productRoutes = products.map((product) => ({
    url: `${SITE.url}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
