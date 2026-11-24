"use client";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { LOW_STOCK } from "@/lib/site";

/** "In stock" / "Only 3 left" / "Out of stock". Products without tracked stock (null) count as in stock. */
export default function StockStatus({ stock }) {
  const { t } = useI18n();
  const soldOut = stock === 0;
  const low = Number.isInteger(stock) && stock > 0 && stock <= LOW_STOCK;

  return (
    <span className={cn("font-medium", soldOut ? "text-sale" : low ? "text-amber-600 dark:text-amber-400" : "text-success")}>
      {t(soldOut ? "product.outOfStock" : low ? "product.lowStock" : "product.inStock", { count: stock })}
    </span>
  );
}
