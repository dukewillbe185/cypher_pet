import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignInLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-lg space-y-6">
        <Badge>Access Node</Badge>
        <div className="space-y-3">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-5">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </Card>
    </div>
  );
}
