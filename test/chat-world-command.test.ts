import { describe, expect, it } from "vitest";

import {
  parseOwnerChatWorldCommand,
  shouldResolveOwnerChatWorldCommandImmediately,
} from "@/lib/domain/chat-world-command";
import { applyOwnerPetCommandToStore } from "@/lib/repository";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

describe("chat world commands", () => {
  it("parses owner chase instructions into a chase pet command", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-halo",
      message: "去追 Ember",
      isOwner: true,
    });

    expect(directive).toMatchObject({
      command: {
        type: "chase_pet",
        targetPetId: "pet-ember",
      },
      stateChanges: {
        social: 3,
        stress: 2,
      },
    });
    expect(directive?.reply).toContain("Ember");
  });

  it("fuzzy-matches misspelled pet names before using preferred companions", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-nyx",
      message: "追上Hola",
      isOwner: true,
      preferredPetId: "pet-biscuit",
    });

    expect(directive?.command).toEqual({
      type: "chase_pet",
      targetPetId: "pet-halo",
    });
    expect(directive?.reply).toContain("Halo");
  });

  it("does not chase a preferred companion when a named target is unknown", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-nyx",
      message: "追上NotARealPet",
      isOwner: true,
      preferredPetId: "pet-biscuit",
    });

    expect(directive).toBeNull();
  });

  it("parses fight instructions into a scuffle command", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-nyx",
      message: "跟 Halo 打一架",
      isOwner: true,
    });

    expect(directive).toMatchObject({
      command: {
        type: "scuffle_pet",
        targetPetId: "pet-halo",
      },
      stateChanges: {
        stress: 5,
      },
    });
    expect(directive?.reply).toContain("Halo");
  });

  it("does not create world commands for non-owners", () => {
    const store = cloneStore();

    expect(
      parseOwnerChatWorldCommand({
        store,
        currentPetId: "pet-halo",
        message: "去追 Ember",
        isOwner: false,
      }),
    ).toBeNull();
  });

  it("applies chase pet commands as visible chase activity", () => {
    const store = cloneStore();
    const owner = store.profiles.find((profile) => profile.id === "profile-luna")!;
    const halo = store.pets.find((pet) => pet.id === "pet-halo")!;
    const haloState = store.petStates.find((state) => state.petId === "pet-halo")!;
    const emberState = store.petStates.find((state) => state.petId === "pet-ember")!;

    emberState.zoneId = "orchard";
    emberState.tileX = 22;
    emberState.tileY = 18;
    haloState.zoneId = "orchard";
    haloState.tileX = 8;
    haloState.tileY = 10;

    const result = applyOwnerPetCommandToStore(store, {
      owner,
      pet: halo,
      command: {
        type: "chase_pet",
        targetPetId: "pet-ember",
      },
    });

    expect(result).toMatchObject({
      petId: "pet-halo",
      zoneId: "orchard",
      activity: "chase",
    });
    expect(haloState).toMatchObject({
      activity: "chase",
      zoneId: "orchard",
      tileY: 18,
    });
    expect(Math.abs(haloState.tileX - emberState.tileX)).toBeLessThanOrEqual(2);
    expect(store.petEvents[0]).toMatchObject({
      petId: "pet-halo",
      relatedPetId: "pet-ember",
      type: "chased",
    });
  });

  it("applies scuffle commands as visible conflict activity", () => {
    const store = cloneStore();
    const owner = store.profiles.find((profile) => profile.id === "profile-luna")!;
    const nyx = store.pets.find((pet) => pet.id === "pet-nyx")!;
    const nyxState = store.petStates.find((state) => state.petId === "pet-nyx")!;
    const haloState = store.petStates.find((state) => state.petId === "pet-halo")!;
    const nowIso = new Date().toISOString();

    haloState.zoneId = "orchard";
    haloState.tileX = 22;
    haloState.tileY = 18;
    nyxState.zoneId = "orchard";
    nyxState.tileX = 8;
    nyxState.tileY = 10;
    store.petGoals.unshift({
      id: "stale-chase-biscuit",
      petId: "pet-nyx",
      goalType: "chase_target",
      priority: 82,
      targetPetId: "pet-biscuit",
      status: "active",
      progress: 30,
      reason: "stale chase target",
      createdAt: nowIso,
      updatedAt: nowIso,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    const result = applyOwnerPetCommandToStore(store, {
      owner,
      pet: nyx,
      command: {
        type: "scuffle_pet",
        targetPetId: "pet-halo",
      },
    });

    expect(result).toMatchObject({
      petId: "pet-nyx",
      zoneId: "orchard",
      activity: "scuffle",
    });
    expect(nyxState).toMatchObject({
      activity: "scuffle",
      zoneId: "orchard",
      tileY: 18,
    });
    expect(Math.abs(nyxState.tileX - haloState.tileX)).toBeLessThanOrEqual(1);
    expect(haloState.currentBubble?.text).toContain("别");
    expect(store.petEvents[0]).toMatchObject({
      petId: "pet-nyx",
      relatedPetId: "pet-halo",
      type: "scuffle",
    });
    expect(
      store.petGoals.find((goal) => goal.petId === "pet-nyx" && goal.goalType === "avoid_pet" && goal.targetPetId === "pet-halo"),
    ).toEqual(expect.objectContaining({ priority: expect.any(Number) }));
    expect(
      store.petGoals.find((goal) => goal.petId === "pet-nyx" && goal.goalType === "avoid_pet" && goal.targetPetId === "pet-halo")!
        .priority,
    ).toBeGreaterThan(82);
  });

  it("marks owner world commands for immediate local chat resolution", () => {
    const store = cloneStore();
    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-halo",
      message: "去追 Ember",
      isOwner: true,
    });

    expect(shouldResolveOwnerChatWorldCommandImmediately(directive)).toBe(true);
  });

  it("parses named zone instructions into tile movement commands", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-halo",
      message: "去池塘看看",
      isOwner: true,
    });

    expect(directive?.command).toMatchObject({
      type: "move_to_tile",
      zoneId: "pond",
    });
    expect(directive?.reply).toContain("池塘");
  });

  it("parses object instructions into object movement commands", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-halo",
      message: "去玩具那边",
      isOwner: true,
    });

    expect(directive?.command).toEqual({
      type: "move_to_object",
      objectId: "obj-dogrun-toy-1",
    });
  });

  it("parses care station instructions into current-zone tile movement", () => {
    const store = cloneStore();

    const directive = parseOwnerChatWorldCommand({
      store,
      currentPetId: "pet-halo",
      message: "去吃饭",
      isOwner: true,
    });

    expect(directive?.command).toEqual({
      type: "move_to_tile",
      zoneId: "orchard",
      tileX: 24,
      tileY: 35,
    });
  });
});
