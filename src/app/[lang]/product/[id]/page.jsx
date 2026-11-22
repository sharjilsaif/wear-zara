import Link from "next/link";
import { notFound } from "next/navigation";
import { LuRotateCcw, LuShieldCheck, LuTruck } from "react-icons/lu";

import ProductGrid from "@/components/product/productGrid";
import ProductImage from "@/components/product/productImage";
import ProductPurchase from "@/components/product/productPurchase";
import Reviews from "@/components/product/reviews";
import Breadcrumb from "@/components/ui/breadcrumb";
import Price from "@/components/ui/price";
import SectionHeader from "@/components/ui/sectionHeader";
import Stars from "@/components/ui/stars";
import { getI18n } from "@/i18n/server";
import { getProduct, getRelatedProducts, getReviews } from "@/lib/catalog";
import { displayName, getDiscountPercent } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, MERCH_CATEGORY_SLUGS, RETURN_DAYS, SITE, categoryName, shopHref } from "@/lib/site";

export const revalidate = 300;

// Empty list = build each product page on its first visit, then serve it from cache (ISR).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const [{ t, format }, product] = await Promise.all([getI18n(lang), getProduct(id)]);
  if (!product) return { title: t("notFound.title") };

  const name = displayName(product.name);
  const description = t("product.metaDescription", { name, amount: format.price(FREE_SHIPPING_THRESHOLD), days: RETURN_DAYS });
  return { title: name, description, openGraph: { title: name, description, images: [{ url: product.imageUrl, alt: name }] } };
}

export default async function ProductPage({ params }) {
  const { lang, id } = await params;
  const [{ t, format }, product] = await Promise.all([getI18n(lang), getProduct(id)]);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([getRelatedProducts(product, 4), getReviews(product.id)]);
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
    offers: { "@type": "Offer", priceCurrency: "USD", price: product.price, availability: "https://schema.org/InStock", url: `${SITE.url}/product/${product.id}` },
    ...(product.reviews > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews } }),
  };

  const perks = [
    { icon: LuTruck, title: t("product.freeDelivery"), text: t("product.freeDeliveryText", { amount: format.price(FREE_SHIPPING_THRESHOLD) }), href: "/faq#delivery" },
    { icon: LuRotateCcw, title: t("product.easyReturns"), text: t("product.returns", { days: RETURN_DAYS }), href: "/faq#returns" },
    { icon: LuShieldCheck, title: t("product.securePayment"), text: t("product.securePaymentText"), href: "/faq#payment" },
  ];

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Breadcrumb
        items={[
          { label: t("nav.shop"), href: "/shop" },
          ...(primary ? [{ label: categoryName(t, primary), href: shopHref({ category: primary.slug }) }] : []),
          { label: name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-surface shadow-[0_10px_40px_rgb(0_0_0/0.08)]">
          <ProductImage src={product.imageUrl} alt={name} fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          {discount ? <span className="absolute start-5 top-5 rounded-full bg-sale px-3 py-1.5 text-sm font-semibold text-white">-{discount}%</span> : null}
        </div>

        <div className="flex flex-col gap-6 lg:py-4">
          <div>
            {primary && <p className="mb-2 text-sm font-semibold text-brand">{categoryName(t, primary)}</p>}
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <a href="#reviews" className="transition-opacity hover:opacity-70">
                <Stars rating={product.rating} reviews={product.reviews} />
              </a>
              <span aria-hidden className="h-4 w-px bg-line-strong" />
              <span className="font-medium text-success">{t("product.inStock")}</span>
            </div>
          </div>

          <Price product={product} size="lg" />
          <p className="leading-7 text-fg-muted">{t("product.description", { name })}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {tags.map((category) => (
                <Link key={category.slug} href={shopHref({ category: category.slug })} className="glass rounded-full px-3.5 py-1.5 text-[13px] transition-colors hover:text-brand">
                  {categoryName(t, category)}
                </Link>
              ))}
            </div>
          )}

          <ProductPurchase product={product} />

          <ul className="glass divide-y divide-line rounded-3xl">
            {perks.map(({ icon: Icon, title, text, href }) => (
              <li key={title}>
                <Link href={href} className="flex items-center gap-4 p-5 transition-colors hover:bg-fg/2">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-xl text-brand">
                    <Icon aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-fg-muted">{text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Reviews productId={product.id} rating={product.rating} count={product.reviews} reviews={reviews} />

      {related.length > 0 && (
        <section className="mt-24">
          <SectionHeader eyebrow={t("product.relatedEyebrow")} title={t("product.relatedTitle")} />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
