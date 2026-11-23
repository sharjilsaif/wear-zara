"use client";

import { useState } from "react";

import AdminCard from "@/components/admin/adminCard";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { useI18n } from "@/i18n/client";
import { ORDER_STATUSES } from "@/lib/site";
import useRequest from "@/lib/useRequest";

/** Lets an admin move an order through its lifecycle. */
export default function OrderStatusControl({ number, status }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [value, setValue] = useState(status);

  if (status === "CANCELLED") {
    return (
      <AdminCard title={t("admin.orders.updateStatus")}>
        <p className="text-sm text-fg-muted">{t("admin.orders.cancelledFinal")}</p>
      </AdminCard>
    );
  }

  return (
    <AdminCard title={t("admin.orders.updateStatus")}>
      <div className="flex flex-col gap-3">
        <Select
          label={t("admin.coupons.status")}
          value={value}
          onChange={setValue}
         
          options={ORDER_STATUSES.map((option) => ({ value: option, label: t(`orderStatus.${option}`) }))}
        />
        <Button
          loading={pending}
          disabled={value === status}
          onClick={() => send(`/api/orders/${number}`, { method: "PATCH", body: { status: value }, success: t("admin.orders.statusUpdated") })}
        >
          {t("common.saveChanges")}
        </Button>
      </div>
    </AdminCard>
  );
}
