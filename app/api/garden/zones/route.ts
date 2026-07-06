import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { createGardenZone, listGardenZones } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

const elementSchema = z.enum([
  "tree",
  "bush",
  "stone",
  "pond",
  "fountain",
  "lamp",
  "doghouse",
  "pet_bed",
  "rest_spot",
  "toy",
]);

const createSchema = z.object({
  name: z.string().min(1).max(16),
  visibility: z.enum(["public", "private"]),
  elements: z.array(elementSchema).min(1).max(10),
  petIds: z.array(z.string()).max(24).default([]),
});

export async function GET() {
  const { profile } = await getViewerContext();
  const zones = await listGardenZones(profile?.id);
  return jsonOk({ zones });
}

export async function POST(request: Request) {
  const { profile } = await getViewerContext();

  if (!profile) {
    return jsonError("请先登录。", 401);
  }

  try {
    const payload = createSchema.parse(await request.json());
    const result = await createGardenZone({
      viewerId: profile.id,
      name: payload.name,
      visibility: payload.visibility,
      elements: payload.elements,
      petIds: payload.petIds,
    });

    return jsonOk(result, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "开辟区域失败。", 400);
  }
}
