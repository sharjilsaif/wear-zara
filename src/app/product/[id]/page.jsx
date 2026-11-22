import Link from "next/link";
import { notFound } from "next/navigation";
import { FiRefreshCw } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";

import ProductGrid from "@/components/product/productGrid";
import ProductImage from "@/components/product/productImage";
import ProductPurchase from "@/components/product/productPurchase";
import Breadcrumb from "@/components/ui/breadcrumb";
import Price from "@/components/ui/price";
import SectionHeader from "@/components/ui/sectionHeader";
import Stars from "@/components/ui/stars";
import { getProduct, getRelatedProducts } from "@/lib/catalog";
import { displayName, getDiscountPercent } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, MERCH_CATEGORY_SLUGS, SITE, shopHref } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };

  const name = displayName(product.name);
  const description = `Buy ${name} at ${SITE.name}. Free delivery on orders over $${FREE_SHIPPING_THRESHOLD} and easy 30-day returns.`;

  return {
    title: name,
    description,
    openGraph: { title: name, description, images: [{ url: product.imageUrl, alt: name }] },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const name = displayName(product.name);
  const discount = getDiscountPercent(product);
  const tags = product.categories.filter((category) => !MERCH_CATEGORY_SLUGS.includes(category.slug));
  const primary = tags[0];

  // Structured data so search engines can show price and rating.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/product/${product.id}`,
    },
    ...(product.reviews > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
    }),
  };

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          ...(primary ? [{ label: primary.name, href: shopHref({ category: primary.slug }) }] : []),
          { label: name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-line bg-surface-muted">
          <ProductImage src={product.imageUrl} alt={name} fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          {discount ? (
            <span className="absolute left-4 top-4 rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white">-{discount}%</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Stars rating={product.rating} reviews={`${product.reviews} reviews`} />
              <span className="text-line" aria-hidden>
                |
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">In Stock</span>
            </div>
          </div>

          <Price product={product} size="lg" />

          <p className="border-b border-line pb-6 leading-7 text-fg-muted">
            Designed for everyday comfort and effortless style, the {name} is made from quality materials that keep their
            shape wash after wash. Pair it with your favourite pieces for a look that works from morning to night.
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-fg-muted">Categories:</span>
              {tags.map((category) => (
                <Link
                  key={category.slug}
                  href={shopHref({ category: category.slug })}
                  className="rounded-full border border-line px-3 py-1 transition-colors hover:border-brand hover:text-brand"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <ProductPurchase product={product} />

          <div className="divide-y divide-line rounded-xl border border-line">
            <div className="flex items-center gap-4 p-5">
              <TbTruckDelivery aria-hidden className="shrink-0 text-3xl" />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-xs text-fg-muted">On all orders over ${FREE_SHIPPING_THRESHOLD}. Delivered in 2–4 business days.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5">
              <FiRefreshCw aria-hidden className="shrink-0 text-2xl" />
              <div>
                <p className="font-medium">Return Delivery</p>
                <p className="text-xs text-fg-muted">
                  Free 30-day returns.{" "}
                  <Link href="/faq" className="underline hover:text-fg">
                    Details
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <SectionHeader eyebrow="Related Items" title="You May Also Like" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
