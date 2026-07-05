import { SignInForm } from "@/components/forms/cyber-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-lg space-y-6">
        <Badge>Access Node</Badge>
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-white">进入 Cypher Garden</h1>
          <p className="text-white/60">
            配置了 Supabase 时会发送 Magic Link；未配置时会自动走本地 demo 登录，方便直接试跑产品流程。
          </p>
        </div>
        <SignInForm />
      </Card>
    </div>
  );
}
