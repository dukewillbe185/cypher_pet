import { z } from "zod";

import { trackServerEvent } from "@/lib/analytics";
import { getViewerContext } from "@/lib/auth";
import { applyOwnerAction, commandPetByOwner } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

const actionSchema = z.object({
  action: z.enum(["feed", "pet", "throw_toy", "clean_poop", "call", "scold", "gift", "photo", "rename_spot"]),
  encounterThreadId: z.string().optional(),
}).strict();

const commandSchema = z.object({
  command: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("move_to_tile"),
      zoneId: z.string().min(1).max(64),
      tileX: z.number().int(),
      tileY: z.number().int(),
    }),
    z.object({
      type: z.literal("move_to_object"),
      objectId: z.string(),
    }),
    z.object({
      type: z.literal("move_to_pet"),
      targetPetId: z.string(),
    }),
    z.object({
      type: z.literal("chase_pet"),
      targetPetId: z.string(),
    }),
    z.object({
      type: z.literal("scuffle_pet"),
      targetPetId: z.string(),
    }),
  ]),
}).strict();

const bodySchema = z.union([actionSchema, commandSchema]);

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
    const result =
      "action" in payload
        ? await applyOwnerAction({
            viewerId: profile.id,
            petId,
            action: payload.action,
            encounterThreadId: payload.encounterThreadId,
          })
        : await commandPetByOwner({
            viewerId: profile.id,
            petId,
            command: payload.command,
          });

    await trackServerEvent({
      event: "owner_action_triggered",
      distinctId: profile.id,
      properties:
        "action" in payload
          ? { petId, action: payload.action }
          : { petId, command: payload.command.type },
    });

    return jsonOk(result);
  } catch (error) {
    captureException(error, { route: "pet-owner-action" });
    return jsonError(error instanceof Error ? error.message : "动作执行失败。", 400);
  }
}
