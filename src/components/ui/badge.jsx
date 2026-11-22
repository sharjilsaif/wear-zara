import { cn } from "@/lib/format";

const TONES = {
  neutral: "bg-fg/6 text-fg-muted",
  brand: "bg-brand-soft text-brand",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-sale-soft text-sale",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", TONES[tone], className)}>
      {children}
    </span>
  );
}

/** Order status → badge colour. */
export const STATUS_TONES = { PENDING: "warning", PROCESSING: "brand", SHIPPED: "brand", DELIVERED: "success", CANCELLED: "danger" };
