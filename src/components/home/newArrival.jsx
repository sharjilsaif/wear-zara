import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

import ProductImage from "@/components/product/productImage";
import SectionHeader from "@/components/ui/sectionHeader";
import { cn } from "@/lib/format";
import { shopHref } from "@/lib/site";

const TILES = [
  {
    title: "Women's Collection",
    text: "Featured looks that give you another vibe.",
    href: shopHref({ category: "womens-fashion" }),
    image: "https://plus.unsplash.com/premium_photo-1668319915454-ee79c9f81f5e",
    alt: "Woman in a light blue shirt",
    className: "min-h-96 md:col-span-2 md:row-span-2",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Outerwear & Jackets",
    text: "Layer up with denim and statement jackets.",
    href: shopHref({ category: "outerwear-jackets" }),
    image: "https://images.unsplash.com/photo-1617178388553-a9d022974a5c",
    alt: "Denim jacket flat lay with shoes and accessories",
    className: "min-h-64 md:col-span-2",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Footwear",
    text: "Heels, sneakers & more.",
    href: shopHref({ category: "footwear-shoes" }),
    image: "https://images.unsplash.com/photo-1581101767113-1677fc2beaa8",
    alt: "Pair of glitter high heels",
    className: "min-h-64",
    sizes: "(min-width: 768px) 25vw, 50vw",
  },
  {
    title: "Kids Wear",
    text: "Comfy picks for little ones.",
    href: shopHref({ category: "kids-baby-wear" }),
    image: "https://images.unsplash.com/photo-1602313306160-9d58a1d56390",
    alt: "Child wearing a red hoodie and beanie",
    className: "min-h-64",
    sizes: "(min-width: 768px) 25vw, 50vw",
  },
];

function FeatureTile({ tile }) {
  return (
    <Link href={tile.href} className={cn("group relative block overflow-hidden rounded-xl bg-black text-white", tile.className)}>
      <ProductImage
        src={tile.image}
        alt={tile.alt}
        fill
        sizes={tile.sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 sm:p-7">
        <h3 className="text-lg font-semibold sm:text-2xl">{tile.title}</h3>
        <p className="mt-2 max-w-60 text-sm text-neutral-200">{tile.text}</p>
        <span className="mt-4 inline-flex items-center gap-2 border-b border-white/60 pb-0.5 text-sm font-medium transition-all group-hover:gap-3">
          Shop Now <HiArrowRight aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export default function NewArrival() {
  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeader eyebrow="Featured" title="New Arrival" />
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-7 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(17rem,1fr))]">
        {TILES.map((tile) => (
          <FeatureTile key={tile.title} tile={tile} />
        ))}
      </div>
    </section>
  );
}
