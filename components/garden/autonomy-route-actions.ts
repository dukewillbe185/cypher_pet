import type { AutonomyMapOverlay } from "@/components/garden/autonomy-map-overlays";
import type { GardenPetSnapshot, OwnerPetCommand, Profile } from "@/lib/types";

export type AutonomyRouteActionState = {
  actorPetId: string | null;
  actorName: string | null;
  label: string;
  command: OwnerPetCommand | null;
  disabledReason: string | null;
};

function findPet(pets: GardenPetSnapshot[], petId?: string) {
  return petId ? pets.find((pet) => pet.pet.id === petId) ?? null : null;
}

function findViewerApproachPet(
  overlay: AutonomyMapOverlay,
  pets: GardenPetSnapshot[],
  viewer: Profile,
) {
  return pets.find((pet) => {
    if (pet.pet.ownerId !== viewer.id || pet.pet.isFrozen) {
      return false;
    }

    return pet.pet.id !== overlay.actorPetId && pet.pet.id !== overlay.targetPetId;
  }) ?? null;
}

function commandForOwnedActor(overlay: AutonomyMapOverlay): OwnerPetCommand | null {
  if (overlay.targetKind === "pet" && overlay.targetPetId) {
    return {
      type: "move_to_pet",
      targetPetId: overlay.targetPetId,
    };
  }

  if (overlay.targetKind === "object" && overlay.targetObjectId) {
    return {
      type: "move_to_object",
      objectId: overlay.targetObjectId,
    };
  }

  return {
    type: "move_to_tile",
    zoneId: overlay.zoneId,
    tileX: overlay.target.tileX,
    tileY: overlay.target.tileY,
  };
}

export function buildAutonomyRouteAction(
  overlay: AutonomyMapOverlay,
  pets: GardenPetSnapshot[],
  viewer: Profile | null,
): AutonomyRouteActionState {
  if (!viewer) {
    return {
      actorPetId: null,
      actorName: null,
      label: "Enter Garden",
      command: null,
      disabledReason: "Enter Garden to act on this route.",
    };
  }

  const actorPet = findPet(pets, overlay.actorPetId);
  if (actorPet?.pet.ownerId === viewer.id) {
    return {
      actorPetId: actorPet.pet.id,
      actorName: actorPet.pet.name,
      label:
        overlay.targetKind === "pet"
          ? `Guide ${actorPet.pet.name} to ${overlay.targetLabel}`
          : `Guide ${actorPet.pet.name}`,
      command: commandForOwnedActor(overlay),
      disabledReason: null,
    };
  }

  const approachPet = findViewerApproachPet(overlay, pets, viewer);
  if (!approachPet) {
    return {
      actorPetId: null,
      actorName: null,
      label: "No pet nearby",
      command: null,
      disabledReason: "Bring one of your pets into this zone to approach this route.",
    };
  }

  return {
    actorPetId: approachPet.pet.id,
    actorName: approachPet.pet.name,
    label: `Approach with ${approachPet.pet.name}`,
    command: {
      type: "move_to_pet",
      targetPetId: overlay.actorPetId,
    },
    disabledReason: null,
  };
}
