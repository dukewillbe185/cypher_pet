import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl space-y-4 text-center">
        <p className="text-xs tracking-[0.24em] uppercase text-cyan-200/75">404 / Signal Lost</p>
        <h1 className="font-display text-4xl text-white">这个入口不在乐园地图上。</h1>
        <p className="text-white/60">可能是宠物已经下线，或者路径被霓虹雨吞掉了。</p>
        <Link href="/">
          <Button>回到首页</Button>
        </Link>
      </Card>
    </div>
  );
}
