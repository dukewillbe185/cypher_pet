import { getViewerContext } from "@/lib/auth";
import { listReports } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

export async function GET() {
  const { profile } = await getViewerContext();

  if (!profile || profile.role !== "admin") {
    return jsonError("需要管理员权限。", 403);
  }

  const reports = await listReports();
  return jsonOk({ reports });
}
