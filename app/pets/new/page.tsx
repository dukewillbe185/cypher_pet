import { redirect } from "next/navigation";

import { CreatePetForm } from "@/components/forms/cyber-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getViewerContext } from "@/lib/auth";

export default async function NewPetPage() {
  const { profile } = await getViewerContext();

  if (!profile) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="space-y-8">
        <div className="space-y-4">
          <Badge>Upload Portal</Badge>
          <h1 className="font-display text-4xl text-white">把你的宠物送进花园</h1>
          <p className="max-w-2xl text-white/60">
            上传原始照片后，系统会先私有保存原图，再生成可进入公共花园的像素精灵。
          </p>
        </div>
        <CreatePetForm />
      </Card>
    </div>
  );
}
