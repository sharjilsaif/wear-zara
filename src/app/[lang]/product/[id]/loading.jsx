import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:gap-14" aria-busy="true">
      <Skeleton className="aspect-4/5 rounded-3xl" />
      <div>
        <Skeleton className="mb-3 h-4 w-24 rounded-full" />
        <Skeleton className="mb-4 h-10 w-3/4" />
        <Skeleton className="mb-8 h-6 w-28 rounded-full" />
        <Skeleton className="mb-2 h-4 w-full rounded-full" />
        <Skeleton className="mb-8 h-4 w-2/3 rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
