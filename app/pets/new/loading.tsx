import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewPetLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="space-y-5">
        <Badge>New Pet</Badge>
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
      <Card className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="space-y-3" key={index}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full rounded-[24px]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-11 w-40 rounded-full" />
      </Card>
    </div>
  );
}
