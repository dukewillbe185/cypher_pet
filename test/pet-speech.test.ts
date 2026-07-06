import { describe, expect, it } from "vitest";

import {
  collectRecentSpokenLines,
  collectSpeechMoment,
  pickSliceFocusPetId,
} from "@/lib/domain/pet-speech";
import type { AppStore } from "@/lib/types";

const now = Date.now();
const iso = (offsetMs = 0) => new Date(now + offsetMs).toISOString();

function baseStore(): AppStore {
  return {
    profiles: [{ id: "owner-1", displayName: "Luna" }],
    pets: [
      { id: "pet-a", ownerId: "owner-1", name: "Ash", isFrozen: false },
      { id: "pet-b", ownerId: "owner-1", name: "Nyx", isFrozen: false },
      { id: "pet-c", ownerId: "owner-1", name: "Moss", isFrozen: false },
    ],
    petStates: [
      { petId: "pet-a", zoneId: "orchard", tileX: 10, tileY: 10, mood: "curious" },
      { petId: "pet-b", zoneId: "orchard", tileX: 20, tileY: 20, mood: "happy" },
    ],
    petEvents: [],
    petRelationships: [],
    pairRelationshipModels: [],
    gardenLedgerEvents: [],
    ownerActions: [],
    gardenPresences: [],
  } as unknown as AppStore;
}

describe("pickSliceFocusPetId", () => {
  it("picks the most socially entangled pet", () => {
    const store = baseStore();
    store.petRelationships = [
      { id: "r1", petAId: "pet-b", petBId: "pet-c", affinity: 60, rivalry: 10, updatedAt: iso() },
      { id: "r2", petAId: "pet-b", petBId: "pet-a", affinity: 40, rivalry: 20, updatedAt: iso() },
    ] as AppStore["petRelationships"];
    store.pairRelationshipModels = [
      { petAId: "pet-b", petBId: "pet-c" },
    ] as unknown as AppStore["pairRelationshipModels"];

    expect(pickSliceFocusPetId(store)).toBe("pet-b");
  });

  it("still returns a pet when nobody has any history, and skips frozen pets", () => {
    const store = baseStore();
    store.pets[0] = { ...store.pets[0], isFrozen: true };
    // pet-a is frozen, so the first eligible pet (pet-b) wins the empty tie.
    expect(pickSliceFocusPetId(store)).toBe("pet-b");
  });
});

describe("collectSpeechMoment", () => {
  it("prioritizes a fresh conflict over a lower-salience owner action", () => {
    const store = baseStore();
    store.ownerActions = [
      { id: "oa1", ownerId: "owner-1", petId: "pet-a", action: "feed", createdAt: iso(-5000), summary: "fed" },
    ] as AppStore["ownerActions"];
    store.petEvents = [
      {
        id: "e1",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "scuffle",
        body: "scuffle",
        createdAt: iso(-2000),
      },
    ] as AppStore["petEvents"];

    const moment = collectSpeechMoment(store, "pet-a", now);
    expect(moment.trigger).toBe("conflict");
    expect(moment.relatedPetId).toBe("pet-b");
    expect(moment.situation).toContain("Nyx");
  });

  it("voices an owner action when that's the only fresh signal", () => {
    const store = baseStore();
    store.ownerActions = [
      { id: "oa1", ownerId: "owner-1", petId: "pet-a", action: "feed", createdAt: iso(-3000), summary: "fed" },
    ] as AppStore["ownerActions"];

    const moment = collectSpeechMoment(store, "pet-a", now);
    expect(moment.trigger).toBe("owner_action");
    expect(moment.situation).toContain("Luna");
  });

  it("ignores stale signals and falls back to idle", () => {
    const store = baseStore();
    store.petEvents = [
      {
        id: "e-old",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "scuffle",
        body: "old",
        createdAt: iso(-1000 * 60 * 10),
      },
    ] as AppStore["petEvents"];

    expect(collectSpeechMoment(store, "pet-a", now).trigger).toBe("idle");
  });

  it("reads a fresh owner presence beside the pet as a reunion", () => {
    const store = baseStore();
    store.gardenPresences = [
      { profileId: "owner-1", zoneId: "orchard", tileX: 11, tileY: 10, updatedAt: iso(-1000) },
    ] as AppStore["gardenPresences"];

    expect(collectSpeechMoment(store, "pet-a", now).trigger).toBe("reunion");
  });
});

describe("collectRecentSpokenLines", () => {
  it("returns raw spoken lines newest-first and skips other pets", () => {
    const store = baseStore();
    store.petEvents = [
      { id: "s2", petId: "pet-a", zoneId: "orchard", type: "inner_voice", body: "…", spokenText: "第二句", createdAt: iso(-1000) },
      { id: "s1", petId: "pet-a", zoneId: "orchard", type: "inner_voice", body: "…", spokenText: "第一句", createdAt: iso(-2000) },
      { id: "sx", petId: "pet-b", zoneId: "orchard", type: "inner_voice", body: "…", spokenText: "别人的", createdAt: iso(-500) },
    ] as AppStore["petEvents"];

    expect(collectRecentSpokenLines(store, "pet-a")).toEqual(["第二句", "第一句"]);
  });
});
