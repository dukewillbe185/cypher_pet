import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { supportsSpecies } from "@/lib/domain/pets";
import { trackServerEvent } from "@/lib/analytics";
import { createPet } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1).max(40),
  species: z.string(),
  breed: z.string().max(40).optional(),
  bio: z.string().max(240).optional(),
  visibility: z.enum(["public", "private"]).default("public"),
});

export async function POST(request: Request) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const payload = schema.parse(await request.json());

    if (!supportsSpecies(payload.species)) {
      return jsonError("第一版仅支持猫和狗。", 400);
    }

    const pet = await createPet({
      viewerId: profile.id,
      name: payload.name,
      species: payload.species,
      breed: payload.breed,
      bio: payload.bio,
      visibility: payload.visibility,
    });

    await trackServerEvent({
      event: "pet_created",
      distinctId: profile.id,
      properties: { petId: pet.id, species: pet.species },
    });

    return jsonOk({ pet }, { status: 201 });
  } catch (error) {
    captureException(error, { route: "create-pet" });
    return jsonError(error instanceof Error ? error.message : "创建宠物失败。", 400);
  }
}
