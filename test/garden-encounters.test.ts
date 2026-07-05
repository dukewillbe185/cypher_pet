import { describe, expect, it } from "vitest";

import { buildGardenEncounterMapMarkers, buildGardenEncounters } from "@/lib/domain/garden-encounters";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore, PetEvent } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

describe("garden encounters", () => {
  it("turns recent pet conflict into an ambient encounter", () => {
    const store = cloneStore();
    const nowIso = "2026-06-28T10:00:00.000Z";
    const event: PetEvent = {
      id: "event-conflict-1",
      petId: "pet-patch",
      relatedPetId: "pet-ember",
      zoneId: "orchard",
      type: "scuffle",
      body: "Patch and Ember squared off near the old tree.",
      createdAt: "2026-06-28T09:55:00.000Z",
      emotion: "grumpy",
    };

    store.petEvents.unshift(event);
    const encounters = buildGardenEncounters(store, {
      zoneId: "orchard",
      nowIso,
      visiblePetIds: ["pet-patch", "pet-ember"],
    });

    expect(encounters[0]).toMatchObject({
      kind: "conflict",
      tone: "conflict",
      stage: "unfolding",
      participantPetIds: ["pet-patch", "pet-ember"],
      relatedEventIds: ["event-conflict-1"],
    });
    expect(encounters[0]?.title).toContain("Patch");
    expect(encounters[0]?.suggestedOwnerActions).toEqual(["call", "pet", "scold"]);
  });

  it("surfaces urgent needs as a player-intervention encounter", () => {
    const store = cloneStore();
    const patchState = store.petStates.find((state) => state.petId === "pet-patch")!;
    patchState.zoneId = "orchard";
    patchState.hunger = 82;
    patchState.stress = 76;
    patchState.energy = 26;

    const encounters = buildGardenEncounters(store, {
      zoneId: "orchard",
      nowIso: "2026-06-28T10:00:00.000Z",
      visiblePetIds: ["pet-patch"],
    });

    const needsEncounter = encounters.find((encounter) => encounter.kind === "needs_attention");
    expect(needsEncounter).toMatchObject({
      kind: "needs_attention",
      tone: "care",
      participantPetIds: ["pet-patch"],
      suggestedOwnerActions: ["feed", "pet", "call"],
    });
    expect(needsEncounter?.summary).toContain("hungry");
    expect(needsEncounter?.summary).toContain("stressed");
  });

  it("derives encounter map markers from participant positions", () => {
    const store = cloneStore();
    const patchState = store.petStates.find((state) => state.petId === "pet-patch")!;
    const emberState = store.petStates.find((state) => state.petId === "pet-ember")!;
    patchState.zoneId = "orchard";
    patchState.tileX = 10;
    patchState.tileY = 12;
    emberState.zoneId = "orchard";
    emberState.tileX = 14;
    emberState.tileY = 18;

    const markers = buildGardenEncounterMapMarkers(store, [
      {
        id: "encounter-conflict-event-1",
        threadId: "thread:conflict:orchard:pet-ember:pet-patch",
        kind: "conflict",
        tone: "conflict",
        stage: "unfolding",
        status: "active",
        zoneId: "orchard",
        title: "Patch and Ember are tense",
        summary: "Patch and Ember squared off near the old tree.",
        participantPetIds: ["pet-patch", "pet-ember"],
        relatedEventIds: ["event-conflict-1"],
        suggestedOwnerActions: ["call", "pet", "scold"],
        updatedAt: "2026-06-28T10:00:00.000Z",
      },
    ]);

    expect(markers).toEqual([
      {
        id: "marker-thread:conflict:orchard:pet-ember:pet-patch",
        encounterId: "encounter-conflict-event-1",
        threadId: "thread:conflict:orchard:pet-ember:pet-patch",
        zoneId: "orchard",
        tileX: 12,
        tileY: 15,
        tone: "conflict",
        stage: "unfolding",
        status: "active",
        title: "Patch and Ember are tense",
        participantPetIds: ["pet-patch", "pet-ember"],
      },
    ]);
  });
});
