import ProductCard, { ProductCardSkeleton } from "@/components/product/productCard";
import { cn } from "@/lib/format";

const GRID = "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8";

/**
 * Responsive product grid: 2 columns on mobile, 4 on desktop.
 * `onRemove(product)` (client usage only) swaps the heart for a remove button.
 */
export default function ProductGrid({ products, className, priorityCount = 0, onRemove }) {
  return (
    <div className={cn(GRID, className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
          onRemove={onRemove ? () => onRemove(product) : undefined}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div className={cn(GRID, className)}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
