"use client";

import { useState } from "react";
import Link from "next/link";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";

import AdminCard from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import Button from "@/components/ui/button";
import FormField, { inputClasses } from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { shopHref } from "@/lib/site";
import useRequest from "@/lib/useRequest";

function CategoryRow({ category }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [name, setName] = useState(null); // null = not editing

  const save = async (event) => {
    event.preventDefault();
    const result = await send(`/api/categories/${category.id}`, { method: "PATCH", body: { name }, success: t("admin.categories.renamed") });
    if (result.ok) setName(null);
  };

  return (
    <li className="flex items-center gap-3 py-3">
      {name === null ? (
        <div className="min-w-0 flex-1">
          <Link href={shopHref({ category: category.slug })} className="font-medium hover:text-brand">
            {category.name}
          </Link>
          <p className="text-xs text-fg-muted" dir="ltr">
            /{category.slug}
          </p>
        </div>
      ) : (
        <form onSubmit={save} className="flex flex-1 items-center gap-2">
          <input value={name} onChange={(event) => setName(event.target.value)} aria-label={t("admin.categories.name")} autoFocus maxLength={50} className={cn(inputClasses, "py-2")} />
          <IconButton label={t("common.save")} type="submit" size="sm" disabled={pending}>
            <LuCheck />
          </IconButton>
          <IconButton label={t("common.cancel")} size="sm" variant="ghost" onClick={() => setName(null)}>
            <LuX />
          </IconButton>
        </form>
      )}
      <span className="rounded-full bg-fg/6 px-2.5 py-1 text-xs text-fg-muted">{t("admin.productsCount", { count: category._count.products })}</span>
      {name === null && (
        <IconButton label={t("common.edit")} variant="ghost" size="sm" onClick={() => setName(category.name)}>
          <LuPencil />
        </IconButton>
      )}
      <DeleteButton
        url={`/api/categories/${category.id}`}
       
        title={t("admin.categories.deleteTitle")}
        description={t("admin.categories.deleteText", { name: category.name })}
        success={t("admin.deleted")}
      />
    </li>
  );
}

export default function CategoryManager({ categories }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleCreate = async (event) => {
    event.preventDefault();
    const result = await send("/api/categories", { body: { name }, success: t("admin.categories.added") });
    if (result.ok) setName("");
    setError(result.ok ? null : result.fields?.name ?? null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      <AdminCard title={t("admin.categories.new")} description={t("admin.categories.newText")}>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <FormField label={t("admin.categories.name")} value={name} onChange={(event) => setName(event.target.value)} placeholder={t("admin.categories.placeholder")} maxLength={50} error={error} />
          <Button type="submit" loading={pending} disabled={name.trim().length < 2}>
            {t("admin.categories.add")}
          </Button>
        </form>
      </AdminCard>

      <AdminCard title={t("admin.categories.all", { count: categories.length })}>
        <ul className="-my-3 divide-y divide-line">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      </AdminCard>
    </div>
  );
}
