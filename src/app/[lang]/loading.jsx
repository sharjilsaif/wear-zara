import Skeleton from "@/components/ui/skeleton";

/** Skeleton blocks shown instantly while a server-rendered page loads (account/admin reuse them inside their layouts). */
export function PageSkeleton() {
  return (
    <div aria-busy="true">
      <Skeleton className="mb-3 h-4 w-24 rounded-full" />
      <Skeleton className="mb-8 h-10 w-64 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container-page py-10">
      <PageSkeleton />
    </div>
  );
}
