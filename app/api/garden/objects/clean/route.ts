import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { cleanGardenPoop } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const bodySchema = z.object({
  objectId: z.string().min(1),
});

export async function POST(request: Request) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const payload = bodySchema.parse(await request.json());
    const result = await cleanGardenPoop({
      viewerId: profile.id,
      objectId: payload.objectId,
    });

    return jsonOk(result);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "清理失败。", 400);
  }
}
