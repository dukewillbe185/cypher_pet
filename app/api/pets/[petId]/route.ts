import { getViewerContext } from "@/lib/auth";
import { trackServerEvent } from "@/lib/analytics";
import { deletePetByOwner } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const { petId } = await context.params;
    const result = await deletePetByOwner({ viewerId: profile.id, petId });

    await trackServerEvent({
      event: "pet_deleted",
      distinctId: profile.id,
      properties: { petId },
    });

    return jsonOk(result);
  } catch (error) {
    captureException(error, { route: "delete-pet" });
    return jsonError(error instanceof Error ? error.message : "删除失败。", 400);
  }
}
