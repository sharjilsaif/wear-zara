import Categories from "@/components/home/categories";
import FlashSale from "@/components/home/flashSale";
import Hero from "@/components/home/hero";
import NewArrival from "@/components/home/newArrival";
import ProductSection from "@/components/home/productSection";
import PromoBanner from "@/components/home/promoBanner";
import ServiceHighlights from "@/components/home/serviceHighlights";
import { getCategories } from "@/lib/catalog";

// Statically rendered and refreshed every 5 minutes (and immediately after admin edits).
export const revalidate = 300;

export default async function HomePage() {
  const categories = await getCategories();
  const counts = Object.fromEntries(categories.map((category) => [category.slug, category._count.products]));

  return (
    <>
      <h1 className="sr-only">Wear Zara — modern fashion for men, women and kids</h1>
      <Hero />
      <FlashSale />
      <Categories counts={counts} />
      <ProductSection category="best-selling" eyebrow="This Month" title="Best Selling Products" count={4} />
      <PromoBanner />
      <ProductSection category="explore-products" eyebrow="Our Products" title="Explore Our Products" count={8} buttonPlacement="footer" />
      <NewArrival />
      <ServiceHighlights />
    </>
  );
}
