"use client";

import Countdown from "@/components/home/countdown";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { shopHref } from "@/lib/site";

export default function PromoBanner() {
  const { t } = useI18n();

  return (
    <section className="container-page py-8">
      <div className="relative grid overflow-hidden rounded-[2rem] bg-[#0b0b0c] text-white shadow-[0_20px_60px_rgb(0_0_0/0.18)] lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center gap-6 p-8 sm:p-12 lg:p-16">
          <p className="text-sm font-semibold text-emerald-400">{t("promo.eyebrow")}</p>
          <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{t("promo.title")}</h2>
          <p className="max-w-md text-white/70">{t("promo.subtitle")}</p>
          <Countdown until="month" dark label={t("promo.endsIn")} />
          <Button href={shopHref({ category: "footwear-shoes" })} size="lg" className="w-fit">
            {t("promo.button")}
          </Button>
        </div>

        <div className="relative min-h-72 sm:min-h-96">
          <ProductImage
            src="https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3"
            alt={t("promo.alt")}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0c] via-transparent to-transparent lg:bg-linear-to-r lg:from-[#0b0b0c] rtl:lg:bg-linear-to-l" />
        </div>
      </div>
    </section>
  );
}
