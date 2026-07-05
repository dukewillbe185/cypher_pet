import { describe, expect, it } from "vitest";

import { buildAutonomyRouteAction } from "@/components/garden/autonomy-route-actions";
import type { AutonomyMapOverlay } from "@/components/garden/autonomy-map-overlays";
import type { GardenPetSnapshot, Profile } from "@/lib/types";

const now = "2026-06-28T00:00:00.000Z";

const viewer: Profile = {
  id: "profile-luna",
  email: "luna@example.com",
  handle: "luna",
  displayName: "Luna",
  bio: "",
  role: "user",
  createdAt: now,
};

function petSnapshot(id: string, name: string, ownerId: string): GardenPetSnapshot {
  return {
    pet: {
      id,
      ownerId,
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
    state: {
      petId: id,
      zoneId: "orchard",
      tileX: 10,
      tileY: 12,
      facing: "down",
      mood: "curious",
      activity: "look_around",
      energy: 78,
      hunger: 24,
      hygiene: 88,
      bladder: 18,
      social: 60,
      stress: 18,
      actionEndsAt: now,
      lastSimulatedAt: now,
    },
    owner: {
      id: ownerId,
      email: `${ownerId}@example.com`,
      handle: ownerId,
      displayName: ownerId,
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
  };
}

function overlay(overrides: Partial<AutonomyMapOverlay> = {}): AutonomyMapOverlay {
  return {
    id: "intent-route:pet-nyx:pet-patch",
    actorPetId: "pet-nyx",
    actorName: "Nyx",
    zoneId: "orchard",
    targetKind: "pet",
    targetLabel: "Patch",
    routeLabel: "approaching Patch",
    reason: "Nyx wants to close the distance.",
    tone: "social",
    priority: 88,
    start: { tileX: 10, tileY: 12 },
    target: { tileX: 18, tileY: 16 },
    targetPetId: "pet-patch",
    ...overrides,
  };
}

describe("autonomy route actions", () => {
  it("guides the actor pet when the viewer owns the route actor", () => {
    const actor = petSnapshot("pet-nyx", "Nyx", "profile-luna");
    const patch = petSnapshot("pet-patch", "Patch", "profile-mars");

    expect(buildAutonomyRouteAction(overlay(), [actor, patch], viewer)).toMatchObject({
      actorPetId: "pet-nyx",
      label: "Guide Nyx to Patch",
      disabledReason: null,
      command: {
        type: "move_to_pet",
        targetPetId: "pet-patch",
      },
    });
  });

  it("uses a viewer pet in the same zone to approach another pet route", () => {
    const actor = petSnapshot("pet-biscuit", "Biscuit", "profile-mars");
    const viewerPet = petSnapshot("pet-nyx", "Nyx", "profile-luna");

    expect(buildAutonomyRouteAction(overlay({ actorPetId: "pet-biscuit", actorName: "Biscuit" }), [actor, viewerPet], viewer)).toMatchObject({
      actorPetId: "pet-nyx",
      label: "Approach with Nyx",
      disabledReason: null,
      command: {
        type: "move_to_pet",
        targetPetId: "pet-biscuit",
      },
    });
  });

  it("keeps public visitors read-only", () => {
    const actor = petSnapshot("pet-biscuit", "Biscuit", "profile-mars");

    expect(buildAutonomyRouteAction(overlay({ actorPetId: "pet-biscuit", actorName: "Biscuit" }), [actor], null)).toMatchObject({
      actorPetId: null,
      command: null,
      disabledReason: "Enter Garden to act on this route.",
    });
  });
});
