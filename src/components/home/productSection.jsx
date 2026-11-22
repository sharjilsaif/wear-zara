import ProductGrid from "@/components/product/productGrid";
import Button from "@/components/ui/button";
import SectionHeader from "@/components/ui/sectionHeader";
import { getProductsByCategory } from "@/lib/catalog";
import { shopHref } from "@/lib/site";

/**
 * Generic "eyebrow + title + product grid + View All" home section,
 * used for Best Selling and Explore Our Products.
 */
export default async function ProductSection({ category, eyebrow, title, count = 8, buttonPlacement = "header", className }) {
  const products = await getProductsByCategory(category, count);
  if (products.length === 0) return null;

  const viewAll = (
    <Button href={shopHref({ category })} size="lg">
      View All
    </Button>
  );

  return (
    <section className={className ?? "container-page py-16 lg:py-20"}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        aside={buttonPlacement === "header" ? <span className="hidden sm:block">{viewAll}</span> : null}
      />
      <ProductGrid products={products} />
      <div className={buttonPlacement === "header" ? "mt-10 flex justify-center sm:hidden" : "mt-12 flex justify-center"}>
        {viewAll}
      </div>
    </section>
  );
}
