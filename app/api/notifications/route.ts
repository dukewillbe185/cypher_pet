import { getViewerContext } from "@/lib/auth";
import { listNotifications } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

export async function GET() {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  const notifications = await listNotifications(profile.id);
  return jsonOk({ notifications });
}
