import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { getGardenLedger } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const querySchema = z.object({
  zoneId: z.enum(["orchard", "pond", "grove", "dog-run"]).optional(),
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

  const payload = await getGardenLedger(parsed);
  return jsonOk(payload);
}

