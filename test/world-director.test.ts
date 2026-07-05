import { describe, expect, it } from "vitest";

import { buildWorldDirectorBeats } from "@/components/garden/world-director";
import type { GardenEncounter, GardenPetSnapshot, GardenSnapshot } from "@/lib/types";

const now = "2026-06-29T00:00:00.000Z";

function petSnapshot(id: string, name: string, overrides: Partial<GardenPetSnapshot> = {}): GardenPetSnapshot {
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
      zoneId: "orchard",
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
    ...overrides,
  };
}

function snapshot(zoneId: GardenSnapshot["zone"]["id"], overrides: Partial<GardenSnapshot> = {}): GardenSnapshot {
  return {
    zone: {
      id: zoneId,
      name:
        zoneId === "orchard"
          ? "Orchard"
          : zoneId === "pond"
            ? "Pond"
            : zoneId === "grove"
              ? "Grove"
              : "Dog Run",
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

function encounter(overrides: Partial<GardenEncounter> = {}): GardenEncounter {
  return {
    id: "encounter-dog-run",
    threadId: "thread-dog-run",
    kind: "conflict",
    tone: "conflict",
    stage: "spark",
    status: "active",
    zoneId: "dog-run",
    title: "Cipher and Taro are tense",
    summary: "Cipher and Taro are circling the dog run.",
    participantPetIds: ["pet-cipher", "pet-taro"],
    relatedEventIds: ["event-dog-run"],
    suggestedOwnerActions: ["call"],
    updatedAt: now,
    ...overrides,
  };
}

describe("world director beats", () => {
  it("prioritizes unresolved off-page encounters as followable open-world leads", () => {
    const items = buildWorldDirectorBeats({
      activeZoneId: "orchard",
      snapshots: [
        snapshot("orchard", {
          pets: [
            petSnapshot("pet-local", "Local", {
              state: { ...petSnapshot("pet-local", "Local").state, hunger: 88 },
            }),
          ],
        }),
        snapshot("dog-run", {
          encounters: [encounter()],
        }),
      ],
    });

    expect(items[0]).toMatchObject({
      id: "encounter:encounter-dog-run",
      kind: "encounter",
      zoneId: "dog-run",
      zoneName: "Dog Run",
      title: "Cipher and Taro are tense",
      petIds: ["pet-cipher", "pet-taro"],
      actionLabel: "Go to zone",
      isOffPage: true,
    });
  });

  it("turns pet pressure into a care lead when no encounter covers that pet", () => {
    const items = buildWorldDirectorBeats({
      activeZoneId: "pond",
      snapshots: [
        snapshot("pond", {
          pets: [
            petSnapshot("pet-sora", "Sora", {
              state: {
                ...petSnapshot("pet-sora", "Sora").state,
                zoneId: "pond",
                hunger: 91,
                hygiene: 24,
              },
            }),
          ],
        }),
      ],
    });

    expect(items[0]).toMatchObject({
      id: "need:pet-sora",
      kind: "need",
      tone: "care",
      title: "Sora needs attention",
      summary: expect.stringContaining("hunger / hygiene"),
      petIds: ["pet-sora"],
      actionLabel: "Track",
    });
  });

  it("surfaces autonomous roaming as a lower-priority ambient lead", () => {
    const items = buildWorldDirectorBeats({
      activeZoneId: "orchard",
      snapshots: [
        snapshot("orchard", {
          pets: [
            petSnapshot("pet-cipher", "Cipher", {
              state: {
                ...petSnapshot("pet-cipher", "Cipher").state,
                lastAutonomyDecision: {
                  goal: "explore",
                  chosenActivity: "look_around",
                  source: "llm",
                  reason: "Cipher is mapping the quiet side of the orchard before moving again.",
                  candidates: [],
                  decidedAt: now,
                },
              },
            }),
          ],
        }),
      ],
    });

    expect(items).toEqual([
      expect.objectContaining({
        id: "intent:pet-cipher",
        kind: "intent",
        tone: "explore",
        title: "Cipher is looking around",
        summary: "Cipher is mapping the quiet side of the orchard before moving again.",
        actionLabel: "Follow",
      }),
    ]);
  });
});
