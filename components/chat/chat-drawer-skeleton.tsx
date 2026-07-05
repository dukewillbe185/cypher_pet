import { Skeleton } from "@/components/ui/skeleton";

export function ChatDrawerSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-20 w-full rounded-[24px]" />
      <div className="flex justify-end">
        <Skeleton className="h-16 w-40 rounded-[24px]" />
      </div>
      <Skeleton className="h-24 w-[82%] rounded-[24px]" />
    </div>
  );
}
