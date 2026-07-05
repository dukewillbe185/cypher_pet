import { randomUUID } from "node:crypto";
import { z } from "zod";

import { getImageGenerationProvider } from "@/lib/ai/provider";
import { trackServerEvent } from "@/lib/analytics";
import { getViewerContext } from "@/lib/auth";
import {
  countGenerationsForPet,
  createGeneration,
  getPetById,
  getLatestSourcePhotoForPet,
  getSourcePhotoById,
} from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

const bodySchema = z.object({
  sourcePhotoId: z.string().optional(),
});

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const { petId } = paramsSchema.parse(await context.params);
    const payload = bodySchema.parse(await request.json());
    const pet = await getPetById(petId);

    if (!pet || pet.ownerId !== profile.id) {
      return jsonError("没有权限为这只宠物生成图像。", 403);
    }

    const totalGenerations = await countGenerationsForPet(petId);

    if (totalGenerations >= 2) {
      return jsonError("第一版每只宠物最多生成 2 次。", 400);
    }

    const sourcePhoto = payload.sourcePhotoId
      ? await getSourcePhotoById(payload.sourcePhotoId)
      : await getLatestSourcePhotoForPet(petId);

    if (!sourcePhoto || sourcePhoto.petId !== petId) {
      return jsonError("找不到可用的原始照片。", 400);
    }

    const provider = getImageGenerationProvider();
    const promptSeed = `${pet.species}-${randomUUID().slice(0, 8)}`;
    const providerJob = await provider.createJob({
      imagePath: sourcePhoto.storagePath,
      species: pet.species,
      promptSeed,
    });

    const generation = await createGeneration({
      petId,
      sourcePhotoId: sourcePhoto.id,
      providerJobId: providerJob.providerJobId,
      promptSeed,
      worldSpritePath: providerJob.worldSpritePath,
      appearanceSeed: providerJob.appearanceSeed,
      paletteName: providerJob.paletteName,
      status: providerJob.worldSpritePath ? "succeeded" : "queued",
    });

    await trackServerEvent({
      event: "generation_started",
      distinctId: profile.id,
      properties: { petId, generationId: generation.id },
    });

    if (providerJob.worldSpritePath) {
      await trackServerEvent({
        event: "generation_succeeded",
        distinctId: profile.id,
        properties: { petId, generationId: generation.id },
      });
    }

    return jsonOk({ generation }, { status: 201 });
  } catch (error) {
    captureException(error, { route: "create-generation" });
    return jsonError(error instanceof Error ? error.message : "生成失败。", 400);
  }
}
