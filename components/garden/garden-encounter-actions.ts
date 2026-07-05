import type { GardenEncounter, GardenPetSnapshot } from "@/lib/types";

export function findEncounterInterventionTarget(
  encounter: GardenEncounter,
  pets: GardenPetSnapshot[],
  viewerId?: string,
) {
  if (!viewerId || encounter.suggestedOwnerActions.length === 0) {
    return null;
  }

  if (encounter.status && encounter.status !== "active") {
    return null;
  }

  const participantIds = new Set(encounter.participantPetIds);
  const pet = pets.find(
    (entry) => participantIds.has(entry.pet.id) && entry.pet.ownerId === viewerId,
  );

  if (!pet) {
    return null;
  }

  return {
    petId: pet.pet.id,
    petName: pet.pet.name,
    actions: encounter.suggestedOwnerActions,
  };
}
