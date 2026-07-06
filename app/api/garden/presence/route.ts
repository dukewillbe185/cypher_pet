import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { generatePetSpeech, recordGardenPresence } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const bodySchema = z.object({
  zoneId: z.string().min(1).max(64),
  tileX: z.number().int().min(0).max(64),
  tileY: z.number().int().min(0).max(64),
});

export async function POST(request: Request) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const payload = bodySchema.parse(await request.json());
    const result = await recordGardenPresence({
      viewerId: profile.id,
      zoneId: payload.zoneId,
      tileX: payload.tileX,
      tileY: payload.tileY,
    });

    // Speech happens off the request path; the next snapshot poll picks it up.
    void generatePetSpeech({ zoneId: payload.zoneId, viewerId: profile.id });

    return jsonOk(result);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "同步位置失败。", 400);
  }
}
