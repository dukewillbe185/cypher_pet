import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeLoading() {
  return (
    <div className="space-y-8">
      <Card className="space-y-5">
        <Badge>Keeper Console</Badge>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-28 rounded-full" />
            <Skeleton className="h-11 w-28 rounded-full" />
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="h-52 w-full rounded-[26px]" key={index} />
            ))}
          </div>
        </Card>
        <Card className="space-y-5">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="h-24 w-full rounded-[26px]" key={index} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
