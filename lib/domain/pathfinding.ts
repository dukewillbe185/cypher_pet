import { buildTerrainMap } from "@/lib/domain/terrain";
import { WORLD_BOUNDS, WORLD_COLS, WORLD_ROWS } from "@/lib/domain/world";
import type { GardenZoneId } from "@/lib/types";

export interface TilePoint {
  tileX: number;
  tileY: number;
}

const MAX_EXPLORED_NODES = 4200;
const BRIDGE_OPEN_RADIUS = 1;

const walkabilityCache = new Map<GardenZoneId, Uint8Array>();

function tileIndex(tileX: number, tileY: number) {
  return tileY * WORLD_COLS + tileX;
}

function inGrid(tileX: number, tileY: number) {
  return tileX >= 0 && tileX < WORLD_COLS && tileY >= 0 && tileY < WORLD_ROWS;
}

function buildWalkabilityGrid(zoneId: GardenZoneId) {
  const grid = new Uint8Array(WORLD_COLS * WORLD_ROWS).fill(1);
  const terrain = buildTerrainMap(zoneId);

  for (const tile of terrain.tiles) {
    if (!inGrid(tile.x, tile.y)) {
      continue;
    }

    if (tile.type === "water" || tile.type === "lily") {
      grid[tileIndex(tile.x, tile.y)] = 0;
    }
  }

  for (const structure of terrain.structures) {
    if (structure.kind !== "bridge") {
      continue;
    }

    for (let dy = -BRIDGE_OPEN_RADIUS; dy <= BRIDGE_OPEN_RADIUS; dy += 1) {
      for (let dx = -BRIDGE_OPEN_RADIUS; dx <= BRIDGE_OPEN_RADIUS; dx += 1) {
        const x = structure.x + dx;
        const y = structure.y + dy;

        if (inGrid(x, y)) {
          grid[tileIndex(x, y)] = 1;
        }
      }
    }
  }

  return grid;
}

function walkabilityGrid(zoneId: GardenZoneId) {
  const cached = walkabilityCache.get(zoneId);

  if (cached) {
    return cached;
  }

  const grid = buildWalkabilityGrid(zoneId);
  walkabilityCache.set(zoneId, grid);
  return grid;
}

export function isWalkableTile(zoneId: GardenZoneId, tileX: number, tileY: number) {
  if (!inGrid(tileX, tileY)) {
    return false;
  }

  return walkabilityGrid(zoneId)[tileIndex(tileX, tileY)] === 1;
}

export function clampToRoamBounds(point: TilePoint): TilePoint {
  return {
    tileX: Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, Math.round(point.tileX))),
    tileY: Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, Math.round(point.tileY))),
  };
}

export function findNearestWalkableTile(zoneId: GardenZoneId, point: TilePoint): TilePoint {
  const target = clampToRoamBounds(point);

  if (isWalkableTile(zoneId, target.tileX, target.tileY)) {
    return target;
  }

  for (let radius = 1; radius <= Math.max(WORLD_COLS, WORLD_ROWS); radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) {
          continue;
        }

        const tileX = target.tileX + dx;
        const tileY = target.tileY + dy;

        if (isWalkableTile(zoneId, tileX, tileY)) {
          return { tileX, tileY };
        }
      }
    }
  }

  return target;
}

function hasLineOfSight(grid: Uint8Array, from: TilePoint, to: TilePoint) {
  let x = from.tileX;
  let y = from.tileY;
  const deltaX = Math.abs(to.tileX - x);
  const deltaY = Math.abs(to.tileY - y);
  const stepX = x < to.tileX ? 1 : -1;
  const stepY = y < to.tileY ? 1 : -1;
  let error = deltaX - deltaY;

  while (x !== to.tileX || y !== to.tileY) {
    const doubledError = error * 2;

    if (doubledError > -deltaY) {
      error -= deltaY;
      x += stepX;
    }

    if (doubledError < deltaX) {
      error += deltaX;
      y += stepY;
    }

    if (!inGrid(x, y) || grid[tileIndex(x, y)] !== 1) {
      return false;
    }
  }

  return true;
}

function smoothPath(grid: Uint8Array, path: TilePoint[]) {
  if (path.length <= 2) {
    return path;
  }

  const smoothed: TilePoint[] = [path[0]];
  let anchorIndex = 0;

  for (let index = 1; index < path.length; index += 1) {
    const isLast = index === path.length - 1;

    if (isLast || !hasLineOfSight(grid, path[anchorIndex], path[index + 1])) {
      smoothed.push(path[index]);
      anchorIndex = index;
    }
  }

  return smoothed;
}

const NEIGHBOR_STEPS = [
  { dx: 0, dy: -1, cost: 1 },
  { dx: 1, dy: 0, cost: 1 },
  { dx: 0, dy: 1, cost: 1 },
  { dx: -1, dy: 0, cost: 1 },
  { dx: 1, dy: -1, cost: Math.SQRT2 },
  { dx: 1, dy: 1, cost: Math.SQRT2 },
  { dx: -1, dy: 1, cost: Math.SQRT2 },
  { dx: -1, dy: -1, cost: Math.SQRT2 },
];

function octileHeuristic(from: TilePoint, to: TilePoint) {
  const dx = Math.abs(from.tileX - to.tileX);
  const dy = Math.abs(from.tileY - to.tileY);
  return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
}

/**
 * A* over the zone walkability grid. Returns waypoints from start (exclusive)
 * to goal (inclusive). Falls back to a straight segment when no path exists
 * within the node budget so callers can always animate toward the target.
 */
export function findWalkingPath(zoneId: GardenZoneId, start: TilePoint, goal: TilePoint): TilePoint[] {
  const grid = walkabilityGrid(zoneId);
  const from = findNearestWalkableTile(zoneId, start);
  const to = findNearestWalkableTile(zoneId, goal);

  if (from.tileX === to.tileX && from.tileY === to.tileY) {
    return [to];
  }

  const gScores = new Map<number, number>();
  const cameFrom = new Map<number, number>();
  const open: Array<{ index: number; fScore: number }> = [];
  const startIndex = tileIndex(from.tileX, from.tileY);
  const goalIndex = tileIndex(to.tileX, to.tileY);

  gScores.set(startIndex, 0);
  open.push({ index: startIndex, fScore: octileHeuristic(from, to) });

  let explored = 0;

  while (open.length > 0 && explored < MAX_EXPLORED_NODES) {
    let bestPosition = 0;

    for (let position = 1; position < open.length; position += 1) {
      if (open[position].fScore < open[bestPosition].fScore) {
        bestPosition = position;
      }
    }

    const current = open.splice(bestPosition, 1)[0];
    explored += 1;

    if (current.index === goalIndex) {
      const reversed: TilePoint[] = [];
      let cursor: number | undefined = goalIndex;

      while (cursor !== undefined && cursor !== startIndex) {
        reversed.push({ tileX: cursor % WORLD_COLS, tileY: Math.floor(cursor / WORLD_COLS) });
        cursor = cameFrom.get(cursor);
      }

      reversed.push(from);
      const ordered = reversed.reverse();
      return smoothPath(grid, ordered).slice(1);
    }

    const currentX = current.index % WORLD_COLS;
    const currentY = Math.floor(current.index / WORLD_COLS);
    const currentG = gScores.get(current.index) ?? Number.POSITIVE_INFINITY;

    for (const step of NEIGHBOR_STEPS) {
      const nextX = currentX + step.dx;
      const nextY = currentY + step.dy;

      if (!inGrid(nextX, nextY) || grid[tileIndex(nextX, nextY)] !== 1) {
        continue;
      }

      // A diagonal move must not cut a blocked corner.
      if (
        step.cost > 1 &&
        (grid[tileIndex(currentX + step.dx, currentY)] !== 1 ||
          grid[tileIndex(currentX, currentY + step.dy)] !== 1)
      ) {
        continue;
      }

      const nextIndex = tileIndex(nextX, nextY);
      const tentativeG = currentG + step.cost;

      if (tentativeG >= (gScores.get(nextIndex) ?? Number.POSITIVE_INFINITY)) {
        continue;
      }

      gScores.set(nextIndex, tentativeG);
      cameFrom.set(nextIndex, current.index);
      open.push({
        index: nextIndex,
        fScore: tentativeG + octileHeuristic({ tileX: nextX, tileY: nextY }, to),
      });
    }
  }

  return [to];
}
