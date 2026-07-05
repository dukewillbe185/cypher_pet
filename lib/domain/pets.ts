import type { Pet, Role, Species } from "@/lib/types";

export const SUPPORTED_SPECIES: Species[] = ["cat", "dog"];
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const MAX_SOURCE_PHOTO_BYTES = 10 * 1024 * 1024;

export function supportsSpecies(species: string): species is Species {
  return SUPPORTED_SPECIES.includes(species as Species);
}

export function validateSourcePhoto(input: { size: number; type: string }) {
  if (!SUPPORTED_IMAGE_TYPES.includes(input.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    return {
      ok: false as const,
      error: "只支持 JPG、PNG 或 WEBP 格式的照片。",
    };
  }

  if (input.size > MAX_SOURCE_PHOTO_BYTES) {
    return {
      ok: false as const,
      error: "照片不能超过 10MB。",
    };
  }

  return { ok: true as const };
}

export function canViewPet(pet: Pet, viewerId?: string, viewerRole: Role = "user") {
  if (viewerRole === "admin") {
    return true;
  }

  if (pet.isFrozen) {
    return viewerId === pet.ownerId;
  }

  if (pet.visibility === "public") {
    return true;
  }

  return viewerId === pet.ownerId;
}

export function speciesLabel(species: Species) {
  return species === "cat" ? "猫" : "狗";
}
