import { describe, expect, it } from "vitest";

import {
  findEncounterActorPet,
  getEncounterWorldActionDisabledReason,
} from "@/components/garden/encounter-context-actions";
import type { GardenEncounter, GardenPetSnapshot, Profile } from "@/lib/types";

const viewer: Profile = {
  id: "profile-luna",
  email: "luna@example.com",
  handle: "luna",
  displayName: "Luna",
  bio: "",
  role: "user",
  createdAt: "2026-06-28T00:00:00.000Z",
};

const encounter: GardenEncounter = {
  id: "encounter-social-1",
  threadId: "thread:social:orchard:pet-biscuit:pet-moss",
  kind: "social",
  tone: "social",
  stage: "spark",
  status: "active",
  zoneId: "orchard",
  title: "Biscuit and Moss are interacting",
  summary: "Biscuit and Moss are chatting.",
  participantPetIds: ["pet-biscuit", "pet-moss"],
  relatedEventIds: ["event-1"],
  suggestedOwnerActions: ["photo"],
  updatedAt: "2026-06-28T10:00:00.000Z",
};

const pets = [
  {
    pet: { id: "pet-nyx", ownerId: "profile-luna", name: "Nyx" },
    state: { zoneId: "orchard" },
  },
  {
    pet: { id: "pet-biscuit", ownerId: "profile-mars", name: "Biscuit" },
    state: { zoneId: "orchard" },
  },
] as GardenPetSnapshot[];

describe("encounter context actions", () => {
  it("finds the viewer pet that can approach a selected encounter", () => {
    expect(findEncounterActorPet(encounter, pets, viewer)?.pet.name).toBe("Nyx");
  });

  it("explains why approach is unavailable when no viewer pet is in the encounter zone", () => {
    expect(
      getEncounterWorldActionDisabledReason({
        action: "approach",
        encounter,
        pets: [
          {
            pet: { id: "pet-nyx", ownerId: "profile-luna", name: "Nyx" },
            state: { zoneId: "pond" },
          },
        ] as GardenPetSnapshot[],
        viewer,
      }),
    ).toBe("Bring one of your pets into this zone to approach.");
  });

  it("requires a logged-in viewer for world actions", () => {
    expect(
      getEncounterWorldActionDisabledReason({
        action: "observe",
        encounter,
        pets,
        viewer: null,
      }),
    ).toBe("Enter Garden to record world actions.");
  });
});
