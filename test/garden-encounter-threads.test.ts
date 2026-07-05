import { describe, expect, it } from "vitest";

import {
  recordEncounterIntervention,
  recordEncounterWorldAction,
  syncGardenEncounterThreads,
} from "@/lib/domain/garden-encounters";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore, GardenEncounter } from "@/lib/types";

function cloneStore() {
  return {
    ...structuredClone(seedStore),
    gardenEncounterThreads: [],
  } as AppStore;
}

const baseEncounter: GardenEncounter = {
  id: "encounter-conflict-event-1",
  kind: "conflict",
  tone: "conflict",
  stage: "spark",
  zoneId: "orchard",
  title: "Patch and Ember are tense",
  summary: "Patch and Ember squared off near the old tree.",
  participantPetIds: ["pet-patch", "pet-ember"],
  relatedEventIds: ["event-1"],
  suggestedOwnerActions: ["call", "pet", "scold"],
  updatedAt: "2026-06-28T10:00:00.000Z",
};

describe("garden encounter threads", () => {
  it("creates and updates a stable persistent thread for the same participants", () => {
    const store = cloneStore();

    const first = syncGardenEncounterThreads(store, [baseEncounter], "2026-06-28T10:00:00.000Z");
    const second = syncGardenEncounterThreads(
      store,
      [
        {
          ...baseEncounter,
          id: "encounter-conflict-event-2",
          stage: "unfolding",
          relatedEventIds: ["event-2"],
          summary: "Patch and Ember are still circling the same tree.",
          updatedAt: "2026-06-28T10:08:00.000Z",
        },
      ],
      "2026-06-28T10:08:00.000Z",
    );

    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(store.gardenEncounterThreads).toHaveLength(1);
    expect(second[0]).toMatchObject({
      id: first[0]?.id,
      status: "active",
      stage: "unfolding",
      summary: "Patch and Ember are still circling the same tree.",
      relatedEventIds: ["event-1", "event-2"],
    });
  });

  it("records owner intervention and moves the thread toward resolving", () => {
    const store = cloneStore();
    const [thread] = syncGardenEncounterThreads(store, [baseEncounter], "2026-06-28T10:00:00.000Z");

    recordEncounterIntervention(store, {
      threadId: thread!.id,
      ownerId: "profile-luna",
      petId: "pet-patch",
      action: "call",
      nowIso: "2026-06-28T10:02:00.000Z",
    });

    expect(store.gardenEncounterThreads[0]).toMatchObject({
      status: "resolving",
      lastIntervention: {
        ownerId: "profile-luna",
        petId: "pet-patch",
        action: "call",
        createdAt: "2026-06-28T10:02:00.000Z",
      },
    });
  });

  it("resolves an intervened thread from the intervention time even when the encounter is still visible", () => {
    const store = cloneStore();
    const [thread] = syncGardenEncounterThreads(store, [baseEncounter], "2026-06-28T10:00:00.000Z");

    recordEncounterIntervention(store, {
      threadId: thread!.id,
      ownerId: "profile-luna",
      petId: "pet-patch",
      action: "call",
      nowIso: "2026-06-28T10:02:00.000Z",
    });

    const [resolvedThread] = syncGardenEncounterThreads(
      store,
      [
        {
          ...baseEncounter,
          stage: "unfolding",
          updatedAt: "2026-06-28T10:25:00.000Z",
        },
      ],
      "2026-06-28T10:25:00.000Z",
    );

    expect(resolvedThread).toMatchObject({
      status: "resolved",
      stage: "cooldown",
    });
  });

  it("records a player world action without resolving the encounter", () => {
    const store = cloneStore();
    const [thread] = syncGardenEncounterThreads(store, [baseEncounter], "2026-06-28T10:00:00.000Z");

    recordEncounterWorldAction(store, {
      threadId: thread!.id,
      viewerId: "profile-luna",
      action: "observe",
      nowIso: "2026-06-28T10:04:00.000Z",
    });

    expect(store.gardenEncounterThreads[0]).toMatchObject({
      status: "active",
      lastWorldAction: {
        viewerId: "profile-luna",
        action: "observe",
        createdAt: "2026-06-28T10:04:00.000Z",
      },
    });
  });
});
