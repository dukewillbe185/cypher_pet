import { describe, expect, it } from "vitest";

import { buildWorldPulseItems } from "@/components/garden/world-pulse";
import type { GardenEncounter, GardenPetSnapshot, PetEvent } from "@/lib/types";

const now = "2026-06-28T00:00:00.000Z";

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
      actionEndsAt: "2026-06-28T00:00:20.000Z",
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

describe("world pulse", () => {
  it("prioritizes unresolved conflict encounters over routine signals", () => {
    const event: PetEvent = {
      id: "event-1",
      petId: "pet-miso",
      zoneId: "orchard",
      type: "watched_fish",
      body: "Miso watched the pond from the grass.",
      emotion: "curious",
      createdAt: now,
    };
    const encounter: GardenEncounter = {
      id: "encounter-1",
      threadId: "thread-1",
      kind: "conflict",
      tone: "conflict",
      stage: "spark",
      status: "active",
      zoneId: "orchard",
      title: "Miso and Patch are tense",
      summary: "Miso and Patch squared off near the old tree.",
      participantPetIds: ["pet-miso", "pet-patch"],
      relatedEventIds: ["event-conflict"],
      suggestedOwnerActions: ["call"],
      updatedAt: now,
    };

    const items = buildWorldPulseItems({
      encounters: [encounter],
      events: [event],
      pets: [petSnapshot("pet-miso", "Miso"), petSnapshot("pet-patch", "Patch")],
    });

    expect(items[0]).toMatchObject({
      id: "encounter:encounter-1",
      kind: "encounter",
      tone: "conflict",
      title: "Miso and Patch are tense",
      encounterId: "encounter-1",
      petIds: ["pet-miso", "pet-patch"],
      actionLabel: "Inspect",
    });
  });

  it("turns autonomy intent into a visible off-page pulse", () => {
    const pet = petSnapshot("pet-miso", "Miso", {
      state: {
        ...petSnapshot("pet-miso", "Miso").state,
        lastAutonomyDecision: {
          goal: "explore",
          chosenActivity: "look_around",
          source: "fallback",
          reason: "Miso wants to scan the orchard before choosing a route.",
          candidates: [],
          decidedAt: now,
        },
      },
    });

    expect(buildWorldPulseItems({ encounters: [], events: [], pets: [pet] })).toEqual([
      expect.objectContaining({
        id: "intent:pet-miso",
        kind: "intent",
        tone: "explore",
        title: "Miso is looking around",
        summary: "Miso wants to scan the orchard before choosing a route.",
        petIds: ["pet-miso"],
        actionLabel: "Track",
      }),
    ]);
  });

  it("does not duplicate an event already represented by an encounter", () => {
    const event: PetEvent = {
      id: "event-conflict",
      petId: "pet-miso",
      relatedPetId: "pet-patch",
      zoneId: "orchard",
      type: "scuffle",
      body: "Miso and Patch scuffled near the tree.",
      emotion: "grumpy",
      createdAt: now,
    };
    const encounter: GardenEncounter = {
      id: "encounter-1",
      kind: "conflict",
      tone: "conflict",
      stage: "unfolding",
      status: "active",
      zoneId: "orchard",
      title: "Miso and Patch are tense",
      summary: "Miso and Patch scuffled near the tree.",
      participantPetIds: ["pet-miso", "pet-patch"],
      relatedEventIds: ["event-conflict"],
      suggestedOwnerActions: ["call"],
      updatedAt: now,
    };

    const items = buildWorldPulseItems({
      encounters: [encounter],
      events: [event],
      pets: [petSnapshot("pet-miso", "Miso"), petSnapshot("pet-patch", "Patch")],
    });

    expect(items.map((item) => item.id)).toEqual(["encounter:encounter-1"]);
  });
});
