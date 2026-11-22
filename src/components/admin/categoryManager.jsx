"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import AdminCard from "@/components/admin/adminCard";
import useAdminRequest from "@/components/admin/useAdminRequest";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import { ConfirmDialog } from "@/components/ui/modal";

export default function CategoryManager({ categories, readOnly }) {
  const [name, setName] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const create = useAdminRequest();
  const remove = useAdminRequest();

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const ok = await create.send("/api/categories", { body: { name }, success: `Category “${name.trim()}” added` });
    if (ok) setName("");
  };

  // Takes the category as an argument (rather than reading `toDelete` in the closure)
  // so the React Compiler doesn't dereference a null `toDelete` while memoizing.
  const handleDelete = async (category) => {
    await remove.send(`/api/categories?id=${category.id}`, { method: "DELETE", success: `Deleted “${category.name}”` });
    setToDelete(null);
  };

  return (
    <AdminCard title="Categories" description="Create and remove store departments.">
      <form onSubmit={handleCreate} className="mb-6 flex items-end gap-2">
        <FormField
          label="New category"
          className="flex-1"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Winter Wear"
          disabled={readOnly}
          maxLength={50}
        />
        <Button type="submit" variant="dark" loading={create.pending} disabled={readOnly || !name.trim()}>
          Add
        </Button>
      </form>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">{categories.length} categories</p>
      <ul className="no-scrollbar flex max-h-96 flex-col gap-2 overflow-y-auto">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between rounded-lg border border-line bg-surface-muted px-3 py-2">
            <div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-fg-muted">
                {category._count.products} products · /{category.slug}
              </p>
            </div>
            <IconButton
              label={`Delete ${category.name}`}
              variant="ghost"
              size="sm"
              className="text-brand"
              disabled={readOnly}
              onClick={() => setToDelete(category)}
            >
              <FiTrash2 />
            </IconButton>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => handleDelete(toDelete)}
        loading={remove.pending}
        title="Delete category?"
        description={toDelete ? `“${toDelete.name}” will be removed. Its products stay in the store but are no longer listed under it.` : ""}
        confirmLabel="Delete"
      />
    </AdminCard>
  );
}
