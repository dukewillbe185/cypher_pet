import { Skeleton } from "@/components/ui/skeleton";

export function SiteHeaderUserSkeleton() {
  return (
    <div className="flex min-w-[14rem] items-center justify-end gap-3">
      <div className="hidden space-y-2 text-right sm:block">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="ml-auto h-3 w-20 rounded-full" />
      </div>
      <Skeleton className="h-11 w-32 rounded-full" />
    </div>
  );
}
