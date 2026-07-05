import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PetLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="space-y-5">
        <Skeleton className="h-80 w-full rounded-[30px]" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </Card>
      <div className="space-y-6">
        <Card className="space-y-5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-48 w-full rounded-[24px]" />
        </Card>
        <Card className="space-y-5">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-[24px]" />
        </Card>
      </div>
    </div>
  );
}
