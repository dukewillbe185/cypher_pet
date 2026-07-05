import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { resolveReport } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  reportId: z.string(),
});

const bodySchema = z.object({
  action: z.enum(["dismiss", "hide_pet", "hide_event", "freeze_pet"]),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  const { profile } = await getViewerContext();

  if (!profile || profile.role !== "admin") {
    return jsonError("需要管理员权限。", 403);
  }

  try {
    const { reportId } = paramsSchema.parse(await context.params);
    const payload = bodySchema.parse(await request.json());
    const report = await resolveReport({
      reportId,
      action: payload.action,
    });

    return jsonOk({ report });
  } catch (error) {
    captureException(error, { route: "resolve-report" });
    return jsonError(error instanceof Error ? error.message : "处理举报失败。", 400);
  }
}
