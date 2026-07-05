import { describe, expect, it } from "vitest";

import { buildWorldActivityTapeItems } from "@/components/garden/world-activity-tape";
import type { GardenEncounter, GardenPetSnapshot, GardenSnapshot, PetEvent } from "@/lib/types";

const now = "2026-06-29T00:00:00.000Z";

function petSnapshot(id: string, name: string, zoneId: GardenSnapshot["zone"]["id"]): GardenPetSnapshot {
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
      sourcePhotoId: `photo-${id}`,
      providerJobId: `job-${id}`,
      status: "succeeded",
      promptSeed: "seed",
      worldSpritePath: `/generated/${id}.svg`,
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
      petId: id,
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
  };
}

function snapshot(
  zoneId: GardenSnapshot["zone"]["id"],
  overrides: Partial<GardenSnapshot> = {},
): GardenSnapshot {
  return {
    zone: {
      id: zoneId,
      name:
        zoneId === "orchard"
          ? "果树区"
          : zoneId === "pond"
            ? "水池区"
            : zoneId === "grove"
              ? "灌木区"
              : "追逐区",
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
    pets: [],
    objects: [],
    environmentActors: [],
    recentEvents: [],
    encounters: [],
    encounterMarkers: [],
    ...overrides,
  };
}

function event(overrides: Partial<PetEvent>): PetEvent {
  return {
    id: "event-1",
    petId: "pet-miso",
    zoneId: "orchard",
    type: "watched_fish",
    body: "Miso watched the pond from the grass.",
    createdAt: now,
    ...overrides,
  };
}

function encounter(overrides: Partial<GardenEncounter>): GardenEncounter {
  return {
    id: "encounter-1",
    threadId: "thread-1",
    kind: "social",
    tone: "social",
    stage: "spark",
    status: "active",
    zoneId: "pond",
    title: "Sora and Glitch are interacting",
    summary: "Sora and Glitch are trading signals at the pond edge.",
    participantPetIds: ["pet-sora", "pet-glitch"],
    relatedEventIds: ["event-pond-social"],
    suggestedOwnerActions: ["call"],
    updatedAt: now,
    ...overrides,
  };
}

describe("world activity tape", () => {
  it("orders recent events and encounters across zones newest first", () => {
    const items = buildWorldActivityTapeItems({
      activeZoneId: "orchard",
      snapshots: [
        snapshot("orchard", {
          pets: [petSnapshot("pet-miso", "Miso", "orchard")],
          recentEvents: [
            event({
              id: "event-orchard",
              petId: "pet-miso",
              body: "Miso circled the old tree.",
              createdAt: "2026-06-29T00:01:00.000Z",
            }),
          ],
        }),
        snapshot("pond", {
          pets: [petSnapshot("pet-sora", "Sora", "pond"), petSnapshot("pet-glitch", "Glitch", "pond")],
          encounters: [
            encounter({
              id: "encounter-pond",
              title: "Sora and Glitch are tense",
              updatedAt: "2026-06-29T00:03:00.000Z",
            }),
          ],
        }),
      ],
    });

    expect(items.map((item) => item.id)).toEqual(["encounter:encounter-pond", "event:event-orchard"]);
    expect(items[0]).toMatchObject({
      kind: "encounter",
      zoneId: "pond",
      zoneName: "水池区",
      isOffPage: true,
      petNames: ["Sora", "Glitch"],
      actionLabel: "Go",
    });
  });

  it("does not duplicate an event already represented by an encounter", () => {
    const items = buildWorldActivityTapeItems({
      activeZoneId: "orchard",
      snapshots: [
        snapshot("pond", {
          pets: [petSnapshot("pet-sora", "Sora", "pond"), petSnapshot("pet-glitch", "Glitch", "pond")],
          encounters: [
            encounter({
              id: "encounter-pond",
              relatedEventIds: ["event-pond-social"],
              updatedAt: "2026-06-29T00:03:00.000Z",
            }),
          ],
          recentEvents: [
            event({
              id: "event-pond-social",
              petId: "pet-sora",
              relatedPetId: "pet-glitch",
              zoneId: "pond",
              type: "social_chat",
              body: "Sora and Glitch traded signals.",
              createdAt: "2026-06-29T00:02:30.000Z",
            }),
          ],
        }),
      ],
    });

    expect(items).toEqual([
      expect.objectContaining({
        id: "encounter:encounter-pond",
      }),
    ]);
  });

  it("keeps local events followable without an off-page action", () => {
    const items = buildWorldActivityTapeItems({
      activeZoneId: "grove",
      snapshots: [
        snapshot("grove", {
          pets: [petSnapshot("pet-unit", "Unit-7", "grove")],
          recentEvents: [
            event({
              id: "event-grove",
              petId: "pet-unit",
              zoneId: "grove",
              type: "dug",
              body: "Unit-7 checked the soil near the lamp.",
              createdAt: "2026-06-29T00:04:00.000Z",
            }),
          ],
        }),
      ],
    });

    expect(items[0]).toMatchObject({
      id: "event:event-grove",
      kind: "event",
      isOffPage: false,
      actionLabel: "Track",
      petNames: ["Unit-7"],
    });
  });
});
