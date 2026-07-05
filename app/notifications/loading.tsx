import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge>Signal Inbox</Badge>
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card className="space-y-4" key={index}>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 flex-1 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
          </Card>
        ))}
      </div>
    </div>
  );
}
