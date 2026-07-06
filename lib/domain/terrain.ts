import { WORLD_COLS, WORLD_ROWS } from "@/lib/domain/world";
import type { GardenZone, GardenZoneId } from "@/lib/types";

export type TerrainTileType =
  | "grass"
  | "flower_grass"
  | "bush_grass"
  | "stone_path"
  | "dirt_path"
  | "water"
  | "lily";

export type TerrainStructureKind =
  | "dog_house"
  | "cat_basket"
  | "cat_tree"
  | "bench"
  | "lamp"
  | "toy_box"
  | "feeding_station"
  | "bridge"
  | "water_bowl";

export interface TerrainTile {
  x: number;
  y: number;
  type: TerrainTileType;
}

export interface TerrainStructure {
  id: string;
  x: number;
  y: number;
  kind: TerrainStructureKind;
}

export interface TerrainMap {
  tiles: TerrainTile[];
  structures: TerrainStructure[];
}

function rectTiles(type: TerrainTileType, left: number, top: number, right: number, bottom: number) {
  const tiles: TerrainTile[] = [];

  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      tiles.push({ x, y, type });
    }
  }

  return tiles;
}

function ellipseTiles(type: TerrainTileType, centerX: number, centerY: number, radiusX: number, radiusY: number) {
  const tiles: TerrainTile[] = [];

  for (let y = centerY - radiusY; y <= centerY + radiusY; y += 1) {
    for (let x = centerX - radiusX; x <= centerX + radiusX; x += 1) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      if (dx * dx + dy * dy <= 1) {
        tiles.push({ x, y, type });
      }
    }
  }

  return tiles;
}

function everyOtherFlower(left: number, top: number, right: number, bottom: number) {
  return rectTiles("flower_grass", left, top, right, bottom).filter((tile) => (tile.x + tile.y) % 3 === 0);
}

function everyOtherBush(left: number, top: number, right: number, bottom: number) {
  return rectTiles("bush_grass", left, top, right, bottom).filter((tile) => (tile.x * 2 + tile.y) % 4 === 0);
}

/**
 * Terrain for a player-created area: cozy grass base, a path, livability
 * structures, and a small pond when the creator picked one.
 */
function buildCustomTerrain(zoneId: GardenZoneId, zone?: GardenZone): TerrainMap {
  const maxX = WORLD_COLS - 1;
  const maxY = WORLD_ROWS - 1;
  const tiles: TerrainTile[] = rectTiles("grass", 0, 0, maxX, maxY);
  const hasPond = zone?.layout?.elements.includes("pond") ?? false;

  tiles.push(...rectTiles("dirt_path", 12, 30, 37, 32));
  tiles.push(...everyOtherFlower(6, 24, 14, 38));
  tiles.push(...everyOtherFlower(34, 24, 42, 38));

  if (hasPond) {
    tiles.push(...ellipseTiles("water", 24, 19, 8, 6));
    tiles.push(...ellipseTiles("lily", 23, 19, 5, 3).filter((tile) => (tile.x + tile.y) % 4 === 0));
  }

  const structures: TerrainStructure[] = [
    { id: `${zoneId}-feeder`, x: 20, y: 35, kind: "feeding_station" },
    { id: `${zoneId}-water-bowl`, x: 28, y: 35, kind: "water_bowl" },
    { id: `${zoneId}-bench`, x: 33, y: 24, kind: "bench" },
    { id: `${zoneId}-lamp-west`, x: 12, y: 20, kind: "lamp" },
    { id: `${zoneId}-lamp-east`, x: 38, y: 20, kind: "lamp" },
  ];

  return { tiles, structures };
}

// Terrain is deterministic per zone (built-ins are static; custom layouts are
// immutable once created), so cache it — the simulation asks for it on every
// pet retarget and used to allocate ~2300 tiles each time.
const terrainCache = new Map<string, TerrainMap>();

export function buildTerrainMap(zoneId: GardenZoneId, zone?: GardenZone): TerrainMap {
  const cacheKey = `${zoneId}:${zone?.layout?.seed ?? "static"}`;
  const cached = terrainCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const terrain = computeTerrainMap(zoneId, zone);
  terrainCache.set(cacheKey, terrain);
  return terrain;
}

function computeTerrainMap(zoneId: GardenZoneId, zone?: GardenZone): TerrainMap {
  if (
    zoneId !== "orchard" &&
    zoneId !== "pond" &&
    zoneId !== "grove" &&
    zoneId !== "dog-run"
  ) {
    return buildCustomTerrain(zoneId, zone);
  }

  const maxX = WORLD_COLS - 1;
  const maxY = WORLD_ROWS - 1;
  const tiles: TerrainTile[] = rectTiles("grass", 0, 0, maxX, maxY);
  const structures: TerrainStructure[] = [];

  if (zoneId === "orchard") {
    tiles.push(...everyOtherFlower(4, 24, 12, 36));
    tiles.push(...everyOtherFlower(30, 24, 42, 37));
    tiles.push(...everyOtherFlower(18, 34, 29, 42));
    tiles.push(...rectTiles("dirt_path", 10, 28, 37, 31));
    tiles.push(...everyOtherBush(5, 12, 10, 18));
    tiles.push(...everyOtherBush(36, 12, 42, 18));
    tiles.push(...everyOtherBush(19, 8, 27, 11));
    structures.push(
      { id: "orchard-cat-tree-left", x: 8, y: 14, kind: "cat_tree" },
      { id: "orchard-cat-tree-right", x: 38, y: 14, kind: "cat_tree" },
      { id: "orchard-bench", x: 33, y: 23, kind: "bench" },
      { id: "orchard-dog-house", x: 11, y: 33, kind: "dog_house" },
      { id: "orchard-basket", x: 30, y: 33, kind: "cat_basket" },
      { id: "orchard-feeder", x: 24, y: 35, kind: "feeding_station" },
      { id: "orchard-lamp", x: 40, y: 18, kind: "lamp" },
      { id: "orchard-lamp-2", x: 15, y: 20, kind: "lamp" },
    );
  }

  if (zoneId === "pond") {
    tiles.push(...ellipseTiles("water", 24, 22, 10, 8));
    tiles.push(...ellipseTiles("lily", 23, 22, 7, 4).filter((tile) => (tile.x + tile.y) % 4 === 0));
    tiles.push(...rectTiles("stone_path", 12, 31, 36, 33));
    tiles.push(...everyOtherFlower(5, 26, 13, 40));
    tiles.push(...everyOtherFlower(33, 25, 42, 40));
    structures.push(
      { id: "pond-bridge", x: 18, y: 31, kind: "bridge" },
      { id: "pond-bench", x: 35, y: 21, kind: "bench" },
      { id: "pond-lamp", x: 40, y: 18, kind: "lamp" },
      { id: "pond-basket", x: 31, y: 35, kind: "cat_basket" },
      { id: "pond-water-bowl", x: 14, y: 35, kind: "water_bowl" },
      { id: "pond-lamp-2", x: 10, y: 20, kind: "lamp" },
    );
  }

  if (zoneId === "grove") {
    tiles.push(...everyOtherBush(6, 20, 42, 42));
    tiles.push(...everyOtherFlower(9, 28, 22, 42));
    tiles.push(...rectTiles("dirt_path", 12, 30, 37, 32));
    structures.push(
      { id: "grove-bench", x: 30, y: 24, kind: "bench" },
      { id: "grove-lamp", x: 39, y: 18, kind: "lamp" },
      { id: "grove-feeder", x: 16, y: 34, kind: "feeding_station" },
      { id: "grove-lamp-2", x: 11, y: 23, kind: "lamp" },
    );
  }

  if (zoneId === "dog-run") {
    tiles.push(...rectTiles("grass", 10, 18, 40, 42));
    tiles.push(...rectTiles("stone_path", 10, 30, 39, 33));
    tiles.push(...everyOtherFlower(6, 30, 12, 40));
    tiles.push(...everyOtherFlower(35, 29, 42, 39));
    structures.push(
      { id: "dogrun-house", x: 10, y: 34, kind: "dog_house" },
      { id: "dogrun-toy-box", x: 20, y: 36, kind: "toy_box" },
      { id: "dogrun-bench", x: 33, y: 22, kind: "bench" },
      { id: "dogrun-water", x: 31, y: 36, kind: "water_bowl" },
      { id: "dogrun-feeder", x: 25, y: 36, kind: "feeding_station" },
      { id: "dogrun-lamp", x: 40, y: 18, kind: "lamp" },
      { id: "dogrun-lamp-2", x: 14, y: 19, kind: "lamp" },
    );
  }

  return { tiles, structures };
}
