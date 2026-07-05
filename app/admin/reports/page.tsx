import { redirect } from "next/navigation";

import { AdminReportActions } from "@/components/forms/cyber-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getViewerContext } from "@/lib/auth";
import { listReports } from "@/lib/repository";
import { formatRelativeTime } from "@/lib/utils";

export default async function AdminReportsPage() {
  const { profile } = await getViewerContext();

  if (!profile || profile.role !== "admin") {
    redirect("/auth/sign-in");
  }

  const reports = await listReports();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge>Moderation</Badge>
        <h1 className="font-display text-4xl text-white">宠物与事件审核台</h1>
        <p className="text-white/60">管理员可以隐藏事件、隐藏宠物，或直接冻结宠物。</p>
      </div>

      <div className="space-y-4">
        {reports.map(({ report, reporter }) => (
          <Card className="space-y-5" key={report.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                  {report.targetType} / {report.status}
                </p>
                <h2 className="text-2xl font-semibold text-white">{report.reason}</h2>
                <p className="text-sm text-white/45">
                  举报人：{reporter?.displayName ?? "unknown"} · {formatRelativeTime(report.createdAt)}
                </p>
              </div>
            </div>
            <AdminReportActions reportId={report.id} targetType={report.targetType} />
          </Card>
        ))}
      </div>
    </div>
  );
}
