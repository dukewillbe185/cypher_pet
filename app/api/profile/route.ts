import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { updateProfile } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const schema = z.object({
  handle: z.string().min(3).max(24),
  displayName: z.string().min(2).max(40),
  bio: z.string().min(0).max(240),
});

export async function PATCH(request: Request) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const payload = schema.parse(await request.json());
    const updated = await updateProfile(profile.id, payload);
    return jsonOk({ profile: updated });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "更新失败。", 400);
  }
}
