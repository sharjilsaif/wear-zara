import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

function Row({ label, value, strong, className }) {
  return (
    <div className={`flex justify-between gap-4 py-3.5 ${strong ? "text-base font-semibold" : "text-sm"} ${className ?? ""}`}>
      <span className={strong ? "" : "text-fg-muted"}>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

/** Subtotal / discount / shipping / total rows — shared by the cart and checkout pages. */
export default function OrderSummary({ totals }) {
  const { subtotal, discount, shipping, total, coupon } = totals;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div>
      <div className="divide-y divide-line">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        {discount > 0 && <Row label={`Discount (${coupon.percent}%)`} value={`−${formatPrice(discount)}`} className="text-green-600 dark:text-green-400" />}
        <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
        <Row label="Total" value={formatPrice(total)} strong />
      </div>
      {shipping > 0 && remaining > 0 && (
        <p className="mt-1 rounded-md bg-brand-soft px-3 py-2 text-xs text-fg">
          Add <strong>{formatPrice(remaining)}</strong> more for free delivery.
        </p>
      )}
    </div>
  );
}
