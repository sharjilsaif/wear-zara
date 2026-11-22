"use client";

import { FaStar } from "react-icons/fa6";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

/** Star rating that reflects the product's real rating. */
export default function Stars({ rating = 0, reviews, className }) {
  const { t, format } = useI18n();
  const value = Math.round(Math.min(5, Math.max(0, Number(rating) || 0)));

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div role="img" aria-label={t("product.rated", { value })} className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => (
          <FaStar key={index} aria-hidden className={cn("text-[11px]", index < value ? "text-amber-400" : "text-fg/15")} />
        ))}
      </div>
      {reviews !== undefined && <span className="text-xs text-fg-muted">({format.number(reviews)})</span>}
    </div>
  );
}
