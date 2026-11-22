"use client";

import { useState } from "react";
import Link from "next/link";
import { LuChevronDown, LuPencil, LuSearch } from "react-icons/lu";

import AdminCard, { Table } from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import ProductImage from "@/components/product/productImage";
import { inputClasses } from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import { useI18n } from "@/i18n/client";
import { cn, displayName, getDiscountPercent } from "@/lib/format";
import { categoryName } from "@/lib/site";

/** Groups products by category (a product in several categories appears in each). */
function groupByCategory(products, t) {
  const groups = new Map();
  for (const product of products) {
    const categories = product.categories.length ? product.categories : [{ slug: "", name: t("admin.products.noCategory") }];
    for (const category of categories) {
      if (!groups.has(category.slug)) groups.set(category.slug, { category, products: [] });
      groups.get(category.slug).products.push(product);
    }
  }
  return [...groups.values()].sort((a, b) => categoryName(t, a.category).localeCompare(categoryName(t, b.category)));
}

export default function ProductTable({ products }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const groups = groupByCategory(products.filter((product) => product.name.toLowerCase().includes(search)), t);

  return (
    <AdminCard
      title={t("admin.products.all", { count: products.length })}
      aside={
        <div className="relative w-full sm:w-64">
          <LuSearch aria-hidden className="absolute start-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("admin.products.search")}
            aria-label={t("admin.products.search")}
            className={cn(inputClasses, "rounded-full py-2 ps-10")}
          />
        </div>
      }
    >
      {groups.length === 0 ? (
        <p className="py-10 text-center text-sm text-fg-muted">{t("admin.noMatches", { query })}</p>
      ) : (
        <div className="-mt-2 divide-y divide-line">
          {groups.map(({ category, products: items }) => (
            // Searching opens every matching group; otherwise groups start collapsed.
            <details key={category.slug} open={search ? true : undefined} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-semibold">{categoryName(t, category)}</span>
                <span className="rounded-full bg-fg/6 px-2 py-0.5 text-xs text-fg-muted tabular-nums">{t("home.items", { count: items.length })}</span>
                <LuChevronDown aria-hidden className="ms-auto text-fg-muted transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="pb-4">
                <Table head={[t("admin.products.product"), t("admin.products.price"), t("admin.products.categories"), ""]}>
                  {items.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </Table>
              </div>
            </details>
          ))}
        </div>
      )}
    </AdminCard>
  );
}

function ProductRow({ product }) {
  const { t, format } = useI18n();
  const name = displayName(product.name);
  const discount = getDiscountPercent(product);

  return (
    <tr className="transition-colors hover:bg-fg/2">
      <td className="py-3 pe-4">
        <Link href={`/product/${product.id}`} className="flex items-center gap-3 hover:text-brand">
          <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
            <ProductImage src={product.imageUrl} alt="" fill sizes="40px" className="object-cover" />
          </span>
          <span className="line-clamp-1 font-medium">{name}</span>
        </Link>
      </td>
      <td className="py-3 pe-4 whitespace-nowrap tabular-nums">
        {format.price(product.price)}
        {discount ? <span className="ms-2 text-xs text-sale">-{discount}%</span> : null}
      </td>
      <td className="max-w-56 py-3 pe-4 text-xs text-fg-muted">
        <span className="line-clamp-2">{product.categories.map((category) => categoryName(t, category)).join(", ")}</span>
      </td>
      <td className="py-3">
        <div className="flex justify-end gap-1">
          <IconButton href={`/admin/products/${product.id}`} label={t("common.edit")} variant="ghost" size="sm">
            <LuPencil />
          </IconButton>
          <DeleteButton
            url={`/api/products/${product.id}`}
            title={t("admin.products.deleteTitle")}
            description={t("admin.products.deleteText", { name })}
            success={t("admin.deleted")}
          />
        </div>
      </td>
    </tr>
  );
}
