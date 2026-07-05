import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { createReport } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

const schema = z.object({
  targetType: z.enum(["pet", "pet_event"]),
  targetId: z.string(),
  reason: z.string().min(6).max(280),
});

export async function POST(request: Request) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const payload = schema.parse(await request.json());
    const report = await createReport({
      viewerId: profile.id,
      targetType: payload.targetType,
      targetId: payload.targetId,
      reason: payload.reason,
    });

    return jsonOk({ report }, { status: 201 });
  } catch (error) {
    captureException(error, { route: "create-report" });
    return jsonError(error instanceof Error ? error.message : "举报失败。", 400);
  }
}
