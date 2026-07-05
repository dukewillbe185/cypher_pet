import { describe, expect, it } from "vitest";

import { applyEncounterWorldActionToStore } from "@/lib/repository";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore, GardenEncounterThread } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

function addThread(store: AppStore): GardenEncounterThread {
  const thread: GardenEncounterThread = {
    id: "thread:social:orchard:pet-biscuit:pet-moss",
    kind: "social",
    tone: "social",
    stage: "spark",
    status: "active",
    zoneId: "orchard",
    title: "Biscuit and Moss are interacting",
    summary: "Biscuit and Moss are chatting near the path.",
    participantPetIds: ["pet-biscuit", "pet-moss"],
    relatedEventIds: ["event-social-1"],
    suggestedOwnerActions: ["photo", "throw_toy"],
    createdAt: "2026-06-28T10:00:00.000Z",
    updatedAt: "2026-06-28T10:00:00.000Z",
    expiresAt: "2026-06-28T16:00:00.000Z",
  };

  store.gardenEncounterThreads = [thread];
  return thread;
}

describe("encounter world actions in the store", () => {
  it("approach records the world action and directs the viewer pet toward an encounter participant", () => {
    const store = cloneStore();
    const thread = addThread(store);
    const nyx = store.pets.find((pet) => pet.id === "pet-nyx")!;
    const nyxState = store.petStates.find((state) => state.petId === nyx.id)!;
    const biscuitState = store.petStates.find((state) => state.petId === "pet-biscuit")!;
    const mossState = store.petStates.find((state) => state.petId === "pet-moss")!;
    nyx.ownerId = "profile-luna";
    nyxState.zoneId = "orchard";
    nyxState.tileX = 3;
    nyxState.tileY = 4;
    biscuitState.zoneId = "orchard";
    biscuitState.tileX = 40;
    biscuitState.tileY = 40;
    mossState.zoneId = "orchard";
    mossState.tileX = 20;
    mossState.tileY = 15;

    const result = applyEncounterWorldActionToStore(store, {
      viewerId: "profile-luna",
      threadId: thread.id,
      action: "approach",
      nowIso: "2026-06-28T10:05:00.000Z",
    });

    expect(result.actorPetId).toBe("pet-nyx");
    expect(store.gardenEncounterThreads[0]).toMatchObject({
      stage: "unfolding",
      lastWorldAction: {
        viewerId: "profile-luna",
        action: "approach",
        actorPetId: "pet-nyx",
        targetPetId: "pet-moss",
        createdAt: "2026-06-28T10:05:00.000Z",
      },
    });
    expect(nyxState).toMatchObject({
      activity: "approach_pet",
      zoneId: "orchard",
      tileY: 15,
    });
    expect(nyxState.tileX).toBeGreaterThan(3);
    expect(store.petEvents[0]).toMatchObject({
      petId: "pet-nyx",
      relatedPetId: "pet-moss",
      type: "owner_action",
    });
  });
});
