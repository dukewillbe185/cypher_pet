import { buildTerrainMap, type TerrainStructureKind } from "@/lib/domain/terrain";
import type { AppStore, GardenZoneId, OwnerAction, OwnerPetCommand, PetGoalType, WorldObjectType } from "@/lib/types";

export type OwnerChatWorldCommandDirective = {
  reply: string;
  action: OwnerAction | null;
  goalHint?: PetGoalType;
  targetZoneId?: GardenZoneId;
  command?: OwnerPetCommand;
  stateChanges: Partial<{ social: number; stress: number; hunger: number; energy: number }>;
};

export function shouldResolveOwnerChatWorldCommandImmediately(
  directive: { command?: OwnerPetCommand } | null | undefined,
) {
  return Boolean(directive?.command);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compactForPetNameMatch(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function boundedDamerauLevenshtein(left: string, right: string, maxDistance: number) {
  if (Math.abs(left.length - right.length) > maxDistance) {
    return maxDistance + 1;
  }

  const rows = left.length + 1;
  const cols = right.length + 1;
  const distances = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    distances[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    distances[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const substitutionCost = left[row - 1] === right[col - 1] ? 0 : 1;
      let best = Math.min(
        distances[row - 1][col] + 1,
        distances[row][col - 1] + 1,
        distances[row - 1][col - 1] + substitutionCost,
      );

      if (
        row > 1 &&
        col > 1 &&
        left[row - 1] === right[col - 2] &&
        left[row - 2] === right[col - 1]
      ) {
        best = Math.min(best, distances[row - 2][col - 2] + 1);
      }

      distances[row][col] = best;
    }
  }

  return distances[left.length][right.length];
}

function possibleExplicitNameFragments(message: string) {
  const fragments = new Set<string>();
  const commandFragmentPattern =
    /(?:去追|追赶|追上|追一下|追|chase|打一架|打架|打斗|打|揍|攻击|扑|fight|scuffle|去找|去看看|去陪|去靠近|去跟着|去见|跟)\s*([A-Za-z0-9][A-Za-z0-9\s_-]{1,24})/giu;
  let match: RegExpExecArray | null;

  while ((match = commandFragmentPattern.exec(message)) !== null) {
    fragments.add(match[1]);
  }

  for (const token of message.match(/[A-Za-z0-9][A-Za-z0-9_-]{2,24}/g) ?? []) {
    fragments.add(token);
  }

  return [...fragments].map(compactForPetNameMatch).filter(Boolean);
}

function fuzzyPetNameScore(message: string, petName: string) {
  const compactMessage = compactForPetNameMatch(message);
  const compactPetName = compactForPetNameMatch(petName);

  if (compactPetName.length < 4) {
    return Number.POSITIVE_INFINITY;
  }

  if (compactMessage.includes(compactPetName)) {
    return 0;
  }

  const maxDistance = compactPetName.length >= 4 ? 2 : 1;
  let best = Number.POSITIVE_INFINITY;

  for (const fragment of possibleExplicitNameFragments(message)) {
    if (Math.abs(fragment.length - compactPetName.length) > maxDistance) {
      continue;
    }

    const distance = boundedDamerauLevenshtein(fragment, compactPetName, maxDistance);

    if (distance < best) {
      best = distance;
    }
  }

  return best <= maxDistance ? best : Number.POSITIVE_INFINITY;
}

function findMentionedPetTarget(
  store: AppStore,
  currentPetId: string,
  message: string,
  preferredPetId?: string,
) {
  const normalized = message.trim().toLowerCase();
  const candidates = store.pets
    .filter((pet) => pet.id !== currentPetId && !pet.isFrozen && pet.visibility === "public")
    .sort((left, right) => right.name.length - left.name.length);

  for (const pet of candidates) {
    if (new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(pet.name.toLowerCase())}([^\\p{L}\\p{N}]|$)`, "iu").test(normalized)) {
      return pet;
    }
  }

  const fuzzyMatches = candidates
    .map((pet) => ({
      pet,
      score: fuzzyPetNameScore(message, pet.name),
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((left, right) => left.score - right.score || right.pet.name.length - left.pet.name.length);

  if (fuzzyMatches[0]) {
    return fuzzyMatches[0].pet;
  }

  if (!preferredPetId) {
    return null;
  }

  return candidates.find((pet) => pet.id === preferredPetId) ?? null;
}

const zoneCommandTargets: Array<{
  zoneId: GardenZoneId;
  label: string;
  tileX: number;
  tileY: number;
  pattern: RegExp;
}> = [
  {
    zoneId: "orchard",
    label: "果树区",
    tileX: 24,
    tileY: 28,
    pattern: /(果树区|果园|orchard)/i,
  },
  {
    zoneId: "pond",
    label: "池塘",
    tileX: 24,
    tileY: 31,
    pattern: /(池塘|水边|pond)/i,
  },
  {
    zoneId: "grove",
    label: "树林",
    tileX: 24,
    tileY: 32,
    pattern: /(树林|林地|灌木区|grove)/i,
  },
  {
    zoneId: "dog-run",
    label: "狗跑区",
    tileX: 25,
    tileY: 33,
    pattern: /(狗跑区|狗狗运动场|运动场|dog[- ]?run)/i,
  },
];

const objectCommandTargets: Array<{
  type: WorldObjectType;
  label: string;
  pattern: RegExp;
}> = [
  { type: "toy", label: "玩具", pattern: /(玩具|球|toy)/i },
  { type: "pond_edge", label: "水边", pattern: /(水边|池边|看鱼|鱼|pond edge)/i },
  { type: "pet_bed", label: "窝", pattern: /(窝|床|睡觉|休息|bed)/i },
  { type: "rest_spot", label: "休息点", pattern: /(休息点|垫子|rest)/i },
  { type: "bush", label: "灌木丛", pattern: /(灌木|躲起来|藏起来|bush|hide)/i },
  { type: "doghouse", label: "狗屋", pattern: /(狗屋|doghouse|dog house)/i },
  { type: "tree", label: "树", pattern: /(树|爬树|tree)/i },
];

const careStationTargets: Array<{
  kind: TerrainStructureKind;
  label: string;
  pattern: RegExp;
}> = [
  { kind: "feeding_station", label: "饭点", pattern: /(吃饭|饭点|饭盆|喂食|food|feed|feeder)/i },
  { kind: "water_bowl", label: "水碗", pattern: /(喝水|水碗|water)/i },
];

function currentPetZoneId(store: AppStore, currentPetId: string) {
  return store.petStates.find((state) => state.petId === currentPetId)?.zoneId ?? "orchard";
}

function findObjectCommandTarget(
  store: AppStore,
  currentPetId: string,
  message: string,
) {
  const currentZoneId = currentPetZoneId(store, currentPetId);
  const target = objectCommandTargets.find((entry) => entry.pattern.test(message));

  if (!target) {
    return null;
  }

  const objects = store.worldObjects
    .filter((object) => object.type === target.type && !object.removedAt)
    .sort((left, right) => {
      if (left.zoneId === currentZoneId && right.zoneId !== currentZoneId) {
        return -1;
      }

      if (left.zoneId !== currentZoneId && right.zoneId === currentZoneId) {
        return 1;
      }

      return left.id.localeCompare(right.id);
    });

  const object = objects[0];
  return object ? { object, label: target.label } : null;
}

function findCareStationCommandTarget(
  store: AppStore,
  currentPetId: string,
  message: string,
) {
  const currentZoneId = currentPetZoneId(store, currentPetId);
  const target = careStationTargets.find((entry) => entry.pattern.test(message));

  if (!target) {
    return null;
  }

  const currentZoneStructure = buildTerrainMap(currentZoneId).structures.find(
    (structure) => structure.kind === target.kind,
  );

  if (currentZoneStructure) {
    return {
      label: target.label,
      zoneId: currentZoneId,
      tileX: currentZoneStructure.x,
      tileY: currentZoneStructure.y,
    };
  }

  for (const zone of zoneCommandTargets) {
    const structure = buildTerrainMap(zone.zoneId).structures.find(
      (entry) => entry.kind === target.kind,
    );

    if (structure) {
      return {
        label: target.label,
        zoneId: zone.zoneId,
        tileX: structure.x,
        tileY: structure.y,
      };
    }
  }

  return null;
}

function findZoneCommandTarget(message: string) {
  return zoneCommandTargets.find((target) => target.pattern.test(message)) ?? null;
}

export function parseOwnerChatWorldCommand(input: {
  store: AppStore;
  currentPetId: string;
  message: string;
  isOwner: boolean;
  preferredPetId?: string;
}): OwnerChatWorldCommandDirective | null {
  if (!input.isOwner) {
    return null;
  }

  const targetPet = findMentionedPetTarget(
    input.store,
    input.currentPetId,
    input.message,
    input.preferredPetId,
  );
  const explicitTargetPet = findMentionedPetTarget(
    input.store,
    input.currentPetId,
    input.message,
  );

  if (/(去追|追赶|追上|追一下|追\s*|chase)/i.test(input.message) && explicitTargetPet) {
    return {
      reply: `${explicitTargetPet.name}？好，我去追它一下。`,
      action: null,
      command: {
        type: "chase_pet",
        targetPetId: explicitTargetPet.id,
      },
      stateChanges: { social: 3, stress: 2, energy: -4 },
    };
  }

  if (/(打一架|打架|打斗|揍|攻击|扑|fight|scuffle)/i.test(input.message) && explicitTargetPet) {
    return {
      reply: `${explicitTargetPet.name}？我会冲上去闹一场。`,
      action: null,
      command: {
        type: "scuffle_pet",
        targetPetId: explicitTargetPet.id,
      },
      stateChanges: { social: -2, stress: 5, energy: -6 },
    };
  }

  if (/(去找|去看看|去陪|去靠近|去跟着|去见)/i.test(input.message) && targetPet) {
    return {
      reply: `${targetPet.name}？行，我去看看它在忙什么。`,
      action: null,
      command: {
        type: "move_to_pet",
        targetPetId: targetPet.id,
      },
      stateChanges: { social: 4, stress: -1, energy: -2 },
    };
  }

  if (/(去找|去看看|去陪|去靠近|去跟着|去见).*(别的宠物|另一只|其他宠物|熟面孔)/i.test(input.message) && targetPet) {
    return {
      reply: `行，我先去靠近 ${targetPet.name} 看看。`,
      action: null,
      command: {
        type: "move_to_pet",
        targetPetId: targetPet.id,
      },
      stateChanges: { social: 4, stress: -1, energy: -2 },
    };
  }

  const objectTarget = findObjectCommandTarget(input.store, input.currentPetId, input.message);

  if (objectTarget) {
    return {
      reply: `行，我去${objectTarget.label}那边看看。`,
      action: null,
      command: {
        type: "move_to_object",
        objectId: objectTarget.object.id,
      },
      stateChanges: { social: 2, stress: -1, energy: -2 },
    };
  }

  const careStationTarget = findCareStationCommandTarget(input.store, input.currentPetId, input.message);

  if (careStationTarget) {
    return {
      reply: `好，我去${careStationTarget.label}那边。`,
      action: null,
      command: {
        type: "move_to_tile",
        zoneId: careStationTarget.zoneId,
        tileX: careStationTarget.tileX,
        tileY: careStationTarget.tileY,
      },
      stateChanges: { social: 2, stress: -1, energy: -2 },
    };
  }

  const zoneTarget = findZoneCommandTarget(input.message);

  if (zoneTarget) {
    return {
      reply: `行，我去${zoneTarget.label}看看。`,
      action: null,
      command: {
        type: "move_to_tile",
        zoneId: zoneTarget.zoneId,
        tileX: zoneTarget.tileX,
        tileY: zoneTarget.tileY,
      },
      stateChanges: { social: 2, stress: -1, energy: -3 },
    };
  }

  return null;
}
