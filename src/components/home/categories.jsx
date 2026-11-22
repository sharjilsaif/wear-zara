"use client";

import { useRef } from "react";
import Link from "next/link";

import CategoryIcon from "@/components/home/categoryIcon";
import SectionHeader from "@/components/ui/sectionHeader";
import SliderArrows, { scrollByPage } from "@/components/ui/sliderArrows";
import { SHOP_CATEGORIES, shopHref } from "@/lib/site";

/** "Browse by Category" — every tile links to the shop filtered by that category. */
export default function Categories({ counts = {} }) {
  const railRef = useRef(null);

  return (
    <section className="container-page border-b border-line py-16 lg:py-20">
      <SectionHeader
        eyebrow="Categories"
        title="Browse by Category"
        aside={
          <SliderArrows
            label="categories"
            onPrev={() => scrollByPage(railRef.current, -1)}
            onNext={() => scrollByPage(railRef.current, 1)}
          />
        }
      />

      <ul ref={railRef} className="no-scrollbar relative -mx-4 flex snap-x gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:gap-6 sm:px-0">
        {SHOP_CATEGORIES.map((category) => (
          <li key={category.slug} className="shrink-0 snap-start">
            <Link
              href={shopHref({ category: category.slug })}
              className="group flex h-36 w-36 flex-col items-center justify-center gap-3 rounded-xl border border-line px-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white sm:h-40 sm:w-40"
            >
              <CategoryIcon name={category.icon} className="text-5xl" />
              <span className="text-sm font-medium leading-tight">{category.name}</span>
              {counts[category.slug] !== undefined && (
                <span className="text-xs text-fg-muted transition-colors group-hover:text-white/80">
                  {counts[category.slug]} items
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
