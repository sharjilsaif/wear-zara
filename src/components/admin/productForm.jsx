"use client";

import { useState } from "react";

import AdminCard from "@/components/admin/adminCard";
import useAdminRequest from "@/components/admin/useAdminRequest";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/formField";
import { cn } from "@/lib/format";

const EMPTY_FORM = { name: "", price: "", discountPrice: "", imageUrl: "", rating: "5", reviews: "", categoryIds: [] };

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProductForm({ categories, readOnly }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { send, pending } = useAdminRequest();

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const toggleCategory = (id) =>
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(id) ? current.categoryIds.filter((item) => item !== id) : [...current.categoryIds, id],
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await send("/api/products", { body: form, success: "Product published" });
    if (ok) setForm(EMPTY_FORM);
  };

  return (
    <AdminCard title="Publish Product" description="Add a new product and assign it to one or more categories.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField label="Product name" required value={form.name} onChange={update("name")} placeholder="e.g. Unisex Sweatshirt" disabled={readOnly} maxLength={80} />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Sale price ($)" required type="number" min="0.01" step="0.01" value={form.price} onChange={update("price")} placeholder="49.99" disabled={readOnly} />
          <FormField label="Original price ($)" type="number" min="0" step="0.01" value={form.discountPrice} onChange={update("discountPrice")} placeholder="Optional, e.g. 79.99" hint="Shown struck-through; discount % is calculated." disabled={readOnly} />
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_6rem]">
          <FormField label="Image URL" required type="url" value={form.imageUrl} onChange={update("imageUrl")} placeholder="https://images.unsplash.com/…" disabled={readOnly} />
          <div className="relative hidden aspect-square self-end overflow-hidden rounded-lg border border-line bg-surface-muted sm:block">
            {isHttpsUrl(form.imageUrl) && <ProductImage src={form.imageUrl} alt="Preview" fill sizes="96px" className="object-cover" />}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField as="select" label="Rating" value={form.rating} onChange={update("rating")} disabled={readOnly}>
            {[5, 4, 3, 2, 1].map((stars) => (
              <option key={stars} value={stars}>
                {stars} {stars === 1 ? "star" : "stars"}
              </option>
            ))}
          </FormField>
          <FormField label="Reviews" type="number" min="0" value={form.reviews} onChange={update("reviews")} placeholder="0" disabled={readOnly} />
        </div>

        <fieldset disabled={readOnly}>
          <legend className="mb-2 text-sm font-medium">
            Categories <span className="text-brand">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const checked = form.categoryIds.includes(category.id);
              return (
                <label
                  key={category.id}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand",
                    checked ? "border-brand bg-brand text-white" : "border-line hover:border-fg/40",
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleCategory(category.id)} />
                  {category.name}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Button type="submit" size="lg" loading={pending} disabled={readOnly} className="w-full">
          Publish Product
        </Button>
      </form>
    </AdminCard>
  );
}
