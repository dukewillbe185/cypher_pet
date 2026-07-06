import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { getGardenLedger } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const querySchema = z.object({
  zoneId: z.string().min(1).max(64).optional(),
  participantId: z.string().optional(),
});

export async function GET(request: Request) {
  const { profile } = await getViewerContext();
  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  const url = new URL(request.url);
  const parsed = querySchema.parse({
    zoneId: url.searchParams.get("zoneId") ?? undefined,
    participantId: url.searchParams.get("participantId") ?? undefined,
  });

  const payload = await getGardenLedger({ ...parsed, viewerId: profile.id });
  return jsonOk(payload);
}

