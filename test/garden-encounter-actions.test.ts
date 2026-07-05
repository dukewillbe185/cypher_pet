import { describe, expect, it } from "vitest";

import { findEncounterInterventionTarget } from "@/components/garden/garden-encounter-actions";
import type { GardenEncounter, GardenPetSnapshot } from "@/lib/types";

const encounter: GardenEncounter = {
  id: "encounter-1",
  kind: "conflict",
  tone: "conflict",
  stage: "unfolding",
  zoneId: "orchard",
  title: "Patch and Ember are tense",
  summary: "Patch and Ember squared off near the old tree.",
  participantPetIds: ["pet-patch", "pet-ember"],
  relatedEventIds: ["event-1"],
  suggestedOwnerActions: ["call", "pet", "scold"],
  updatedAt: "2026-06-28T10:00:00.000Z",
};

const pets = [
  {
    pet: { id: "pet-patch", ownerId: "owner-1", name: "Patch" },
  },
  {
    pet: { id: "pet-ember", ownerId: "owner-2", name: "Ember" },
  },
] as GardenPetSnapshot[];

describe("garden encounter actions", () => {
  it("targets the first participant owned by the viewer", () => {
    expect(findEncounterInterventionTarget(encounter, pets, "owner-2")).toEqual({
      petId: "pet-ember",
      petName: "Ember",
      actions: ["call", "pet", "scold"],
    });
  });

  it("returns null when the viewer does not own any participant", () => {
    expect(findEncounterInterventionTarget(encounter, pets, "owner-3")).toBeNull();
  });

  it("does not offer intervention buttons while the thread is resolving", () => {
    expect(
      findEncounterInterventionTarget(
        {
          ...encounter,
          status: "resolving",
        },
        pets,
        "owner-2",
      ),
    ).toBeNull();
  });
});
