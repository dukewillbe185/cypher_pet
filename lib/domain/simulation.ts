import { randomUUID } from "node:crypto";

import { decidePetAction, type PetActionCandidate } from "@/lib/ai/action-director";
import { clampBubbleText } from "@/lib/ai/content-safety";
import { getActiveGoalSnippets, planPetGoals, rankActivitiesAgainstGoals } from "@/lib/ai/goal-planner";
import { generateInnerVoice, type InnerVoiceTrigger } from "@/lib/ai/inner-voice";
import { narrateEvent } from "@/lib/ai/narrator";
import { buildPersonaContextFromStore } from "@/lib/ai/pet-persona";
import type { LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { generateSocialExchange, type SocialInteraction } from "@/lib/ai/social-chat";
import { decideSocialIntent } from "@/lib/ai/social-intent";
import { syncAutonomyState, syncPetAutonomyState } from "@/lib/domain/autonomy";
import { advanceGoalProgress } from "@/lib/domain/goals";
import {
  buildGardenEncounterMapMarkers,
  buildGardenEncounters,
  syncGardenEncounterThreads,
} from "@/lib/domain/garden-encounters";
import { listGardenFactsForPet, recordGardenLedgerEvent } from "@/lib/domain/garden-memory";
import {
  applyBondDecay,
  applyGrowthAward,
  ensureGrowthState,
  growthSummary,
  ownerActionGrowthAward,
} from "@/lib/domain/growth";
import {
  buildMoodNotification,
  buildPetEventBody,
  notificationKindFromMood,
} from "@/lib/domain/notifications";
import { getPetPersonality } from "@/lib/domain/personality";
import {
  ageSocialGraph,
  buildPetBonds,
  listPetMemories,
  rememberPet,
  strongestMemory,
  upsertRelationship,
} from "@/lib/domain/social";
import { listPairRelationshipModels } from "@/lib/domain/social-model";
import { buildTerrainMap } from "@/lib/domain/terrain";
import { env } from "@/lib/env";
import {
  buildEnvironmentActors,
  clampTileX,
  clampTileY,
  createWorldState,
  WORLD_BOUNDS,
} from "@/lib/domain/world";
import type {
  AppStore,
  Facing,
  GardenPetSnapshot,
  GardenSnapshot,
  GardenZoneId,
  OwnerAction,
  Pet,
  PetEvent,
  PetMood,
  PetState,
  Profile,
  PetActivity,
  SocialIntent,
  WorldObject,
  WorldObjectType,
} from "@/lib/types";

const MAX_ZONE_PETS = 24;
const HOURS_TO_MS = 1000 * 60 * 60;
const ACTION_WINDOW_MS = 1000 * 20;
const FUTURE_TOLERANCE_MS = 1000 * 60;
const BUBBLE_DURATION_MS = 1000 * 5;
const MAX_NARRATED_EVENTS_PER_ADVANCE = 3;

export interface AdvanceStoreOptions {
  llmMode?: LLMExecutionMode;
}

export function shouldUseLLMAutonomyForPet(
  pet: Pick<Pet, "visibility">,
  state: Pick<PetState, "zoneId">,
  config: {
    enabled: boolean;
    publicOnly: boolean;
    zones: GardenZoneId[];
  } = {
    enabled: env.llmAutonomyEnabled,
    publicOnly: env.llmAutonomyPublicOnly,
    zones: env.llmAutonomyZones,
  },
) {
  if (!config.enabled) {
    return false;
  }

  if (config.publicOnly && pet.visibility !== "public") {
    return false;
  }

  if (config.zones.length > 0 && !config.zones.includes(state.zoneId)) {
    return false;
  }

  return true;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function simpleHash(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function randomFromSeed(seed: string) {
  return (simpleHash(seed) % 10000) / 10000;
}

function sample<T>(items: T[], seed: string) {
  return items[simpleHash(seed) % items.length];
}

function timeMs(iso: string) {
  const value = new Date(iso).getTime();
  return Number.isFinite(value) ? value : 0;
}

function isCurrentTimeline(iso: string, nowMs = Date.now()) {
  return timeMs(iso) <= nowMs + FUTURE_TOLERANCE_MS;
}

function zoneName(store: AppStore, zoneId: GardenZoneId) {
  return store.gardenZones.find((zone) => zone.id === zoneId)?.name ?? zoneId;
}

function pickFacing(seed: string): Facing {
  return sample(["up", "down", "left", "right"] as const, seed);
}

function facingFromDelta(dx: number, dy: number, fallback: Facing): Facing {
  if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) > 0) {
    return dx > 0 ? "right" : "left";
  }

  if (Math.abs(dy) > 0) {
    return dy > 0 ? "down" : "up";
  }

  return fallback;
}

function actionDurationMs(
  activity: PetState["activity"],
  seed: string,
  personality: ReturnType<typeof getPetPersonality>,
) {
  const jitter = (simpleHash(seed) % 5) * 640;

  switch (activity) {
    case "sleep":
      return 22000 + jitter + personality.napBias * 34;
    case "climb_tree":
      return 17000 + jitter + Math.floor(personality.treeAffinity * 24);
    case "hide":
      return 16000 + jitter + Math.floor((100 - personality.boldness) * 18);
    case "poop":
      return 7000 + jitter;
    case "watch_fish":
      return 19000 + jitter + Math.floor(personality.curiosity * 14);
    case "sunbathe":
      return 20000 + jitter + Math.floor((100 - personality.zoomies) * 12);
    case "groom":
      return 14000 + jitter + Math.floor((100 - personality.boldness) * 10);
    case "eat":
      return 12000 + jitter + Math.floor((100 - personality.zoomies) * 7);
    case "drink":
      return 9500 + jitter + Math.floor(personality.curiosity * 4);
    case "look_around":
      return 13000 + jitter + Math.floor(personality.curiosity * 11);
    case "dig":
      return 12000 + jitter + Math.floor(personality.zoomies * 12);
    case "chase":
      return 9800 + jitter + Math.floor(personality.zoomies * 13);
    case "play":
    case "scuffle":
      return 13500 + jitter + Math.floor(personality.sociability * 11);
    default:
      return 15000 + jitter + Math.floor(personality.curiosity * 8);
  }
}

function activeZoneObjects(store: AppStore, zoneId: GardenZoneId, type?: WorldObjectType) {
  return store.worldObjects.filter(
    (object) =>
      object.zoneId === zoneId &&
      !object.removedAt &&
      (type ? object.type === type : true),
  );
}

function createEvent(
  store: AppStore,
  input: Omit<PetEvent, "id" | "createdAt"> & { createdAt?: string },
) {
  const event: PetEvent = {
    id: randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    ...input,
  };

  store.petEvents.unshift(event);
  recordGardenLedgerEvent(store, {
    type:
      input.type === "owner_action"
        ? "owner_action"
        : input.type === "zone_move"
          ? "zone_move"
        : input.type === "mood_change"
          ? "mood_change"
          : input.type === "social_chat"
            ? "social_interaction"
            : input.type === "scuffle" || input.type === "chased"
              ? "conflict"
              : input.type === "climbed_tree"
                ? "territory_claim"
                : "object_interaction",
    participants: [input.petId, input.relatedPetId].filter(Boolean) as string[],
    zoneId: input.zoneId,
    body: input.body,
    salience: input.type === "mood_change" ? 44 : 56,
    semanticTags: [input.type, input.emotion].filter(Boolean) as string[],
    nowIso: event.createdAt,
  });
  return event;
}

function createNotification(
  store: AppStore,
  input: {
    userId: string;
    kind: "mood_change" | "important_event" | "system";
    petId?: string;
    eventId?: string;
    body: string;
  },
) {
  store.notifications.unshift({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  });
}

function clearExpiredBubble(state: PetState, nowMs = Date.now()) {
  if (state.currentBubble && timeMs(state.currentBubble.expiresAt) <= nowMs) {
    state.currentBubble = undefined;
  }
}

function setBubble(
  state: PetState,
  input: { text: string; kind: "thought" | "speech" },
  now: Date,
) {
  state.currentBubble = {
    text: clampBubbleText(input.text),
    kind: input.kind,
    expiresAt: new Date(now.getTime() + BUBBLE_DURATION_MS).toISOString(),
  };
}

function socialInteractionFromActivity(activity: PetState["activity"], isFriend: boolean): SocialInteraction {
  if (activity === "scuffle") {
    return "scuffle";
  }

  if (activity === "chase") {
    return "chase";
  }

  if (activity === "play") {
    return isFriend ? "reunion" : "play";
  }

  return isFriend ? "bond" : "first_meet";
}

export function deriveMood(state: PetState): PetMood {
  if (state.stress >= 70) {
    return "grumpy";
  }

  if (state.social <= 30) {
    return "lonely";
  }

  if (state.energy <= 28) {
    return "sleepy";
  }

  if (state.hygiene <= 35 || state.bladder >= 72) {
    return "dirty";
  }

  if (state.social >= 68 && state.stress <= 35) {
    return "playful";
  }

  if (state.hunger <= 60 && state.stress <= 45) {
    return "curious";
  }

  return "happy";
}

function moveToObject(state: PetState, object: WorldObject) {
  state.tileX = object.tileX;
  state.tileY = object.tileY;
}

function moveToRandomTile(state: PetState, seed: string) {
  state.tileX = clampTileX(WORLD_BOUNDS.minX + (simpleHash(`${seed}-x`) % (WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX + 1)));
  state.tileY = clampTileY(WORLD_BOUNDS.minY + (simpleHash(`${seed}-y`) % (WORLD_BOUNDS.maxY - WORLD_BOUNDS.minY + 1)));
}

function cloneStateForPlanning(state: PetState): PetState {
  return {
    ...state,
    currentBubble: state.currentBubble ? { ...state.currentBubble } : undefined,
    lastAutonomyDecision: state.lastAutonomyDecision
      ? {
          ...state.lastAutonomyDecision,
          candidates: [...state.lastAutonomyDecision.candidates],
        }
      : undefined,
  };
}

function activityLabel(activity: PetActivity) {
  switch (activity) {
    case "sleep":
      return "补觉";
    case "eat":
      return "找东西吃";
    case "drink":
      return "补水";
    case "climb_tree":
      return "爬到高处";
    case "hide":
      return "躲开视线";
    case "poop":
      return "去解决生理需求";
    case "chase":
      return "追逐";
    case "scuffle":
      return "发生摩擦";
    case "seek_owner":
      return "去找主人";
    case "play":
      return "找同伴玩";
    case "look_around":
      return "观察周围";
    case "sunbathe":
      return "晒太阳";
    case "watch_fish":
      return "盯着鱼看";
    case "groom":
      return "整理自己";
    case "dig":
      return "刨点东西";
    case "wander":
      return "四处溜达";
    default:
      return "继续待着";
  }
}

function socialIntentLabel(intent?: SocialIntent) {
  switch (intent) {
    case "approach":
      return "试探着靠近";
    case "invite_play":
      return "主动邀玩";
    case "tease":
      return "带着挑衅";
    case "avoid":
      return "带着回避";
    case "reassure":
      return "想安抚对方";
    case "observe":
    default:
      return "边观察边试探";
  }
}

function pushActionCandidate(candidates: PetActionCandidate[], candidate: PetActionCandidate) {
  const exists = candidates.some(
    (entry) =>
      entry.activity === candidate.activity &&
      entry.targetPetId === candidate.targetPetId &&
      entry.targetObjectId === candidate.targetObjectId,
  );

  if (!exists) {
    candidates.push(candidate);
  }
}

function activityCandidate(
  state: Pick<PetState, "tileX" | "tileY"> & Partial<Pick<PetState, "zoneId">>,
  input: Omit<PetActionCandidate, "tileX" | "tileY">,
): PetActionCandidate {
  return {
    ...input,
    tileX: state.tileX,
    tileY: state.tileY,
    zoneId: input.zoneId ?? state.zoneId,
  };
}

function tileDistance(left: Pick<PetState, "tileX" | "tileY">, right: Pick<PetState, "tileX" | "tileY">) {
  return Math.abs(left.tileX - right.tileX) + Math.abs(left.tileY - right.tileY);
}

function findNearbyPet(
  store: AppStore,
  pet: Pet,
  state: PetState,
  input?: {
    species?: Pet["species"];
    excludePetId?: string;
    zoneId?: PetState["zoneId"];
  },
) {
  return store.petStates
    .filter(
      (other) =>
        other.petId !== pet.id &&
        other.petId !== input?.excludePetId &&
        other.zoneId === (input?.zoneId ?? state.zoneId) &&
        (!input?.species ||
          store.pets.find((entry) => entry.id === other.petId)?.species === input.species),
    )
    .sort((left, right) => tileDistance(state, left) - tileDistance(state, right))[0];
}

function activeBondPet(
  store: AppStore,
  pet: Pet,
  state: PetState,
  status: "friend" | "enemy",
) {
  return buildPetBonds(store, pet.id, 6)
    .filter((bond) => bond.status === status)
    .map((bond) => {
      const otherState = store.petStates.find((entry) => entry.petId === bond.otherPetId && entry.zoneId === state.zoneId);
      const otherPet = store.pets.find((entry) => entry.id === bond.otherPetId);
      return otherState && otherPet ? { bond, otherState, otherPet } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((left, right) => tileDistance(state, left.otherState) - tileDistance(state, right.otherState))[0];
}

function ensurePoopObject(store: AppStore, pet: Pet, state: PetState, nowIso: string) {
  const existing = activeZoneObjects(store, state.zoneId, "poop").find(
    (object) => object.petId === pet.id,
  );

  if (existing) {
    return existing;
  }

  const bushes = activeZoneObjects(store, state.zoneId, "bush");
  const anchor = bushes[0] ?? {
    id: "fallback",
    zoneId: state.zoneId,
    type: "bush" as const,
    tileX: state.tileX,
    tileY: state.tileY,
    createdAt: nowIso,
  };

  const poop: WorldObject = {
    id: randomUUID(),
    zoneId: state.zoneId,
    type: "poop",
    tileX: anchor.tileX,
    tileY: anchor.tileY + 1,
    petId: pet.id,
    createdAt: nowIso,
  };

  store.worldObjects.unshift(poop);
  return poop;
}

const PRESENCE_FRESH_MS = 1000 * 90;

/** Live avatar position for a pet's owner, if the owner is in this zone right now. */
export function freshOwnerPresence(
  store: AppStore,
  ownerId: string,
  zoneId: GardenZoneId,
  nowMs = Date.now(),
) {
  const presence = store.gardenPresences?.find((entry) => entry.profileId === ownerId);

  if (!presence || presence.zoneId !== zoneId) {
    return undefined;
  }

  if (nowMs - timeMs(presence.updatedAt) > PRESENCE_FRESH_MS) {
    return undefined;
  }

  return presence;
}

function moveToOwnerPresence(state: PetState, presence: { tileX: number; tileY: number }, seed: string) {
  const angle = randomFromSeed(`${seed}-angle`) * Math.PI * 2;
  state.tileX = clampTileX(Math.round(presence.tileX + Math.cos(angle) * 1.4));
  state.tileY = clampTileY(Math.round(presence.tileY + Math.sin(angle) * 1.4));
}

function activeCrossZoneGoal(store: AppStore, petId: string, currentZoneId: GardenZoneId) {
  return (store.petGoals ?? [])
    .filter(
      (goal) =>
        goal.petId === petId &&
        goal.status === "active" &&
        goal.targetZoneId &&
        goal.targetZoneId !== currentZoneId &&
        (goal.goalType === "explore_zone" ||
          goal.goalType === "move_to_zone" ||
          goal.goalType === "guard_favorite_spot" ||
          goal.goalType === "avoid_pet"),
    )
    .sort((left, right) => right.priority - left.priority || timeMs(left.createdAt) - timeMs(right.createdAt))[0];
}

function canRoamAcrossZones(state: PetState, restThreshold: number) {
  return state.energy > restThreshold + 6 && state.hunger < 58 && state.bladder < 70 && state.stress < 74;
}

function moveToZoneEntryTile(state: PetState, targetZoneId: GardenZoneId, seed: string) {
  const terrain = buildTerrainMap(targetZoneId);
  const entryStructure =
    terrain.structures.find((structure) => structure.kind === "bridge") ??
    terrain.structures.find((structure) => structure.kind === "lamp") ??
    terrain.structures.find((structure) => structure.kind === "cat_basket") ??
    terrain.structures.find((structure) => structure.kind === "bench") ??
    terrain.structures[0];

  state.zoneId = targetZoneId;
  if (entryStructure) {
    state.tileX = clampTileX(entryStructure.x + (simpleHash(`${seed}-x`) % 3) - 1);
    state.tileY = clampTileY(entryStructure.y + (simpleHash(`${seed}-y`) % 3) - 1);
  } else {
    moveToRandomTile(state, `${seed}-entry`);
  }
  state.activity = "move_to_zone";
  state.lastKnownZonePreference = targetZoneId;
}

function chooseActivity(
  store: AppStore,
  pet: Pet,
  state: PetState,
  now: Date,
) {
  const personality = getPetPersonality(pet);
  const world = createWorldState(now);
  const timeSeed = `${pet.id}-${Math.floor(now.getTime() / ACTION_WINDOW_MS)}`;
  const nearbyCats = store.petStates.filter(
    (other) =>
      other.petId !== pet.id &&
      other.zoneId === state.zoneId &&
      store.pets.find((entry) => entry.id === other.petId)?.species === "cat",
  );
  const nearbyPets = store.petStates.filter(
    (other) => other.petId !== pet.id && other.zoneId === state.zoneId,
  );
  const trees = activeZoneObjects(store, state.zoneId, "tree");
  const restSpots = [
    ...activeZoneObjects(store, state.zoneId, "pet_bed"),
    ...activeZoneObjects(store, state.zoneId, "rest_spot"),
  ];
  const bushes = activeZoneObjects(store, state.zoneId, "bush");
  const pondEdges = activeZoneObjects(store, state.zoneId, "pond_edge");
  const toys = activeZoneObjects(store, state.zoneId, "toy");
  const terrain = buildTerrainMap(state.zoneId);
  const feeders = terrain.structures.filter((structure) => structure.kind === "feeding_station");
  const waterSpots = terrain.structures.filter(
    (structure) => structure.kind === "water_bowl" || structure.kind === "bridge",
  );
  const friendlyPet = activeBondPet(store, pet, state, "friend");
  const rivalPet = activeBondPet(store, pet, state, "enemy");
  const rememberedFriend = strongestMemory(store, pet.id, ["friend_pet"], state.zoneId);
  const rememberedThreat = strongestMemory(
    store,
    pet.id,
    ["enemy_pet", "chased_by_dog"],
    state.zoneId,
  );
  const ownerChatMemory = strongestMemory(store, pet.id, ["owner_chat"], state.zoneId);
  const favoriteFoodMemory = strongestMemory(store, pet.id, ["favorite_food"], state.zoneId);
  const scaryMomentMemory = strongestMemory(store, pet.id, ["scary_moment"], state.zoneId);
  const dislikeMemory = strongestMemory(store, pet.id, ["dislike"], state.zoneId);
  const effectiveBoldness = clamp(
    personality.boldness -
      Math.floor((scaryMomentMemory?.weight ?? 0) * 0.16) -
      Math.floor((dislikeMemory?.weight ?? 0) * 0.08),
    10,
    100,
  );
  const effectiveSociability = clamp(
    personality.sociability + Math.floor((ownerChatMemory?.weight ?? 0) * 0.06),
    0,
    100,
  );
  const favoriteFoodBias = favoriteFoodMemory
    ? Math.max(4, Math.floor(favoriteFoodMemory.weight / 14))
    : 0;
  const rememberedFriendState =
    rememberedFriend?.relatedPetId
      ? store.petStates.find(
          (entry) => entry.petId === rememberedFriend.relatedPetId && entry.zoneId === state.zoneId,
        )
      : undefined;
  const rememberedThreatState =
    rememberedThreat?.relatedPetId
      ? store.petStates.find(
          (entry) => entry.petId === rememberedThreat.relatedPetId && entry.zoneId === state.zoneId,
        )
      : undefined;

  if (state.bladder >= 75) {
    const bush = bushes[0];
    if (bush) {
      moveToObject(state, bush);
    }
    state.activity = "poop";
    return;
  }

  const restThreshold =
    world.isNight
      ? Math.max(34, 74 - Math.floor(personality.napBias / 3))
      : Math.max(24, 58 - Math.floor(personality.napBias / 2));

  if (state.energy <= restThreshold) {
    const napSpot = restSpots[0];
    if (napSpot) {
      moveToObject(state, napSpot);
    }
    state.activity = "sleep";
    return;
  }

  const roamGoal = activeCrossZoneGoal(store, pet.id, state.zoneId);
  if (roamGoal?.targetZoneId && canRoamAcrossZones(state, restThreshold)) {
    moveToZoneEntryTile(state, roamGoal.targetZoneId, `${timeSeed}-zone-roam`);
    return;
  }

  // The owner walking through the garden is the strongest social pull there is.
  const ownerPresence = freshOwnerPresence(store, pet.ownerId, state.zoneId, now.getTime());

  if (
    ownerPresence &&
    (personality.archetype === "velcro heart" ||
      state.social <= 62 ||
      randomFromSeed(`${timeSeed}-greet-owner`) > 0.55)
  ) {
    moveToOwnerPresence(state, ownerPresence, `${timeSeed}-presence`);
    state.activity = "seek_owner";
    return;
  }

  if (
    ownerChatMemory &&
    (personality.archetype === "velcro heart" || state.social <= 54) &&
    randomFromSeed(`${timeSeed}-seek-owner`) > 0.44
  ) {
    const ownerTrail = store.ownerActions.find(
      (action) =>
        action.petId === pet.id &&
        now.getTime() - new Date(action.createdAt).getTime() < 1000 * 60 * 90,
    );
    const targetSpot =
      ownerTrail && restSpots[0]
        ? restSpots[0]
        : activeZoneObjects(store, state.zoneId, "toy")[0] ?? restSpots[0];

    if (targetSpot) {
      moveToObject(state, targetSpot);
    } else {
      moveToRandomTile(state, `${timeSeed}-owner`);
    }

    state.activity = "seek_owner";
    return;
  }

  if (
    pet.species === "cat" &&
    state.zoneId === "pond" &&
    pondEdges.length > 0 &&
    !world.isNight &&
    personality.curiosity >= 52 &&
    randomFromSeed(`${timeSeed}-watch-fish`) > 0.42
  ) {
    moveToObject(state, sample(pondEdges, `${timeSeed}-pond`));
    state.activity = "watch_fish";
    return;
  }

  if (state.hunger >= Math.max(42, 58 - favoriteFoodBias) && feeders.length > 0) {
    const feeder = sample(feeders, `${timeSeed}-feeder`);
    state.tileX = clampTileX(feeder.x);
    state.tileY = clampTileY(feeder.y);
    state.activity = "eat";
    return;
  }

  if (
    (state.activity === "chase" || state.activity === "dig" || state.activity === "play") &&
    (waterSpots.length > 0 || pondEdges.length > 0) &&
    randomFromSeed(`${timeSeed}-drink`) > 0.46
  ) {
    const source = waterSpots[0]
      ? { tileX: waterSpots[0].x, tileY: waterSpots[0].y }
      : pondEdges[0];
    if (source) {
      state.tileX = clampTileX(source.tileX);
      state.tileY = clampTileY(source.tileY);
    }
    state.activity = "drink";
    return;
  }

  if (
    pet.species === "cat" &&
    !world.isNight &&
    state.energy >= 52 &&
    personality.napBias <= 62 &&
    randomFromSeed(`${timeSeed}-sunbathe`) > 0.52
  ) {
    moveToRandomTile(state, `${timeSeed}-sun`);
    state.activity = "sunbathe";
    return;
  }

  if (
    pet.species === "dog" &&
    toys.length > 0 &&
    personality.zoomies >= 58 &&
    randomFromSeed(`${timeSeed}-dig`) > 0.48
  ) {
    moveToObject(state, sample(toys, `${timeSeed}-toy`));
    state.activity = "dig";
    return;
  }

  if (
    pet.species === "cat" &&
    state.hygiene <= 74 &&
    randomFromSeed(`${timeSeed}-groom`) > Math.max(0.34, 0.84 - (100 - effectiveBoldness) / 100)
  ) {
    state.activity = "groom";
    return;
  }

  if (
    personality.curiosity >= 58 &&
    randomFromSeed(`${timeSeed}-look`) > 0.54
  ) {
    moveToRandomTile(state, `${timeSeed}-look-around`);
    state.activity = "look_around";
    return;
  }

  if (
    rememberedThreatState &&
    tileDistance(state, rememberedThreatState) <= 12 &&
    randomFromSeed(`${timeSeed}-memory-threat`) > Math.max(0.2, 0.58 - (100 - effectiveBoldness) / 180)
  ) {
    if (trees.length > 0 && personality.treeAffinity >= 48) {
      moveToObject(state, sample(trees, `${timeSeed}-memory-safe-tree`));
      state.activity = "climb_tree";
    } else if (bushes.length > 0) {
      moveToObject(state, sample(bushes, `${timeSeed}-memory-safe-bush`));
      state.activity = "hide";
    }

    if (state.activity === "climb_tree" || state.activity === "hide") {
      return;
    }
  }

  if (
    rivalPet &&
    pet.species === "cat" &&
    randomFromSeed(`${timeSeed}-rival-avoid`) > Math.max(0.24, 0.62 - (100 - effectiveBoldness) / 170)
  ) {
    if (trees.length > 0 && personality.treeAffinity >= 50) {
      moveToObject(state, sample(trees, `${timeSeed}-safe-tree`));
      state.activity = "climb_tree";
    } else if (bushes.length > 0) {
      moveToObject(state, sample(bushes, `${timeSeed}-safe-bush`));
      state.activity = "hide";
    }

    if (state.activity === "climb_tree" || state.activity === "hide") {
      return;
    }
  }

  if (
    friendlyPet &&
    state.social >= 52 &&
    randomFromSeed(`${timeSeed}-friend`) > 0.5
  ) {
    state.tileX = clampTileX(friendlyPet.otherState.tileX + (simpleHash(`${timeSeed}-friend-x`) % 3) - 1);
    state.tileY = clampTileY(friendlyPet.otherState.tileY + (simpleHash(`${timeSeed}-friend-y`) % 3) - 1);
    state.activity = state.energy <= 52 ? "sleep" : pet.species === "dog" ? "play" : "sunbathe";
    return;
  }

  if (
    rememberedFriendState &&
    tileDistance(state, rememberedFriendState) <= 14 &&
    state.social >= 46 &&
    randomFromSeed(`${timeSeed}-memory-friend`) > Math.max(0.26, 0.7 - effectiveSociability / 170)
  ) {
    state.tileX = clampTileX(rememberedFriendState.tileX + (simpleHash(`${timeSeed}-memory-friend-x`) % 3) - 1);
    state.tileY = clampTileY(rememberedFriendState.tileY + (simpleHash(`${timeSeed}-memory-friend-y`) % 3) - 1);
    state.activity = pet.species === "dog" ? "play" : "sunbathe";
    return;
  }

  if (
    pet.species === "cat" &&
    trees.length > 0 &&
    personality.treeAffinity >= 54 &&
    randomFromSeed(`${timeSeed}-tree`) > Math.max(0.16, 0.72 - personality.treeAffinity / 100)
  ) {
    moveToObject(state, sample(trees, `${timeSeed}-tree-target`));
    state.activity = "climb_tree";
    return;
  }

  if (
    pet.species === "dog" &&
    nearbyCats.length > 0 &&
    !world.isNight &&
    personality.zoomies + effectiveBoldness >= 118 &&
    randomFromSeed(`${timeSeed}-chase`) > Math.max(0.28, 0.82 - personality.zoomies / 100)
  ) {
    const cat = rivalPet?.otherPet.species === "cat" ? rivalPet.otherState : sample(nearbyCats, `${timeSeed}-cat`);
    state.tileX = clampTileX(cat.tileX + ((simpleHash(`${timeSeed}-lunge-x`) % 5) - 2));
    state.tileY = clampTileY(cat.tileY + ((simpleHash(`${timeSeed}-lunge-y`) % 5) - 2));
    state.activity = "chase";
    return;
  }

  if (
    nearbyPets.length > 0 &&
    state.social >= Math.max(42, 84 - effectiveSociability / 2) &&
    effectiveSociability >= 48 &&
    randomFromSeed(`${timeSeed}-social`) > Math.max(0.28, 0.82 - effectiveSociability / 100)
  ) {
    const companion =
      friendlyPet?.otherState ??
      findNearbyPet(store, pet, state, {
        zoneId: state.zoneId,
      }) ??
      sample(nearbyPets, `${timeSeed}-companion`);
    state.tileX = clampTileX(companion.tileX + (simpleHash(`${timeSeed}-offset-x`) % 3) - 1);
    state.tileY = clampTileY(companion.tileY + (simpleHash(`${timeSeed}-offset-y`) % 3) - 1);
    state.activity = pet.species === "dog" ? "play" : "scuffle";
    return;
  }

  if (
    state.stress >= Math.max(48, 82 - effectiveBoldness / 2) &&
    randomFromSeed(`${timeSeed}-hide`) > Math.max(0.22, 0.72 - (100 - effectiveBoldness) / 100)
  ) {
    const bush = bushes[0];
    if (bush) {
      moveToObject(state, bush);
    }
    state.activity = "hide";
    return;
  }

  if (
    personality.zoomies >= 52 &&
    state.social >= Math.max(38, 78 - effectiveSociability / 2) &&
    randomFromSeed(`${timeSeed}-play`) > Math.max(0.25, 0.78 - personality.zoomies / 100)
  ) {
    moveToRandomTile(state, `${timeSeed}-play`);
    state.activity = pet.species === "dog" ? "play" : "wander";
    return;
  }

  moveToRandomTile(state, `${timeSeed}-wander`);
  state.activity = "wander";
}

function buildActivityCandidates(
  store: AppStore,
  pet: Pet,
  state: PetState,
  now: Date,
  baseline: PetActionCandidate,
): PetActionCandidate[] {
  const personality = getPetPersonality(pet);
  const world = createWorldState(now);
  const timeSeed = `${pet.id}-${Math.floor(now.getTime() / ACTION_WINDOW_MS)}`;
  const terrain = buildTerrainMap(state.zoneId);
  const feeders = terrain.structures.filter((structure) => structure.kind === "feeding_station");
  const restSpots = [
    ...activeZoneObjects(store, state.zoneId, "pet_bed"),
    ...activeZoneObjects(store, state.zoneId, "rest_spot"),
  ];
  const trees = activeZoneObjects(store, state.zoneId, "tree");
  const bushes = activeZoneObjects(store, state.zoneId, "bush");
  const pondEdges = activeZoneObjects(store, state.zoneId, "pond_edge");
  const toys = activeZoneObjects(store, state.zoneId, "toy");
  const nearbyPetState = findNearbyPet(store, pet, state);
  const nearbyPet =
    nearbyPetState && store.pets.find((entry) => entry.id === nearbyPetState.petId);
  const friendlyPet = activeBondPet(store, pet, state, "friend");
  const targetCompanion = friendlyPet
    ? { pet: friendlyPet.otherPet, state: friendlyPet.otherState }
    : nearbyPetState && nearbyPet
      ? { pet: nearbyPet, state: nearbyPetState }
      : null;
  const ownerChatMemory = strongestMemory(store, pet.id, ["owner_chat"], state.zoneId);
  const restThreshold =
    world.isNight
      ? Math.max(34, 74 - Math.floor(personality.napBias / 3))
      : Math.max(24, 58 - Math.floor(personality.napBias / 2));
  const candidates: PetActionCandidate[] = [baseline];

  const roamGoal = activeCrossZoneGoal(store, pet.id, state.zoneId);
  if (roamGoal?.targetZoneId && canRoamAcrossZones(state, restThreshold)) {
    const roamState = cloneStateForPlanning(state);
    moveToZoneEntryTile(roamState, roamGoal.targetZoneId, `${timeSeed}-candidate-zone-roam`);
    pushActionCandidate(
      candidates,
      activityCandidate(roamState, {
        activity: "move_to_zone",
        summary: `${pet.name} 想沿着开放花园的路径去 ${zoneName(store, roamGoal.targetZoneId)} 看看。`,
        targetZoneId: roamGoal.targetZoneId,
        zoneId: roamGoal.targetZoneId,
      }),
    );
  }

  if (state.energy <= restThreshold + 10) {
    const napSpot = restSpots[0];
    pushActionCandidate(
      candidates,
      activityCandidate(napSpot ?? state, {
        activity: "sleep",
        summary: `${pet.name} 现在更想先找地方恢复体力。`,
        targetObjectId: napSpot?.id,
      }),
    );
  }

  if (state.hunger >= 44 && feeders.length > 0) {
    const feeder = sample(feeders, `${timeSeed}-candidate-feeder`);
    pushActionCandidate(candidates, {
      activity: "eat",
      summary: `${pet.name} 的饥饿感在抬头，倾向先去补一口。`,
      tileX: clampTileX(feeder.x),
      tileY: clampTileY(feeder.y),
    });
  }

  if (state.hygiene <= 68) {
    pushActionCandidate(
      candidates,
      activityCandidate(state, {
        activity: "groom",
        summary: `${pet.name} 有点想先把自己整理舒服。`,
      }),
    );
  }

  if (state.stress >= 52) {
    const safeSpot =
      pet.species === "cat" && trees.length > 0 && personality.treeAffinity >= 48
        ? sample(trees, `${timeSeed}-candidate-tree`)
        : bushes[0];
    const safeActivity =
      safeSpot?.type === "tree" && pet.species === "cat" ? "climb_tree" : "hide";

    if (safeSpot) {
      pushActionCandidate(
        candidates,
        activityCandidate(safeSpot, {
          activity: safeActivity,
          summary: `${pet.name} 现在更需要先稳住安全感。`,
          targetObjectId: safeSpot.id,
        }),
      );
    }
  }

  const candidateOwnerPresence = freshOwnerPresence(store, pet.ownerId, state.zoneId, now.getTime());

  if (candidateOwnerPresence) {
    pushActionCandidate(candidates, {
      activity: "seek_owner",
      summary: `${pet.name} 发现主人就在这个分区里，想直接跑过去。`,
      tileX: clampTileX(candidateOwnerPresence.tileX),
      tileY: clampTileY(candidateOwnerPresence.tileY),
    });
  } else if ((state.social <= 46 || ownerChatMemory) && (restSpots[0] || toys[0])) {
    const ownerAnchor = restSpots[0] ?? toys[0];
    if (ownerAnchor) {
      pushActionCandidate(
        candidates,
        activityCandidate(ownerAnchor, {
          activity: "seek_owner",
          summary: `${pet.name} 想去靠近和主人有关的熟悉路径。`,
          targetObjectId: ownerAnchor.id,
        }),
      );
    }
  }

  if (
    pet.species === "cat" &&
    state.zoneId === "pond" &&
    pondEdges.length > 0 &&
    !world.isNight &&
    personality.curiosity >= 48
  ) {
    const pondEdge = sample(pondEdges, `${timeSeed}-candidate-pond`);
    pushActionCandidate(
      candidates,
      activityCandidate(pondEdge, {
        activity: "watch_fish",
        summary: `${pet.name} 还是会被水边发亮的动静吸住注意力。`,
        targetObjectId: pondEdge.id,
      }),
    );
  }

  if (targetCompanion && state.social >= 42) {
    pushActionCandidate(candidates, {
      activity: pet.species === "dog" ? "play" : "scuffle",
      summary:
        pet.species === "dog"
          ? `${pet.name} 想靠近 ${targetCompanion.pet.name} 试着把气氛带热。`
          : `${pet.name} 想靠近 ${targetCompanion.pet.name} 试探边界。`,
      tileX: clampTileX(targetCompanion.state.tileX + (simpleHash(`${timeSeed}-candidate-social-x`) % 3) - 1),
      tileY: clampTileY(targetCompanion.state.tileY + (simpleHash(`${timeSeed}-candidate-social-y`) % 3) - 1),
      targetPetId: targetCompanion.pet.id,
    });
  }

  if (pet.species === "dog" && toys.length > 0 && personality.zoomies >= 58) {
    const toy = sample(toys, `${timeSeed}-candidate-toy`);
    pushActionCandidate(
      candidates,
      activityCandidate(toy, {
        activity: "dig",
        summary: `${pet.name} 精力很足，想找个目标狠狠干点什么。`,
        targetObjectId: toy.id,
      }),
    );
  }

  if (personality.curiosity >= 54) {
    const lookState = cloneStateForPlanning(state);
    moveToRandomTile(lookState, `${timeSeed}-candidate-look`);
    pushActionCandidate(
      candidates,
      activityCandidate(lookState, {
        activity: "look_around",
        summary: `${pet.name} 更想先扫一圈周围再决定下一步。`,
      }),
    );
  }

  if (
    pet.species === "cat" &&
    !world.isNight &&
    state.energy >= 50 &&
    personality.napBias <= 70
  ) {
    const sunState = cloneStateForPlanning(state);
    moveToRandomTile(sunState, `${timeSeed}-candidate-sunbathe`);
    pushActionCandidate(
      candidates,
      activityCandidate(sunState, {
        activity: "sunbathe",
        summary: `${pet.name} 也可能只是想挑块顺眼的地方晒一会儿。`,
      }),
    );
  }

  const wanderState = cloneStateForPlanning(state);
  moveToRandomTile(wanderState, `${timeSeed}-candidate-wander`);
  pushActionCandidate(
    candidates,
    activityCandidate(wanderState, {
      activity: "wander",
      summary: `${pet.name} 也可能什么都不急，先把这片区域再走一遍。`,
    }),
  );

  return candidates.slice(0, 6);
}

async function chooseActivityWithAutonomy(
  store: AppStore,
  pet: Pet,
  owner: Profile,
  state: PetState,
  now: Date,
  llmMode: LLMExecutionMode,
) {
  const planningState = cloneStateForPlanning(state);
  chooseActivity(store, pet, planningState, now);

  const baseline: PetActionCandidate = {
    activity: planningState.activity,
    tileX: planningState.tileX,
    tileY: planningState.tileY,
    zoneId: planningState.zoneId,
    targetZoneId: planningState.activity === "move_to_zone" ? planningState.zoneId : undefined,
    summary: `${pet.name} 按当前局面最自然的选择是先${activityLabel(planningState.activity)}。`,
  };
  const candidates = buildActivityCandidates(store, pet, state, now, baseline);
  const goals = planPetGoals(store, pet, state, now.toISOString());
  const rankedCandidates = rankActivitiesAgainstGoals(goals, candidates) as PetActionCandidate[];
  const context = buildPersonaContextFromStore(store, pet, state, createWorldState(now), owner);
  if (llmMode === "off") {
    state.activity = baseline.activity;
    state.zoneId = baseline.zoneId ?? state.zoneId;
    state.tileX = baseline.tileX;
    state.tileY = baseline.tileY;
    if (baseline.targetZoneId) {
      state.lastKnownZonePreference = baseline.targetZoneId;
    }
    state.lastAutonomyDecision = {
      goal:
        baseline.activity === "eat"
          ? "seek_food"
          : baseline.activity === "sleep"
            ? "seek_rest"
            : baseline.activity === "seek_owner"
              ? "seek_owner"
              : baseline.activity === "hide"
                ? "avoid_threat"
                : baseline.activity === "play" || baseline.activity === "chase"
                  ? "seek_play"
                  : baseline.activity === "climb_tree" || baseline.activity === "sunbathe"
                    ? "guard_spot"
                    : "explore",
      chosenActivity: baseline.activity,
      source: "fallback",
      reason: baseline.summary,
      targetPetId: baseline.targetPetId,
      targetObjectId: baseline.targetObjectId,
      targetZoneId: baseline.targetZoneId,
      socialIntent: undefined,
      candidates: rankedCandidates.map(({ activity, summary, targetObjectId, targetPetId, targetZoneId }) => ({
        activity,
        summary,
        targetObjectId,
        targetPetId,
        targetZoneId,
      })),
      decidedAt: new Date().toISOString(),
    };
    return;
  }
  const decision = await decidePetAction({
    pet,
    context,
    candidates: rankedCandidates,
    mode: llmMode === "cache-first" ? "blocking" : llmMode,
  });
  const chosen =
    rankedCandidates.find(
      (candidate) =>
        candidate.activity === decision.chosenActivity &&
        candidate.targetPetId === decision.targetPetId &&
        candidate.targetObjectId === decision.targetObjectId,
    ) ??
    rankedCandidates.find((candidate) => candidate.activity === decision.chosenActivity) ??
    baseline;

  state.activity = chosen.activity;
  state.zoneId = chosen.zoneId ?? state.zoneId;
  state.tileX = chosen.tileX;
  state.tileY = chosen.tileY;
  if (chosen.targetZoneId) {
    state.lastKnownZonePreference = chosen.targetZoneId;
  }
  state.lastAutonomyDecision = {
    ...decision,
    chosenActivity: chosen.activity,
    reason: decision.reason || chosen.summary,
    targetPetId: chosen.targetPetId ?? decision.targetPetId,
    targetObjectId: chosen.targetObjectId ?? decision.targetObjectId,
    targetZoneId: chosen.targetZoneId ?? decision.targetZoneId,
    socialIntent: decision.socialIntent,
    candidates: rankedCandidates.map(({ activity, summary, targetObjectId, targetPetId, targetZoneId }) => ({
      activity,
      summary,
      targetObjectId,
      targetPetId,
      targetZoneId,
    })),
    decidedAt: new Date().toISOString(),
  };

  advanceGoalProgress(store, pet.id, {
    matchedGoalTypes:
      chosen.activity === "seek_owner" || chosen.activity === "escort_owner"
        ? ["seek_reassurance_from_owner"]
        : chosen.activity === "sleep" || chosen.activity === "sunbathe"
          ? ["rest_and_reset"]
          : chosen.activity === "eat"
            ? ["seek_food"]
            : ["wander", "move_to_zone", "look_around"].includes(chosen.activity)
              ? ["explore_zone", "move_to_zone"]
              : ["claim_spot", "observe_from_distance"].includes(chosen.activity)
                ? ["guard_favorite_spot"]
                : ["approach_pet", "reconcile", "play"].includes(chosen.activity)
                  ? ["repair_bond"]
                  : undefined,
    progressDelta: 18,
    nowIso: now.toISOString(),
  });
}

function applyNeedDecay(state: PetState, elapsedMs: number) {
  const elapsedHours = elapsedMs / HOURS_TO_MS;

  state.energy = clamp(state.energy - elapsedHours * 9);
  state.hunger = clamp(state.hunger + elapsedHours * 12);
  state.hygiene = clamp(state.hygiene - elapsedHours * 5);
  state.bladder = clamp(state.bladder + elapsedHours * 14);
  state.social = clamp(state.social - elapsedHours * 6);
  state.stress = clamp(state.stress + elapsedHours * 4);
}

async function maybeGenerateInnerVoice(
  store: AppStore,
  pet: Pet,
  owner: Profile,
  state: PetState,
  now: Date,
  trigger: InnerVoiceTrigger,
  worldState = createWorldState(now),
  llmMode: LLMExecutionMode = "cache-first",
) {
  clearExpiredBubble(state, now.getTime());

  if (state.currentBubble && timeMs(state.currentBubble.expiresAt) > now.getTime()) {
    return null;
  }

  const bubble = await generateInnerVoice(
    pet,
    state,
    buildPersonaContextFromStore(store, pet, state, worldState, owner),
    trigger,
    llmMode,
  );

  if (!bubble.text) {
    return null;
  }

  setBubble(state, bubble, now);
  return createEvent(store, {
    petId: pet.id,
    zoneId: state.zoneId,
    type: "inner_voice",
    body: `${pet.name} ${bubble.kind === "speech" ? "冒出一句" : "心里闪过一句"}：「${bubble.text}」`,
    createdAt: now.toISOString(),
    narrationSource: llmMode === "off" ? "template" : "llm",
    emotion: state.mood,
  });
}

async function narratePetEvent(
  store: AppStore,
  pet: Pet,
  owner: Profile,
  state: PetState,
  now: Date,
  input: {
    type: PetEvent["type"];
    fallbackBody: string;
    relatedPet?: Pet;
    socialLines?: PetEvent["socialLines"];
    llmMode?: LLMExecutionMode;
  },
) {
  const previewEvent: PetEvent = {
    id: `preview-${pet.id}-${input.type}`,
    petId: pet.id,
    zoneId: state.zoneId,
    type: input.type,
    body: input.fallbackBody,
    createdAt: now.toISOString(),
    relatedPetId: input.relatedPet?.id,
    socialLines: input.socialLines,
  };

  const body = await narrateEvent(previewEvent, pet, {
    ...buildPersonaContextFromStore(store, pet, state, createWorldState(now), owner),
    fallbackBody: input.fallbackBody,
    relatedPet: input.relatedPet,
  }, input.llmMode ?? "cache-first");

  return createEvent(store, {
    petId: pet.id,
    zoneId: state.zoneId,
    type: input.type,
    body,
    createdAt: now.toISOString(),
    relatedPetId: input.relatedPet?.id,
    socialLines: input.socialLines,
    narrationSource: body === input.fallbackBody ? "template" : "llm",
    emotion: state.mood,
  });
}

async function maybeEmitSocialDialogue(
  store: AppStore,
  pet: Pet,
  owner: Profile,
  state: PetState,
  nearbyPet: Pet,
  nearbyState: PetState,
  now: Date,
  budget?: { narrationsRemaining: number },
  llmMode: LLMExecutionMode = "cache-first",
) {
  const bond = buildPetBonds(store, pet.id, 8).find((entry) => entry.otherPetId === nearbyPet.id);
  const interaction = socialInteractionFromActivity(state.activity, bond?.status === "friend");
  const petAContext = buildPersonaContextFromStore(store, pet, state, createWorldState(now), owner);
  const petBContext = buildPersonaContextFromStore(
    store,
    nearbyPet,
    nearbyState,
    createWorldState(now),
    store.profiles.find((profile) => profile.id === nearbyPet.ownerId),
  );
  const socialDecision = await decideSocialIntent({
    petA: pet,
    petB: nearbyPet,
    interaction,
    petAContext,
    petBContext,
    mode: llmMode === "cache-first" ? "blocking" : llmMode,
  });
  const exchange = await generateSocialExchange(
    pet,
    nearbyPet,
    socialDecision.interaction,
    {
      petAContext,
      petBContext,
    },
    socialDecision.intent,
    llmMode,
  );

  const firstLine = exchange.lines[0];
  const secondLine = exchange.lines[1];

  if (firstLine?.text) {
    setBubble(state, { text: firstLine.text, kind: "speech" }, now);
  }

  if (secondLine?.text) {
    setBubble(nearbyState, { text: secondLine.text, kind: "speech" }, now);
  }

  upsertRelationship(store, pet.id, nearbyPet.id, {
    affinityDelta: exchange.relationshipDelta.affinityChange + socialDecision.affinityChange,
    rivalryDelta: exchange.relationshipDelta.rivalryChange + socialDecision.rivalryChange,
    nowIso: now.toISOString(),
  });
  if (state.lastAutonomyDecision) {
    state.lastAutonomyDecision.socialIntent = socialDecision.intent;
  }

  const fallbackBody = `${pet.name} 和 ${nearbyPet.name} 在 ${zoneName(store, state.zoneId)} ${socialIntentLabel(socialDecision.intent)}地聊了起来。`;

  if (!budget || budget.narrationsRemaining <= 0) {
    return createEvent(store, {
      petId: pet.id,
      zoneId: state.zoneId,
      type: "social_chat",
      body: fallbackBody,
      createdAt: now.toISOString(),
      relatedPetId: nearbyPet.id,
      socialLines: exchange.lines,
      narrationSource: "template",
      emotion: state.mood,
    });
  }

  budget.narrationsRemaining -= 1;
  return narratePetEvent(store, pet, owner, state, now, {
    type: "social_chat",
    fallbackBody,
    relatedPet: nearbyPet,
    socialLines: exchange.lines,
  });
}

async function resolveActivityEffects(
  store: AppStore,
  pet: Pet,
  owner: Profile,
  state: PetState,
  previousZoneId: GardenZoneId,
  previousMood: PetMood,
  previousActivity: PetState["activity"],
  now: Date,
  budget: { narrationsRemaining: number },
  options: Required<AdvanceStoreOptions>,
) {
  const nowIso = now.toISOString();
  const zoneDisplayName = zoneName(store, state.zoneId);
  const previousZoneDisplayName = zoneName(store, previousZoneId);
  const nearbyPetState = findNearbyPet(store, pet, state);
  const nearbyPet =
    nearbyPetState && store.pets.find((entry) => entry.id === nearbyPetState.petId);
  let emittedEvents = 0;
  const activityChanged = state.activity !== previousActivity;
  const worldState = createWorldState(now);

  const emitEvent = async (
    type: PetEvent["type"],
    fallbackBody: string,
    relatedPet?: Pet,
    socialLines?: PetEvent["socialLines"],
  ) => {
    if (emittedEvents >= 3) {
      return null;
    }

    const event =
      budget.narrationsRemaining > 0
        ? await narratePetEvent(store, pet, owner, state, now, {
            type,
            fallbackBody,
            relatedPet,
            socialLines,
            llmMode: options.llmMode,
          })
        : createEvent(store, {
            petId: pet.id,
            zoneId: state.zoneId,
            type,
            body: fallbackBody,
            createdAt: nowIso,
            relatedPetId: relatedPet?.id,
            socialLines,
            narrationSource: "template",
            emotion: state.mood,
          });

    if (budget.narrationsRemaining > 0) {
      budget.narrationsRemaining -= 1;
    }

    if (type === "mood_change") {
      createNotification(store, {
        userId: owner.id,
        kind: notificationKindFromMood(state.mood),
        petId: pet.id,
        eventId: event.id,
        body: buildMoodNotification(pet.name, state.mood),
      });
    } else if (type === "pooped" || type === "scuffle" || type === "chased" || type === "social_chat") {
      createNotification(store, {
        userId: owner.id,
        kind: "important_event",
        petId: pet.id,
        eventId: event.id,
        body: event.body,
      });
    }

    emittedEvents += 1;
    return event;
  };

  if (state.activity === "move_to_zone" && activityChanged && previousZoneId !== state.zoneId) {
    state.stress = clamp(state.stress - 2);
    state.social = clamp(state.social - 1);
    rememberPet(store, {
      petId: pet.id,
      kind: "favorite_spot",
      body: `${pet.name} 记住了从 ${previousZoneDisplayName} 去 ${zoneDisplayName} 的开放路径。`,
      zoneId: state.zoneId,
      weight: 48,
      nowIso,
    });
    await emitEvent(
      "zone_move",
      `${pet.name} 离开 ${previousZoneDisplayName}，沿着开放花园的边路去了 ${zoneDisplayName}。`,
    );
  }

  if (state.activity === "poop") {
    ensurePoopObject(store, pet, state, nowIso);
    if (activityChanged) {
      state.bladder = clamp(state.bladder - 55);
      state.hygiene = clamp(state.hygiene - 12);
      await emitEvent(
        "pooped",
        buildPetEventBody({
          petName: pet.name,
          type: "pooped",
          zoneName: zoneDisplayName,
        }),
      );
    }
  }

  if (state.activity === "sleep") {
    state.energy = clamp(state.energy + 22);
    state.stress = clamp(state.stress - 10);
    if (activityChanged) {
      rememberPet(store, {
        petId: pet.id,
        kind: "slept_well",
        body: `${pet.name} 记住了 ${zoneDisplayName} 这块很适合睡觉。`,
        zoneId: state.zoneId,
        weight: 60,
        nowIso,
      });

      if (nearbyPet) {
        upsertRelationship(store, pet.id, nearbyPet.id, {
          affinityDelta: 5,
          rivalryDelta: -1,
          nowIso,
        });
      }

      await emitEvent(
        "slept",
        buildPetEventBody({
          petName: pet.name,
          type: "slept",
          zoneName: zoneDisplayName,
        }),
      );
    }
  }

  if (state.activity === "climb_tree") {
    state.stress = clamp(state.stress - 8);
    state.social = clamp(state.social - 4);
    if (activityChanged) {
      rememberPet(store, {
        petId: pet.id,
        kind: "favorite_spot",
        body: `${pet.name} 认定 ${zoneDisplayName} 的树冠是安全位。`,
        zoneId: state.zoneId,
        weight: 72,
        nowIso,
      });
      await emitEvent(
        "climbed_tree",
        buildPetEventBody({
          petName: pet.name,
          type: "climbed_tree",
          zoneName: zoneDisplayName,
        }),
      );
    }
  }

  if (state.activity === "chase") {
    const targetCatState = store.petStates.find(
      (entry) =>
        entry.zoneId === state.zoneId &&
        store.pets.find((petEntry) => petEntry.id === entry.petId)?.species === "cat",
    );
    const targetCat =
      targetCatState && store.pets.find((entry) => entry.id === targetCatState.petId);

    state.stress = clamp(state.stress + 5);
    state.social = clamp(state.social + 3);

    if (targetCatState && targetCat && activityChanged) {
      const escapeTrees = activeZoneObjects(store, targetCatState.zoneId, "tree");
      const panicTree = escapeTrees.length > 0 ? sample(escapeTrees, `${pet.id}-${targetCat.id}-tree`) : null;

      if (panicTree && randomFromSeed(`${pet.id}-${targetCat.id}-escape`) > 0.35) {
        moveToObject(targetCatState, panicTree);
        targetCatState.activity = "climb_tree";
      } else {
        targetCatState.activity = "hide";
      }

      targetCatState.stress = clamp(targetCatState.stress + 8);
      targetCatState.mood = deriveMood(targetCatState);
      const targetCatPersonality = getPetPersonality(targetCat);
      targetCatState.actionEndsAt = new Date(
        now.getTime() + actionDurationMs(targetCatState.activity, `${targetCat.id}-panic`, targetCatPersonality),
      ).toISOString();

      upsertRelationship(store, pet.id, targetCat.id, {
        rivalryDelta: 14,
        affinityDelta: -4,
        nowIso,
      });
      rememberPet(store, {
        petId: targetCat.id,
        kind: "chased_by_dog",
        body: `${targetCat.name} 还记得 ${pet.name} 刚才突然冲出来追它。`,
        zoneId: targetCatState.zoneId,
        relatedPetId: pet.id,
        weight: 92,
        nowIso,
      });
      rememberPet(store, {
        petId: pet.id,
        kind: "enemy_pet",
        body: `${pet.name} 把 ${targetCat.name} 记成了一个特别想追的对象。`,
        zoneId: state.zoneId,
        relatedPetId: targetCat.id,
        weight: 72,
        nowIso,
      });
    }

    if (activityChanged) {
      await emitEvent(
        "chased",
        buildPetEventBody({
          petName: pet.name,
          type: "chased",
          zoneName: zoneDisplayName,
          otherPetName: targetCat?.name,
        }),
        targetCat ?? undefined,
      );
    }
  }

  if (state.activity === "play") {
    state.social = clamp(state.social + 4);
    state.stress = clamp(state.stress - 3);

    if (activityChanged && nearbyPet) {
      upsertRelationship(store, pet.id, nearbyPet.id, {
        affinityDelta: 7,
        rivalryDelta: -2,
        nowIso,
      });
      rememberPet(store, {
        petId: pet.id,
        kind: "friend_pet",
        body: `${pet.name} 觉得 ${nearbyPet.name} 最近特别适合一起疯跑。`,
        zoneId: state.zoneId,
        relatedPetId: nearbyPet.id,
        weight: 66,
        nowIso,
      });
      await emitEvent(
        "bonded",
        buildPetEventBody({
          petName: pet.name,
          type: "bonded",
          zoneName: zoneDisplayName,
          otherPetName: nearbyPet.name,
        }),
        nearbyPet,
      );
    }
  }

  if (state.activity === "scuffle") {
    state.stress = clamp(state.stress + 10);
    if (activityChanged) {
      if (nearbyPet) {
        upsertRelationship(store, pet.id, nearbyPet.id, {
          rivalryDelta: 11,
          affinityDelta: -3,
          nowIso,
        });
        rememberPet(store, {
          petId: pet.id,
          kind: "enemy_pet",
          body: `${pet.name} 把 ${nearbyPet.name} 记成了最近有点不对付的对象。`,
          zoneId: state.zoneId,
          relatedPetId: nearbyPet.id,
          weight: 70,
          nowIso,
        });
      }
      await emitEvent(
        "scuffle",
        buildPetEventBody({
          petName: pet.name,
          type: "scuffle",
          zoneName: zoneDisplayName,
          otherPetName: nearbyPet?.name,
        }),
        nearbyPet ?? undefined,
      );
    }
  }

  if (state.activity === "watch_fish") {
    state.stress = clamp(state.stress - 6);
    state.social = clamp(state.social - 2);
    if (activityChanged) {
      rememberPet(store, {
        petId: pet.id,
        kind: "watched_fish",
        body: `${pet.name} 又在 ${zoneDisplayName} 盯着水里发亮的数字锦鲤。`,
        zoneId: state.zoneId,
        weight: 74,
        nowIso,
      });
      await emitEvent(
        "watched_fish",
        buildPetEventBody({
          petName: pet.name,
          type: "watched_fish",
          zoneName: zoneDisplayName,
        }),
      );
    }
  }

  if (state.activity === "sunbathe") {
    state.energy = clamp(state.energy + 10);
    state.stress = clamp(state.stress - 5);
  }

  if (state.activity === "eat") {
    state.hunger = clamp(state.hunger - 18);
    state.stress = clamp(state.stress - 2);
  }

  if (state.activity === "drink") {
    state.stress = clamp(state.stress - 4);
    state.social = clamp(state.social - 1);
  }

  if (state.activity === "seek_owner") {
    state.social = clamp(state.social + 6);
    state.stress = clamp(state.stress - 6);

    // Arriving next to the owner's live avatar is a real reunion moment.
    const reunionPresence = freshOwnerPresence(store, pet.ownerId, state.zoneId, now.getTime());

    if (
      reunionPresence &&
      activityChanged &&
      tileDistance(state, reunionPresence) <= 3
    ) {
      setBubble(
        state,
        { text: pet.species === "cat" ? "找到你了。" : "你回来啦!!", kind: "speech" },
        now,
      );
      applyGrowthAward(state, { xp: 2, bond: 2 });
      await emitEvent(
        "bonded",
        `${pet.name} 穿过${zoneDisplayName}跑到主人脚边，绕着转了两圈。`,
      );
    }
  }

  if (state.activity === "look_around") {
    state.stress = clamp(state.stress - 2);
  }

  if (state.activity === "groom") {
    state.hygiene = clamp(state.hygiene + 14);
    state.stress = clamp(state.stress - 5);
    if (activityChanged) {
      await emitEvent(
        "groomed",
        buildPetEventBody({
          petName: pet.name,
          type: "groomed",
          zoneName: zoneDisplayName,
        }),
      );
    }
  }

  if (state.activity === "dig") {
    state.stress = clamp(state.stress - 3);
    state.hunger = clamp(state.hunger + 4);
    if (activityChanged) {
      await emitEvent(
        "dug",
        buildPetEventBody({
          petName: pet.name,
          type: "dug",
          zoneName: zoneDisplayName,
        }),
      );
    }
  }

  const nextMood = deriveMood(state);
  state.mood = nextMood;

  if (nextMood !== previousMood) {
    await emitEvent(
      "mood_change",
      buildMoodNotification(pet.name, nextMood),
    );
    await maybeGenerateInnerVoice(store, pet, owner, state, now, "mood_change", worldState, options.llmMode);
  } else if (
    activityChanged &&
    randomFromSeed(`${pet.id}-${previousActivity}-${state.activity}-${Math.floor(now.getTime() / ACTION_WINDOW_MS)}-inner-voice`) >
      0.7
  ) {
    await maybeGenerateInnerVoice(store, pet, owner, state, now, "activity_change", worldState, options.llmMode);
  }

  if (activityChanged && nearbyPet && nearbyPetState && ["play", "scuffle", "chase"].includes(state.activity)) {
    await maybeEmitSocialDialogue(store, pet, owner, state, nearbyPet, nearbyPetState, now, budget, options.llmMode);
    if (!state.currentBubble) {
      await maybeGenerateInnerVoice(store, pet, owner, state, now, "social_encounter", worldState, options.llmMode);
    }
  } else if (
    store.ownerActions.some(
      (action) =>
        action.petId === pet.id &&
        now.getTime() - new Date(action.createdAt).getTime() < 1000 * 60 * 12,
    )
  ) {
    await maybeGenerateInnerVoice(store, pet, owner, state, now, "owner_nearby", worldState, options.llmMode);
  } else if (randomFromSeed(`${pet.id}-${state.activity}-${Math.floor(now.getTime() / ACTION_WINDOW_MS)}-bubble`) > 0.95) {
    await maybeGenerateInnerVoice(store, pet, owner, state, now, "random", worldState, options.llmMode);
  }
}

export async function advanceStoreToNow(
  store: AppStore,
  now = new Date(),
  options: AdvanceStoreOptions = {},
) {
  const nowIso = now.toISOString();
  ageSocialGraph(store, nowIso);
  syncAutonomyState(store, nowIso);
  const budget = { narrationsRemaining: MAX_NARRATED_EVENTS_PER_ADVANCE };
  const resolvedOptions: Required<AdvanceStoreOptions> = {
    llmMode: options.llmMode ?? "cache-first",
  };

  for (const state of store.petStates) {
    const pet = store.pets.find((entry) => entry.id === state.petId);
    const owner = pet && store.profiles.find((profile) => profile.id === pet.ownerId);

    if (!pet || !owner) {
      continue;
    }

    state.tileX = clampTileX(state.tileX);
    state.tileY = clampTileY(state.tileY);

    const rawLastSimulatedAtMs = timeMs(state.lastSimulatedAt);
    const effectiveLastSimulatedAtMs =
      rawLastSimulatedAtMs <= now.getTime() + FUTURE_TOLERANCE_MS
        ? rawLastSimulatedAtMs
        : now.getTime() - ACTION_WINDOW_MS * 2;
    const elapsedMs = Math.max(0, now.getTime() - effectiveLastSimulatedAtMs);

    if (elapsedMs < 1000) {
      continue;
    }

    const previousMood = state.mood;
    const previousActivity = state.activity;
    const previousZoneId = state.zoneId;
    const previousTileX = state.tileX;
    const previousTileY = state.tileY;
    const personality = getPetPersonality(pet);
    const actionEndsAtMs = timeMs(state.actionEndsAt);
    const shouldRetarget =
      actionEndsAtMs === 0 ||
      actionEndsAtMs <= now.getTime() ||
      !isCurrentTimeline(state.actionEndsAt, now.getTime());

    ensureGrowthState(state);
    applyNeedDecay(state, elapsedMs);
    applyBondDecay(state, elapsedMs);
    syncPetAutonomyState(store, pet, nowIso);

    if (shouldRetarget) {
      const autonomyMode =
        shouldUseLLMAutonomyForPet(pet, state) ? resolvedOptions.llmMode : "off";
      await chooseActivityWithAutonomy(store, pet, owner, state, now, autonomyMode);
      state.facing = facingFromDelta(
        state.tileX - previousTileX,
        state.tileY - previousTileY,
        pickFacing(`${pet.id}-${state.activity}-${Math.floor(now.getTime() / ACTION_WINDOW_MS)}`),
      );
      state.actionEndsAt = new Date(
        now.getTime() + actionDurationMs(state.activity, `${pet.id}-${state.activity}`, personality),
      ).toISOString();
    }

    clearExpiredBubble(state, now.getTime());
    await resolveActivityEffects(
      store,
      pet,
      owner,
      state,
      previousZoneId,
      previousMood,
      previousActivity,
      now,
      budget,
      resolvedOptions,
    );
    if (
      state.bladder >= 75 &&
      !store.worldObjects.some(
        (object) => object.type === "poop" && object.petId === pet.id && !object.removedAt,
      )
    ) {
      ensurePoopObject(store, pet, state, nowIso);
    }
    syncPetAutonomyState(store, pet, nowIso);
    state.lastSimulatedAt = nowIso;
  }

  syncAutonomyState(store, nowIso);
  for (const zone of store.gardenZones) {
    const visiblePetIds = store.pets
      .filter((pet) => {
        if (pet.visibility !== "public" || pet.isFrozen) {
          return false;
        }

        const state = store.petStates.find((entry) => entry.petId === pet.id);
        const generation = store.petGenerations.find(
          (entry) => entry.id === pet.activeGenerationId && entry.status === "succeeded",
        );

        return Boolean(state && generation && state.zoneId === zone.id);
      })
      .map((pet) => pet.id);

    const encounters = buildGardenEncounters(store, {
      zoneId: zone.id,
      visiblePetIds,
      nowIso,
    });
    syncGardenEncounterThreads(store, encounters, nowIso);
  }
  store.petEvents = store.petEvents.slice(0, 300);
  store.petMemories = store.petMemories.slice(0, 300);
  store.petRelationships = store.petRelationships.slice(0, 200);
  store.notifications = store.notifications.slice(0, 200);
  store.ownerActions = store.ownerActions.slice(0, 200);
}

function stablePetSort(seed: string, petId: string) {
  return simpleHash(`${seed}-${petId}`);
}

export function buildGardenSnapshot(
  store: AppStore,
  zoneId: GardenZoneId,
  viewerId?: string,
): GardenSnapshot {
  const zone = store.gardenZones.find((entry) => entry.id === zoneId) ?? store.gardenZones[0];
  const world = createWorldState();
  const hourSeed = new Date().toISOString().slice(0, 13);
  const nowMs = Date.now();
  const visibleEvents = store.petEvents.filter(
    (event) => !event.hidden && isCurrentTimeline(event.createdAt, nowMs),
  );
  const publicCandidates = store.pets.filter((pet) => {
    if (pet.isFrozen || pet.visibility !== "public") {
      return false;
    }

    const state = store.petStates.find((entry) => entry.petId === pet.id);
    const generation = store.petGenerations.find(
      (entry) => entry.id === pet.activeGenerationId && entry.status === "succeeded",
    );

    return Boolean(state && generation && state.zoneId === zone.id);
  });
  const publicCandidateIds = new Set(publicCandidates.map((pet) => pet.id));
  const publicZoneEvents = visibleEvents.filter((event) => {
    if (event.zoneId !== zone.id || !publicCandidateIds.has(event.petId)) {
      return false;
    }

    return !event.relatedPetId || publicCandidateIds.has(event.relatedPetId);
  });

  const priorityViewer = publicCandidates.filter((pet) => pet.ownerId === viewerId);
  const recentEventPetIds = new Set(
    publicZoneEvents
      .filter(
        (event) => nowMs - timeMs(event.createdAt) < 1000 * 60 * 60 * 2,
      )
      .map((event) => event.petId),
  );
  const priorityRecent = publicCandidates.filter(
    (pet) => recentEventPetIds.has(pet.id) && !priorityViewer.some((entry) => entry.id === pet.id),
  );
  const remaining = publicCandidates
    .filter(
      (pet) =>
        !priorityViewer.some((entry) => entry.id === pet.id) &&
        !priorityRecent.some((entry) => entry.id === pet.id),
    )
    .sort((left, right) => stablePetSort(hourSeed, left.id) - stablePetSort(hourSeed, right.id));

  const selectedPets = [...priorityViewer, ...priorityRecent, ...remaining].slice(
    0,
    MAX_ZONE_PETS,
  );
  const selectedPetIds = new Set(selectedPets.map((pet) => pet.id));

  const pets = selectedPets
    .map((pet): GardenPetSnapshot | null => {
      const owner = store.profiles.find((entry) => entry.id === pet.ownerId);
      const generation = store.petGenerations.find(
        (entry) => entry.id === pet.activeGenerationId && entry.status === "succeeded",
      );
      const state = store.petStates.find((entry) => entry.petId === pet.id);
      const recentEvent = store.petEvents.find(
        (event) => event.petId === pet.id && !event.hidden && isCurrentTimeline(event.createdAt, nowMs),
      );

      if (!owner || !generation || !state) {
        return null;
      }

      return {
        pet,
        generation,
        state,
        owner,
        personality: getPetPersonality(pet),
        growth: growthSummary(state),
        autonomyProfile: store.petAutonomyProfiles.find((entry) => entry.petId === pet.id),
        memoryDigest: store.petMemoryDigests.find((entry) => entry.petId === pet.id),
        semanticMemoryDigest: store.petSemanticMemoryDigests.find((entry) => entry.petId === pet.id),
        bonds: buildPetBonds(store, pet.id),
        memories: listPetMemories(store, pet.id),
        currentGoals: getActiveGoalSnippets(store, pet.id),
        relationshipModels: listPairRelationshipModels(store, pet.id),
        ledgerFacts: listGardenFactsForPet(store, pet.id),
        conversationSummary: store.conversationSummaries.find(
          (entry) => entry.petId === pet.id && (!viewerId || entry.userId === viewerId),
        ),
        recentEvent,
      };
    })
    .filter((entry): entry is GardenPetSnapshot => entry !== null);

  const objects = activeZoneObjects(store, zone.id);
  const recentEvents = publicZoneEvents
    .filter((event) => selectedPetIds.has(event.petId))
    .sort((left, right) => timeMs(right.createdAt) - timeMs(left.createdAt))
    .slice(0, 12);
  const encounters = buildGardenEncounters(store, {
    zoneId: zone.id,
    visiblePetIds: [...selectedPetIds],
    nowIso: new Date().toISOString(),
  });
  const encounterMarkers = buildGardenEncounterMapMarkers(store, encounters);

  return {
    zone,
    serverTime: new Date().toISOString(),
    world,
    pets,
    objects,
    environmentActors: buildEnvironmentActors(zone.id, world),
    recentEvents,
    encounters,
    encounterMarkers,
  };
}

export function applyOwnerActionToStore(
  store: AppStore,
  input: {
    owner: Profile;
    pet: Pet;
    action: OwnerAction;
  },
) {
  const state = store.petStates.find((entry) => entry.petId === input.pet.id);

  if (!state) {
    throw new Error("pet-state-not-found");
  }

  if (input.pet.ownerId !== input.owner.id) {
    throw new Error("not-authorized");
  }

  const zoneDisplayName = zoneName(store, state.zoneId);
  let summary = "";

  if (input.action === "feed") {
    state.hunger = clamp(state.hunger - 26);
    state.stress = clamp(state.stress - 6);
    state.social = clamp(state.social + 4);
    summary = `${input.owner.displayName} 给 ${input.pet.name} 喂了点零食。`;
  }

  if (input.action === "pet") {
    state.stress = clamp(state.stress - 14);
    state.social = clamp(state.social + 8);
    summary = `${input.owner.displayName} 摸了摸 ${input.pet.name}。`;
  }

  if (input.action === "throw_toy") {
    state.activity = input.pet.species === "dog" ? "chase" : "play";
    state.social = clamp(state.social + 10);
    state.stress = clamp(state.stress - 8);
    rememberPet(store, {
      petId: input.pet.id,
      kind: "favorite_toy",
      body: `${input.pet.name} 现在一看到主人扔玩具就会立刻兴奋起来。`,
      zoneId: state.zoneId,
      weight: 64,
      nowIso: new Date().toISOString(),
    });
    summary = `${input.owner.displayName} 朝 ${input.pet.name} 扔出了玩具。`;
  }

  if (input.action === "clean_poop") {
    const poop = activeZoneObjects(store, state.zoneId, "poop").find(
      (object) => object.petId === input.pet.id,
    );

    if (poop) {
      poop.removedAt = new Date().toISOString();
    }

    state.hygiene = clamp(state.hygiene + 18);
    state.stress = clamp(state.stress - 5);
    summary = `${input.owner.displayName} 替 ${input.pet.name} 清理了现场。`;
  }

  if (input.action === "call") {
    state.activity = "seek_owner";
    state.social = clamp(state.social + 8);
    state.stress = clamp(state.stress - 3);
    summary = `${input.owner.displayName} 叫了 ${input.pet.name} 一声。`;
  }

  if (input.action === "scold") {
    state.stress = clamp(state.stress + 9);
    state.social = clamp(state.social - 6);
    summary = `${input.owner.displayName} 训了 ${input.pet.name} 两句。`;
  }

  if (input.action === "gift") {
    state.social = clamp(state.social + 10);
    state.stress = clamp(state.stress - 4);
    rememberPet(store, {
      petId: input.pet.id,
      kind: "favorite_toy",
      body: `${input.pet.name} 记住主人送来的那件小礼物有点特别。`,
      zoneId: state.zoneId,
      weight: 70,
      nowIso: new Date().toISOString(),
    });
    summary = `${input.owner.displayName} 给 ${input.pet.name} 送了份小礼物。`;
  }

  if (input.action === "photo") {
    state.social = clamp(state.social + 2);
    state.stress = clamp(state.stress + 1);
    state.currentBubble = {
      text: input.pet.species === "cat" ? "拍我记得开美颜。" : "等等，我这边还没站好！",
      kind: "speech",
      expiresAt: new Date(Date.now() + BUBBLE_DURATION_MS).toISOString(),
    };
    summary = `${input.owner.displayName} 给 ${input.pet.name} 拍了一张照。`;
  }

  if (input.action === "rename_spot") {
    state.social = clamp(state.social + 4);
    rememberPet(store, {
      petId: input.pet.id,
      kind: "owner_chat",
      body: `${input.pet.name} 记住主人替它常待的角落起了个只有彼此知道的名字。`,
      zoneId: state.zoneId,
      weight: 62,
      nowIso: new Date().toISOString(),
    });
    summary = `${input.owner.displayName} 给 ${input.pet.name} 的地盘起了个新昵称。`;
  }

  // Every act of care feeds the growth loop.
  const growthResult = applyGrowthAward(state, ownerActionGrowthAward(input.action));

  state.mood = deriveMood(state);
  state.lastSimulatedAt = new Date().toISOString();
  syncPetAutonomyState(store, input.pet, state.lastSimulatedAt);

  const event = createEvent(store, {
    petId: input.pet.id,
    zoneId: state.zoneId,
    type: "owner_action",
    body: buildPetEventBody({
      petName: input.pet.name,
      type: "owner_action",
      zoneName: zoneDisplayName,
      action: input.action,
    }),
  });

  if (growthResult.stageChanged) {
    const stageEvent = createEvent(store, {
      petId: input.pet.id,
      zoneId: state.zoneId,
      type: "bonded",
      body: `${input.pet.name} 的代码纹路亮了一下——它进化成了「${growthResult.stageLabel}」。`,
    });

    createNotification(store, {
      userId: input.owner.id,
      kind: "important_event",
      petId: input.pet.id,
      eventId: stageEvent.id,
      body: `${input.pet.name} 进化成了「${growthResult.stageLabel}」！这是你们一起攒出来的。`,
    });
  }

  store.ownerActions.unshift({
    id: randomUUID(),
    ownerId: input.owner.id,
    petId: input.pet.id,
    action: input.action,
    createdAt: new Date().toISOString(),
    summary,
  });

  createNotification(store, {
    userId: input.owner.id,
    kind: "system",
    petId: input.pet.id,
    eventId: event.id,
    body: buildPetEventBody({
      petName: input.pet.name,
      type: "owner_action",
      zoneName: zoneDisplayName,
      action: input.action,
    }),
  });

  return {
    state,
    event,
  };
}
