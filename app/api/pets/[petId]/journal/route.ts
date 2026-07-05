import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { getPetDetails, listPetJournal } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  const { petId } = paramsSchema.parse(await context.params);
  const { profile } = await getViewerContext();
  const details = await getPetDetails(petId);

  if (!details) {
    return jsonError("找不到这只宠物。", 404);
  }

  if (!canViewPet(details.pet, profile?.id, profile?.role ?? "user")) {
    return jsonError("没有权限查看这只宠物的日志。", 403);
  }

  const events = await listPetJournal(petId);
  return jsonOk({ events });
}
