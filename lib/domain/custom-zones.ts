import { randomUUID } from "node:crypto";

import { countCustomZonesOwnedBy, MAX_CUSTOM_ZONES_PER_USER } from "@/lib/domain/zone-access";
import type {
  AppStore,
  CustomZoneElementKind,
  GardenZone,
  GardenZoneVisibility,
  Pet,
  Profile,
  WorldObjectType,
} from "@/lib/types";

export const ZONE_NAME_MAX_CHARS = 16;

interface ElementSpec {
  label: string;
  objectType?: WorldObjectType;
  count: number;
}

/** What each pickable element plants into the area. `pond` is terrain-only. */
export const ZONE_ELEMENT_CATALOG: Record<CustomZoneElementKind, ElementSpec> = {
  tree: { label: "果树", objectType: "tree", count: 4 },
  bush: { label: "灌木", objectType: "bush", count: 5 },
  stone: { label: "石头", objectType: "stone", count: 3 },
  pond: { label: "小池塘", count: 0 },
  fountain: { label: "喷泉", objectType: "fountain", count: 1 },
  lamp: { label: "霓虹路灯", objectType: "lamp", count: 2 },
  doghouse: { label: "狗屋", objectType: "doghouse", count: 1 },
  pet_bed: { label: "宠物床", objectType: "pet_bed", count: 2 },
  rest_spot: { label: "休息点", objectType: "rest_spot", count: 2 },
  toy: { label: "玩具", objectType: "toy", count: 2 },
};

const ZONE_ACCENTS = ["#A78BFA", "#62EFFF", "#BEFE5F", "#FF68DF", "#FDE68A"];

const POND_CENTER = { x: 24, y: 19, rx: 8, ry: 6 };
const PLACEMENT_BOUNDS = { minX: 7, maxX: 41, minY: 9, maxY: 40 };
const PATH_ROWS = { minY: 30, maxY: 32 };
const SPAWN_TILE = { x: 24, y: 33 };

function seededRandom(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4294967296;
  };
}

function insidePond(x: number, y: number, hasPond: boolean) {
  if (!hasPond) {
    return false;
  }

  const dx = (x - POND_CENTER.x) / (POND_CENTER.rx + 2);
  const dy = (y - POND_CENTER.y) / (POND_CENTER.ry + 2);
  return dx * dx + dy * dy <= 1;
}

function onPath(y: number) {
  return y >= PATH_ROWS.minY && y <= PATH_ROWS.maxY;
}

/** Deterministic scatter that keeps decor off the pond, path and each other. */
export function layoutZoneElements(elements: CustomZoneElementKind[], seed: string) {
  const random = seededRandom(seed);
  const hasPond = elements.includes("pond");
  const placed: Array<{ type: WorldObjectType; tileX: number; tileY: number }> = [];

  const farEnough = (x: number, y: number) =>
    placed.every((entry) => Math.hypot(entry.tileX - x, entry.tileY - y) >= 3);

  for (const kind of elements) {
    const spec = ZONE_ELEMENT_CATALOG[kind];

    if (!spec?.objectType) {
      continue;
    }

    for (let index = 0; index < spec.count; index += 1) {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const x = Math.round(
          PLACEMENT_BOUNDS.minX + random() * (PLACEMENT_BOUNDS.maxX - PLACEMENT_BOUNDS.minX),
        );
        const y = Math.round(
          PLACEMENT_BOUNDS.minY + random() * (PLACEMENT_BOUNDS.maxY - PLACEMENT_BOUNDS.minY),
        );

        if (insidePond(x, y, hasPond) || onPath(y) || !farEnough(x, y)) {
          continue;
        }

        placed.push({ type: spec.objectType, tileX: x, tileY: y });
        break;
      }
    }
  }

  // A pond needs watchable edges so cats can do their favorite thing.
  if (hasPond) {
    const edges = [
      { x: POND_CENTER.x - POND_CENTER.rx - 1, y: POND_CENTER.y },
      { x: POND_CENTER.x + POND_CENTER.rx + 1, y: POND_CENTER.y },
      { x: POND_CENTER.x, y: POND_CENTER.y + POND_CENTER.ry + 1 },
    ];

    for (const edge of edges) {
      placed.push({ type: "pond_edge", tileX: edge.x, tileY: edge.y });
    }
  }

  return placed;
}

export interface CreateCustomZoneInput {
  owner: Profile;
  name: string;
  visibility: GardenZoneVisibility;
  elements: CustomZoneElementKind[];
  petIds: string[];
}

export function createCustomZoneInStore(store: AppStore, input: CreateCustomZoneInput) {
  const name = input.name.trim();

  if (!name || name.length > ZONE_NAME_MAX_CHARS) {
    throw new Error(`区域名字需要在 1-${ZONE_NAME_MAX_CHARS} 个字符之间。`);
  }

  if (countCustomZonesOwnedBy(store, input.owner.id) >= MAX_CUSTOM_ZONES_PER_USER) {
    throw new Error(`每个玩家最多开辟 ${MAX_CUSTOM_ZONES_PER_USER} 个区域。`);
  }

  const elements = [...new Set(input.elements)].filter(
    (kind): kind is CustomZoneElementKind => kind in ZONE_ELEMENT_CATALOG,
  );

  if (elements.length === 0) {
    throw new Error("至少选择一种区域元素。");
  }

  const nowIso = new Date().toISOString();
  const seed = randomUUID().slice(0, 8);
  const zone: GardenZone = {
    id: `zone-${seed}`,
    name,
    description: `${input.owner.displayName} 亲手开辟的${
      input.visibility === "private" ? "私人" : "公共"
    }角落。`,
    accent: ZONE_ACCENTS[Math.abs(seed.charCodeAt(0) + seed.charCodeAt(1)) % ZONE_ACCENTS.length],
    speciesBias: "all",
    ownerId: input.owner.id,
    visibility: input.visibility,
    layout: { elements, seed },
    createdAt: nowIso,
  };

  store.gardenZones.push(zone);

  for (const item of layoutZoneElements(elements, seed)) {
    store.worldObjects.push({
      id: `${zone.id}-obj-${randomUUID().slice(0, 8)}`,
      zoneId: zone.id,
      type: item.type,
      tileX: item.tileX,
      tileY: item.tileY,
      createdAt: nowIso,
    });
  }

  const movedPets: Pet[] = [];
  const random = seededRandom(`${seed}-pets`);

  for (const petId of [...new Set(input.petIds)]) {
    const pet = store.pets.find((entry) => entry.id === petId);
    const state = store.petStates.find((entry) => entry.petId === petId);

    if (!pet || !state || pet.ownerId !== input.owner.id) {
      continue;
    }

    state.zoneId = zone.id;
    state.tileX = SPAWN_TILE.x + Math.round(random() * 8 - 4);
    state.tileY = SPAWN_TILE.y + Math.round(random() * 4 - 2);
    state.activity = "look_around";
    state.actionEndsAt = new Date(Date.now() + 12000).toISOString();
    state.currentBubble = {
      text: "新地盘，先巡一圈。",
      kind: "thought",
      expiresAt: new Date(Date.now() + 8000).toISOString(),
    };
    movedPets.push(pet);

    store.petEvents.unshift({
      id: randomUUID(),
      petId: pet.id,
      zoneId: zone.id,
      type: "zone_move",
      body: `${pet.name} 搬进了 ${input.owner.displayName} 新开辟的「${zone.name}」。`,
      createdAt: nowIso,
    });
  }

  store.notifications.unshift({
    id: randomUUID(),
    userId: input.owner.id,
    kind: "system",
    body:
      movedPets.length > 0
        ? `「${zone.name}」已经开辟好了，${movedPets.map((pet) => pet.name).join("、")} 已经搬进去。`
        : `「${zone.name}」已经开辟好了，随时可以带宠物入住。`,
    createdAt: nowIso,
  });

  return { zone, movedPetIds: movedPets.map((pet) => pet.id) };
}

export function updateCustomZoneInStore(
  store: AppStore,
  input: {
    owner: Profile;
    zoneId: string;
    name?: string;
    visibility?: GardenZoneVisibility;
  },
) {
  const zone = store.gardenZones.find((entry) => entry.id === input.zoneId);

  if (!zone || zone.ownerId !== input.owner.id) {
    throw new Error("只有区域主人可以修改这个区域。");
  }

  if (input.name !== undefined) {
    const name = input.name.trim();

    if (!name || name.length > ZONE_NAME_MAX_CHARS) {
      throw new Error(`区域名字需要在 1-${ZONE_NAME_MAX_CHARS} 个字符之间。`);
    }

    zone.name = name;
  }

  if (input.visibility) {
    zone.visibility = input.visibility;
  }

  return zone;
}
