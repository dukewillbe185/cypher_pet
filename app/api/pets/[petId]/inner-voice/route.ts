import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { getPetById, generatePetInnerVoicePreview } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  const { profile } = await getViewerContext();
  const { petId } = paramsSchema.parse(await context.params);
  const pet = await getPetById(petId);

  if (!pet) {
    return jsonError("找不到这只宠物。", 404);
  }

  if (!canViewPet(pet, profile?.id, profile?.role ?? "user")) {
    return jsonError("没有权限查看这只宠物的内心独白。", 403);
  }

  const preview = await generatePetInnerVoicePreview({ petId });
  return jsonOk(preview);
}
