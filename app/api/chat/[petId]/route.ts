import { z } from "zod";

import { assertSafePetChatMessage, normalizePetChatMessage } from "@/lib/ai/content-safety";
import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { getChatSessionForUser, getPetById, sendChatToPet } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

const bodySchema = z.object({
  message: z.string().trim().min(1).max(280),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  try {
    const { profile } = await getViewerContext();

    if (!profile) {
      return jsonError("请先登录。", 401);
    }

    const { petId } = paramsSchema.parse(await context.params);
    const pet = await getPetById(petId);

    if (!pet) {
      return jsonError("找不到这只宠物。", 404);
    }

    if (!canViewPet(pet, profile.id, profile.role)) {
      return jsonError("你现在不能和这只宠物说话。", 403);
    }

    const session = await getChatSessionForUser({
      petId,
      userId: profile.id,
    });

    return jsonOk({ session });
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 500;
    return jsonError(error instanceof Error ? error.message : "聊天记录加载失败。", status);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  try {
    const { profile } = await getViewerContext();

    if (!profile) {
      return jsonError("请先登录。", 401);
    }

    const { petId } = paramsSchema.parse(await context.params);
    const { message } = bodySchema.parse(await request.json());
    const normalizedMessage = normalizePetChatMessage(message);
    assertSafePetChatMessage(normalizedMessage);
    const pet = await getPetById(petId);

    if (!pet) {
      return jsonError("找不到这只宠物。", 404);
    }

    if (!canViewPet(pet, profile.id, profile.role)) {
      return jsonError("你现在不能和这只宠物说话。", 403);
    }

    const result = await sendChatToPet({
      petId,
      userId: profile.id,
      message: normalizedMessage,
    });

    return jsonOk(result);
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 500;
    return jsonError(error instanceof Error ? error.message : "对话失败。", status);
  }
}
