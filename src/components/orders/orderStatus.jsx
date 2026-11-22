"use client";

import { LuCheck, LuPackage, LuTruck, LuX, LuClock } from "react-icons/lu";

import Badge, { STATUS_TONES } from "@/components/ui/badge";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

export function StatusBadge({ status }) {
  const { t } = useI18n();
  return <Badge tone={STATUS_TONES[status]}>{t(`orderStatus.${status}`)}</Badge>;
}

const STEPS = [
  { status: "PENDING", icon: LuClock },
  { status: "PROCESSING", icon: LuPackage },
  { status: "SHIPPED", icon: LuTruck },
  { status: "DELIVERED", icon: LuCheck },
];

/** Progress tracker: Placed → Processing → Shipped → Delivered (or a cancelled notice). */
export function StatusTimeline({ status }) {
  const { t } = useI18n();

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-sale-soft p-4 text-sm text-sale">
        <LuX aria-hidden className="text-lg" /> {t("orders.cancelledNotice")}
      </div>
    );
  }

  const current = STEPS.findIndex((step) => step.status === status);
  return (
    <ol className="grid grid-cols-4">
      {STEPS.map(({ status: step, icon: Icon }, index) => {
        const done = index <= current;
        return (
          <li key={step} className="relative flex flex-col items-center gap-2 text-center">
            {index > 0 && (
              <span aria-hidden className={cn("absolute end-1/2 top-5 h-0.5 w-full -translate-y-1/2 transition-colors", index <= current ? "bg-brand" : "bg-line")} />
            )}
            <span className={cn("relative flex h-10 w-10 items-center justify-center rounded-full transition-all", done ? "bg-brand text-white shadow-[0_4px_14px_var(--brand-soft)]" : "bg-fg/6 text-fg-muted")}>
              <Icon aria-hidden />
            </span>
            <span className={cn("text-xs", done ? "font-semibold" : "text-fg-muted")}>{t(`orderStatus.${step}`)}</span>
          </li>
        );
      })}
    </ol>
  );
}
