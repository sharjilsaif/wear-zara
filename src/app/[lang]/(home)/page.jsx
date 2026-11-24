import Categories from "@/components/home/categories";
import FlashSale from "@/components/home/flashSale";
import HeroCarousel from "@/components/home/heroCarousel";
import NewArrival from "@/components/home/newArrival";
import ProductSection from "@/components/home/productSection";
import PromoBanner from "@/components/home/promoBanner";
import ServiceHighlights from "@/components/home/serviceHighlights";
import { getI18n } from "@/i18n/server";

// Statically rendered per language, refreshed every 5 minutes (and immediately after admin edits).
export const revalidate = 300;

export default async function HomePage({ params }) {
  const { lang } = await params;
  const { t } = await getI18n(lang);

  return (
    <>
      <h1 className="sr-only">{t("home.srTitle")}</h1>
      <div className="container-page pt-4 sm:pt-6">
        <HeroCarousel />
      </div>
      <FlashSale lang={lang} />
      <Categories />
      <ProductSection lang={lang} category="best-selling" eyebrow="home.bestEyebrow" title="home.bestTitle" count={4} />
      <PromoBanner />
      <ProductSection lang={lang} category="explore-products" eyebrow="home.exploreEyebrow" title="home.exploreTitle" count={8} />
      <NewArrival />
      <ServiceHighlights />
    </>
  );
}
