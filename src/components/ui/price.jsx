"use client";

import { useI18n } from "@/i18n/client";
import { cn, getOriginalPrice } from "@/lib/format";

/** Current price, with the struck-through original when the product is on sale. */
export default function Price({ product, size = "sm", className }) {
  const { t, format } = useI18n();
  const original = getOriginalPrice(product);

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", size === "lg" ? "text-2xl" : "text-[15px]", className)}>
      <span className={cn("font-semibold", original ? "text-sale" : "text-fg")}>{format.price(product.price)}</span>
      {original && (
        <span className={cn("text-fg-muted line-through", size === "lg" ? "text-base" : "text-[13px]")}>
          <span className="sr-only">{t("product.was")} </span>
          {format.price(original)}
        </span>
      )}
    </div>
  );
}
