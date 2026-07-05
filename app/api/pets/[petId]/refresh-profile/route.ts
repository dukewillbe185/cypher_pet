import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { getPetById, refreshPetProfile } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

export async function POST(
  _request: Request,
  context: { params: Promise<{ petId: string }> },
) {
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
    return jsonError("你现在不能刷新这只宠物的人格档案。", 403);
  }

  const payload = await refreshPetProfile({ petId });
  return jsonOk(payload);
}

