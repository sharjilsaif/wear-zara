import Countdown from "@/components/home/countdown";
import ProductRail from "@/components/product/productRail";
import Button from "@/components/ui/button";
import { getI18n } from "@/i18n/server";
import { getProductsByCategory } from "@/lib/catalog";
import { shopHref } from "@/lib/site";

export default async function FlashSale({ lang }) {
  const [{ t }, products] = await Promise.all([getI18n(lang), getProductsByCategory("flash-sales", 12)]);
  if (products.length === 0) return null;

  return (
    <section className="container-page pt-16 pb-8 lg:pt-20">
      <ProductRail
        eyebrow={t("home.flashEyebrow")}
        title={t("home.flashTitle")}
        products={products}
        footer={
          <Button href={shopHref({ category: "flash-sales" })} size="lg" variant="outline">
            {t("common.viewAll")}
          </Button>
        }
      >
        <Countdown until="week" label={t("home.flashEnds")} />
      </ProductRail>
    </section>
  );
}
