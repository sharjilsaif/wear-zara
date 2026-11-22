"use client";

import { useRef } from "react";
import Link from "next/link";

import CategoryIcon from "@/components/home/categoryIcon";
import SectionHeader from "@/components/ui/sectionHeader";
import SliderArrows from "@/components/ui/sliderArrows";
import { useI18n } from "@/i18n/client";
import { SHOP_CATEGORIES, categoryName, shopHref } from "@/lib/site";

/** "Browse by Category" — every tile opens the shop filtered by that category. */
export default function Categories({ counts = {} }) {
  const { t } = useI18n();
  const railRef = useRef(null);

  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeader eyebrow={t("home.categoriesEyebrow")} title={t("home.categoriesTitle")} aside={<SliderArrows targetRef={railRef} />} />

      <ul ref={railRef} className="no-scrollbar relative -mx-4 flex snap-x gap-4 overflow-x-auto scroll-px-4 px-4 pt-1 pb-4 sm:mx-0 sm:px-0">
        {SHOP_CATEGORIES.map((category) => (
          <li key={category.slug} className="shrink-0 snap-start">
            <Link
              href={shopHref({ category: category.slug })}
              className="glass group flex h-40 w-36 flex-col items-center justify-center gap-3 rounded-3xl px-3 text-center transition-all duration-300 ease-apple hover:-translate-y-1 hover:bg-brand hover:text-white sm:w-40"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fg/5 text-3xl transition-colors group-hover:bg-white/20">
                <CategoryIcon name={category.icon} />
              </span>
              <span className="text-[13px] font-semibold leading-tight">{categoryName(t, category)}</span>
              {counts[category.slug] !== undefined && (
                <span className="text-xs text-fg-muted transition-colors group-hover:text-white/80">{t("home.items", { count: counts[category.slug] })}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
