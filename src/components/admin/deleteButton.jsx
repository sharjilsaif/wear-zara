"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";

import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import { ConfirmDialog } from "@/components/ui/modal";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";

/**
 * Delete action with confirmation, used across the admin.
 * `redirectTo` navigates after success (e.g. back to the list from a detail page).
 */
export default function DeleteButton({ url, title, description, success, disabled, label, redirectTo }) {
  const { t } = useI18n();
  const router = useRouter();
  const { send, pending } = useRequest();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await send(url, { method: "DELETE", success, refresh: !redirectTo });
    if (!result.ok) return;
    setOpen(false);
    if (redirectTo) router.push(redirectTo);
  };

  return (
    <>
      {label ? (
        <Button variant="danger-soft" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
          <LuTrash2 /> {label}
        </Button>
      ) : (
        <IconButton label={t("common.delete")} variant="ghost" size="sm" className="text-fg-muted hover:bg-sale-soft hover:text-sale" disabled={disabled} onClick={() => setOpen(true)}>
          <LuTrash2 />
        </IconButton>
      )}
      <ConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={handleDelete} loading={pending} title={title} description={description} confirmLabel={t("common.delete")} />
    </>
  );
}
