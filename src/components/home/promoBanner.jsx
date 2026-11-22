import Countdown from "@/components/home/countdown";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import { shopHref } from "@/lib/site";

export default function PromoBanner() {
  return (
    <section className="container-page py-4">
      <div className="grid overflow-hidden rounded-xl bg-black text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-8 p-8 sm:p-12 lg:p-16">
          <p className="font-semibold text-green-400">Footwear Week</p>
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Step Up Your
            <br />
            Shoe Game
          </h2>
          <Countdown until="month" variant="circles" label="Footwear deals end in" />
          <Button href={shopHref({ category: "footwear-shoes" })} size="lg" className="w-fit bg-green-500 hover:bg-green-600 active:bg-green-700">
            Buy Now!
          </Button>
        </div>

        <div className="relative min-h-72 sm:min-h-96">
          <ProductImage
            src="https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3"
            alt="Olive green high-top sneakers splashing through a puddle"
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent lg:bg-linear-to-r lg:from-black lg:via-black/20" />
        </div>
      </div>
    </section>
  );
}
