"use client";

import { LuMinus, LuPlus } from "react-icons/lu";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { MAX_QTY } from "@/lib/site";

export default function QuantityStepper({ value, onChange, min = 1, max = MAX_QTY, size = "md", label }) {
  const { t, format } = useI18n();
  const button = cn(
    "flex items-center justify-center rounded-full text-fg transition-all hover:bg-fg/8 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent",
    size === "sm" ? "h-8 w-8" : "h-10 w-10",
  );

  return (
    <div role="group" aria-label={label ?? t("common.quantity")} className="inline-flex items-center rounded-full bg-fg/5 p-0.5">
      <button type="button" aria-label={t("common.decrease")} className={button} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <LuMinus />
      </button>
      <span aria-live="polite" className={cn("text-center text-sm font-semibold tabular-nums", size === "sm" ? "w-7" : "w-9")}>
        {format.number(value)}
      </span>
      <button type="button" aria-label={t("common.increase")} className={button} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <LuPlus />
      </button>
    </div>
  );
}
