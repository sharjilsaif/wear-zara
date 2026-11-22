import ProductGrid from "@/components/product/productGrid";
import Button from "@/components/ui/button";
import SectionHeader from "@/components/ui/sectionHeader";
import { getI18n } from "@/i18n/server";
import { getProductsByCategory } from "@/lib/catalog";
import { shopHref } from "@/lib/site";

/** "Eyebrow + title + product grid + View all" home section (Best Selling, Explore). */
export default async function ProductSection({ lang, category, eyebrow, title, count = 8 }) {
  const [{ t }, products] = await Promise.all([getI18n(lang), getProductsByCategory(category, count)]);
  if (products.length === 0) return null;

  const viewAll = (
    <Button href={shopHref({ category })} variant="outline">
      {t("common.viewAll")}
    </Button>
  );

  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeader eyebrow={t(eyebrow)} title={t(title)} aside={<span className="hidden sm:block">{viewAll}</span>} />
      <ProductGrid products={products} />
      <div className="mt-10 flex justify-center sm:hidden">{viewAll}</div>
    </section>
  );
}
