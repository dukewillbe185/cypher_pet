import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { trackServerEvent } from "@/lib/analytics";
import { getPetById, createSourcePhoto } from "@/lib/repository";
import { captureException } from "@/lib/sentry";
import { validateSourcePhoto } from "@/lib/domain/pets";
import { jsonError, jsonOk } from "@/lib/utils";

const paramsSchema = z.object({
  petId: z.string(),
});

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const paletteSchema = z.object({
  fur: hexColor,
  stripe: hexColor,
  inner: hexColor,
  accent: hexColor,
});

function parsePalette(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) {
    return undefined;
  }

  try {
    return paletteSchema.parse(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

export const runtime = "nodejs";

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
    const pet = await getPetById(petId);

    if (!pet || pet.ownerId !== profile.id) {
      return jsonError("没有权限为这只宠物上传照片。", 403);
    }

    const formData = await request.formData();
    const file = formData.get("photo");

    if (!(file instanceof File)) {
      return jsonError("缺少照片文件。", 400);
    }

    const validation = validateSourcePhoto({
      size: file.size,
      type: file.type,
    });

    if (!validation.ok) {
      return jsonError(validation.error, 400);
    }

    const extension = path.extname(file.name) || ".png";
    const filename = `${randomUUID()}${extension}`;
    const targetPath = path.join(process.cwd(), "storage", "source", filename);

    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));

    const sourcePhoto = await createSourcePhoto({
      petId,
      storagePath: targetPath,
      mimeType: file.type,
      sizeBytes: file.size,
      originalFilename: file.name,
      palette: parsePalette(formData.get("palette")),
    });

    await trackServerEvent({
      event: "source_photo_uploaded",
      distinctId: profile.id,
      properties: { petId, sourcePhotoId: sourcePhoto.id },
    });

    return jsonOk({ sourcePhoto }, { status: 201 });
  } catch (error) {
    captureException(error, { route: "upload-source-photo" });
    return jsonError(error instanceof Error ? error.message : "上传失败。", 400);
  }
}
