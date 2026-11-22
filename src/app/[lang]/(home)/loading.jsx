import { ProductCardSkeleton } from "@/components/product/productCard";
import Skeleton from "@/components/ui/skeleton";

/** Mirrors the top of the home page: hero, flash-sale rail and category tiles (same sizes and spacing). */
export default function Loading() {
  const header = (
    <div className="mb-8 flex items-end justify-between sm:mb-10">
      <Skeleton className="h-9 w-56 sm:h-10 sm:w-72" />
      <div className="flex gap-2">
        <Skeleton className="size-11 rounded-full" />
        <Skeleton className="size-11 rounded-full" />
      </div>
    </div>
  );

  return (
    <div aria-busy="true">
      {/* Hero: same box, text column, buttons and slide dots as heroCarousel. */}
      <div className="container-page pt-4 sm:pt-6">
        <div className="relative h-[36rem] overflow-hidden rounded-[2rem] sm:h-[32rem] lg:h-[36rem]">
          <div className="absolute inset-0">
            <Skeleton className="h-full rounded-none" />
          </div>
          <div className="relative flex h-full max-w-xl flex-col justify-end gap-4 p-7 pb-20 sm:justify-center sm:p-12 lg:p-16">
            <div className="h-4 w-28 rounded-full bg-fg/10" />
            <div className="space-y-3">
              <div className="h-9 w-4/5 rounded-xl bg-fg/10 sm:h-11 lg:h-14" />
              <div className="h-9 w-3/5 rounded-xl bg-fg/10 sm:h-11 lg:h-14" />
            </div>
            <div className="max-w-md space-y-2">
              <div className="h-4 rounded-full bg-fg/8 sm:h-5" />
              <div className="h-4 w-3/4 rounded-full bg-fg/8 sm:h-5" />
            </div>
            <div className="mt-2 flex gap-3">
              <div className="h-12 w-36 rounded-full bg-fg/10" />
              <div className="h-12 w-32 rounded-full bg-fg/8" />
            </div>
          </div>
          <div className="absolute bottom-6 start-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-fg/8 p-2 rtl:translate-x-1/2 sm:start-12 sm:translate-x-0 lg:start-16 rtl:sm:translate-x-0">
            <span className="h-2 w-7 rounded-full bg-fg/15" />
            <span className="size-2 rounded-full bg-fg/10" />
            <span className="size-2 rounded-full bg-fg/10" />
          </div>
        </div>
      </div>

      <section className="container-page overflow-hidden pt-16 pb-8 lg:pt-20">
        {header}
        <div className="flex gap-3 sm:gap-6 lg:gap-7">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="w-[calc(50%-0.375rem)] shrink-0 sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.3125rem)]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page overflow-hidden py-16 lg:py-20">
        {header}
        <div className="flex gap-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-40 w-36 shrink-0 rounded-3xl sm:w-40" />
          ))}
        </div>
      </section>
    </div>
  );
}
