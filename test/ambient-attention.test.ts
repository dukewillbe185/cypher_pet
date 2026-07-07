import { describe, expect, it } from "vitest";

import { AMBIENT_BUBBLE_LIFETIME_MS, commitAmbientBubble } from "@/lib/domain/ambient-attention";
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

  it("carries relatedPetId for dialogue turns", () => {
    const store = cloneStore();
    const { pet, state } = nearestOwnPetSetup(store);
    const nowMs = Date.now();

    const event = commitAmbientBubble(store, {
      petId: pet.id,
      zoneId: "orchard",
      text: "你先别说话。",
      kind: "speech",
      nowMs,
      source: "llm",
      relatedPetId: "pet-x",
    });

    expect(event?.relatedPetId).toBe("pet-x");

    state.currentBubble = undefined;
    const secondEvent = commitAmbientBubble(store, {
      petId: pet.id,
      zoneId: "orchard",
      text: "轮到我了。",
      kind: "speech",
      nowMs: nowMs + AMBIENT_BUBBLE_LIFETIME_MS + 1000,
      source: "llm",
    });

    expect(secondEvent).not.toBeNull();
    expect(secondEvent?.relatedPetId).toBeUndefined();
  });

  it("force-replaces an active bubble for staged dialogue turns", () => {
    const store = cloneStore();
    const { pet, state } = nearestOwnPetSetup(store);
    const nowMs = Date.now();

    state.currentBubble = {
      text: "无关紧要的碎碎念",
      kind: "thought",
      expiresAt: new Date(nowMs + 5000).toISOString(),
    };

    const event = commitAmbientBubble(store, {
      petId: pet.id,
      zoneId: "orchard",
      text: "挠你，活该！",
      kind: "speech",
      nowMs,
      source: "llm",
      relatedPetId: "pet-other",
      force: true,
    });

    expect(event).not.toBeNull();
    expect(event!.relatedPetId).toBe("pet-other");
    expect(state.currentBubble?.text).toBe("挠你，活该！");
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
