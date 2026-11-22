import { cn, formatPrice, getOriginalPrice } from "@/lib/format";

/** Current price with the struck-through original when the product is on sale. */
export default function Price({ product, size = "sm", className }) {
  const original = getOriginalPrice(product);

  return (
    <div className={cn("flex items-baseline gap-2.5", size === "lg" ? "text-2xl" : "text-sm", className)}>
      <span className="font-semibold text-brand">{formatPrice(product.price)}</span>
      {original && (
        <span className={cn("text-fg-muted line-through", size === "lg" ? "text-base" : "text-sm")}>
          <span className="sr-only">Was </span>
          {formatPrice(original)}
        </span>
      )}
    </div>
  );
}
