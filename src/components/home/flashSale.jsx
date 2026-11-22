import Countdown from "@/components/home/countdown";
import ProductRail from "@/components/product/productRail";
import Button from "@/components/ui/button";
import { getProductsByCategory } from "@/lib/catalog";
import { shopHref } from "@/lib/site";

export default async function FlashSale() {
  const products = await getProductsByCategory("flash-sales", 12);
  if (products.length === 0) return null;

  return (
    <section className="container-page border-b border-line pb-16 pt-12 lg:pt-20">
      <ProductRail
        eyebrow="Today's"
        title="Flash Sales"
        products={products}
        footer={
          <Button href={shopHref({ category: "flash-sales" })} size="lg">
            View All Products
          </Button>
        }
      >
        <Countdown until="week" label="Flash sale ends in" />
      </ProductRail>
    </section>
  );
}
