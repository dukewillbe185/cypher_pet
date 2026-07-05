import type {
  GardenEncounter,
  GardenEncounterWorldAction,
  GardenPetSnapshot,
  Profile,
} from "@/lib/types";

export function findEncounterActorPet(
  encounter: GardenEncounter,
  pets: GardenPetSnapshot[],
  viewer: Profile | null,
) {
  if (!viewer) {
    return null;
  }

  const participantIds = new Set(encounter.participantPetIds);
  return pets.find(
    (entry) =>
      entry.pet.ownerId === viewer.id &&
      entry.state.zoneId === encounter.zoneId &&
      !participantIds.has(entry.pet.id),
  ) ?? null;
}

export function getEncounterWorldActionDisabledReason(input: {
  action: GardenEncounterWorldAction;
  encounter: GardenEncounter;
  pets: GardenPetSnapshot[];
  viewer: Profile | null;
}) {
  if (!input.viewer) {
    return "Enter Garden to record world actions.";
  }

  if (!input.encounter.threadId) {
    return "This encounter is not stable yet.";
  }

  if (input.action === "approach" && !findEncounterActorPet(input.encounter, input.pets, input.viewer)) {
    return "Bring one of your pets into this zone to approach.";
  }

  return null;
}
