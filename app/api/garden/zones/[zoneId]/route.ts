import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { updateGardenZone } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const patchSchema = z
  .object({
    name: z.string().min(1).max(16).optional(),
    visibility: z.enum(["public", "private"]).optional(),
  })
  .refine((value) => value.name !== undefined || value.visibility !== undefined, {
    message: "nothing-to-update",
  });

export async function PATCH(
  request: Request,
  context: { params: Promise<{ zoneId: string }> },
) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const { zoneId } = await context.params;
    const payload = patchSchema.parse(await request.json());
    const zone = await updateGardenZone({
      viewerId: profile.id,
      zoneId,
      name: payload.name,
      visibility: payload.visibility,
    });

    return jsonOk({ zone });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "更新区域失败。", 400);
  }
}
