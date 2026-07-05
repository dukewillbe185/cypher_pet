import { SmartLink } from "@/components/ui/smart-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { getViewerContext } from "@/lib/auth";

export async function SiteHeaderUserSlot() {
  const { profile } = await getViewerContext();

  if (!profile) {
    return (
      <div className="flex min-w-[14rem] items-center justify-end gap-3">
        <SmartLink className={buttonVariants({ variant: "primary" })} href="/auth/sign-in">
          Enter Garden
        </SmartLink>
      </div>
    );
  }

  return (
    <div className="flex min-w-[14rem] items-center justify-end gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold text-white">{profile.displayName}</p>
        <p className="text-xs text-cyan-200/70">@{profile.handle}</p>
      </div>
      <form action="/api/auth/sign-out" method="post">
        <Button type="submit" variant="ghost">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
