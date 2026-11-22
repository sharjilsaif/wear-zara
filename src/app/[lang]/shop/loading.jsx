import { ProductGridSkeleton } from "@/components/product/productGrid";
import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-10">
      <Skeleton className="mb-8 h-4 w-40 rounded-full" />
      <Skeleton className="mb-3 h-4 w-16 rounded-full" />
      <Skeleton className="mb-10 h-12 w-72" />
      <div className="mb-10 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full" />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
