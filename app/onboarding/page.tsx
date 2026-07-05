import { redirect } from "next/navigation";

import { ProfileSetupForm } from "@/components/forms/cyber-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getViewerContext } from "@/lib/auth";

export default async function OnboardingPage() {
  const { profile } = await getViewerContext();

  if (!profile) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="space-y-6">
        <Badge>First Boot</Badge>
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-white">设置你的乐园身份</h1>
          <p className="text-white/60">
            第一次登录后，先确认公开展示用的昵称、handle 和简介。后续还可以继续改。
          </p>
        </div>
        <ProfileSetupForm profile={profile} />
      </Card>
    </div>
  );
}
