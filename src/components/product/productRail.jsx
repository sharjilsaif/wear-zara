"use client";

import { useRef } from "react";

import ProductCard from "@/components/product/productCard";
import SectionHeader from "@/components/ui/sectionHeader";
import SliderArrows from "@/components/ui/sliderArrows";

/** Horizontally scrolling row of products. `children` render next to the title (e.g. a countdown). */
export default function ProductRail({ eyebrow, title, products, children, footer }) {
  const railRef = useRef(null);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} aside={<SliderArrows targetRef={railRef} />}>
        {children}
      </SectionHeader>

      <div
        ref={railRef}
        className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pt-1 pb-4 sm:-mx-6 sm:gap-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:gap-7 lg:scroll-px-0 lg:px-0"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 2}
            className="w-[calc(50%-0.375rem)] shrink-0 snap-start sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.3125rem)]"
          />
        ))}
      </div>

      {footer && <div className="mt-10 flex justify-center">{footer}</div>}
    </div>
  );
}
