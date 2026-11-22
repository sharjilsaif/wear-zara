import { Suspense } from "react";
import { FiSearch } from "react-icons/fi";

import ProductGrid from "@/components/product/productGrid";
import FilterChips from "@/components/shop/filterChips";
import Pagination from "@/components/shop/pagination";
import SortSelect from "@/components/shop/sortSelect";
import Breadcrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { Eyebrow } from "@/components/ui/sectionHeader";
import { getCategories, getCategoryBySlug, getProducts, SORT_OPTIONS } from "@/lib/catalog";
import { shopHref } from "@/lib/site";

function readParams(searchParams) {
  const first = (value) => (Array.isArray(value) ? value[0] : value) ?? "";
  const sort = first(searchParams.sort);
  return {
    category: first(searchParams.category),
    q: first(searchParams.q).trim().slice(0, 80),
    sort: SORT_OPTIONS[sort] ? sort : "newest",
    page: Math.max(1, parseInt(first(searchParams.page), 10) || 1),
  };
}

export async function generateMetadata({ searchParams }) {
  const { category, q } = readParams(await searchParams);
  if (q) return { title: `Search: ${q}`, robots: { index: false } };
  const found = await getCategoryBySlug(category);
  return {
    title: found ? found.name : "Shop All Products",
    description: found
      ? `Shop ${found.name} at Wear Zara — curated styles with free delivery over $140.`
      : "Browse the full Wear Zara collection of clothing, footwear and accessories.",
  };
}

export default async function ShopPage({ searchParams }) {
  const params = readParams(await searchParams);
  const [categories, result] = await Promise.all([getCategories(), getProducts(params)]);

  const activeCategory = categories.find((category) => category.slug === params.category);
  const title = params.q ? `Results for “${params.q}”` : activeCategory?.name ?? "All Products";
  // Builds a /shop URL from the current filters, omitting defaults to keep URLs clean.
  const buildHref = (overrides = {}) => {
    const next = { ...params, ...overrides };
    return shopHref({
      category: next.category,
      q: next.q,
      sort: next.sort === "newest" ? undefined : next.sort,
      page: next.page > 1 ? next.page : undefined,
    });
  };

  const chips = [
    { href: buildHref({ category: undefined, page: 1 }), label: "All", active: !params.category },
    ...categories.map((category) => ({
      href: buildHref({ category: category.slug, page: 1 }),
      label: category.name,
      count: category._count.products,
      active: category.slug === params.category,
    })),
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, ...(activeCategory || params.q ? [{ label: params.q ? "Search" : activeCategory.name }] : [])]} />

      <Eyebrow className="mb-4">{params.q ? "Search" : "Shop"}</Eyebrow>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-fg-muted">
            {result.total} {result.total === 1 ? "product" : "products"}
          </p>
        </div>
        <Suspense>
          <SortSelect options={Object.fromEntries(Object.entries(SORT_OPTIONS).map(([key, option]) => [key, option.label]))} value={params.sort} />
        </Suspense>
      </div>

      <div className="mb-10">
        <FilterChips items={chips} label="Filter by category" />
      </div>

      {result.products.length === 0 ? (
        <EmptyState
          icon={FiSearch}
          title="No products found"
          description={params.q ? "Try a different search term or browse all categories." : "There are no products in this category yet."}
        >
          <Button href="/shop">Browse all products</Button>
        </EmptyState>
      ) : (
        <>
          <ProductGrid products={result.products} priorityCount={4} />
          <Pagination page={result.page} totalPages={result.totalPages} hrefFor={(page) => buildHref({ page })} />
        </>
      )}
    </div>
  );
}
