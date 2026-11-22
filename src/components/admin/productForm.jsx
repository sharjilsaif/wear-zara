"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminCard from "@/components/admin/adminCard";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/formField";
import Select from "@/components/ui/select";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import useRequest from "@/lib/useRequest";

const isHttpsUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

/** Create (no `product`) or edit a product. */
export default function ProductForm({ categories, product }) {
  const { t } = useI18n();
  const router = useRouter();
  const { send, pending } = useRequest();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: product?.name ?? "",
    price: product?.price?.toString() ?? "",
    discountPrice: product?.discountPrice?.toString() ?? "",
    imageUrl: product?.imageUrl ?? "",
    rating: String(product?.rating ?? 5),
    reviews: product?.reviews?.toString() ?? "",
    categoryIds: product?.categories.map((category) => category.id) ?? [],
  });

  const field = (name) => ({ name, value: form[name], error: errors[name], onChange: (event) => setForm({ ...form, [name]: event.target.value }) });
  const toggleCategory = (id) =>
    setForm({ ...form, categoryIds: form.categoryIds.includes(id) ? form.categoryIds.filter((item) => item !== id) : [...form.categoryIds, id] });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await send(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      body: form,
      success: t(product ? "admin.products.updated" : "admin.products.published"),
      refresh: false,
    });
    setErrors(result.fields ?? {});
    if (result.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <AdminCard title={t("admin.products.details")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("admin.products.name")} required placeholder={t("admin.products.namePlaceholder")} maxLength={80} className="sm:col-span-2" {...field("name")} />
          <FormField label={t("admin.products.price")} required type="number" min="0.01" step="0.01" placeholder="49.99" dir="ltr" {...field("price")} />
          <FormField label={t("admin.products.originalPrice")} type="number" min="0" step="0.01" placeholder={t("admin.products.originalPlaceholder")} hint={t("admin.products.originalHint")} dir="ltr" {...field("discountPrice")} />
          <FormField label={t("admin.products.imageUrl")} required type="url" placeholder="https://images.unsplash.com/…" className="sm:col-span-2" dir="ltr" {...field("imageUrl")} />
          <Select
            label={t("admin.products.rating")}
            value={form.rating}
           
            onChange={(rating) => setForm({ ...form, rating })}
            options={["5", "4", "3", "2", "1"].map((stars) => ({ value: stars, label: `${"★".repeat(stars)} (${stars})` }))}
          />
          <FormField label={t("admin.products.reviews")} type="number" min="0" placeholder="0" dir="ltr" {...field("reviews")} />

          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-[13px] font-medium">
              {t("admin.products.categories")} <span className="text-sale">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const checked = form.categoryIds.includes(category.id);
                return (
                  <label
                    key={category.id}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[13px] transition-all has-focus-visible:ring-2 has-focus-visible:ring-brand",
                      checked ? "bg-brand text-white" : "bg-fg/6 hover:bg-fg/10",
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleCategory(category.id)} />
                    {category.name}
                  </label>
                );
              })}
            </div>
            {errors.categoryIds && <p className="mt-2 text-xs text-sale">{t(`validation.${errors.categoryIds}`)}</p>}
          </fieldset>
        </div>
      </AdminCard>

      <div className="flex flex-col gap-4 lg:sticky lg:top-28">
        <AdminCard title={t("admin.products.preview")}>
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-surface">
            {isHttpsUrl(form.imageUrl) ? (
              <ProductImage src={form.imageUrl} alt={form.name} fill sizes="288px" className="object-cover" />
            ) : (
              <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-fg-muted">{t("admin.products.previewHint")}</p>
            )}
          </div>
        </AdminCard>
        <Button type="submit" size="lg" loading={pending}>
          {t(product ? "common.saveChanges" : "admin.products.publish")}
        </Button>
        <Button href="/admin/products" variant="secondary" size="lg">
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
