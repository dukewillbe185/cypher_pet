import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { getGardenSnapshot } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const schema = z.object({
  zoneId: z.enum(["orchard", "pond", "grove", "dog-run"]).default("orchard"),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { zoneId } = schema.parse({
      zoneId: url.searchParams.get("zoneId") ?? "orchard",
    });
    const { profile } = await getViewerContext();
    const snapshot = await getGardenSnapshot({
      zoneId,
      viewerId: profile?.id,
      llmMode: "off",
    });

    return jsonOk({ snapshot });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "花园同步失败。", 400);
  }
}
