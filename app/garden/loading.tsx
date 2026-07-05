import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GardenLoading() {
  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <Card className="space-y-5 overflow-visible">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <Badge>Public Garden</Badge>
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-80 max-w-full" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-16 w-32 rounded-[20px]" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-[31rem] w-full rounded-[32px]" />
        </Card>
        <Card className="space-y-4">
          <Skeleton className="h-8 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-28 w-full rounded-[24px]" key={index} />
            ))}
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="space-y-5">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-[22px]" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-[22px]" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-16 w-full rounded-[18px]" key={index} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
