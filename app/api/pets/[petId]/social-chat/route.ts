import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { generatePetSocialChatPreview, getPetById } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

const bodySchema = z.object({
  otherPetId: z.string().optional(),
  interaction: z.enum(["play", "scuffle", "chase", "bond", "first_meet", "reunion"]).optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  const { profile } = await getViewerContext();
  const { petId } = paramsSchema.parse(await context.params);
  const pet = await getPetById(petId);

  if (!pet) {
    return jsonError("找不到这只宠物。", 404);
  }

  if (!canViewPet(pet, profile?.id, profile?.role ?? "user")) {
    return jsonError("没有权限查看这只宠物的社交对话。", 403);
  }

  try {
    const payload = bodySchema.parse(await request.json());
    const exchange = await generatePetSocialChatPreview({
      petId,
      otherPetId: payload.otherPetId,
      interaction: payload.interaction,
    });

    return jsonOk({ exchange });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "生成社交对话失败。", 400);
  }
}
