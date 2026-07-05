import { describe, expect, it } from "vitest";

import {
  findNearestWalkableTile,
  findWalkingPath,
  isWalkableTile,
} from "@/lib/domain/pathfinding";
import { buildTerrainMap } from "@/lib/domain/terrain";

describe("pathfinding walkability", () => {
  it("keeps grass walkable and pond water blocked", () => {
    expect(isWalkableTile("orchard", 24, 30)).toBe(true);
    expect(isWalkableTile("pond", 24, 22)).toBe(false);
  });

  it("rejects tiles outside the grid", () => {
    expect(isWalkableTile("orchard", -1, 10)).toBe(false);
    expect(isWalkableTile("orchard", 10, 400)).toBe(false);
  });

  it("relocates a water target to the nearest shore tile", () => {
    const shore = findNearestWalkableTile("pond", { tileX: 24, tileY: 22 });

    expect(isWalkableTile("pond", shore.tileX, shore.tileY)).toBe(true);
    expect(Math.abs(shore.tileX - 24) + Math.abs(shore.tileY - 22)).toBeLessThanOrEqual(24);
  });
});

describe("findWalkingPath", () => {
  it("returns waypoints ending exactly at the goal", () => {
    const path = findWalkingPath("orchard", { tileX: 6, tileY: 8 }, { tileX: 40, tileY: 38 });

    expect(path.length).toBeGreaterThan(0);
    expect(path[path.length - 1]).toEqual({ tileX: 40, tileY: 38 });
  });

  it("never routes through pond water", () => {
    const waterTiles = new Set(
      buildTerrainMap("pond")
        .tiles.filter((tile) => tile.type === "water" || tile.type === "lily")
        .map((tile) => `${tile.x}:${tile.y}`),
    );
    const path = findWalkingPath("pond", { tileX: 12, tileY: 22 }, { tileX: 36, tileY: 22 });

    expect(path.length).toBeGreaterThan(1);
    for (const waypoint of path) {
      const key = `${waypoint.tileX}:${waypoint.tileY}`;
      if (waterTiles.has(key)) {
        // Bridge structures re-open a small pocket of water tiles.
        const bridge = buildTerrainMap("pond").structures.find((entry) => entry.kind === "bridge");
        expect(bridge).toBeDefined();
        expect(Math.abs(waypoint.tileX - bridge!.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(waypoint.tileY - bridge!.y)).toBeLessThanOrEqual(1);
      }
    }
  });

  it("handles start equal to goal", () => {
    const path = findWalkingPath("grove", { tileX: 20, tileY: 20 }, { tileX: 20, tileY: 20 });

    expect(path).toEqual([{ tileX: 20, tileY: 20 }]);
  });

  it("smooths long open-field paths down to a few waypoints", () => {
    const path = findWalkingPath("dog-run", { tileX: 8, tileY: 20 }, { tileX: 38, tileY: 40 });

    expect(path.length).toBeLessThanOrEqual(6);
  });
});
