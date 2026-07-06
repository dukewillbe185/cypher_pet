import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { setPetHome } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const bodySchema = z.object({
  zoneId: z.string().min(1).max(64).nullable(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const { petId } = await context.params;
    const payload = bodySchema.parse(await request.json());
    const pet = await setPetHome({
      viewerId: profile.id,
      petId,
      zoneId: payload.zoneId,
    });

    return jsonOk({ pet });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "安排失败。", 400);
  }
}
