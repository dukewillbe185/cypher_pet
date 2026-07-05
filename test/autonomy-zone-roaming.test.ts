import { describe, expect, it } from "vitest";

import { buildGardenSnapshot, advanceStoreToNow } from "@/lib/domain/simulation";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

describe("autonomy zone roaming", () => {
  it("lets an autonomous pet move to a different zone when an active goal targets that zone", async () => {
    const store = cloneStore();
    const pet = store.pets.find((entry) => entry.id === "pet-patch")!;
    const state = store.petStates.find((entry) => entry.petId === pet.id)!;
    const now = "2026-03-15T04:00:00.000Z";

    state.zoneId = "orchard";
    state.tileX = 8;
    state.tileY = 8;
    state.activity = "wander";
    state.energy = 82;
    state.hunger = 18;
    state.hygiene = 88;
    state.bladder = 12;
    state.social = 64;
    state.stress = 16;
    state.actionEndsAt = "2026-03-15T03:59:00.000Z";
    state.lastSimulatedAt = "2026-03-15T03:30:00.000Z";
    store.petGoals.unshift({
      id: "goal-patch-pond",
      petId: pet.id,
      goalType: "explore_zone",
      priority: 92,
      targetZoneId: "pond",
      status: "active",
      progress: 0,
      reason: "Patch wants to investigate the water edge.",
      createdAt: "2026-03-15T03:20:00.000Z",
      updatedAt: "2026-03-15T03:20:00.000Z",
      expiresAt: "2026-03-15T09:20:00.000Z",
    });

    await advanceStoreToNow(store, new Date(now), { llmMode: "off" });

    expect(state.zoneId).toBe("pond");
    expect(state.activity).toBe("move_to_zone");
    expect(state.lastKnownZonePreference).toBe("pond");
    const moveEvent = store.petEvents.find((event) => event.petId === pet.id && event.type === "zone_move");
    expect(moveEvent).toMatchObject({
      petId: pet.id,
      zoneId: "pond",
      type: "zone_move",
    });
    expect(moveEvent?.body).toContain("果树区");
    expect(moveEvent?.body).toContain("水池区");
    expect(buildGardenSnapshot(store, "pond", "profile-luna").recentEvents).toContainEqual(expect.objectContaining({
      petId: pet.id,
      type: "zone_move",
      zoneId: "pond",
    }));
  });
});
