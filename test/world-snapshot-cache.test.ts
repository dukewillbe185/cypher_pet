import { describe, expect, it } from "vitest";

import { mergeCurrentZoneSnapshot } from "@/components/garden/world-snapshot-cache";
import type { GardenSnapshot } from "@/lib/types";

const now = "2026-06-29T00:00:00.000Z";

function snapshot(zoneId: GardenSnapshot["zone"]["id"], petCount: number): GardenSnapshot {
  return {
    zone: {
      id: zoneId,
      name: zoneId,
      description: "A garden zone.",
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
    pets: Array.from({ length: petCount }, (_, index) => ({
      pet: {
        id: `${zoneId}-pet-${index}`,
        ownerId: "owner-1",
        name: `Pet ${index}`,
        species: "cat",
        visibility: "public",
        isFrozen: false,
        createdAt: now,
      },
      generation: {
        id: `${zoneId}-gen-${index}`,
        petId: `${zoneId}-pet-${index}`,
        sourcePhotoId: `${zoneId}-photo-${index}`,
        providerJobId: `${zoneId}-job-${index}`,
        status: "succeeded",
        promptSeed: "seed",
        worldSpritePath: `/generated/${zoneId}-${index}.svg`,
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
      state: {
        petId: `${zoneId}-pet-${index}`,
        zoneId,
        tileX: 4,
        tileY: 5,
        facing: "down",
        mood: "curious",
        activity: "look_around",
        energy: 80,
        hunger: 20,
        hygiene: 90,
        bladder: 10,
        social: 60,
        stress: 15,
        lastSimulatedAt: now,
        actionEndsAt: "2026-06-29T00:00:20.000Z",
      },
      personality: {
        archetype: "shadow watcher",
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
    })),
    objects: [],
    environmentActors: [],
    recentEvents: [],
    encounters: [],
    encounterMarkers: [],
  };
}

describe("world snapshot cache", () => {
  it("replaces the matching zone snapshot with the current live snapshot", () => {
    const staleOrchard = snapshot("orchard", 1);
    const pond = snapshot("pond", 2);
    const liveOrchard = snapshot("orchard", 4);

    const merged = mergeCurrentZoneSnapshot([staleOrchard, pond], liveOrchard);

    expect(merged.map((entry) => `${entry.zone.id}:${entry.pets.length}`)).toEqual(["orchard:4", "pond:2"]);
    expect(merged[0]).toBe(liveOrchard);
    expect(merged[1]).toBe(pond);
  });

  it("keeps a current snapshot even if it was missing from the world preview", () => {
    const liveDogRun = snapshot("dog-run", 3);

    expect(mergeCurrentZoneSnapshot([snapshot("pond", 2)], liveDogRun).map((entry) => entry.zone.id)).toEqual([
      "pond",
      "dog-run",
    ]);
  });
});
