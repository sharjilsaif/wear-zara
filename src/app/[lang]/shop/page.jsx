import { Suspense } from "react";
import { LuSearch } from "react-icons/lu";

import ProductGrid from "@/components/product/productGrid";
import FilterChips from "@/components/shop/filterChips";
import Pagination from "@/components/shop/pagination";
import SortSelect from "@/components/shop/sortSelect";
import Breadcrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { Eyebrow } from "@/components/ui/sectionHeader";
import { getI18n } from "@/i18n/server";
import { getCategories, getProducts, SORT_OPTIONS } from "@/lib/catalog";
import { categoryName, shopHref } from "@/lib/site";

function readParams(searchParams) {
  const first = (value) => (Array.isArray(value) ? value[0] : value) ?? "";
  const sort = first(searchParams.sort);
  return {
    category: first(searchParams.category),
    q: first(searchParams.q).trim().slice(0, 80),
    sort: SORT_OPTIONS[sort] ? sort : "newest",
    page: Math.max(1, Number.parseInt(first(searchParams.page), 10) || 1),
  };
}

export async function generateMetadata({ params, searchParams }) {
  const [{ t }, { category, q }] = await Promise.all([getI18n((await params).lang), searchParams.then(readParams)]);
  if (q) return { title: t("shop.resultsFor", { q }), robots: { index: false } };
  const name = category ? categoryName(t, { slug: category, name: category }) : null;
  return { title: name ?? t("meta.shop.title"), description: t("meta.shop.description") };
}

export default async function ShopPage({ params, searchParams }) {
  const [{ t }, filters] = await Promise.all([getI18n((await params).lang), searchParams.then(readParams)]);
  const [categories, result] = await Promise.all([getCategories(), getProducts(filters)]);

  const active = categories.find((category) => category.slug === filters.category);
  const activeName = active && categoryName(t, active);
  const title = filters.q ? t("shop.resultsFor", { q: filters.q }) : activeName ?? t("shop.all");

  // A /shop URL from the current filters, omitting defaults to keep URLs clean.
  const buildHref = (overrides = {}) => {
    const next = { ...filters, ...overrides };
    return shopHref({ category: next.category, q: next.q, sort: next.sort === "newest" ? undefined : next.sort, page: next.page > 1 ? next.page : undefined });
  };

  const chips = [
    { href: buildHref({ category: undefined, page: 1 }), label: t("shop.allChip"), active: !filters.category },
    ...categories.map((category) => ({
      href: buildHref({ category: category.slug, page: 1 }),
      label: categoryName(t, category),
      count: category._count.products,
      active: category.slug === filters.category,
    })),
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t("nav.shop"), href: "/shop" }, ...(active || filters.q ? [{ label: filters.q ? t("search.label") : activeName }] : [])]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow className="mb-2">{t(filters.q ? "search.label" : "nav.shop")}</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-fg-muted">{t("shop.count", { count: result.total })}</p>
        </div>
        <Suspense>
          <SortSelect options={Object.keys(SORT_OPTIONS)} value={filters.sort} />
        </Suspense>
      </div>

      <div className="mb-10">
        <FilterChips items={chips} label={t("shop.filter")} />
      </div>

      {result.products.length === 0 ? (
        <EmptyState icon={LuSearch} title={t("shop.emptyTitle")} description={t(filters.q ? "shop.emptySearch" : "shop.emptyCategory")}>
          <Button href="/shop">{t("common.browseProducts")}</Button>
        </EmptyState>
      ) : (
        <>
          <ProductGrid products={result.products} priorityCount={4} />
          <Pagination page={result.page} hrefs={Array.from({ length: result.totalPages }, (_, index) => buildHref({ page: index + 1 }))} />
        </>
      )}
    </div>
  );
}
