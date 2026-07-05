import { describe, expect, it } from "vitest";

import {
  applyBondDecay,
  applyGrowthAward,
  AWAKENED_STAGE_XP,
  ensureGrowthState,
  growthStageForXp,
  growthSummary,
  ownerActionGrowthAward,
  SYNCED_STAGE_XP,
} from "@/lib/domain/growth";
import {
  advanceStoreToNow,
  applyOwnerActionToStore,
  buildGardenSnapshot,
  cleanPoopObjectInStore,
  freshOwnerPresence,
} from "@/lib/domain/simulation";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore, PetState } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

function makeState(overrides: Partial<PetState> = {}): PetState {
  return {
    petId: "pet-test",
    zoneId: "orchard",
    tileX: 10,
    tileY: 10,
    facing: "right",
    mood: "happy",
    activity: "idle",
    energy: 80,
    hunger: 20,
    hygiene: 80,
    bladder: 10,
    social: 60,
    stress: 10,
    actionEndsAt: new Date().toISOString(),
    lastSimulatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("growth stages", () => {
  it("maps xp to stages at the documented thresholds", () => {
    expect(growthStageForXp(0)).toBe("proto");
    expect(growthStageForXp(SYNCED_STAGE_XP - 1)).toBe("proto");
    expect(growthStageForXp(SYNCED_STAGE_XP)).toBe("synced");
    expect(growthStageForXp(AWAKENED_STAGE_XP)).toBe("awakened");
  });

  it("defaults missing growth fields on legacy states", () => {
    const state = makeState();
    const vitals = ensureGrowthState(state);

    expect(vitals.bond).toBeGreaterThan(0);
    expect(vitals.growthXp).toBe(0);
  });

  it("reports a stage change exactly when a threshold is crossed", () => {
    const state = makeState({ growthXp: SYNCED_STAGE_XP - 5, bond: 40 });

    const beforeThreshold = applyGrowthAward(state, { xp: 2, bond: 1 });
    expect(beforeThreshold.stageChanged).toBe(false);

    const crossing = applyGrowthAward(state, { xp: 10, bond: 1 });
    expect(crossing.stageChanged).toBe(true);
    expect(crossing.stage).toBe("synced");
  });

  it("clamps bond between 0 and 100 and decays slowly", () => {
    const state = makeState({ bond: 99, growthXp: 0 });

    applyGrowthAward(state, { xp: 0, bond: 50 });
    expect(state.bond).toBe(100);

    applyBondDecay(state, 1000 * 60 * 60 * 10);
    expect(state.bond).toBeLessThan(100);
    expect(state.bond).toBeGreaterThan(90);
  });

  it("summarizes progress toward the next stage", () => {
    const state = makeState({ growthXp: SYNCED_STAGE_XP / 2, bond: 30 });
    const summary = growthSummary(state);

    expect(summary.stage).toBe("proto");
    expect(summary.stageProgress).toBeCloseTo(0.5, 1);
    expect(summary.stageLabel.length).toBeGreaterThan(0);
  });
});

describe("owner actions feed growth", () => {
  it("awards xp and bond when the owner feeds a pet", () => {
    const store = cloneStore();
    const pet = store.pets.find((entry) => entry.ownerId === "profile-luna");
    expect(pet).toBeDefined();
    const owner = store.profiles.find((entry) => entry.id === pet!.ownerId)!;
    const state = store.petStates.find((entry) => entry.petId === pet!.id)!;
    ensureGrowthState(state);
    const xpBefore = state.growthXp ?? 0;
    const bondBefore = state.bond ?? 0;

    applyOwnerActionToStore(store, { owner, pet: pet!, action: "feed" });

    const award = ownerActionGrowthAward("feed");
    expect(state.growthXp).toBe(xpBefore + award.xp);
    expect(state.bond).toBeGreaterThan(bondBefore);
  });

  it("exposes growth in the garden snapshot", () => {
    const store = cloneStore();
    const snapshot = buildGardenSnapshot(store, "orchard");

    expect(snapshot.pets.length).toBeGreaterThan(0);
    for (const entry of snapshot.pets) {
      expect(entry.growth).toBeDefined();
      expect(entry.growth!.stageLabel.length).toBeGreaterThan(0);
    }
  });
});

describe("walk-up poop cleaning", () => {
  function storeWithPoop(ownerId: string) {
    const store = cloneStore();
    const pet = store.pets.find((entry) => entry.ownerId === ownerId && !entry.isFrozen)!;
    const state = store.petStates.find((entry) => entry.petId === pet.id)!;

    store.worldObjects.push({
      id: "poop-test-1",
      type: "poop",
      zoneId: state.zoneId,
      tileX: state.tileX,
      tileY: state.tileY,
      petId: pet.id,
      createdAt: new Date().toISOString(),
    });

    return { store, pet, state };
  }

  it("removes the poop and rewards the owner's bond", () => {
    const { store, pet, state } = storeWithPoop("profile-luna");
    const viewer = store.profiles.find((entry) => entry.id === "profile-luna")!;
    ensureGrowthState(state);
    const xpBefore = state.growthXp ?? 0;

    const result = cleanPoopObjectInStore(store, { viewer, objectId: "poop-test-1" });

    expect(result.ownedByViewer).toBe(true);
    expect(result.petId).toBe(pet.id);
    expect(store.worldObjects.find((entry) => entry.id === "poop-test-1")?.removedAt).toBeTruthy();
    expect(state.growthXp).toBeGreaterThan(xpBefore);
  });

  it("lets a passer-by clean without a growth award", () => {
    const { store, state } = storeWithPoop("profile-luna");
    const viewer = store.profiles.find((entry) => entry.id === "profile-mars")!;
    ensureGrowthState(state);
    const xpBefore = state.growthXp ?? 0;

    const result = cleanPoopObjectInStore(store, { viewer, objectId: "poop-test-1" });

    expect(result.ownedByViewer).toBe(false);
    expect(state.growthXp).toBe(xpBefore);
    expect(store.worldObjects.find((entry) => entry.id === "poop-test-1")?.removedAt).toBeTruthy();
  });

  it("rejects already-removed or missing objects", () => {
    const { store } = storeWithPoop("profile-luna");
    const viewer = store.profiles.find((entry) => entry.id === "profile-luna")!;

    cleanPoopObjectInStore(store, { viewer, objectId: "poop-test-1" });
    expect(() => cleanPoopObjectInStore(store, { viewer, objectId: "poop-test-1" })).toThrow();
    expect(() => cleanPoopObjectInStore(store, { viewer, objectId: "missing" })).toThrow();
  });
});

describe("garden presence", () => {
  it("returns fresh presence only for the matching zone within the freshness window", () => {
    const store = cloneStore();
    const now = Date.now();
    store.gardenPresences = [
      {
        profileId: "profile-luna",
        zoneId: "orchard",
        tileX: 20,
        tileY: 20,
        updatedAt: new Date(now - 10_000).toISOString(),
      },
      {
        profileId: "profile-mars",
        zoneId: "pond",
        tileX: 12,
        tileY: 12,
        updatedAt: new Date(now - 1000 * 60 * 30).toISOString(),
      },
    ];

    expect(freshOwnerPresence(store, "profile-luna", "orchard", now)).toBeDefined();
    expect(freshOwnerPresence(store, "profile-luna", "pond", now)).toBeUndefined();
    expect(freshOwnerPresence(store, "profile-mars", "pond", now)).toBeUndefined();
    expect(freshOwnerPresence(store, "profile-nobody", "orchard", now)).toBeUndefined();
  });

  it("pulls a lonely pet toward its owner's live position during simulation", async () => {
    const store = cloneStore();
    const now = new Date();
    const pet = store.pets.find((entry) => entry.ownerId === "profile-luna" && !entry.isFrozen);
    expect(pet).toBeDefined();
    const state = store.petStates.find((entry) => entry.petId === pet!.id)!;

    state.zoneId = "orchard";
    state.tileX = 8;
    state.tileY = 8;
    state.social = 20;
    state.energy = 90;
    state.bladder = 10;
    state.activity = "idle";
    // Force an immediate retarget window.
    state.actionEndsAt = new Date(now.getTime() - 1000).toISOString();
    state.lastSimulatedAt = new Date(now.getTime() - 30_000).toISOString();

    store.gardenPresences = [
      {
        profileId: "profile-luna",
        zoneId: "orchard",
        tileX: 36,
        tileY: 36,
        updatedAt: now.toISOString(),
      },
    ];

    await advanceStoreToNow(store, now, { llmMode: "off" });

    expect(state.activity).toBe("seek_owner");
    expect(Math.abs(state.tileX - 36)).toBeLessThanOrEqual(2);
    expect(Math.abs(state.tileY - 36)).toBeLessThanOrEqual(2);
  });
});
