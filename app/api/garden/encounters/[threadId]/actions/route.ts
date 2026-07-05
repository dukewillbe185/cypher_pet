import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { applyEncounterWorldAction } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  threadId: z.string(),
});

const bodySchema = z.object({
  action: z.enum(["observe", "approach"]),
}).strict();

export async function POST(
  request: Request,
  context: { params: Promise<{ threadId: string }> },
) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const { threadId } = paramsSchema.parse(await context.params);
    const payload = bodySchema.parse(await request.json());
    const result = await applyEncounterWorldAction({
      viewerId: profile.id,
      threadId,
      action: payload.action,
    });

    return jsonOk({ result });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "事件互动失败。", 400);
  }
}
