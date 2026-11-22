"use client";

import { FiMinus, FiPlus } from "react-icons/fi";

import { MAX_QTY } from "@/lib/site";
import { cn } from "@/lib/format";

export default function QuantityStepper({ value, onChange, min = 1, max = MAX_QTY, size = "md", label = "Quantity" }) {
  const buttonClasses = cn(
    "flex items-center justify-center text-fg transition-colors hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent",
    size === "sm" ? "h-8 w-8" : "h-11 w-11",
  );

  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-md border border-line">
      <button type="button" aria-label="Decrease quantity" className={buttonClasses} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <FiMinus />
      </button>
      <span aria-live="polite" className={cn("text-center text-sm font-semibold tabular-nums", size === "sm" ? "w-8" : "w-12")}>
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" className={buttonClasses} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <FiPlus />
      </button>
    </div>
  );
}
