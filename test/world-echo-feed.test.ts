import { describe, expect, it } from "vitest";

import { buildWorldEchoItems } from "@/components/garden/world-echo-feed";
import type { GardenSnapshot } from "@/lib/types";

const now = "2026-06-29T00:00:00.000Z";

function snapshot(
  zoneId: GardenSnapshot["zone"]["id"],
  overrides: Partial<GardenSnapshot> = {},
): GardenSnapshot {
  return {
    zone: {
      id: zoneId,
      name:
        zoneId === "orchard"
          ? "果树区"
          : zoneId === "pond"
            ? "水池区"
            : zoneId === "grove"
              ? "灌木区"
              : "追逐区",
      description: "A garden zone.",
      accent: "#bef264",
      speciesBias: "all",
    },
    serverTime: now,
    world: {
      clockLabel: "12:00",
      phase: "day",
      cycleProgress: 0.5,
      minuteOfDay: 720,
      isNight: false,
      skyTop: "#83D8FF",
      skyBottom: "#C5F08F",
      ambientGlow: "rgba(255,255,255,0.08)",
      overlayAlpha: 0,
      neonAlpha: 0.08,
      ambienceLabel: "Day garden.",
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

describe("world echo feed", () => {
  it("prioritizes off-page unresolved encounters over quiet local activity", () => {
    const items = buildWorldEchoItems({
      activeZoneId: "orchard",
      snapshots: [
        snapshot("orchard", {
          recentEvents: [
            {
              id: "event-local",
              petId: "pet-nyx",
              zoneId: "orchard",
              type: "owner_action",
              body: "Nyx moved closer to the tree.",
              createdAt: now,
            },
          ],
        }),
        snapshot("pond", {
          encounters: [
            {
              id: "encounter-pond",
              threadId: "thread-pond",
              kind: "conflict",
              tone: "conflict",
              stage: "spark",
              status: "active",
              zoneId: "pond",
              title: "Sora and Glitch are tense",
              summary: "Sora and Glitch are circling the pond edge.",
              participantPetIds: ["pet-sora", "pet-glitch"],
              relatedEventIds: ["event-pond"],
              suggestedOwnerActions: ["call"],
              updatedAt: now,
            },
          ],
        }),
      ],
    });

    expect(items[0]).toMatchObject({
      id: "encounter:encounter-pond",
      kind: "encounter",
      zoneId: "pond",
      zoneName: "水池区",
      petIds: ["pet-sora", "pet-glitch"],
      actionLabel: "Go to zone",
      isOffPage: true,
      priority: expect.any(Number),
    });
  });

  it("includes recent off-page events when no encounter represents them", () => {
    const items = buildWorldEchoItems({
      activeZoneId: "orchard",
      snapshots: [
        snapshot("grove", {
          recentEvents: [
            {
              id: "event-grove",
              petId: "pet-unit",
              relatedPetId: "pet-moss",
              zoneId: "grove",
              type: "social_chat",
              body: "Unit-7 and Moss exchanged a short signal near the lamp.",
              createdAt: "2026-06-29T00:02:00.000Z",
            },
          ],
        }),
      ],
    });

    expect(items).toEqual([
      expect.objectContaining({
        id: "event:event-grove",
        kind: "event",
        zoneId: "grove",
        title: "social chat",
        summary: "Unit-7 and Moss exchanged a short signal near the lamp.",
        petIds: ["pet-unit", "pet-moss"],
        isOffPage: true,
      }),
    ]);
  });
});
