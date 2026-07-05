import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartLink } from "@/components/ui/smart-link";
import { getViewerContext } from "@/lib/auth";
import { getViewerDashboard } from "@/lib/repository";
import { formatRelativeTime } from "@/lib/utils";

type DashboardResult = Awaited<ReturnType<typeof getViewerDashboard>>;

function DashboardCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="space-y-4">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-12 w-56" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton className="h-5 w-full" key={index} />
        ))}
      </div>
    </Card>
  );
}

async function HeroSection({
  dashboardPromise,
}: {
  dashboardPromise: Promise<DashboardResult>;
}) {
  const dashboard = await dashboardPromise;

  if (!dashboard) {
    redirect("/auth/sign-in");
  }

  return (
    <Card className="space-y-5">
      <Badge>Keeper Console</Badge>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-white">{dashboard.profile.displayName}</h1>
          <p className="text-cyan-200/80">@{dashboard.profile.handle}</p>
          <p className="max-w-2xl text-white/62">{dashboard.profile.bio}</p>
        </div>
        <div className="flex gap-3">
          <SmartLink className={buttonVariants({ variant: "ghost" })} href="/onboarding">
            编辑档案
          </SmartLink>
          <SmartLink className={buttonVariants()} href="/pets/new">
            新增宠物
          </SmartLink>
        </div>
      </div>
    </Card>
  );
}

async function PetsSection({
  dashboardPromise,
}: {
  dashboardPromise: Promise<DashboardResult>;
}) {
  const dashboard = await dashboardPromise;

  if (!dashboard) {
    redirect("/auth/sign-in");
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">我的宠物控制台</h2>
        <span className="text-sm text-white/45">{dashboard.pets.length} 只</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {dashboard.pets.map((item) => (
          <SmartLink href={`/pets/${item.pet.id}`} key={item.pet.id}>
            <div className="ease-smooth motion-fast rounded-[26px] border border-white/10 bg-white/[0.03] p-4 transition-[border-color,transform] hover:border-lime-300/30 hover:-translate-y-0.5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.generation?.worldSpritePath ? (
                    <img
                      alt={item.pet.name}
                      className="h-14 w-14 object-contain [image-rendering:pixelated]"
                      src={item.generation.worldSpritePath}
                    />
                  ) : null}
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.pet.name}</h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {item.zone?.name ?? "未分区"}
                    </p>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                  {item.state?.mood}
                </span>
              </div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-lime-200/65">
                {item.personality.archetype}
              </p>
              <p className="text-sm leading-7 text-white/60">{item.recentEvents[0]?.body ?? item.pet.bio}</p>
              {item.memories[0] ? (
                <p className="mt-3 text-xs leading-6 text-cyan-100/60">{item.memories[0].body}</p>
              ) : null}
            </div>
          </SmartLink>
        ))}
      </div>
      <SmartLink className={buttonVariants({ variant: "secondary" })} href="/garden">
        进入花园观察
      </SmartLink>
    </Card>
  );
}

async function NotificationsSection({
  dashboardPromise,
}: {
  dashboardPromise: Promise<DashboardResult>;
}) {
  const dashboard = await dashboardPromise;

  if (!dashboard) {
    redirect("/auth/sign-in");
  }

  return (
    <Card className="space-y-5">
      <h2 className="text-2xl font-semibold text-white">最近提醒</h2>
      <div className="space-y-4">
        {dashboard.notifications.slice(0, 6).map((notification) => (
          <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4" key={notification.id}>
            <p className="text-sm leading-7 text-white/72">{notification.body}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
        ))}
      </div>
      <SmartLink className={buttonVariants({ variant: "ghost" })} href="/notifications">
        查看全部提醒
      </SmartLink>
    </Card>
  );
}

export default async function MePage() {
  const { profile } = await getViewerContext();

  if (!profile) {
    redirect("/auth/sign-in");
  }

  const dashboardPromise = getViewerDashboard(profile.id);

  return (
    <div className="space-y-8">
      <Suspense fallback={<DashboardCardSkeleton lines={2} />}>
        <HeroSection dashboardPromise={dashboardPromise} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Suspense fallback={<DashboardCardSkeleton lines={4} />}>
          <PetsSection dashboardPromise={dashboardPromise} />
        </Suspense>
        <Suspense fallback={<DashboardCardSkeleton lines={5} />}>
          <NotificationsSection dashboardPromise={dashboardPromise} />
        </Suspense>
      </div>
    </div>
  );
}
