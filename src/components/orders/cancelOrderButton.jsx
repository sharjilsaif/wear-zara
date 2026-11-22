"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";

export default function CancelOrderButton({ number }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [open, setOpen] = useState(false);

  const cancel = async () => {
    const result = await send(`/api/orders/${number}`, { method: "PATCH", body: { action: "cancel" }, success: t("orders.cancelled") });
    if (result.ok) setOpen(false);
  };

  return (
    <>
      <Button variant="danger-soft" size="sm" onClick={() => setOpen(true)}>
        {t("orders.cancel")}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={cancel}
        loading={pending}
        title={t("orders.cancelTitle")}
        description={t("orders.cancelText")}
        confirmLabel={t("orders.cancel")}
        cancelLabel={t("orders.keep")}
      />
    </>
  );
}
