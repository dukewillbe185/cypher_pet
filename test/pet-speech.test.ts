import { describe, expect, it } from "vitest";

import {
  collectDialogueOpportunity,
  collectRecentSpokenLines,
  collectSpeechMoment,
  dialoguePairKey,
  rankSpeechCandidates,
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

describe("rankSpeechCandidates", () => {
  const cooldownOkFor = () => true;

  it("a conflict across the map outranks an idle pet at the player's feet", () => {
    const store = baseStore();
    store.gardenPresences = [
      { profileId: "owner-1", zoneId: "orchard", tileX: 11, tileY: 10, updatedAt: iso(-20_000) },
    ] as AppStore["gardenPresences"];
    store.petEvents = [
      {
        id: "e-scuffle",
        petId: "pet-b",
        relatedPetId: "pet-c",
        zoneId: "orchard",
        type: "scuffle",
        body: "scuffle",
        createdAt: iso(-2000),
      },
    ] as AppStore["petEvents"];

    const ranked = rankSpeechCandidates(store, {
      zoneId: "orchard",
      viewerId: "owner-1",
      nowMs: now,
      cooldownOkFor,
    });

    expect(ranked[0]?.petId).toBe("pet-b");
    expect(ranked[0]?.moment.trigger).toBe("conflict");

    const petA = ranked.find((entry) => entry.petId === "pet-a");
    expect(petA).toBeDefined();
    expect(petA?.moment.trigger).toBe("idle");
  });

  it("idle musings need a fresh viewer presence nearby", () => {
    const store = baseStore();

    expect(
      rankSpeechCandidates(store, { zoneId: "orchard", viewerId: "owner-1", nowMs: now, cooldownOkFor }),
    ).toEqual([]);

    store.gardenPresences = [
      { profileId: "owner-1", zoneId: "orchard", tileX: 11, tileY: 10, updatedAt: iso(-20_000) },
    ] as AppStore["gardenPresences"];

    const ranked = rankSpeechCandidates(store, {
      zoneId: "orchard",
      viewerId: "owner-1",
      nowMs: now,
      cooldownOkFor,
    });
    // pet-b is idle too, but ~13 tiles away — outside the ambient radius.
    expect(ranked.map((entry) => entry.petId)).toEqual(["pet-a"]);
  });

  it("stale presence disqualifies idle candidates", () => {
    const store = baseStore();
    store.gardenPresences = [
      { profileId: "owner-1", zoneId: "orchard", tileX: 11, tileY: 10, updatedAt: iso(-1000 * 60 * 5) },
    ] as AppStore["gardenPresences"];

    expect(
      rankSpeechCandidates(store, { zoneId: "orchard", viewerId: "owner-1", nowMs: now, cooldownOkFor }),
    ).toEqual([]);
  });

  it("per-pet cooldown gate filters candidates", () => {
    const store = baseStore();
    store.gardenPresences = [
      { profileId: "owner-1", zoneId: "orchard", tileX: 11, tileY: 10, updatedAt: iso(-20_000) },
    ] as AppStore["gardenPresences"];

    const ranked = rankSpeechCandidates(store, {
      zoneId: "orchard",
      viewerId: "owner-1",
      nowMs: now,
      cooldownOkFor: (petId) => petId !== "pet-a",
    });

    expect(ranked.find((entry) => entry.petId === "pet-a")).toBeUndefined();
  });

  it("own pets win salience ties", () => {
    const store = baseStore();
    store.pets = [
      ...store.pets,
      { id: "pet-d", ownerId: "owner-2", name: "Rex", isFrozen: false },
    ] as AppStore["pets"];
    store.petStates = [
      ...store.petStates,
      { petId: "pet-d", zoneId: "orchard", tileX: 12, tileY: 10, mood: "happy" },
    ] as AppStore["petStates"];
    store.gardenPresences = [
      { profileId: "owner-1", zoneId: "orchard", tileX: 11, tileY: 10, updatedAt: iso(-20_000) },
    ] as AppStore["gardenPresences"];

    const ranked = rankSpeechCandidates(store, {
      zoneId: "orchard",
      viewerId: "owner-1",
      nowMs: now,
      cooldownOkFor,
    });

    // Both pets are idle and equidistant (1 tile) from the viewer; owner-1's
    // own pet-a wins the tie over owner-2's pet-d.
    expect(ranked.map((entry) => entry.petId)).toEqual(["pet-a", "pet-d"]);
  });
});

describe("collectDialogueOpportunity", () => {
  const isFree = () => true;
  const pairCooldownOkFor = () => true;

  it("stages a fresh conflict between two free pets", () => {
    const store = baseStore();
    store.petEvents = [
      {
        id: "e-scuffle",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "scuffle",
        body: "scuffle",
        createdAt: iso(-2000),
      },
    ] as AppStore["petEvents"];

    const opportunity = collectDialogueOpportunity(store, {
      zoneId: "orchard",
      nowMs: now,
      isFree,
      pairCooldownOkFor,
    });

    expect(opportunity?.trigger).toBe("conflict");
    expect(opportunity?.petAId).toBe("pet-a");
    expect(opportunity?.petBId).toBe("pet-b");
    expect(opportunity?.salience).toBe(100);
    expect(opportunity?.situation).toContain("Ash");
    expect(opportunity?.situation).toContain("Nyx");
    expect(opportunity?.sourceEventId).toBe("e-scuffle");
  });

  it("conflict beats a fresher friendly chat", () => {
    const store = baseStore();
    // petEvents is newest-first: the chat is fresher but the scuffle outranks it.
    store.petEvents = [
      {
        id: "e-chat",
        petId: "pet-a",
        relatedPetId: "pet-c",
        zoneId: "orchard",
        type: "bonded",
        body: "chat",
        createdAt: iso(-1000),
      },
      {
        id: "e-scuffle",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "scuffle",
        body: "scuffle",
        createdAt: iso(-30_000),
      },
    ] as AppStore["petEvents"];

    const opportunity = collectDialogueOpportunity(store, {
      zoneId: "orchard",
      nowMs: now,
      isFree,
      pairCooldownOkFor,
    });

    expect(opportunity?.trigger).toBe("conflict");
    expect(opportunity?.petBId).toBe("pet-b");
  });

  it("skips the pair when either pet is busy", () => {
    const store = baseStore();
    store.petEvents = [
      {
        id: "e-scuffle",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "scuffle",
        body: "scuffle",
        createdAt: iso(-2000),
      },
    ] as AppStore["petEvents"];

    const opportunity = collectDialogueOpportunity(store, {
      zoneId: "orchard",
      nowMs: now,
      isFree: (petId) => petId !== "pet-b",
      pairCooldownOkFor,
    });

    expect(opportunity).toBeNull();
  });

  it("respects the pair cooldown", () => {
    const store = baseStore();
    store.petEvents = [
      {
        id: "e-scuffle",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "scuffle",
        body: "scuffle",
        createdAt: iso(-2000),
      },
    ] as AppStore["petEvents"];

    const opportunity = collectDialogueOpportunity(store, {
      zoneId: "orchard",
      nowMs: now,
      isFree,
      pairCooldownOkFor: () => false,
    });

    expect(opportunity).toBeNull();
  });

  it("warming bond turns a chat into new_friendship", () => {
    const store = baseStore();
    store.petEvents = [
      {
        id: "e-chat",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "social_chat",
        body: "chat",
        createdAt: iso(-1000),
      },
    ] as AppStore["petEvents"];
    store.petRelationships = [
      { id: "r1", petAId: "pet-a", petBId: "pet-b", affinity: 60, rivalry: 10, updatedAt: iso() },
    ] as AppStore["petRelationships"];

    const warm = collectDialogueOpportunity(store, {
      zoneId: "orchard",
      nowMs: now,
      isFree,
      pairCooldownOkFor,
    });
    expect(warm?.trigger).toBe("new_friendship");
    expect(warm?.salience).toBe(76);

    store.petRelationships = [];
    const cool = collectDialogueOpportunity(store, {
      zoneId: "orchard",
      nowMs: now,
      isFree,
      pairCooldownOkFor,
    });
    expect(cool?.trigger).toBe("encounter");
    expect(cool?.salience).toBe(40);
  });

  it("ignores stale events and inner_voice noise", () => {
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
    expect(
      collectDialogueOpportunity(store, { zoneId: "orchard", nowMs: now, isFree, pairCooldownOkFor }),
    ).toBeNull();

    store.petEvents = [
      {
        id: "e-inner",
        petId: "pet-a",
        relatedPetId: "pet-b",
        zoneId: "orchard",
        type: "inner_voice",
        body: "…",
        createdAt: iso(-1000),
      },
    ] as AppStore["petEvents"];
    expect(
      collectDialogueOpportunity(store, { zoneId: "orchard", nowMs: now, isFree, pairCooldownOkFor }),
    ).toBeNull();
  });
});

describe("dialoguePairKey", () => {
  it("is order-independent", () => {
    expect(dialoguePairKey("pet-b", "pet-a")).toBe(dialoguePairKey("pet-a", "pet-b"));
  });
});
