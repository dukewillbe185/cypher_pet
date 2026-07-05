import { z } from "zod";

import { getImageGenerationProvider } from "@/lib/ai/provider";
import { env } from "@/lib/env";
import { trackServerEvent } from "@/lib/analytics";
import { updateGenerationByProviderJob } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

const schema = z.object({
  providerJobId: z.string().optional(),
  status: z.enum(["queued", "processing", "succeeded", "failed"]).optional(),
  worldSpritePath: z.string().optional(),
  error: z.string().optional(),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-cypher-webhook-secret");

  if (secret !== env.imageProviderWebhookSecret) {
    return jsonError("invalid-webhook-secret", 401);
  }

  try {
    const provider = getImageGenerationProvider();
    const rawPayload = schema.parse(await request.json());
    const parsed = await provider.parseWebhook(rawPayload);
    const generation = await updateGenerationByProviderJob({
      providerJobId: parsed.providerJobId,
      status: parsed.status,
      worldSpritePath: parsed.worldSpritePath,
      error: parsed.error,
    });

    if (parsed.status === "succeeded") {
      await trackServerEvent({
        event: "generation_succeeded",
        distinctId: generation.petId,
        properties: { generationId: generation.id, petId: generation.petId },
      });
    }

    return jsonOk({ generation });
  } catch (error) {
    captureException(error, { route: "generation-webhook" });
    return jsonError(error instanceof Error ? error.message : "webhook 处理失败。", 400);
  }
}
