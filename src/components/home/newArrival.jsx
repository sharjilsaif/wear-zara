"use client";

import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

import ProductImage from "@/components/product/productImage";
import SectionHeader from "@/components/ui/sectionHeader";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { shopHref } from "@/lib/site";

const TILES = [
  {
    key: "women",
    category: "womens-fashion",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
    className: "min-h-96 md:col-span-2 md:row-span-2",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  {
    key: "outerwear",
    category: "outerwear-jackets",
    image: "https://images.unsplash.com/photo-1617178388553-a9d022974a5c",
    className: "min-h-64 md:col-span-2",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  { key: "footwear", category: "footwear-shoes", image: "https://images.unsplash.com/photo-1581101767113-1677fc2beaa8", className: "min-h-64", sizes: "(min-width: 768px) 25vw, 50vw" },
  { key: "kids", category: "kids-baby-wear", image: "https://images.unsplash.com/photo-1602313306160-9d58a1d56390", className: "min-h-64", sizes: "(min-width: 768px) 25vw, 50vw" },
];

export default function NewArrival() {
  const { t } = useI18n();

  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeader eyebrow={t("home.newEyebrow")} title={t("home.newTitle")} />
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(17rem,1fr))]">
        {TILES.map((tile) => (
          <Link key={tile.key} href={shopHref({ category: tile.category })} className={cn("group relative block overflow-hidden rounded-[2rem] bg-black text-white", tile.className)}>
            <ProductImage
              src={tile.image}
              alt={t(`arrivals.${tile.key}.alt`)}
              fill
              sizes={tile.sizes}
              className="object-cover transition-transform duration-1000 ease-apple group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{t(`arrivals.${tile.key}.title`)}</h3>
              <p className="mt-1.5 max-w-64 text-sm text-white/80">{t(`arrivals.${tile.key}.text`)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black">
                {t("common.shopNow")} <LuArrowRight aria-hidden className="rtl:-scale-x-100" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
