import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";

import HeroCarousel from "@/components/home/heroCarousel";
import { SHOP_CATEGORIES, shopHref } from "@/lib/site";

export default function Hero() {
  return (
    <section className="container-page grid gap-8 pt-6 lg:grid-cols-[15rem_1fr] lg:pt-0">
      <nav aria-label="Shop by category" className="hidden border-r border-line py-8 pr-4 lg:block">
        <ul className="flex flex-col gap-1">
          {SHOP_CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={shopHref({ category: category.slug })}
                className="group flex items-center justify-between rounded-md px-3 py-2 text-[15px] transition-colors hover:bg-surface-muted"
              >
                {category.name}
                <FaAngleRight aria-hidden className="text-xs opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="lg:py-8">
        <HeroCarousel />
      </div>
    </section>
  );
}
