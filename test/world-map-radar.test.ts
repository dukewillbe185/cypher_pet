import { describe, expect, it } from "vitest";

import { buildWorldZoneRadarItems } from "@/components/garden/world-map-radar";
import type { GardenSnapshot } from "@/lib/types";

const now = "2026-06-28T00:00:00.000Z";

function snapshot(
  zoneId: GardenSnapshot["zone"]["id"],
  overrides: Partial<GardenSnapshot> = {},
): GardenSnapshot {
  return {
    zone: {
      id: zoneId,
      name: zoneId,
      description: `${zoneId} description`,
      accent: "#39ff14",
      speciesBias: "all",
    },
    serverTime: now,
    world: {
      clockLabel: "12:00",
      phase: "day",
      cycleProgress: 0.5,
      minuteOfDay: 720,
      isNight: false,
      skyTop: "#000",
      skyBottom: "#111",
      ambientGlow: "rgba(255,255,255,0.2)",
      overlayAlpha: 0,
      neonAlpha: 0.2,
      ambienceLabel: "clear",
    },
    pets: [],
    objects: [],
    environmentActors: [],
    recentEvents: [],
    encounters: [],
    encounterMarkers: [],
    ...overrides,
  };
}

describe("world map radar", () => {
  it("summarizes every zone and marks the active zone", () => {
    const items = buildWorldZoneRadarItems(
      [
        snapshot("orchard", {
          pets: [{ pet: { id: "pet-1" } } as GardenSnapshot["pets"][number]],
          encounters: [
            {
              id: "encounter-1",
              kind: "conflict",
              tone: "conflict",
              stage: "spark",
              status: "active",
              zoneId: "orchard",
              title: "Nyx and Ember are tense",
              summary: "A sharp encounter is unfolding.",
              participantPetIds: ["pet-1", "pet-2"],
              relatedEventIds: [],
              suggestedOwnerActions: ["call"],
              updatedAt: now,
            },
          ],
          encounterMarkers: [{} as GardenSnapshot["encounterMarkers"][number]],
          recentEvents: [{ id: "event-1" } as GardenSnapshot["recentEvents"][number]],
        }),
        snapshot("pond"),
      ],
      "orchard",
    );

    expect(items).toEqual([
      expect.objectContaining({
        zoneId: "orchard",
        active: true,
        petCount: 1,
        encounterCount: 1,
        eventCount: 1,
        markerCount: 1,
        tone: "conflict",
        topSignal: "Nyx and Ember are tense",
      }),
      expect.objectContaining({
        zoneId: "pond",
        active: false,
        tone: "quiet",
        topSignal: "Quiet patrol",
      }),
    ]);
  });

  it("uses recent events as off-page signals when a zone has no encounters", () => {
    const items = buildWorldZoneRadarItems(
      [
        snapshot("grove", {
          recentEvents: [
            {
              id: "event-1",
              petId: "pet-1",
              zoneId: "grove",
              type: "climbed_tree",
              body: "Halo climbed into the grove canopy.",
              emotion: "curious",
              createdAt: now,
            },
          ],
        }),
      ],
      "orchard",
    );

    expect(items[0]).toMatchObject({
      zoneId: "grove",
      active: false,
      tone: "event",
      topSignal: "Halo climbed into the grove canopy.",
      eventCount: 1,
    });
  });

  it("counts zone move arrivals as visible map signals", () => {
    const items = buildWorldZoneRadarItems(
      [
        snapshot("pond", {
          pets: [
            {
              pet: { id: "pet-miso", name: "Miso" },
              state: { tileX: 14, tileY: 18 },
            } as GardenSnapshot["pets"][number],
          ],
          recentEvents: [
            {
              id: "event-miso-arrival",
              petId: "pet-miso",
              zoneId: "pond",
              type: "zone_move",
              body: "Miso slipped from 果树区 into 水池区.",
              createdAt: now,
            },
          ],
        }),
      ],
      "orchard",
    );

    expect(items[0]).toMatchObject({
      zoneId: "pond",
      arrivalCount: 1,
      markerCount: 1,
      tone: "explore",
      topSignal: "Miso slipped from 果树区 into 水池区.",
    });
  });
});
