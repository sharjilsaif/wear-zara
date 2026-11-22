"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

import ProductImage from "@/components/product/productImage";
import { cn } from "@/lib/format";
import { shopHref } from "@/lib/site";

const SLIDES = [
  {
    eyebrow: "New Season",
    title: ["Women's Collection", "Up to 50% Off"],
    href: shopHref({ category: "womens-fashion" }),
    image: "https://images.unsplash.com/photo-1633821879282-0c4e91f96232",
    alt: "Woman wearing a beige trench coat",
  },
  {
    eyebrow: "Tailored Fits",
    title: ["Sharp Looks", "for Every Man"],
    href: shopHref({ category: "mens-fashion" }),
    image: "https://images.unsplash.com/photo-1593030942428-a5451dca4b42",
    alt: "Man in a navy blazer and orange tie",
  },
  {
    eyebrow: "Accessories",
    title: ["Bags that", "Finish the Look"],
    href: shopHref({ category: "bags-accessories" }),
    image: "https://plus.unsplash.com/premium_photo-1670963025497-d6d582ea9319",
    alt: "Brown leather handbag with accessories",
  },
];

const INTERVAL = 6000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((index) => (index + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative h-105 overflow-hidden rounded-xl bg-black text-white sm:h-96 lg:h-full lg:min-h-96"
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}`}
            inert={!isActive}
            className={cn(
              "absolute inset-0 flex flex-col-reverse transition-opacity sm:flex-row",
              // Outgoing slide fades out fast; the incoming one fades in after it, so headlines never overlap.
              isActive ? "opacity-100 delay-200 duration-500" : "opacity-0 duration-200",
            )}
          >
            <div className="relative z-10 flex flex-1 flex-col justify-center gap-5 p-6 pb-12 sm:p-10 lg:pl-14">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-300 sm:text-sm">{slide.eyebrow}</p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {slide.title[0]}
                <br />
                {slide.title[1]}
              </h2>
              <Link
                href={slide.href}
                className="group flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium transition-all hover:gap-3 hover:bg-white/20"
              >
                Shop Now <HiArrowRight className="text-lg" />
              </Link>
            </div>

            <div className="relative h-44 shrink-0 sm:h-auto sm:w-[45%]">
              <ProductImage
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent sm:bg-linear-to-r" />
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.href}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
            className={cn(
              "h-3 rounded-full transition-all duration-300",
              index === active ? "w-8 bg-brand" : "w-3 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}
