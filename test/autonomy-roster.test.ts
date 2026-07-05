import { describe, expect, it } from "vitest";

import { buildAutonomyRosterItems } from "@/components/garden/autonomy-roster";
import type { GardenPetSnapshot, PetActivity, PetGoal, PetMood } from "@/lib/types";

const now = "2026-06-28T00:00:00.000Z";

function petSnapshot(
  id: string,
  name: string,
  overrides: Partial<GardenPetSnapshot> = {},
): GardenPetSnapshot {
  const state = {
    petId: id,
    zoneId: "orchard" as const,
    tileX: 12,
    tileY: 16,
    facing: "down" as const,
    mood: "curious" as PetMood,
    activity: "look_around" as PetActivity,
    energy: 78,
    hunger: 24,
    hygiene: 88,
    bladder: 18,
    social: 60,
    stress: 18,
    actionEndsAt: now,
    lastSimulatedAt: now,
  };

  return {
    pet: {
      id,
      ownerId: "owner-1",
      name,
      species: "cat",
      visibility: "public",
      activeGenerationId: `gen-${id}`,
      isFrozen: false,
      createdAt: now,
    },
    generation: {
      id: `gen-${id}`,
      petId: id,
      sourcePhotoId: "photo-1",
      providerJobId: "job-1",
      status: "succeeded",
      promptSeed: "seed",
      worldSpritePath: "/generated/pet.svg",
      appearanceSeed: "appearance",
      paletteName: "lime",
      attempts: 1,
      createdAt: now,
      updatedAt: now,
    },
    state,
    owner: {
      id: "owner-1",
      email: "owner@example.com",
      handle: "owner",
      displayName: "Owner",
      bio: "",
      role: "user",
      createdAt: now,
    },
    personality: {
      archetype: "tree poet",
      summary: "Alert and nosy.",
      curiosity: 88,
      sociability: 50,
      boldness: 48,
      treeAffinity: 80,
      zoomies: 45,
      napBias: 35,
    },
    bonds: [],
    memories: [],
    currentGoals: [],
    relationshipModels: [],
    ledgerFacts: [],
    ...overrides,
    state: {
      ...state,
      ...overrides.state,
    },
  };
}

function goal(overrides: Partial<PetGoal>): PetGoal {
  return {
    id: "goal-1",
    petId: "pet-miso",
    goalType: "explore_zone",
    priority: 60,
    status: "active",
    progress: 20,
    reason: "Miso wants to inspect the pond path.",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("autonomy roster", () => {
  it("orders pets by visible pressure before quiet ambient intent", () => {
    const urgent = petSnapshot("pet-miso", "Miso", {
      state: {
        petId: "pet-miso",
        zoneId: "orchard",
        tileX: 12,
        tileY: 16,
        facing: "down",
        mood: "dirty",
        activity: "eat",
        energy: 24,
        hunger: 92,
        hygiene: 30,
        bladder: 84,
        social: 24,
        stress: 76,
        actionEndsAt: now,
        lastSimulatedAt: now,
      },
    });
    const quiet = petSnapshot("pet-nyx", "Nyx");

    const items = buildAutonomyRosterItems([quiet, urgent]);

    expect(items.map((item) => item.petId)).toEqual(["pet-miso", "pet-nyx"]);
    expect(items[0]).toMatchObject({
      urgencyLabel: "needs intervention",
      tone: "care",
    });
  });

  it("surfaces target pets and cross-zone goals as route text", () => {
    const patch = petSnapshot("pet-patch", "Patch");
    const miso = petSnapshot("pet-miso", "Miso", {
      currentGoals: [
        goal({
          goalType: "move_to_zone",
          targetZoneId: "pond",
          priority: 88,
          reason: "Miso wants to check the pond.",
        }),
      ],
      state: {
        ...petSnapshot("pet-miso", "Miso").state,
        activity: "approach_pet",
        lastAutonomyDecision: {
          goal: "seek_friend",
          chosenActivity: "approach_pet",
          source: "llm",
          reason: "Miso wants to close the distance with Patch.",
          targetPetId: "pet-patch",
          decidedAt: now,
          candidates: [],
        },
      },
    });

    const [item] = buildAutonomyRosterItems([miso, patch]);

    expect(item).toMatchObject({
      petId: "pet-miso",
      goalLabel: "seeking a friend",
      source: "llm",
      targetLabel: "toward Patch",
      routeLabel: "route to pond",
    });
  });
});
