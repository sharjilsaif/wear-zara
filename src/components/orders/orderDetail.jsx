"use client";

import Link from "next/link";

import OrderSummary from "@/components/cart/orderSummary";
import { StatusBadge, StatusTimeline } from "@/components/orders/orderStatus";
import ProductImage from "@/components/product/productImage";
import DateText from "@/components/ui/dateText";
import { useI18n } from "@/i18n/client";
import { displayName } from "@/lib/format";

/**
 * Full order view shared by the customer's account, the confirmation page and the admin.
 * `actions` renders in the header (cancel / status controls); `aside` adds cards under the summary.
 */
export default function OrderDetail({ order, actions, aside }) {
  const { t, format } = useI18n();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="flex flex-col gap-6">
        <section className="glass rounded-3xl p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-fg-muted">{t("orders.order")}</p>
              <h2 className="text-xl font-semibold tracking-tight" dir="ltr">
                {order.number}
              </h2>
              <p className="mt-1 text-[13px] text-fg-muted">
                {t("orders.placedOn")} <DateText value={order.createdAt} withTime />
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              {actions}
            </div>
          </div>
          <StatusTimeline status={order.status} />
        </section>

        <section className="glass rounded-3xl p-6">
          <h3 className="mb-4 font-semibold">{t("orders.items", { count: order.items.length })}</h3>
          <ul className="divide-y divide-line">
            {order.items.map((item) => {
              const name = displayName(item.name);
              const image = (
                <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <ProductImage src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                </span>
              );
              return (
                <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  {item.productId ? <Link href={`/product/${item.productId}`}>{image}</Link> : image}
                  <div className="min-w-0 flex-1">
                    {item.productId ? (
                      <Link href={`/product/${item.productId}`} className="line-clamp-2 text-sm font-medium hover:text-brand">
                        {name}
                      </Link>
                    ) : (
                      <p className="line-clamp-2 text-sm font-medium">{name}</p>
                    )}
                    <p className="text-xs text-fg-muted">
                      {format.price(item.unitPrice)} × {format.number(item.quantity)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{format.price(item.unitPrice * item.quantity)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-28">
        <section className="glass rounded-3xl p-6">
          <h3 className="mb-2 font-semibold">{t("cart.summary")}</h3>
          <OrderSummary totals={order} couponCode={order.couponCode} />
          <p className="mt-3 text-xs text-fg-muted">{t("orders.paymentCod")}</p>
        </section>

        <section className="glass rounded-3xl p-6 text-sm">
          <h3 className="mb-3 font-semibold">{t("orders.deliveryTo")}</h3>
          <address className="flex flex-col gap-1 not-italic text-fg-muted">
            <span className="font-medium text-fg">{order.customerName}</span>
            {order.company && <span>{order.company}</span>}
            <span>{[order.street, order.apartment].filter(Boolean).join(", ")}</span>
            <span>{order.city}</span>
            <span dir="ltr" className="text-start">
              {order.phone}
            </span>
            <span>{order.email}</span>
            {order.notes && <span className="mt-2 rounded-xl bg-fg/4 p-3 text-fg">“{order.notes}”</span>}
          </address>
        </section>
        {aside}
      </div>
    </div>
  );
}
