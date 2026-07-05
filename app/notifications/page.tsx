import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getViewerContext } from "@/lib/auth";
import { listNotifications } from "@/lib/repository";
import { formatRelativeTime } from "@/lib/utils";

type NotificationsResult = Awaited<ReturnType<typeof listNotifications>>;

function NotificationsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card className="space-y-4" key={index}>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-32" />
        </Card>
      ))}
    </div>
  );
}

async function NotificationsList({
  notificationsPromise,
}: {
  notificationsPromise: Promise<NotificationsResult>;
}) {
  const notifications = await notificationsPromise;

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card className="space-y-4" key={notification.id}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-base leading-7 text-white/74">{notification.body}</p>
            <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-white/35">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">{notification.kind}</p>
        </Card>
      ))}
    </div>
  );
}

export default async function NotificationsPage() {
  const { profile } = await getViewerContext();

  if (!profile) {
    redirect("/auth/sign-in");
  }

  const notificationsPromise = listNotifications(profile.id);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge>Signal Inbox</Badge>
        <h1 className="font-display text-4xl text-white">花园提醒</h1>
        <p className="text-white/60">这里只保留宠物心情变化、重要事件和系统提示。</p>
      </div>

      <Suspense fallback={<NotificationsListSkeleton />}>
        <NotificationsList notificationsPromise={notificationsPromise} />
      </Suspense>
    </div>
  );
}
