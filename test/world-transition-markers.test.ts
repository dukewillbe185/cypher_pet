import { describe, expect, it } from "vitest";

import { buildWorldTransitionMarkers } from "@/components/garden/world-transition-markers";
import type { GardenPetSnapshot, GardenSnapshot, PetEvent } from "@/lib/types";

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
    zoneId: "pond" as const,
    tileX,
    tileY,
    facing: "down" as const,
    mood: "curious" as const,
    activity: "move_to_zone" as const,
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
      archetype: "pond dreamer",
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

function zoneMoveEvent(overrides: Partial<PetEvent>): PetEvent {
  return {
    id: "event-miso-arrival",
    petId: "pet-miso",
    zoneId: "pond",
    type: "zone_move",
    body: "Miso slipped from 果树区 into 水池区.",
    createdAt: now,
    ...overrides,
  };
}

function snapshot(overrides: Partial<GardenSnapshot>): GardenSnapshot {
  return {
    zone: {
      id: "pond",
      name: "水池区",
      description: "Water and reeds.",
      accent: "#67e8f9",
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

describe("world transition markers", () => {
  it("builds a visible arrival marker for a zone move in the active zone", () => {
    const markerSnapshot = snapshot({
      pets: [petSnapshot("pet-miso", "Miso", 14, 18)],
      recentEvents: [zoneMoveEvent({})],
    });

    expect(buildWorldTransitionMarkers(markerSnapshot)).toEqual([
      expect.objectContaining({
        id: "transition:event-miso-arrival",
        eventId: "event-miso-arrival",
        petId: "pet-miso",
        petName: "Miso",
        zoneId: "pond",
        tileX: 14,
        tileY: 18,
        title: "Miso 到达水池区",
      }),
    ]);
  });

  it("keeps only the newest arrival marker for each pet", () => {
    const markerSnapshot = snapshot({
      pets: [petSnapshot("pet-miso", "Miso", 14, 18)],
      recentEvents: [
        zoneMoveEvent({
          id: "event-miso-latest",
          body: "Miso returned to 水池区 by the fountain.",
          createdAt: "2026-06-28T00:05:00.000Z",
        }),
        zoneMoveEvent({
          id: "event-miso-older",
          body: "Miso first crossed into 水池区.",
          createdAt: "2026-06-28T00:01:00.000Z",
        }),
      ],
    });

    expect(buildWorldTransitionMarkers(markerSnapshot).map((marker) => marker.eventId)).toEqual([
      "event-miso-latest",
    ]);
  });

  it("assigns distinct label offsets when multiple arrivals share a tile", () => {
    const markerSnapshot = snapshot({
      pets: [
        petSnapshot("pet-miso", "Miso", 18, 20),
        petSnapshot("pet-patch", "Patch", 18, 20),
      ],
      recentEvents: [
        zoneMoveEvent({
          id: "event-miso-arrival",
          petId: "pet-miso",
          createdAt: "2026-06-28T00:05:00.000Z",
        }),
        zoneMoveEvent({
          id: "event-patch-arrival",
          petId: "pet-patch",
          createdAt: "2026-06-28T00:04:00.000Z",
        }),
      ],
    });

    const markerOffsets = buildWorldTransitionMarkers(markerSnapshot).map((marker) => ({
      offsetX: marker.offsetX,
      offsetY: marker.offsetY,
    }));

    expect(new Set(markerOffsets.map((offset) => `${offset.offsetX}:${offset.offsetY}`)).size).toBe(2);
    expect(markerOffsets).toEqual([
      expect.objectContaining({ offsetX: expect.any(Number), offsetY: expect.any(Number) }),
      expect.objectContaining({ offsetX: expect.any(Number), offsetY: expect.any(Number) }),
    ]);
  });
});
