import { describe, expect, it } from "vitest";

import {
  AMBIENT_RADIUS_TILES,
  commitAmbientBubble,
  pickAmbientCandidate,
} from "@/lib/domain/ambient-attention";
import { buildOvernightRecapLines } from "@/lib/domain/notifications";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

function withPresence(store: AppStore, zoneId: string, tileX: number, tileY: number) {
  store.gardenPresences = [
    {
      profileId: "profile-luna",
      zoneId,
      tileX,
      tileY,
      updatedAt: new Date().toISOString(),
    },
  ];
}

function nearestOwnPetSetup(store: AppStore) {
  const pet = store.pets.find((entry) => entry.ownerId === "profile-luna" && !entry.isFrozen)!;
  const state = store.petStates.find((entry) => entry.petId === pet.id)!;

  state.zoneId = "orchard";
  state.tileX = 20;
  state.tileY = 20;
  state.activity = "idle";
  state.currentBubble = undefined;
  withPresence(store, "orchard", 21, 20);

  return { pet, state };
}

describe("pickAmbientCandidate", () => {
  it("picks the nearest own pet next to the player", () => {
    const store = cloneStore();
    const { pet } = nearestOwnPetSetup(store);

    const candidate = pickAmbientCandidate(store, {
      zoneId: "orchard",
      viewerId: "profile-luna",
      nowMs: Date.now(),
      petCooldownUntil: () => 0,
    });

    expect(candidate?.petId).toBe(pet.id);
    expect(candidate?.ownedByViewer).toBe(true);
  });

  it("returns nothing without fresh presence in the zone", () => {
    const store = cloneStore();
    nearestOwnPetSetup(store);
    store.gardenPresences![0].updatedAt = new Date(Date.now() - 1000 * 60 * 5).toISOString();

    expect(
      pickAmbientCandidate(store, {
        zoneId: "orchard",
        viewerId: "profile-luna",
        nowMs: Date.now(),
        petCooldownUntil: () => 0,
      }),
    ).toBeNull();
  });

  it("skips pets that are asleep, bubbled, cooling down, or too far", () => {
    const store = cloneStore();
    const { pet, state } = nearestOwnPetSetup(store);
    const nowMs = Date.now();
    const base = {
      zoneId: "orchard",
      viewerId: "profile-luna",
      nowMs,
      petCooldownUntil: () => 0,
    };

    state.activity = "sleep";
    expect(pickAmbientCandidate(store, base)?.petId).not.toBe(pet.id);
    state.activity = "idle";

    state.currentBubble = {
      text: "…",
      kind: "thought",
      expiresAt: new Date(nowMs + 5000).toISOString(),
    };
    expect(pickAmbientCandidate(store, base)?.petId).not.toBe(pet.id);
    state.currentBubble = undefined;

    expect(
      pickAmbientCandidate(store, {
        ...base,
        petCooldownUntil: (petId) => (petId === pet.id ? nowMs + 60_000 : 0),
      })?.petId,
    ).not.toBe(pet.id);

    state.tileX = 20 + AMBIENT_RADIUS_TILES + 30;
    const farCandidate = pickAmbientCandidate(store, base);
    expect(farCandidate?.petId).not.toBe(pet.id);
  });
});

describe("commitAmbientBubble", () => {
  it("writes the bubble and an llm-tagged inner voice event", () => {
    const store = cloneStore();
    const { pet, state } = nearestOwnPetSetup(store);
    const nowMs = Date.now();

    const event = commitAmbientBubble(store, {
      petId: pet.id,
      zoneId: "orchard",
      text: "你站这么近，是想被我蹭吗。",
      kind: "thought",
      nowMs,
      source: "llm",
    });

    expect(event).not.toBeNull();
    expect(event!.narrationSource).toBe("llm");
    expect(state.currentBubble?.text).toContain("蹭");
    expect(store.petEvents[0]?.id).toBe(event!.id);
  });

  it("drops the moment if a bubble raced in or the pet moved zones", () => {
    const store = cloneStore();
    const { pet, state } = nearestOwnPetSetup(store);
    const nowMs = Date.now();

    state.currentBubble = {
      text: "先来的",
      kind: "speech",
      expiresAt: new Date(nowMs + 5000).toISOString(),
    };
    expect(
      commitAmbientBubble(store, {
        petId: pet.id,
        zoneId: "orchard",
        text: "迟到的想法",
        kind: "thought",
        nowMs,
        source: "llm",
      }),
    ).toBeNull();

    state.currentBubble = undefined;
    state.zoneId = "pond";
    expect(
      commitAmbientBubble(store, {
        petId: pet.id,
        zoneId: "orchard",
        text: "错区的想法",
        kind: "thought",
        nowMs,
        source: "llm",
      }),
    ).toBeNull();
  });
});

describe("buildOvernightRecapLines", () => {
  it("collects recent event bodies for the owner's pets, one per pet", () => {
    const store = cloneStore();
    const owned = store.pets.filter((pet) => pet.ownerId === "profile-luna").slice(0, 2);
    const nowMs = Date.now();

    store.petEvents.unshift(
      {
        id: "recap-1",
        petId: owned[0].id,
        zoneId: "orchard",
        type: "bonded",
        body: `${owned[0].name} 和 Patch 蹭了蹭鼻尖。`,
        createdAt: new Date(nowMs - 1000 * 60 * 60).toISOString(),
      },
      {
        id: "recap-2",
        petId: owned[0].id,
        zoneId: "orchard",
        type: "scuffle",
        body: `${owned[0].name} 又和谁扭打了一场。`,
        createdAt: new Date(nowMs - 1000 * 60 * 90).toISOString(),
      },
      {
        id: "recap-3",
        petId: owned[1].id,
        zoneId: "pond",
        type: "zone_move",
        body: `${owned[1].name} 溜达去了水池区。`,
        createdAt: new Date(nowMs - 1000 * 60 * 30).toISOString(),
      },
    );

    const lines = buildOvernightRecapLines(store, "profile-luna", nowMs);

    expect(lines.length).toBeGreaterThanOrEqual(2);
    expect(lines.some((line) => line.includes("蹭了蹭鼻尖"))).toBe(true);
    expect(lines.some((line) => line.includes("水池区"))).toBe(true);
    // one line per pet: the scuffle for the same pet is not doubled in
    expect(lines.filter((line) => line.includes(owned[0].name)).length).toBe(1);
  });

  it("ignores stale events, owner actions and inner voice chatter", () => {
    const store = cloneStore();
    store.petEvents = store.petEvents.filter(() => false);
    const pet = store.pets.find((entry) => entry.ownerId === "profile-luna")!;
    const nowMs = Date.now();

    store.petEvents.push(
      {
        id: "stale",
        petId: pet.id,
        zoneId: "orchard",
        type: "bonded",
        body: "太久以前的事。",
        createdAt: new Date(nowMs - 1000 * 60 * 60 * 40).toISOString(),
      },
      {
        id: "owner-action",
        petId: pet.id,
        zoneId: "orchard",
        type: "owner_action",
        body: "主人喂了它。",
        createdAt: new Date(nowMs - 1000 * 60).toISOString(),
      },
      {
        id: "inner",
        petId: pet.id,
        zoneId: "orchard",
        type: "inner_voice",
        body: "内心戏。",
        createdAt: new Date(nowMs - 1000 * 60).toISOString(),
      },
    );

    expect(buildOvernightRecapLines(store, "profile-luna", nowMs)).toEqual([]);
  });
});
