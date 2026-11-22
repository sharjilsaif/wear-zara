"use client";

import { useState } from "react";
import Link from "next/link";
import { LuPencil, LuSearch } from "react-icons/lu";

import AdminCard, { Table } from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import ProductImage from "@/components/product/productImage";
import { inputClasses } from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import { useI18n } from "@/i18n/client";
import { cn, displayName, getDiscountPercent } from "@/lib/format";

export default function ProductTable({ products }) {
  const { t, format } = useI18n();
  const [query, setQuery] = useState("");
  const filtered = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));

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
      <Table
        head={[t("admin.products.product"), t("admin.products.price"), t("admin.products.categories"), ""]}
        empty={filtered.length === 0 && <p className="py-10 text-center text-sm text-fg-muted">{t("admin.noMatches", { query })}</p>}
      >
        {filtered.map((product) => {
          const name = displayName(product.name);
          const discount = getDiscountPercent(product);
          return (
            <tr key={product.id} className="transition-colors hover:bg-fg/2">
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
                <span className="line-clamp-2">{product.categories.map((category) => category.name).join(", ")}</span>
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
        })}
      </Table>
    </AdminCard>
  );
}
