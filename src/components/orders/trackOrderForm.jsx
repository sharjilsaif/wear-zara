"use client";

import { useState } from "react";

import { StatusBadge, StatusTimeline } from "@/components/orders/orderStatus";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import DateText from "@/components/ui/dateText";
import FormField, { FormAlert } from "@/components/ui/formField";
import { useI18n } from "@/i18n/client";
import { displayName } from "@/lib/format";
import useRequest from "@/lib/useRequest";

export default function TrackOrderForm() {
  const { t, format } = useI18n();
  const { send, pending } = useRequest();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = await send("/api/orders/track", { body: data, refresh: false, quiet: true });
    setOrder(result.ok ? result.order : null);
    setError(result.ok ? "" : t(result.error === "tooManyRequests" ? "errors.tooManyRequests" : "errors.trackNotFound"));
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="glass grid gap-5 rounded-3xl p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-8">
        <FormField label={t("pages.trackOrder.number")} name="number" required placeholder="WZ-7K3P9Q2M" autoComplete="off" inputClassName="uppercase placeholder:normal-case" dir="ltr" />
        <FormField label={t("common.email")} name="email" type="email" required placeholder="you@example.com" autoComplete="email" dir="ltr" />
        <Button type="submit" size="lg" loading={pending}>
          {t("pages.trackOrder.submit")}
        </Button>
      </form>

      <FormAlert>{error}</FormAlert>

      {order && (
        <section className="glass flex animate-fade-up flex-col gap-6 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-fg-muted">{t("orders.order")}</p>
              <h2 className="text-xl font-semibold" dir="ltr">
                {order.number}
              </h2>
              <p className="mt-1 text-[13px] text-fg-muted">
                {t("orders.placedOn")} <DateText value={order.createdAt} /> · {order.city}
              </p>
            </div>
            <div className="text-end">
              <StatusBadge status={order.status} />
              <p className="mt-2 text-lg font-semibold">{format.price(order.total)}</p>
            </div>
          </div>
          <StatusTimeline status={order.status} />
          <ul className="flex flex-wrap gap-3">
            {order.items.map((item, index) => (
              <li key={index} className="flex items-center gap-3 rounded-2xl bg-fg/4 p-2 pe-4 text-sm">
                <span className="relative h-12 w-10 overflow-hidden rounded-lg bg-surface">
                  <ProductImage src={item.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="line-clamp-1 max-w-48">{displayName(item.name)}</span>
                <span className="text-fg-muted">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
