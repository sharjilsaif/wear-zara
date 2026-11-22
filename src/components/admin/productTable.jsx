"use client";

import { useState } from "react";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

import AdminCard from "@/components/admin/adminCard";
import useAdminRequest from "@/components/admin/useAdminRequest";
import ProductImage from "@/components/product/productImage";
import { inputClasses } from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import { ConfirmDialog } from "@/components/ui/modal";
import { cn, displayName, formatPrice } from "@/lib/format";

export default function ProductTable({ products, readOnly, className }) {
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const { send, pending } = useAdminRequest();

  const filtered = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));

  // Receives the product as an argument so the React Compiler never reads `toDelete.id` while it is null.
  const handleDelete = async (product) => {
    await send(`/api/products/${product.id}`, { method: "DELETE", success: `Deleted “${displayName(product.name)}”` });
    setToDelete(null);
  };

  return (
    <AdminCard
      className={className}
      title="Products"
      description={`${products.length} products in the catalogue.`}
      aside={
        <>
          <label htmlFor="admin-search" className="sr-only">
            Search products
          </label>
          <input
            id="admin-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search…"
            className={cn(inputClasses, "w-40 border-line py-2 sm:w-56")}
          />
        </>
      }
    >
      <div className="no-scrollbar max-h-128 overflow-auto">
        <table className="w-full min-w-xl text-left text-sm">
          <thead className="sticky top-0 bg-surface-raised text-xs uppercase tracking-wider text-fg-muted">
            <tr>
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Categories</th>
              <th className="py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((product) => {
              const name = displayName(product.name);
              return (
                <tr key={product.id}>
                  <td className="py-3 pr-4">
                    <Link href={`/product/${product.id}`} className="flex items-center gap-3 hover:text-brand">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                        <ProductImage src={product.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="line-clamp-1 font-medium">{name}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{formatPrice(product.price)}</td>
                  <td className="py-3 pr-4 text-xs text-fg-muted">{product.categories.map((category) => category.name).join(", ")}</td>
                  <td className="py-3 text-right">
                    <IconButton label={`Delete ${name}`} variant="ghost" size="sm" className="text-brand" disabled={readOnly} onClick={() => setToDelete(product)}>
                      <FiTrash2 />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-fg-muted">No products match “{query}”.</p>}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => handleDelete(toDelete)}
        loading={pending}
        title="Delete product?"
        description={toDelete ? `“${displayName(toDelete.name)}” will be permanently removed from the store.` : ""}
        confirmLabel="Delete"
      />
    </AdminCard>
  );
}
