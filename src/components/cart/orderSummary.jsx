"use client";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

function Row({ label, value, strong, className }) {
  return (
    <div className={cn("flex justify-between gap-4 py-3", strong ? "text-[17px] font-semibold" : "text-sm", className)}>
      <span className={strong ? "" : "text-fg-muted"}>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

/**
 * Subtotal / discount / shipping / total rows. Works with live cart totals
 * (from getCartTotals) and saved orders (same field names).
 */
export default function OrderSummary({ totals, couponCode }) {
  const { t, format } = useI18n();
  const { subtotal, discount, shipping, total } = totals;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const code = couponCode ?? totals.coupon?.code;

  return (
    <div>
      <div className="divide-y divide-line">
        <Row label={t("cart.subtotal")} value={format.price(subtotal)} />
        {discount > 0 && <Row label={t("cart.discount", { code })} value={`−${format.price(discount)}`} className="text-success" />}
        <Row label={t("cart.shipping")} value={shipping === 0 ? t("cart.free") : format.price(shipping)} />
        <Row label={t("cart.total")} value={format.price(total)} strong />
      </div>
      {totals.itemCount !== undefined && shipping > 0 && remaining > 0 && (
        <div className="mt-2 rounded-2xl bg-brand-soft p-3">
          <p className="text-xs">{t("cart.freeShippingHint", { amount: format.price(remaining) })}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand/15">
            <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
