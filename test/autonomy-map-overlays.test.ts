import { describe, expect, it } from "vitest";

import { buildAutonomyMapOverlays } from "@/components/garden/autonomy-map-overlays";
import type { GardenPetSnapshot, GardenSnapshot, PetGoal } from "@/lib/types";

const now = "2026-06-28T00:00:00.000Z";

function petSnapshot(
  id: string,
  name: string,
  tileX: number,
  tileY: number,
  overrides: Partial<GardenPetSnapshot> = {},
): GardenPetSnapshot {
  const state = {
    petId: id,
    zoneId: "orchard" as const,
    tileX,
    tileY,
    facing: "down" as const,
    mood: "curious" as const,
    activity: "look_around" as const,
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
    priority: 80,
    status: "active",
    progress: 20,
    reason: "Miso wants a new route.",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function snapshot(overrides: Partial<GardenSnapshot>): GardenSnapshot {
  return {
    zone: {
      id: "orchard",
      name: "果树区",
      description: "Trees and paths.",
      accent: "#bef264",
      speciesBias: "all",
    },
    serverTime: now,
    world: {
      clockLabel: "12:00",
      phase: "day",
      cycleProgress: 0.5,
      minuteOfDay: 720,
      isNight: false,
      skyTop: "#83D8FF",
      skyBottom: "#C5F08F",
      ambientGlow: "rgba(255,255,255,0.08)",
      overlayAlpha: 0,
      neonAlpha: 0.08,
      ambienceLabel: "Day garden.",
    },
    pets: [],
    objects: [],
    environmentActors: [],
    recentEvents: [],
    encounters: [],
    encounterMarkers: [],
    ...overrides,
  };
}

describe("autonomy map overlays", () => {
  it("builds a visible route from an actor pet to its autonomy target pet", () => {
    const target = petSnapshot("pet-patch", "Patch", 22, 28);
    const actor = petSnapshot("pet-miso", "Miso", 8, 11, {
      state: {
        ...petSnapshot("pet-miso", "Miso", 8, 11).state,
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

    expect(buildAutonomyMapOverlays(snapshot({ pets: [actor, target] }))).toEqual([
      expect.objectContaining({
        id: "intent-route:pet-miso:pet-patch",
        actorPetId: "pet-miso",
        targetPetId: "pet-patch",
        targetKind: "pet",
        targetLabel: "Patch",
        routeLabel: "approaching Patch",
        tone: "social",
        start: { tileX: 8, tileY: 11 },
        target: { tileX: 22, tileY: 28 },
      }),
    ]);
  });

  it("builds a cross-zone route when a pet has a goal outside the active zone", () => {
    const actor = petSnapshot("pet-miso", "Miso", 10, 14, {
      currentGoals: [
        goal({
          goalType: "move_to_zone",
          targetZoneId: "pond",
          priority: 92,
          reason: "Miso wants to check the pond.",
        }),
      ],
    });

    const [overlay] = buildAutonomyMapOverlays(snapshot({ pets: [actor] }));

    expect(overlay).toMatchObject({
      id: "intent-route:pet-miso:zone-pond",
      actorPetId: "pet-miso",
      targetKind: "zone",
      targetZoneId: "pond",
      targetLabel: "pond",
      routeLabel: "route to pond",
      tone: "explore",
      start: { tileX: 10, tileY: 14 },
      target: { tileX: 43, tileY: 24 },
    });
  });

  it("projects an ambient route for autonomy decisions without an explicit target", () => {
    const actor = petSnapshot("pet-miso", "Miso", 10, 14, {
      state: {
        ...petSnapshot("pet-miso", "Miso", 10, 14).state,
        activity: "wander",
        lastAutonomyDecision: {
          goal: "explore",
          chosenActivity: "wander",
          source: "fallback",
          reason: "Miso wants to sweep the orchard path before choosing a spot.",
          decidedAt: now,
          candidates: [],
        },
      },
    });

    const [overlay] = buildAutonomyMapOverlays(snapshot({ pets: [actor] }));

    expect(overlay).toMatchObject({
      id: "intent-route:pet-miso:ambient",
      actorPetId: "pet-miso",
      targetKind: "tile",
      targetLabel: "next tile",
      routeLabel: "wandering route",
      tone: "explore",
      start: { tileX: 10, tileY: 14 },
      target: { tileX: 16, tileY: 17 },
    });
  });

  it("uses the current conflict activity over stale autonomy decisions", () => {
    const actor = petSnapshot("pet-nyx", "Nyx", 31, 31, {
      state: {
        ...petSnapshot("pet-nyx", "Nyx", 31, 31).state,
        activity: "scuffle",
        lastAutonomyDecision: {
          goal: "guard_spot",
          chosenActivity: "climb_tree",
          source: "fallback",
          reason: "Nyx had wanted to climb before the owner redirected it.",
          decidedAt: now,
          candidates: [],
        },
      },
    });

    const [overlay] = buildAutonomyMapOverlays(snapshot({ pets: [actor] }), "pet-nyx");

    expect(overlay).toMatchObject({
      actorPetId: "pet-nyx",
      targetKind: "tile",
      routeLabel: "scuffling route",
      tone: "conflict",
    });
  });
});
