import { describe, expect, it } from "vitest";

import { listGardenLedgerEvents } from "@/lib/domain/garden-memory";
import { deletePetFromStore } from "@/lib/domain/pet-lifecycle";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore, GardenLedgerEvent } from "@/lib/types";

function ledgerEvent(overrides: Partial<GardenLedgerEvent> & { id: string; zoneId: string }): GardenLedgerEvent {
  return {
    type: "social_interaction",
    participants: [],
    salience: 5,
    body: "",
    semanticTags: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("listGardenLedgerEvents zone allowlist", () => {
  it("drops events from zones outside the accessible set", () => {
    const store = {
      gardenLedgerEvents: [
        ledgerEvent({ id: "e-public", zoneId: "orchard" }),
        ledgerEvent({ id: "e-private", zoneId: "zone-secret" }),
        ledgerEvent({ id: "e-own", zoneId: "zone-mine" }),
      ],
    } as unknown as AppStore;

    const visible = listGardenLedgerEvents(store, {
      zoneIds: new Set(["orchard", "zone-mine"]),
      limit: 24,
    });

    expect(visible.map((event) => event.id).sort()).toEqual(["e-own", "e-public"]);
    expect(visible.some((event) => event.zoneId === "zone-secret")).toBe(false);
  });

  it("applies the allowlist before the limit so a private zone can't crowd out visible events", () => {
    const events: GardenLedgerEvent[] = [];
    // Newest-first: 5 private then 3 public. A naive limit-then-filter would
    // return the 5 private (dropped) and lose the public events entirely.
    for (let index = 0; index < 5; index += 1) {
      events.push(
        ledgerEvent({
          id: `private-${index}`,
          zoneId: "zone-secret",
          createdAt: new Date(Date.now() - index * 1000).toISOString(),
        }),
      );
    }
    for (let index = 0; index < 3; index += 1) {
      events.push(
        ledgerEvent({
          id: `public-${index}`,
          zoneId: "orchard",
          createdAt: new Date(Date.now() - (100 + index) * 1000).toISOString(),
        }),
      );
    }

    const store = { gardenLedgerEvents: events } as unknown as AppStore;

    const visible = listGardenLedgerEvents(store, {
      zoneIds: new Set(["orchard"]),
      limit: 3,
    });

    expect(visible).toHaveLength(3);
    expect(visible.every((event) => event.zoneId === "orchard")).toBe(true);
  });
});

describe("deletePetFromStore ledger cleanup", () => {
  it("purges ledger events that reference the deleted pet", () => {
    const store = structuredClone(seedStore) as AppStore;
    const owner = store.profiles.find((entry) => entry.id === "profile-luna")!;
    const pet = store.pets.find((entry) => entry.ownerId === owner.id)!;
    const otherPet = store.pets.find((entry) => entry.ownerId !== owner.id)!;

    store.gardenLedgerEvents = [
      ledgerEvent({ id: "with-pet", zoneId: "orchard", participants: [pet.id, otherPet.id] }),
      ledgerEvent({ id: "without-pet", zoneId: "orchard", participants: [otherPet.id] }),
    ];

    deletePetFromStore(store, { owner, petId: pet.id });

    expect(store.gardenLedgerEvents.map((event) => event.id)).toEqual(["without-pet"]);
  });
});
