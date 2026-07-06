import { describe, expect, it } from "vitest";

import {
  createCustomZoneInStore,
  layoutZoneElements,
  updateCustomZoneInStore,
  ZONE_NAME_MAX_CHARS,
} from "@/lib/domain/custom-zones";
import { deletePetFromStore, setPetHomeInStore } from "@/lib/domain/pet-lifecycle";
import { buildTerrainMap } from "@/lib/domain/terrain";
import {
  canPetEnterZone,
  canViewerAccessZone,
  listAccessibleZones,
  MAX_CUSTOM_ZONES_PER_USER,
} from "@/lib/domain/zone-access";
import { advanceStoreToNow, buildGardenSnapshot } from "@/lib/domain/simulation";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore, GardenZone } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

function luna(store: AppStore) {
  return store.profiles.find((entry) => entry.id === "profile-luna")!;
}

function mars(store: AppStore) {
  return store.profiles.find((entry) => entry.id === "profile-mars")!;
}

describe("zone access rules", () => {
  it("treats built-in zones as public for everyone", () => {
    const store = cloneStore();
    const orchard = store.gardenZones.find((zone) => zone.id === "orchard")!;

    expect(canViewerAccessZone(orchard, undefined)).toBe(true);
    expect(canViewerAccessZone(orchard, "profile-luna")).toBe(true);
  });

  it("hides private areas from strangers but not the owner", () => {
    const zone: GardenZone = {
      id: "zone-test",
      name: "Luna Lab",
      description: "",
      accent: "#fff",
      speciesBias: "all",
      ownerId: "profile-luna",
      visibility: "private",
    };

    expect(canViewerAccessZone(zone, "profile-luna")).toBe(true);
    expect(canViewerAccessZone(zone, "profile-mars")).toBe(false);
    expect(canViewerAccessZone(zone, undefined)).toBe(false);
  });

  it("only lets the owner's pets into a private area", () => {
    const store = cloneStore();
    store.gardenZones.push({
      id: "zone-test",
      name: "Luna Lab",
      description: "",
      accent: "#fff",
      speciesBias: "all",
      ownerId: "profile-luna",
      visibility: "private",
    });

    const lunaPet = store.pets.find((pet) => pet.ownerId === "profile-luna")!;
    const marsPet = store.pets.find((pet) => pet.ownerId === "profile-mars")!;

    expect(canPetEnterZone(store, lunaPet, "zone-test")).toBe(true);
    expect(canPetEnterZone(store, marsPet, "zone-test")).toBe(false);
    expect(canPetEnterZone(store, marsPet, "orchard")).toBe(true);
  });
});

describe("createCustomZoneInStore", () => {
  it("creates a named area with decor objects and moves chosen pets in", () => {
    const store = cloneStore();
    const owner = luna(store);
    const ownPet = store.pets.find((pet) => pet.ownerId === owner.id)!;

    const { zone, movedPetIds } = createCustomZoneInStore(store, {
      owner,
      name: "Luna 实验田",
      visibility: "private",
      elements: ["tree", "pond", "toy"],
      petIds: [ownPet.id],
    });

    expect(zone.ownerId).toBe(owner.id);
    expect(zone.visibility).toBe("private");
    expect(zone.layout?.elements).toContain("pond");
    expect(movedPetIds).toEqual([ownPet.id]);

    const state = store.petStates.find((entry) => entry.petId === ownPet.id)!;
    expect(state.zoneId).toBe(zone.id);

    const zoneObjects = store.worldObjects.filter((object) => object.zoneId === zone.id);
    expect(zoneObjects.some((object) => object.type === "tree")).toBe(true);
    expect(zoneObjects.some((object) => object.type === "toy")).toBe(true);
    expect(zoneObjects.some((object) => object.type === "pond_edge")).toBe(true);
  });

  it("ignores pets that belong to someone else", () => {
    const store = cloneStore();
    const owner = luna(store);
    const foreignPet = store.pets.find((pet) => pet.ownerId === "profile-mars")!;

    const { movedPetIds } = createCustomZoneInStore(store, {
      owner,
      name: "蹭宠物失败",
      visibility: "public",
      elements: ["bush"],
      petIds: [foreignPet.id],
    });

    expect(movedPetIds).toEqual([]);
    const state = store.petStates.find((entry) => entry.petId === foreignPet.id)!;
    expect(state.zoneId).not.toMatch(/^zone-/);
  });

  it("enforces the name and per-user zone caps", () => {
    const store = cloneStore();
    const owner = luna(store);

    expect(() =>
      createCustomZoneInStore(store, {
        owner,
        name: "x".repeat(ZONE_NAME_MAX_CHARS + 1),
        visibility: "public",
        elements: ["tree"],
        petIds: [],
      }),
    ).toThrow();

    for (let index = 0; index < MAX_CUSTOM_ZONES_PER_USER; index += 1) {
      createCustomZoneInStore(store, {
        owner,
        name: `区域${index}`,
        visibility: "public",
        elements: ["tree"],
        petIds: [],
      });
    }

    expect(() =>
      createCustomZoneInStore(store, {
        owner,
        name: "超出上限",
        visibility: "public",
        elements: ["tree"],
        petIds: [],
      }),
    ).toThrow();
  });

  it("keeps decor off the pond and the path", () => {
    const placed = layoutZoneElements(["tree", "bush", "stone", "pond", "toy"], "seed01");

    for (const item of placed) {
      if (item.type === "pond_edge") {
        continue;
      }

      const dx = (item.tileX - 24) / 10;
      const dy = (item.tileY - 19) / 8;
      expect(dx * dx + dy * dy).toBeGreaterThan(1);
      expect(item.tileY < 30 || item.tileY > 32).toBe(true);
    }
  });
});

describe("custom zone world integration", () => {
  function storeWithPrivateZone() {
    const store = cloneStore();
    const owner = luna(store);
    const ownPet = store.pets.find((pet) => pet.ownerId === owner.id)!;
    const { zone } = createCustomZoneInStore(store, {
      owner,
      name: "Luna 密境",
      visibility: "private",
      elements: ["tree", "pond"],
      petIds: [ownPet.id],
    });

    return { store, zone, owner, ownPet };
  }

  it("generates livable terrain with water for custom pond zones", () => {
    const { store, zone } = storeWithPrivateZone();
    const terrain = buildTerrainMap(zone.id, store.gardenZones.find((entry) => entry.id === zone.id));

    expect(terrain.tiles.some((tile) => tile.type === "water")).toBe(true);
    expect(terrain.structures.some((structure) => structure.kind === "feeding_station")).toBe(true);
  });

  it("lists the private zone only for its owner", () => {
    const { store, zone, owner } = storeWithPrivateZone();

    expect(listAccessibleZones(store, owner.id).some((entry) => entry.id === zone.id)).toBe(true);
    expect(listAccessibleZones(store, mars(store).id).some((entry) => entry.id === zone.id)).toBe(false);
    expect(listAccessibleZones(store, undefined).some((entry) => entry.id === zone.id)).toBe(false);
  });

  it("never lets foreign pets roam into the private zone during simulation", async () => {
    const { store, zone } = storeWithPrivateZone();
    const now = new Date();

    // Give every foreign pet an explicit goal to invade the private zone.
    for (const pet of store.pets.filter((entry) => entry.ownerId !== "profile-luna")) {
      store.petGoals.push({
        id: `goal-invade-${pet.id}`,
        petId: pet.id,
        goalType: "move_to_zone",
        priority: 99,
        targetZoneId: zone.id,
        status: "active",
        progress: 0,
        reason: "test",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      });

      const state = store.petStates.find((entry) => entry.petId === pet.id);
      if (state) {
        state.actionEndsAt = new Date(now.getTime() - 1000).toISOString();
        state.lastSimulatedAt = new Date(now.getTime() - 30_000).toISOString();
      }
    }

    await advanceStoreToNow(store, now, { llmMode: "off" });

    const intruders = store.petStates.filter((state) => {
      const pet = store.pets.find((entry) => entry.id === state.petId);
      return state.zoneId === zone.id && pet && pet.ownerId !== "profile-luna";
    });

    expect(intruders).toEqual([]);
  });

  it("builds a snapshot for the custom zone with its pets", () => {
    const { store, zone, ownPet } = storeWithPrivateZone();
    const snapshot = buildGardenSnapshot(store, zone.id, "profile-luna");

    expect(snapshot.zone.id).toBe(zone.id);
    expect(snapshot.pets.some((entry) => entry.pet.id === ownPet.id)).toBe(true);
  });

  it("supports renaming and visibility toggles by the owner only", () => {
    const { store, zone, owner } = storeWithPrivateZone();

    const updated = updateCustomZoneInStore(store, {
      owner,
      zoneId: zone.id,
      name: "改名了",
      visibility: "public",
    });
    expect(updated.name).toBe("改名了");
    expect(updated.visibility).toBe("public");

    expect(() =>
      updateCustomZoneInStore(store, {
        owner: mars(store),
        zoneId: zone.id,
        visibility: "private",
      }),
    ).toThrow();
  });
});

describe("pet home (定居)", () => {
  function settledSetup() {
    const store = cloneStore();
    const owner = luna(store);
    const pet = store.pets.find((entry) => entry.ownerId === owner.id && !entry.isFrozen)!;
    const { zone } = createCustomZoneInStore(store, {
      owner,
      name: "定居测试",
      visibility: "private",
      elements: ["tree"],
      petIds: [],
    });

    setPetHomeInStore(store, { owner, petId: pet.id, zoneId: zone.id });
    return { store, owner, pet, zone };
  }

  it("moves the pet in and records its home", () => {
    const { store, pet, zone } = settledSetup();
    const state = store.petStates.find((entry) => entry.petId === pet.id)!;

    expect(pet.homeZoneId).toBe(zone.id);
    expect(state.zoneId).toBe(zone.id);
    expect(store.petEvents[0]?.body).toContain("把这里当成家");
  });

  it("keeps a settled pet in its home across simulation despite wanderlust goals", async () => {
    const { store, pet, zone } = settledSetup();
    const now = new Date();
    const state = store.petStates.find((entry) => entry.petId === pet.id)!;

    store.petGoals.push({
      id: "goal-wander-out",
      petId: pet.id,
      goalType: "move_to_zone",
      priority: 99,
      targetZoneId: "orchard",
      status: "active",
      progress: 0,
      reason: "test",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
    });
    state.actionEndsAt = new Date(now.getTime() - 1000).toISOString();
    state.lastSimulatedAt = new Date(now.getTime() - 30_000).toISOString();
    state.energy = 90;
    state.hunger = 10;
    state.bladder = 10;
    state.stress = 10;

    await advanceStoreToNow(store, now, { llmMode: "off" });

    expect(state.zoneId).toBe(zone.id);
  });

  it("sends a displaced settled pet back home through the goal engine", async () => {
    const { store, pet, zone } = settledSetup();
    const state = store.petStates.find((entry) => entry.petId === pet.id)!;

    // Displace the pet as if it had been summoned elsewhere.
    state.zoneId = "orchard";
    state.tileX = 20;
    state.tileY = 20;

    // Two retarget windows: goals are planned on the first, acted on after.
    for (const offsetMs of [0, 30_000]) {
      const tick = new Date(Date.now() + offsetMs);
      state.actionEndsAt = new Date(tick.getTime() - 1000).toISOString();
      state.lastSimulatedAt = new Date(tick.getTime() - 25_000).toISOString();
      state.energy = 90;
      state.hunger = 10;
      state.bladder = 10;
      state.stress = 10;
      await advanceStoreToNow(store, tick, { llmMode: "off" });
    }

    expect(state.zoneId).toBe(zone.id);
  });

  it("clearing the home restores free roaming", () => {
    const { store, owner, pet } = settledSetup();

    setPetHomeInStore(store, { owner, petId: pet.id, zoneId: null });

    expect(pet.homeZoneId).toBeUndefined();
    expect(store.petEvents[0]?.body).toContain("自由漫游");
  });

  it("rejects foreign owners and inaccessible zones", () => {
    const { store, pet } = settledSetup();
    const stranger = mars(store);

    expect(() =>
      setPetHomeInStore(store, { owner: stranger, petId: pet.id, zoneId: "orchard" }),
    ).toThrow();

    const strangerPet = store.pets.find((entry) => entry.ownerId === stranger.id)!;
    const privateZone = store.gardenZones.find((entry) => entry.ownerId === "profile-luna")!;

    expect(() =>
      setPetHomeInStore(store, {
        owner: stranger,
        petId: strangerPet.id,
        zoneId: privateZone.id,
      }),
    ).toThrow();
  });
});

describe("deletePetFromStore", () => {
  it("removes the pet and every trace of it", () => {
    const store = cloneStore();
    const owner = luna(store);
    const pet = store.pets.find((entry) => entry.ownerId === owner.id)!;

    const result = deletePetFromStore(store, { owner, petId: pet.id });

    expect(result.petName).toBe(pet.name);
    expect(store.pets.some((entry) => entry.id === pet.id)).toBe(false);
    expect(store.petStates.some((entry) => entry.petId === pet.id)).toBe(false);
    expect(store.petEvents.some((entry) => entry.petId === pet.id)).toBe(false);
    expect(store.petMemories.some((entry) => entry.petId === pet.id)).toBe(false);
    expect(
      store.petRelationships.some((entry) => entry.petAId === pet.id || entry.petBId === pet.id),
    ).toBe(false);
    expect(store.chatSessions.some((entry) => entry.petId === pet.id)).toBe(false);
    expect(store.worldObjects.some((entry) => entry.petId === pet.id)).toBe(false);
  });

  it("refuses to delete someone else's pet", () => {
    const store = cloneStore();
    const pet = store.pets.find((entry) => entry.ownerId === "profile-luna")!;

    expect(() => deletePetFromStore(store, { owner: mars(store), petId: pet.id })).toThrow();
    expect(store.pets.some((entry) => entry.id === pet.id)).toBe(true);
  });
});
