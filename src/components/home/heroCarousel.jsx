"use client";

import { useEffect, useState } from "react";

import ArtImage, { artSources } from "@/components/ui/artImage";
import Button from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { shopHref } from "@/lib/site";

// Each slide is art-directed: its own crop (or photo) for phones, tablets and desktops.
const SLIDES = [
  { key: "women", category: "womens-fashion", sources: artSources({ phone: { id: "1483985988355-763728e1935b", crop: "faces" } }) },
  { key: "men", category: "mens-fashion", sources: artSources({ phone: { id: "1617137968427-85924c800a22", crop: "faces" } }) },
  {
    key: "bags",
    category: "bags-accessories",
    sources: artSources({ phone: { id: "1584917865442-de89df76afd3", crop: "entropy" }, desktop: { id: "1566150905458-1bf1fc113f0d", crop: "entropy" } }),
  },
];

const INTERVAL = 6000;

export default function HeroCarousel() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((index) => (index + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, active]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("hero.label")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative h-[36rem] overflow-hidden rounded-[2rem] bg-black text-white shadow-[0_20px_60px_rgb(0_0_0/0.15)] sm:h-[32rem] lg:h-[36rem]"
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.key}
            role="group"
            aria-roledescription="slide"
            aria-label={t("hero.slideOf", { current: index + 1, total: SLIDES.length })}
            inert={!isActive}
            className={cn("absolute inset-0 transition-opacity", isActive ? "opacity-100 delay-150 duration-700" : "opacity-0 duration-300")}
          >
            {/* Mirrored in right-to-left languages so the model faces the text, not under it. */}
            <div className="absolute inset-0 rtl:-scale-x-100">
              <ArtImage
                sources={slide.sources}
                alt={t(`hero.${slide.key}.alt`)}
                priority={index === 0}
                className={cn("transition-transform duration-[7s] ease-out", isActive ? "scale-105" : "scale-100")}
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent sm:bg-linear-to-r sm:from-black/75 sm:via-black/25 rtl:sm:bg-linear-to-l" />

            <div
              className={cn(
                "relative flex h-full max-w-xl flex-col justify-end gap-4 p-7 pb-20 transition-all duration-700 ease-apple sm:justify-center sm:p-12 lg:p-16",
                isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0",
              )}
            >
              <p className="text-sm font-semibold text-white/80">{t(`hero.${slide.key}.eyebrow`)}</p>
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{t(`hero.${slide.key}.title`)}</h2>
              <p className="max-w-md text-[15px] text-white/80 sm:text-lg">{t(`hero.${slide.key}.text`)}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Button href={shopHref({ category: slide.category })} size="lg">
                  {t("common.shopNow")}
                </Button>
                <Button href="/shop" size="lg" variant="ghost" className="bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                  {t("hero.browseAll")}
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-6 start-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/15 p-2 backdrop-blur-md rtl:translate-x-1/2 sm:start-12 sm:translate-x-0 lg:start-16 rtl:sm:translate-x-0">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            aria-label={t("hero.showSlide", { number: index + 1 })}
            aria-current={index === active}
            onClick={() => setActive(index)}
            className={cn("h-2 rounded-full transition-all duration-500 ease-apple", index === active ? "w-7 bg-white" : "w-2 bg-white/45 hover:bg-white/75")}
          />
        ))}
      </div>
    </section>
  );
}
