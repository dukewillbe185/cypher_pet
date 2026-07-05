import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { narrateExistingEvent } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const bodySchema = z.object({
  eventId: z.string(),
});

export async function POST(request: Request) {
  const { profile } = await getViewerContext();

  try {
    const { eventId } = bodySchema.parse(await request.json());
    const event = await narrateExistingEvent({
      eventId,
      viewerId: profile?.id,
    });

    if (!event) {
      return jsonError("找不到要重述的事件。", 404);
    }

    return jsonOk({ event });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "事件叙事生成失败。", 400);
  }
}
