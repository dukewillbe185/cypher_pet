import { randomUUID } from "node:crypto";

import {
  clampBubbleText,
  looksLikeMetaReasoning,
  normalizePetChatMessage,
  sanitizePetUtterance,
} from "@/lib/ai/content-safety";
import { authorPetAutonomyProfile } from "@/lib/ai/profile-author";
import { getLLMProvider } from "@/lib/ai/llm-provider";
import { extractMemory } from "@/lib/ai/memory-extractor";
import { narrateEvent } from "@/lib/ai/narrator";
import { buildPetChatPrompt, buildPersonaContextFromStore, type PersonaContext } from "@/lib/ai/pet-persona";
import {
  estimateTokensFromText,
  executeLLMTask,
  type LLMExecutionMode,
} from "@/lib/ai/rate-limiter";
import { generateInnerVoice } from "@/lib/ai/inner-voice";
import { decideSocialIntent } from "@/lib/ai/social-intent";
import { generateSocialExchange, type SocialInteraction } from "@/lib/ai/social-chat";
import { syncPetAutonomyState } from "@/lib/domain/autonomy";
import {
  parseOwnerChatWorldCommand,
  shouldResolveOwnerChatWorldCommandImmediately,
} from "@/lib/domain/chat-world-command";
import { buildPetEpisodicMemoryIndex, buildSemanticMemoryDigest } from "@/lib/ai/memory-compressor";
import { recordEncounterIntervention, recordEncounterWorldAction } from "@/lib/domain/garden-encounters";
import { buildGardenSnapshot, advanceStoreToNow, applyOwnerActionToStore, deriveMood } from "@/lib/domain/simulation";
import {
  applyGrowthAward,
  DAILY_REUNION_BOND,
  DAILY_REUNION_XP,
  ensureGrowthState,
  utcDayKey,
} from "@/lib/domain/growth";
import {
  listGardenFactsForPet,
  listGardenLedgerEvents,
  listRelevantGardenFacts,
  recordGardenLedgerEvent,
} from "@/lib/domain/garden-memory";
import { ensurePetGoals, listPetGoals, upsertPetGoal } from "@/lib/domain/goals";
import { getPetPersonality } from "@/lib/domain/personality";
import { buildPetBonds, listPetMemories, rememberPet } from "@/lib/domain/social";
import { listPairRelationshipModels } from "@/lib/domain/social-model";
import { clampTileX, clampTileY, createWorldState } from "@/lib/domain/world";
import { env } from "@/lib/env";
import { slugifyHandle, titleCase } from "@/lib/utils";
import { mutateStore, queryStore } from "@/lib/repository/store";
import type {
  AppStore,
  ChatReplySource,
  ChatSession,
  ChatMessage,
  ConversationSummary,
  DashboardPetCard,
  HomeSignalFeed,
  GardenZoneId,
  GardenEncounterWorldAction,
  LLMChatResult,
  OwnerAction,
  OwnerPetCommand,
  Pet,
  PetActivity,
  PetDetailsView,
  PetGeneration,
  PetGoalType,
  PetState,
  Profile,
  ReportStatus,
  ReportTargetType,
  Species,
  PetMood,
  ViewerDashboard,
  Visibility,
} from "@/lib/types";

export async function listGardenZones() {
  return queryStore((store) => store.gardenZones);
}

type WorldViewReadOptions = {
  llmMode?: LLMExecutionMode;
};

const BACKGROUND_TICK_FRESHNESS_WINDOW_MS = Math.max(env.gardenTickIntervalMs * 3, 45_000);

function getLatestSimulationLagMs(store: AppStore) {
  const latestSimulatedAt = store.petStates.reduce((latest, state) => {
    const simulatedAtMs = new Date(state.lastSimulatedAt).getTime();
    return Number.isFinite(simulatedAtMs) ? Math.max(latest, simulatedAtMs) : latest;
  }, 0);

  if (!latestSimulatedAt) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, Date.now() - latestSimulatedAt);
}

async function readWorldView<T>(
  reader: (store: AppStore) => T | Promise<T>,
  options?: WorldViewReadOptions,
) {
  if (env.gardenBackgroundTickEnabled) {
    const snapshot = await queryStore(async (store) => {
      if (getLatestSimulationLagMs(store) > BACKGROUND_TICK_FRESHNESS_WINDOW_MS) {
        return { shouldAdvance: true as const };
      }

      return {
        shouldAdvance: false as const,
        value: await reader(store),
      };
    });

    if (!snapshot.shouldAdvance) {
      return snapshot.value;
    }
  }

  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: options?.llmMode ?? "off" });
    return reader(store);
  });
}

function zoneLabel(store: AppStore, zoneId: GardenZoneId) {
  return store.gardenZones.find((zone) => zone.id === zoneId)?.name ?? zoneId;
}

function facingFromDelta(dx: number, dy: number, fallback: PetState["facing"]) {
  if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) > 0) {
    return dx > 0 ? "right" : "left";
  }

  if (Math.abs(dy) > 0) {
    return dy > 0 ? "down" : "up";
  }

  return fallback;
}

function guidedActionDurationMs(activity: PetActivity, pet: Pet) {
  const personality = getPetPersonality(pet);

  switch (activity) {
    case "climb_tree":
      return 16_000 + Math.floor(personality.treeAffinity * 18);
    case "chase":
      return 11_000 + Math.floor(personality.zoomies * 18);
    case "scuffle":
      return 18_000 + Math.floor(personality.boldness * 16);
    case "approach_pet":
      return 11_000 + Math.floor(personality.sociability * 10);
    case "move_to_zone":
    case "wander":
      return 10_000 + Math.floor(personality.curiosity * 12);
    case "hide":
      return 12_000 + Math.floor((100 - personality.boldness) * 8);
    case "watch_fish":
      return 14_000 + Math.floor(personality.curiosity * 12);
    default:
      return 9_000 + Math.floor(personality.curiosity * 10);
  }
}

function pushOwnerDirectedEvent(
  store: AppStore,
  input: {
    pet: Pet;
    zoneId: GardenZoneId;
    body: string;
    createdAt: string;
    relatedPetId?: string;
    type?: "owner_action" | "chased" | "scuffle";
  },
) {
  const eventType = input.type ?? "owner_action";

  store.petEvents.unshift({
    id: randomUUID(),
    petId: input.pet.id,
    zoneId: input.zoneId,
    type: eventType,
    body: input.body,
    relatedPetId: input.relatedPetId,
    createdAt: input.createdAt,
  });

  recordGardenLedgerEvent(store, {
    type: eventType === "chased" || eventType === "scuffle" ? "conflict" : "owner_action",
    participants: [input.pet.id, input.relatedPetId].filter(Boolean) as string[],
    zoneId: input.zoneId,
    body: input.body,
    salience: eventType === "chased" || eventType === "scuffle" ? 72 : 60,
    semanticTags:
      eventType === "chased"
        ? ["owner_action", "guided_chase"]
        : eventType === "scuffle"
          ? ["owner_action", "guided_scuffle"]
          : ["owner_action", "guided_move"],
    nowIso: input.createdAt,
  });
}

export function applyOwnerPetCommandToStore(
  store: AppStore,
  input: {
    owner: Profile;
    pet: Pet;
    command: OwnerPetCommand;
  },
) {
  const state = store.petStates.find((entry) => entry.petId === input.pet.id);

  if (!state) {
    throw new Error("pet-state-not-found");
  }

  if (input.pet.ownerId !== input.owner.id) {
    throw new Error("not-authorized");
  }

  const previousZoneId = state.zoneId;
  const previousTileX = state.tileX;
  const previousTileY = state.tileY;
  const nowIso = new Date().toISOString();
  let activity: PetActivity = "wander";
  let summary = "";
  let relatedPetId: string | undefined;

  switch (input.command.type) {
    case "move_to_tile":
      state.zoneId = input.command.zoneId;
      state.tileX = clampTileX(input.command.tileX);
      state.tileY = clampTileY(input.command.tileY);
      activity = "wander";
      summary = `${input.owner.displayName} 轻轻指了下 ${zoneLabel(store, state.zoneId)} 的另一头，${input.pet.name} 便朝那边慢慢走过去。`;
      upsertPetGoal(store, {
        petId: input.pet.id,
        goalType: "move_to_zone",
        priority: 76,
        targetZoneId: state.zoneId,
        status: "active",
        progress: 16,
        expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
        reason: `${input.owner.displayName} 刚刚指了一个想让 ${input.pet.name} 过去的位置。`,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      break;
    case "move_to_object": {
      const command = input.command;
      const targetObject = store.worldObjects.find(
        (object) => object.id === command.objectId && !object.removedAt,
      );

      if (!targetObject) {
        throw new Error("target-object-not-found");
      }

      state.zoneId = targetObject.zoneId;
      state.tileX = clampTileX(targetObject.tileX);
      state.tileY = clampTileY(targetObject.tileY);

      if (targetObject.type === "tree") {
        activity = input.pet.species === "cat" ? "climb_tree" : "look_around";
        summary =
          input.pet.species === "cat"
            ? `${input.owner.displayName} 朝树枝上方扬了扬下巴，${input.pet.name} 立刻往那棵树窜了过去。`
            : `${input.owner.displayName} 指向树边，${input.pet.name} 便跑去树下探了探气味。`;
        rememberPet(store, {
          petId: input.pet.id,
          kind: "favorite_spot",
          body: `${input.pet.name} 记住主人曾经示意它去靠近 ${zoneLabel(store, targetObject.zoneId)} 的那棵树。`,
          zoneId: targetObject.zoneId,
          weight: 58,
          nowIso,
        });
      } else if (targetObject.type === "bush") {
        activity = "hide";
        summary = `${input.owner.displayName} 朝灌木丛点了点，${input.pet.name} 便悄悄往那边缩了过去。`;
      } else if (targetObject.type === "pond_edge") {
        activity = "watch_fish";
        summary = `${input.owner.displayName} 示意水边，${input.pet.name} 立刻把注意力挪向池沿。`;
      } else {
        activity = "look_around";
        summary = `${input.owner.displayName} 指了指前面的 ${targetObject.type}，${input.pet.name} 很快就朝那边靠了过去。`;
      }
      break;
    }
    case "move_to_pet": {
      const command = input.command;
      const targetPet = store.pets.find((entry) => entry.id === command.targetPetId);
      const targetState = store.petStates.find((entry) => entry.petId === command.targetPetId);

      if (!targetPet || !targetState) {
        throw new Error("target-pet-not-found");
      }

      if (targetPet.id === input.pet.id) {
        throw new Error("target-pet-invalid");
      }

      state.zoneId = targetState.zoneId;
      state.tileX = clampTileX(targetState.tileX + (input.pet.species === "dog" ? -1 : 1));
      state.tileY = clampTileY(targetState.tileY);
      activity = "approach_pet";
      relatedPetId = targetPet.id;
      summary = `${input.owner.displayName} 提到了 ${targetPet.name}，${input.pet.name} 便朝它所在的方向靠了过去。`;

      upsertPetGoal(store, {
        petId: input.pet.id,
        goalType: "repair_bond",
        priority: 72,
        targetPetId: targetPet.id,
        status: "active",
        progress: 12,
        expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
        reason: `${input.owner.displayName} 刚刚让 ${input.pet.name} 去找 ${targetPet.name}。`,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      break;
    }
    case "chase_pet": {
      const command = input.command;
      const targetPet = store.pets.find((entry) => entry.id === command.targetPetId);
      const targetState = store.petStates.find((entry) => entry.petId === command.targetPetId);

      if (!targetPet || !targetState) {
        throw new Error("target-pet-not-found");
      }

      if (targetPet.id === input.pet.id) {
        throw new Error("target-pet-invalid");
      }

      state.zoneId = targetState.zoneId;
      state.tileX = clampTileX(targetState.tileX + (input.pet.species === "dog" ? -2 : -1));
      state.tileY = clampTileY(targetState.tileY);
      activity = "chase";
      relatedPetId = targetPet.id;
      summary = `${input.owner.displayName} 提到了要追 ${targetPet.name}，${input.pet.name} 立刻朝它冲了过去。`;

      targetState.stress = Math.min(100, targetState.stress + 5);
      targetState.social = Math.max(0, targetState.social - 2);
      targetState.mood = deriveMood(targetState);
      targetState.currentBubble = {
        text: "别追太近。",
        kind: "speech",
        expiresAt: new Date(Date.now() + 5_500).toISOString(),
      };

      upsertPetGoal(store, {
        petId: input.pet.id,
        goalType: "chase_target",
        priority: 82,
        targetPetId: targetPet.id,
        status: "active",
        progress: 18,
        expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        reason: `${input.owner.displayName} 刚刚让 ${input.pet.name} 去追 ${targetPet.name}。`,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      break;
    }
    case "scuffle_pet": {
      const command = input.command;
      const targetPet = store.pets.find((entry) => entry.id === command.targetPetId);
      const targetState = store.petStates.find((entry) => entry.petId === command.targetPetId);

      if (!targetPet || !targetState) {
        throw new Error("target-pet-not-found");
      }

      if (targetPet.id === input.pet.id) {
        throw new Error("target-pet-invalid");
      }

      state.zoneId = targetState.zoneId;
      state.tileX = clampTileX(targetState.tileX + (input.pet.species === "dog" ? -1 : 1));
      state.tileY = clampTileY(targetState.tileY);
      activity = "scuffle";
      relatedPetId = targetPet.id;
      summary = `${input.owner.displayName} 让 ${input.pet.name} 去找 ${targetPet.name} 打一架，两个身影立刻撞在一起。`;

      targetState.activity = "scuffle";
      targetState.facing = facingFromDelta(state.tileX - targetState.tileX, state.tileY - targetState.tileY, targetState.facing);
      targetState.actionEndsAt = new Date(Date.now() + guidedActionDurationMs("scuffle", targetPet)).toISOString();
      targetState.stress = Math.min(100, targetState.stress + 9);
      targetState.social = Math.max(0, targetState.social - 5);
      targetState.mood = deriveMood(targetState);
      targetState.currentBubble = {
        text: "别打太凶。",
        kind: "speech",
        expiresAt: new Date(Date.now() + 5_500).toISOString(),
      };
      targetState.lastSimulatedAt = nowIso;

      upsertPetGoal(store, {
        petId: input.pet.id,
        goalType: "avoid_pet",
        priority: 92,
        targetPetId: targetPet.id,
        status: "active",
        progress: 18,
        expiresAt: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
        reason: `${input.owner.displayName} 刚刚让 ${input.pet.name} 和 ${targetPet.name} 起了冲突。`,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      break;
    }
  }

  state.activity = activity;
  state.facing = facingFromDelta(state.tileX - previousTileX, state.tileY - previousTileY, state.facing);
  state.actionEndsAt = new Date(Date.now() + guidedActionDurationMs(activity, input.pet)).toISOString();
  state.social = Math.max(0, Math.min(100, state.social + (activity === "scuffle" ? -3 : 4)));
  state.stress = Math.max(0, Math.min(100, state.stress + (activity === "scuffle" ? 7 : -2)));
  state.mood = deriveMood(state);
  state.currentBubble = {
    text:
      activity === "climb_tree"
        ? "上树。"
        : activity === "chase"
          ? "我去追它。"
        : activity === "scuffle"
          ? "我冲上去了。"
        : activity === "approach_pet"
          ? "我去看看。"
          : "这就过去。",
    kind: "speech",
    expiresAt: new Date(Date.now() + 5_500).toISOString(),
  };
  state.lastSimulatedAt = nowIso;
  state.activeGoals = listPetGoals(store, input.pet.id).map((goal) => goal.id);
  syncPetAutonomyState(store, input.pet, nowIso);

  pushOwnerDirectedEvent(store, {
    pet: input.pet,
    zoneId: state.zoneId,
    body: summary,
    createdAt: nowIso,
    relatedPetId,
    type: activity === "chase" ? "chased" : activity === "scuffle" ? "scuffle" : "owner_action",
  });

  store.ownerActions.unshift({
    id: randomUUID(),
    ownerId: input.owner.id,
    petId: input.pet.id,
    action: "call",
    createdAt: nowIso,
    summary,
  });

  return {
    petId: input.pet.id,
    zoneId: state.zoneId,
    previousZoneId,
    activity,
    summary,
  };
}

function findViewerPetForEncounter(store: AppStore, input: {
  viewerId: string;
  thread: { zoneId: GardenZoneId; participantPetIds: string[] };
}) {
  const participantIds = new Set(input.thread.participantPetIds);
  return store.pets.find((pet) => {
    if (pet.ownerId !== input.viewerId || pet.isFrozen || participantIds.has(pet.id)) {
      return false;
    }

    const state = store.petStates.find((entry) => entry.petId === pet.id);
    return Boolean(state && state.zoneId === input.thread.zoneId);
  });
}

function findEncounterApproachTarget(store: AppStore, input: {
  actorPetId?: string;
  thread: { zoneId: GardenZoneId; participantPetIds: string[] };
}) {
  const actorState = input.actorPetId
    ? store.petStates.find((entry) => entry.petId === input.actorPetId)
    : undefined;

  return input.thread.participantPetIds
    .map((petId) => {
      const pet = store.pets.find((entry) => entry.id === petId);
      const state = store.petStates.find((entry) => entry.petId === petId);
      return pet && state && state.zoneId === input.thread.zoneId && pet.id !== input.actorPetId
        ? { pet, state }
        : null;
    })
    .filter((entry): entry is { pet: Pet; state: PetState } => Boolean(entry))
    .sort((left, right) => {
      if (!actorState) {
        return 0;
      }

      const leftDistance = Math.hypot(left.state.tileX - actorState.tileX, left.state.tileY - actorState.tileY);
      const rightDistance = Math.hypot(right.state.tileX - actorState.tileX, right.state.tileY - actorState.tileY);
      return leftDistance - rightDistance;
    })[0]?.pet;
}

export function applyEncounterWorldActionToStore(
  store: AppStore,
  input: {
    viewerId: string;
    threadId: string;
    action: GardenEncounterWorldAction;
    nowIso?: string;
  },
) {
  const viewer = store.profiles.find((profile) => profile.id === input.viewerId);
  if (!viewer) {
    throw new Error("not-found");
  }

  const thread = store.gardenEncounterThreads.find((entry) => entry.id === input.threadId);
  if (!thread) {
    throw new Error("encounter-not-found");
  }

  let actorPetId: string | undefined;
  let targetPetId: string | undefined;

  if (input.action === "approach") {
    const actorPet = findViewerPetForEncounter(store, {
      viewerId: viewer.id,
      thread,
    });
    const targetPet = findEncounterApproachTarget(store, {
      actorPetId: actorPet?.id,
      thread,
    });

    if (!actorPet || !targetPet) {
      throw new Error("encounter-approach-target-not-found");
    }

    applyOwnerPetCommandToStore(store, {
      owner: viewer,
      pet: actorPet,
      command: {
        type: "move_to_pet",
        targetPetId: targetPet.id,
      },
    });
    actorPetId = actorPet.id;
    targetPetId = targetPet.id;
  }

  const updatedThread = recordEncounterWorldAction(store, {
    threadId: input.threadId,
    viewerId: viewer.id,
    action: input.action,
    actorPetId,
    targetPetId,
    nowIso: input.nowIso,
  });

  if (!updatedThread) {
    throw new Error("encounter-not-found");
  }

  return {
    thread: updatedThread,
    actorPetId,
    targetPetId,
  };
}

export async function listFeaturedPets() {
  return readWorldView((store) => {
    return store.pets
      .filter((pet) => pet.visibility === "public" && !pet.isFrozen)
      .slice(0, 4)
      .map((pet) => ({
        pet,
        generation: store.petGenerations.find(
          (generation) =>
            generation.id === pet.activeGenerationId &&
            generation.status === "succeeded",
        ),
        owner: store.profiles.find((profile) => profile.id === pet.ownerId),
        state: store.petStates.find((state) => state.petId === pet.id),
      }))
      .filter((entry) => entry.owner && entry.generation);
  });
}

export async function getGardenSnapshot(input: {
  zoneId: GardenZoneId;
  viewerId?: string;
  llmMode?: LLMExecutionMode;
}) {
  return readWorldView(
    (store) => buildGardenSnapshot(store, input.zoneId, input.viewerId),
    { llmMode: input.llmMode ?? "off" },
  );
}

export async function getGardenPreview(viewerId?: string) {
  return readWorldView(
    (store) => store.gardenZones.map((zone) => buildGardenSnapshot(store, zone.id, viewerId)),
    { llmMode: "off" },
  );
}

function buildHomeSignalFeed(
  store: AppStore,
  input?: {
    viewerId?: string;
    viewerName?: string;
    limit?: number;
  },
): HomeSignalFeed {
  const limit = input?.limit ?? 4;
  const refreshedAt = new Date().toISOString();
  const petNameById = new Map(store.pets.map((pet) => [pet.id, pet.name]));
  const zoneNameById = new Map(store.gardenZones.map((zone) => [zone.id, zone.name]));

  if (input?.viewerId) {
    return {
      audience: "viewer",
      refreshedAt,
      viewerName: input.viewerName,
      items: store.notifications
        .filter((notification) => notification.userId === input.viewerId)
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        )
        .slice(0, limit)
        .map((notification) => ({
          id: notification.id,
          source: "notification" as const,
          kind: notification.kind,
          body: notification.body,
          createdAt: notification.createdAt,
          href: notification.petId ? `/pets/${notification.petId}` : "/notifications",
          petId: notification.petId,
          petName: notification.petId ? petNameById.get(notification.petId) : undefined,
        })),
    };
  }

  return {
    audience: "public",
    refreshedAt,
    items: store.petEvents
      .filter((event) => !event.hidden)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      )
      .slice(0, limit)
      .map((event) => ({
        id: event.id,
        source: "event" as const,
        kind: "public_event" as const,
        body: event.body,
        createdAt: event.createdAt,
        href: `/garden?zone=${event.zoneId}`,
        petId: event.petId,
        petName: petNameById.get(event.petId),
        zoneId: event.zoneId,
        zoneName: zoneNameById.get(event.zoneId),
      })),
  };
}

export async function getHomeSignals(input?: {
  viewerId?: string;
  viewerName?: string;
  limit?: number;
  simulate?: boolean;
}) {
  if (input?.simulate === false) {
    return queryStore((store) => buildHomeSignalFeed(store, input));
  }

  return readWorldView((store) => buildHomeSignalFeed(store, input), { llmMode: "off" });
}

export async function runGardenTick(input?: {
  now?: Date;
  llmMode?: LLMExecutionMode;
}) {
  return mutateStore(async (store) => {
    const startedAt = input?.now ?? new Date();
    const previousLastSimulatedAt = new Map(
      store.petStates.map((state) => [state.petId, state.lastSimulatedAt]),
    );
    const previousRelationshipUpdatedAt = new Map(
      store.petRelationships.map((relationship) => [relationship.id, relationship.updatedAt]),
    );
    const before = {
      events: store.petEvents.length,
      notifications: store.notifications.length,
      memories: store.petMemories.length,
    };

    await advanceStoreToNow(store, startedAt, {
      llmMode: input?.llmMode ?? "off",
    });

    return {
      tickedAt: startedAt.toISOString(),
      llmMode: input?.llmMode ?? "off",
      petsSimulated: store.petStates.filter(
        (state) => previousLastSimulatedAt.get(state.petId) !== state.lastSimulatedAt,
      ).length,
      newEvents: Math.max(0, store.petEvents.length - before.events),
      newNotifications: Math.max(0, store.notifications.length - before.notifications),
      newMemories: Math.max(0, store.petMemories.length - before.memories),
      relationshipUpdates: store.petRelationships.filter(
        (relationship) =>
          previousRelationshipUpdatedAt.get(relationship.id) !== relationship.updatedAt,
      ).length,
    };
  });
}

function buildDashboardPetCard(store: AppStore, pet: Pet): DashboardPetCard {
  const state = store.petStates.find((entry) => entry.petId === pet.id);

  return {
    pet,
    generation: store.petGenerations.find(
      (generation: PetGeneration) =>
        generation.id === pet.activeGenerationId && generation.status === "succeeded",
    ),
    state,
    zone: state
      ? store.gardenZones.find((zone: { id: GardenZoneId }) => zone.id === state.zoneId)
      : undefined,
    personality: getPetPersonality(pet),
    autonomyProfile: store.petAutonomyProfiles.find((entry) => entry.petId === pet.id),
    memoryDigest: store.petMemoryDigests.find((entry) => entry.petId === pet.id),
    semanticMemoryDigest: store.petSemanticMemoryDigests.find((entry) => entry.petId === pet.id),
    bonds: buildPetBonds(store, pet.id),
    memories: listPetMemories(store, pet.id),
    currentGoals: listPetGoals(store, pet.id),
    relationshipModels: listPairRelationshipModels(store, pet.id),
    ledgerFacts: listGardenFactsForPet(store, pet.id),
    conversationSummary: store.conversationSummaries.find(
      (entry) => entry.petId === pet.id && entry.userId === pet.ownerId,
    ),
    recentEvents: store.petEvents
      .filter((event: { petId: string; hidden?: boolean }) => event.petId === pet.id && !event.hidden)
      .slice(0, 4),
  };
}

export async function getViewerDashboard(viewerId: string) {
  return readWorldView((store) => {
    const profile = store.profiles.find((item) => item.id === viewerId);

    if (!profile) {
      return null;
    }

    const pets = store.pets
      .filter((pet) => pet.ownerId === viewerId)
      .map((pet) => buildDashboardPetCard(store, pet));
    const notifications = store.notifications
      .filter((notification) => notification.userId === viewerId)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );

    return {
      profile,
      pets,
      notifications,
    } satisfies ViewerDashboard;
  }, { llmMode: "off" });
}

export async function listViewerPets(viewerId: string) {
  return queryStore((store) =>
    store.pets
      .filter((pet) => pet.ownerId === viewerId)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
  );
}

export async function listNotifications(viewerId: string) {
  return readWorldView(
    (store) => store.notifications
      .filter((notification) => notification.userId === viewerId)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    { llmMode: "off" },
  );
}

export async function getProfileById(profileId: string) {
  return queryStore((store) =>
    store.profiles.find((profile) => profile.id === profileId) ?? null,
  );
}

export async function findDemoProfileByEmail(email: string) {
  return queryStore((store) => {
    const match = store.profiles.find(
      (profile) => profile.email.toLowerCase() === email.toLowerCase(),
    );
    return match ?? store.profiles[0] ?? null;
  });
}

export async function ensureProfileFromAuth(input: {
  id: string;
  email: string;
  displayName?: string;
}) {
  return mutateStore((store) => {
    const existing =
      store.profiles.find((profile) => profile.id === input.id) ??
      store.profiles.find(
        (profile) => profile.email.toLowerCase() === input.email.toLowerCase(),
      );

    if (existing) {
      existing.email = input.email;
      if (input.displayName) {
        existing.displayName = input.displayName;
      }

      return existing;
    }

    const baseHandle = slugifyHandle(input.displayName ?? input.email.split("@")[0] ?? "cypher");
    const uniqueHandle = store.profiles.some((profile) => profile.handle === baseHandle)
      ? `${baseHandle}-${store.profiles.length + 1}`
      : baseHandle;

    const profile: Profile = {
      id: input.id,
      email: input.email,
      handle: uniqueHandle,
      displayName: input.displayName ?? titleCase(baseHandle),
      bio: "刚刚把自己的宠物搬进了 Cypher 花园。",
      role: "user",
      createdAt: new Date().toISOString(),
    };

    store.profiles.unshift(profile);
    return profile;
  });
}

export async function updateProfile(
  viewerId: string,
  input: { handle: string; displayName: string; bio: string },
) {
  return mutateStore((store) => {
    const profile = store.profiles.find((item) => item.id === viewerId);

    if (!profile) {
      throw new Error("profile-not-found");
    }

    const nextHandle = slugifyHandle(input.handle);
    const handleTaken = store.profiles.some(
      (item) => item.id !== viewerId && item.handle === nextHandle,
    );

    if (handleTaken) {
      throw new Error("handle-taken");
    }

    profile.handle = nextHandle;
    profile.displayName = input.displayName.trim();
    profile.bio = input.bio.trim();
    return profile;
  });
}

function initialZoneForSpecies(species: Species) {
  return species === "cat" ? "orchard" : "dog-run";
}

function initialTileForSpecies(species: Species) {
  return species === "cat"
    ? { tileX: 10, tileY: 26 }
    : { tileX: 28, tileY: 28 };
}

export async function createPet(input: {
  viewerId: string;
  name: string;
  species: Species;
  breed?: string;
  bio?: string;
  visibility: Visibility;
}) {
  return mutateStore((store) => {
    const initialTile = initialTileForSpecies(input.species);
    const pet: Pet = {
      id: randomUUID(),
      ownerId: input.viewerId,
      name: input.name.trim(),
      species: input.species,
      breed: input.breed?.trim() || undefined,
      bio: input.bio?.trim() || undefined,
      visibility: input.visibility,
      isFrozen: false,
      createdAt: new Date().toISOString(),
    };

    store.pets.unshift(pet);
    store.petStates.unshift({
      petId: pet.id,
      zoneId: initialZoneForSpecies(pet.species),
      tileX: initialTile.tileX,
      tileY: initialTile.tileY,
      facing: "down",
      mood: "curious",
      activity: "idle",
      energy: 72,
      hunger: 28,
      hygiene: 70,
      bladder: 32,
      social: 58,
      stress: 24,
      actionEndsAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      lastSimulatedAt: new Date().toISOString(),
    });

    syncPetAutonomyState(store, pet, new Date().toISOString());

    return pet;
  });
}

export async function createSourcePhoto(input: {
  petId: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  originalFilename: string;
}) {
  return mutateStore((store) => {
    const photo = {
      id: randomUUID(),
      petId: input.petId,
      storagePath: input.storagePath,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      originalFilename: input.originalFilename,
      createdAt: new Date().toISOString(),
    };

    store.sourcePhotos.unshift(photo);
    return photo;
  });
}

export async function createGeneration(input: {
  petId: string;
  sourcePhotoId: string;
  providerJobId: string;
  promptSeed: string;
  worldSpritePath?: string;
  appearanceSeed: string;
  paletteName: string;
  status?: PetGeneration["status"];
  error?: string;
}) {
  return mutateStore((store) => {
    const attempts =
      store.petGenerations.filter((generation) => generation.petId === input.petId).length + 1;

    const generation: PetGeneration = {
      id: randomUUID(),
      petId: input.petId,
      sourcePhotoId: input.sourcePhotoId,
      providerJobId: input.providerJobId,
      status: input.status ?? "queued",
      promptSeed: input.promptSeed,
      worldSpritePath: input.worldSpritePath,
      appearanceSeed: input.appearanceSeed,
      paletteName: input.paletteName,
      error: input.error,
      attempts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.petGenerations.unshift(generation);

    if (generation.status === "succeeded") {
      const pet = store.pets.find((item) => item.id === input.petId);
      if (pet) {
        pet.activeGenerationId = generation.id;
      }
    }

    return generation;
  });
}

export async function updateGenerationByProviderJob(input: {
  providerJobId: string;
  status: PetGeneration["status"];
  worldSpritePath?: string;
  error?: string;
}) {
  return mutateStore((store) => {
    const generation = store.petGenerations.find(
      (item) => item.providerJobId === input.providerJobId,
    );

    if (!generation) {
      throw new Error("generation-not-found");
    }

    generation.status = input.status;
    generation.worldSpritePath = input.worldSpritePath ?? generation.worldSpritePath;
    generation.error = input.error;
    generation.updatedAt = new Date().toISOString();

    if (input.status === "succeeded") {
      const pet = store.pets.find((item) => item.id === generation.petId);
      if (pet) {
        pet.activeGenerationId = generation.id;
      }
    }

    return generation;
  });
}

export async function getLatestSourcePhotoForPet(petId: string) {
  return queryStore((store) =>
    store.sourcePhotos
      .filter((photo) => photo.petId === petId)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      )[0] ?? null,
  );
}

export async function getSourcePhotoById(sourcePhotoId: string) {
  return queryStore((store) =>
    store.sourcePhotos.find((photo) => photo.id === sourcePhotoId) ?? null,
  );
}

export async function getPetById(petId: string) {
  return queryStore((store) => store.pets.find((pet) => pet.id === petId) ?? null);
}

export async function countGenerationsForPet(petId: string) {
  return queryStore(
    (store) => store.petGenerations.filter((generation) => generation.petId === petId).length,
  );
}

export async function getPetDetails(petId: string) {
  return readWorldView((store) => {
    const pet = store.pets.find((item) => item.id === petId);

    if (!pet) {
      return null;
    }

    const owner = store.profiles.find((profile) => profile.id === pet.ownerId);

    if (!owner) {
      return null;
    }

    const generation = store.petGenerations.find(
      (item) => item.id === pet.activeGenerationId && item.status === "succeeded",
    );
    const state = store.petStates.find((item) => item.petId === pet.id);
    const zone = state && store.gardenZones.find((entry) => entry.id === state.zoneId);
    const recentEvents = store.petEvents
      .filter((event) => event.petId === pet.id && !event.hidden)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      )
      .slice(0, 8);

    return {
      pet,
      owner,
      generation,
      state,
      zone,
      personality: getPetPersonality(pet),
      autonomyProfile: store.petAutonomyProfiles.find((entry) => entry.petId === pet.id),
      memoryDigest: store.petMemoryDigests.find((entry) => entry.petId === pet.id),
      semanticMemoryDigest: store.petSemanticMemoryDigests.find((entry) => entry.petId === pet.id),
      episodicMemoryIndex: buildPetEpisodicMemoryIndex(store, pet),
      bonds: buildPetBonds(store, pet.id),
      memories: listPetMemories(store, pet.id, 5),
      currentGoals: listPetGoals(store, pet.id),
      relationshipModels: listPairRelationshipModels(store, pet.id),
      ledgerFacts: listGardenFactsForPet(store, pet.id, 8),
      conversationSummary: store.conversationSummaries.find(
        (entry) => entry.petId === pet.id && entry.userId === pet.ownerId,
      ),
      recentEvents,
    } satisfies PetDetailsView;
  }, { llmMode: "off" });
}

export async function listPetJournal(petId: string) {
  return readWorldView(
    (store) => store.petEvents
      .filter((event) => event.petId === petId && !event.hidden)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    { llmMode: "off" },
  );
}

export async function getPetMemoryView(input: { petId: string; userId?: string }) {
  return readWorldView((store) => {
    const pet = store.pets.find((entry) => entry.id === input.petId);
    if (!pet) {
      return null;
    }

    return {
      pet,
      memories: listPetMemories(store, pet.id, 12),
      memoryDigest: store.petMemoryDigests.find((entry) => entry.petId === pet.id),
      semanticMemoryDigest: store.petSemanticMemoryDigests.find((entry) => entry.petId === pet.id),
      episodicMemoryIndex: buildPetEpisodicMemoryIndex(store, pet),
      currentGoals: listPetGoals(store, pet.id),
      relationshipModels: listPairRelationshipModels(store, pet.id, 8),
      ledgerFacts: listGardenFactsForPet(store, pet.id, 12),
      ledgerEvents: listGardenLedgerEvents(store, { participantId: pet.id, limit: 12 }),
      conversationSummary: input.userId
        ? store.conversationSummaries.find(
            (entry) => entry.petId === pet.id && entry.userId === input.userId,
          )
        : undefined,
      traces: store.petChatTraces
        .filter((entry) => entry.petId === pet.id)
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 10),
    };
  }, { llmMode: "off" });
}

export async function getGardenLedger(input?: { zoneId?: GardenZoneId; participantId?: string }) {
  return readWorldView((store) => ({
      events: listGardenLedgerEvents(store, {
        zoneId: input?.zoneId,
        participantId: input?.participantId,
        limit: 24,
      }),
      facts: store.gardenSemanticFacts
        .filter((fact) => !input?.participantId || fact.subjectId === input.participantId || fact.objectId === input.participantId)
        .sort((left, right) => right.weight - left.weight)
        .slice(0, 24),
    }), { llmMode: "off" });
}

export async function refreshPetProfile(input: { petId: string }) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    const pet = store.pets.find((entry) => entry.id === input.petId);
    const state = store.petStates.find((entry) => entry.petId === input.petId);
    if (!pet || !state) {
      return null;
    }

    syncPetAutonomyState(store, pet, new Date().toISOString());
    const fallback = store.petAutonomyProfiles.find((entry) => entry.petId === pet.id);
    if (!fallback) {
      return null;
    }

    const authored = await authorPetAutonomyProfile({
      store,
      pet,
      state,
      fallback,
      refreshReason: "manual-refresh",
      mode: "blocking",
    });
    const index = store.petAutonomyProfiles.findIndex((entry) => entry.petId === pet.id);
    if (index >= 0) {
      store.petAutonomyProfiles[index] = authored;
    } else {
      store.petAutonomyProfiles.push(authored);
    }
    return authored;
  });
}

export async function getMyPetStatuses(viewerId: string) {
  return readWorldView(
    (store) => store.pets
      .filter((pet) => pet.ownerId === viewerId)
      .map((pet) => buildDashboardPetCard(store, pet)),
    { llmMode: "off" },
  );
}

export async function applyOwnerAction(input: {
  viewerId: string;
  petId: string;
  action: OwnerAction;
  encounterThreadId?: string;
}) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "cache-first" });

    const owner = store.profiles.find((profile) => profile.id === input.viewerId);
    const pet = store.pets.find((entry) => entry.id === input.petId);

    if (!owner || !pet) {
      throw new Error("not-found");
    }

    const result = applyOwnerActionToStore(store, {
      owner,
      pet,
      action: input.action,
    });

    if (input.encounterThreadId) {
      recordEncounterIntervention(store, {
        threadId: input.encounterThreadId,
        ownerId: owner.id,
        petId: pet.id,
        action: input.action,
      });
    }

    return result;
  });
}

const PRESENCE_STALE_MS = 1000 * 60 * 10;

export async function recordGardenPresence(input: {
  viewerId: string;
  zoneId: GardenZoneId;
  tileX: number;
  tileY: number;
}) {
  return mutateStore(async (store) => {
    const viewer = store.profiles.find((profile) => profile.id === input.viewerId);

    if (!viewer) {
      throw new Error("not-found");
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const dayKey = utcDayKey(now);

    if (!Array.isArray(store.gardenPresences)) {
      store.gardenPresences = [];
    }

    // Drop stale visitors so the list stays small.
    store.gardenPresences = store.gardenPresences.filter(
      (entry) =>
        entry.profileId === viewer.id ||
        now.getTime() - new Date(entry.updatedAt).getTime() < PRESENCE_STALE_MS,
    );

    let presence = store.gardenPresences.find((entry) => entry.profileId === viewer.id);

    if (!presence) {
      presence = {
        profileId: viewer.id,
        zoneId: input.zoneId,
        tileX: clampTileX(input.tileX),
        tileY: clampTileY(input.tileY),
        updatedAt: nowIso,
      };
      store.gardenPresences.push(presence);
    } else {
      presence.zoneId = input.zoneId;
      presence.tileX = clampTileX(input.tileX);
      presence.tileY = clampTileY(input.tileY);
      presence.updatedAt = nowIso;
    }

    let dailyReunion = false;

    // First visit of the day: every pet that waited gets a reunion bonus.
    if (presence.lastDailyGiftDay !== dayKey) {
      presence.lastDailyGiftDay = dayKey;
      dailyReunion = true;

      const ownedPets = store.pets.filter((pet) => pet.ownerId === viewer.id && !pet.isFrozen);
      let mostBondedPet: Pet | undefined;
      let highestBond = -1;

      for (const pet of ownedPets) {
        const state = store.petStates.find((entry) => entry.petId === pet.id);

        if (!state) {
          continue;
        }

        const vitals = ensureGrowthState(state);
        applyGrowthAward(state, { xp: DAILY_REUNION_XP, bond: DAILY_REUNION_BOND });

        if (vitals.bond > highestBond) {
          highestBond = vitals.bond;
          mostBondedPet = pet;
        }

        if (state.zoneId === input.zoneId) {
          state.currentBubble = {
            text: pet.species === "cat" ? "……你总算来了。" : "今天也等到你啦!",
            kind: "speech",
            expiresAt: new Date(now.getTime() + 8000).toISOString(),
          };
        }
      }

      if (mostBondedPet) {
        store.notifications.unshift({
          id: randomUUID(),
          userId: viewer.id,
          kind: "system",
          petId: mostBondedPet.id,
          body: `${mostBondedPet.name} 今天一直在花园里等你，刚才第一个发现你回来了。`,
          createdAt: nowIso,
        });
      }
    }

    await advanceStoreToNow(store, now, { llmMode: "off" });

    return {
      presence: { ...presence },
      dailyReunion,
    };
  });
}

export async function applyEncounterWorldAction(input: {
  viewerId: string;
  threadId: string;
  action: GardenEncounterWorldAction;
}) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    return applyEncounterWorldActionToStore(store, input);
  });
}

export async function commandPetByOwner(input: {
  viewerId: string;
  petId: string;
  command: OwnerPetCommand;
}) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "cache-first" });

    const owner = store.profiles.find((profile) => profile.id === input.viewerId);
    const pet = store.pets.find((entry) => entry.id === input.petId);

    if (!owner || !pet) {
      throw new Error("not-found");
    }

    return applyOwnerPetCommandToStore(store, {
      owner,
      pet,
      command: input.command,
    });
  });
}

export async function createReport(input: {
  viewerId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}) {
  return mutateStore((store) => {
    const report = {
      id: randomUUID(),
      reporterUserId: input.viewerId,
      targetType: input.targetType,
      targetId: input.targetId,
      reason: input.reason.trim(),
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };

    store.reports.unshift(report);
    return report;
  });
}

export async function listReports() {
  return queryStore((store) =>
    store.reports
      .map((report) => {
        const reporter = store.profiles.find((profile) => profile.id === report.reporterUserId);
        return { report, reporter };
      })
      .sort(
        (left, right) =>
          new Date(right.report.createdAt).getTime() -
          new Date(left.report.createdAt).getTime(),
      ),
  );
}

export async function resolveReport(input: {
  reportId: string;
  action: "dismiss" | "hide_pet" | "hide_event" | "freeze_pet";
  status?: ReportStatus;
}) {
  return mutateStore((store) => {
    const report = store.reports.find((item) => item.id === input.reportId);

    if (!report) {
      throw new Error("report-not-found");
    }

    if (input.action === "hide_pet") {
      const pet = store.pets.find((item) => item.id === report.targetId);
      if (pet) {
        pet.visibility = "private";
      }
    }

    if (input.action === "hide_event") {
      const event = store.petEvents.find((item) => item.id === report.targetId);
      if (event) {
        event.hidden = true;
      }
    }

    if (input.action === "freeze_pet") {
      const pet = store.pets.find((item) => item.id === report.targetId);
      if (pet) {
        pet.isFrozen = true;
      }
    }

    report.status = input.status ?? (input.action === "dismiss" ? "dismissed" : "resolved");
    report.resolutionAction = input.action;
    report.resolvedAt = new Date().toISOString();

    return report;
  });
}

export async function listNarrativeEvents(
  zoneId: GardenZoneId,
  limit = 16,
  viewerId?: string,
) {
  return readWorldView(
    (store) => buildGardenSnapshot(store, zoneId, viewerId).recentEvents.slice(0, limit),
    { llmMode: "cache-first" },
  );
}

export async function getChatSessionForUser(input: { petId: string; userId: string }) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    return (
      store.chatSessions
        .filter((session) => session.petId === input.petId && session.userId === input.userId)
        .sort(
          (left, right) =>
            new Date(right.lastMessageAt).getTime() - new Date(left.lastMessageAt).getTime(),
        )[0] ?? null
    );
  });
}

export async function upsertChatSession(input: {
  petId: string;
  userId: string;
  messages: ChatMessage[];
}) {
  return mutateStore((store) => {
    const existing = store.chatSessions.find(
      (session) => session.petId === input.petId && session.userId === input.userId,
    );

    if (existing) {
      existing.messages = input.messages;
      existing.lastMessageAt = input.messages[input.messages.length - 1]?.createdAt ?? existing.lastMessageAt;
      return existing;
    }

    const session: ChatSession = {
      id: randomUUID(),
      petId: input.petId,
      userId: input.userId,
      messages: input.messages,
      startedAt: input.messages[0]?.createdAt ?? new Date().toISOString(),
      lastMessageAt: input.messages[input.messages.length - 1]?.createdAt ?? new Date().toISOString(),
    };

    store.chatSessions.unshift(session);
    return session;
  });
}

export async function narrateExistingEvent(input: {
  eventId: string;
  viewerId?: string;
}) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    const event = store.petEvents.find((entry) => entry.id === input.eventId && !entry.hidden);

    if (!event) {
      return null;
    }

    const pet = store.pets.find((entry) => entry.id === event.petId);
    const state = store.petStates.find((entry) => entry.petId === event.petId);
    const owner = pet && store.profiles.find((entry) => entry.id === pet.ownerId);

    if (!pet || !state || !owner) {
      return null;
    }

    const body = await narrateEvent(event, pet, {
      ...buildPersonaContextFromStore(store, pet, state, createWorldState(), owner),
      fallbackBody: event.body,
      relatedPet: event.relatedPetId
        ? store.pets.find((entry) => entry.id === event.relatedPetId)
        : undefined,
    });

    const previousBody = event.body;
    event.body = body;
    event.narrationSource = body === previousBody ? event.narrationSource ?? "template" : "llm";
    void input.viewerId;
    return event;
  });
}

function tokenizeForRetrieval(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 1);
}

function sanitizeConversationMemoryText(text: string) {
  return sanitizePetUtterance(text, {
    maxChars: 180,
    fallback: "",
  });
}

function buildPromptDigest(input: { petId: string; userId: string; message: string; summary?: string }) {
  return `${input.petId}:${input.userId}:${input.message.slice(0, 64)}:${input.summary?.slice(0, 96) ?? "-"}`;
}

function selectRelevantMemories(store: AppStore, petId: string, message: string, limit = 5) {
  const keywords = tokenizeForRetrieval(message);
  return store.petMemories
    .filter((memory) => memory.petId === petId)
    .sort((left, right) => {
      const leftScore =
        left.weight +
        keywords.reduce((score, token) => score + (left.body.toLowerCase().includes(token) ? 10 : 0), 0);
      const rightScore =
        right.weight +
        keywords.reduce((score, token) => score + (right.body.toLowerCase().includes(token) ? 10 : 0), 0);

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })
    .slice(0, limit);
}

function deriveConversationHighlights(messages: ChatMessage[]) {
  const highlights = messages
    .slice(-10)
    .map((message) => sanitizeConversationMemoryText(message.content))
    .filter(Boolean);

  return [...new Set(highlights)].slice(-4);
}

function summarizeConversation(messages: ChatMessage[], petName: string) {
  const highlights = deriveConversationHighlights(messages);
  if (highlights.length === 0) {
    return `${petName} 和眼前这个人还没聊出足够稳定的轨迹。`;
  }

  return `${petName} 这段对话最近围绕这些事打转：${highlights.join("；")}`;
}

function upsertConversationSummary(
  store: AppStore,
  input: {
    petId: string;
    userId: string;
    messages: ChatMessage[];
    source?: ConversationSummary["source"];
  },
) {
  const existing = store.conversationSummaries.find(
    (entry) => entry.petId === input.petId && entry.userId === input.userId,
  );
  const pet = store.pets.find((entry) => entry.id === input.petId);
  const summaryText = summarizeConversation(input.messages, pet?.name ?? "这只宠物");
  const highlights = deriveConversationHighlights(input.messages);

  if (existing) {
    existing.summary = summaryText;
    existing.highlights = highlights;
    existing.turnCount = input.messages.length;
    existing.source = input.source ?? existing.source;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const summary: ConversationSummary = {
    id: randomUUID(),
    petId: input.petId,
    userId: input.userId,
    summary: summaryText,
    highlights,
    source: input.source ?? "derived",
    turnCount: input.messages.length,
    updatedAt: new Date().toISOString(),
  };

  store.conversationSummaries.unshift(summary);
  return summary;
}

function buildInteractiveConversation(messages: ChatMessage[]) {
  return messages
    .slice(-4)
    .map((message) => ({
      role: message.participantType === "user" ? ("user" as const) : ("assistant" as const),
      content: sanitizeConversationMemoryText(message.content).slice(0, 120),
    }))
    .filter((message) => message.content);
}

function looksCompleteUtterance(message: string) {
  const trimmed = message.trim();
  if (!trimmed) {
    return false;
  }

  return /[。！？…~”」』)]$/.test(trimmed);
}

function extractLeadUtterance(message: string) {
  const normalized = message.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  const segments = normalized.match(/[^。！？…]+[。！？…]?/g) ?? [];
  const picked: string[] = [];

  for (const segment of segments) {
    const cleaned = segment.trim();
    if (!cleaned) {
      continue;
    }

    picked.push(cleaned);
    const candidate = picked.join("");
    if (looksCompleteUtterance(candidate)) {
      return candidate;
    }

    if (candidate.length >= 42) {
      return `${candidate.replace(/[，、；：,;:]+$/g, "").trim()}。`;
    }
  }

  return "";
}

async function repairPetReply(input: {
  systemPrompt: string;
  partialReply: string;
  fallback: string;
  userMessage?: string;
}) {
  const repairPrompt = looksLikeMetaReasoning(input.partialReply)
    ? `
你刚刚输出了分析文本，不是宠物台词。现在重来一次，只给最终台词。
规则：
- 保持宠物语气和第一人称
- 只输出 1 到 2 句自然中文
- 总长度尽量控制在 40 个汉字以内
- 必须以中文句号、问号或感叹号结尾
- 禁止输出分析、步骤、标题、markdown、英文说明
用户刚说：${input.userMessage ?? "请直接回应眼前的人。"}
错误草稿：${input.partialReply}
    `.trim()
    : `
把下面这句被截断的宠物回复补成完整、自然、口语化的中文短回复。
规则：
- 保持原来的宠物语气
- 保持第一人称
- 只输出 1 到 2 句完整中文
- 总长度尽量控制在 40 个汉字以内
- 必须以中文句号、问号或感叹号结尾
- 禁止输出分析、步骤、英文标题、markdown、括号说明
- 不要复述规则
被截断的回复：${input.partialReply}
    `.trim();

  const repaired = await getLLMProvider().chat({
    systemPrompt: input.systemPrompt,
    messages: [{ role: "user", content: repairPrompt }],
    model: env.llmModelChat,
    maxTokens: 96,
    temperature: 0.3,
    timeoutMs: 24000,
  });

  const sanitized = sanitizePetUtterance(repaired.content, {
    maxChars: 160,
    fallback: input.fallback,
  });

  if (sanitized === input.fallback) {
    const partial = sanitizePetUtterance(
      /[。！？…~”」』)]$/.test(input.partialReply.trim())
        ? input.partialReply
        : `${input.partialReply.trim()}。`,
      {
        maxChars: 160,
        fallback: input.fallback,
      },
    );
    return partial;
  }

  return sanitized;
}

type FallbackChatDirective = {
  reply: string;
  action: OwnerAction | null;
  goalHint?: PetGoalType;
  targetZoneId?: GardenZoneId;
  command?: OwnerPetCommand;
  stateChanges: Partial<{ social: number; stress: number; hunger: number; energy: number }>;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

  if (!preferredPetId) {
    return null;
  }

  return candidates.find((pet) => pet.id === preferredPetId) ?? null;
}

function buildOwnerMovementFallback(input: {
  store: AppStore;
  pet: Pet;
  state: PetState;
  message: string;
  context: PersonaContext;
  isOwner: boolean;
}): FallbackChatDirective | null {
  if (!input.isOwner) {
    return null;
  }

  const trees = input.store.worldObjects.filter(
    (object) => object.zoneId === input.state.zoneId && object.type === "tree" && !object.removedAt,
  );
  const preferredCompanionId = input.context.gardenAcquaintances[0]?.petId;
  const targetPet = findMentionedPetTarget(input.store, input.pet.id, input.message, preferredCompanionId);

  if (/(上树|去树上|到树上|爬树|去那棵树|到那棵树)/i.test(input.message) && trees[0]) {
    return {
      reply:
        input.pet.species === "cat"
          ? "行，我去树上待一会儿。"
          : "我可以先去树边闻闻，再决定要不要继续守在那里。",
      action: null,
      command: {
        type: "move_to_object",
        objectId: trees[0].id,
      },
      stateChanges: { social: 3, stress: -1, energy: -2 },
    };
  }

  const petCommandDirective = parseOwnerChatWorldCommand({
    store: input.store,
    currentPetId: input.pet.id,
    message: input.message,
    isOwner: input.isOwner,
    preferredPetId: preferredCompanionId,
  });

  if (petCommandDirective) {
    return petCommandDirective;
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

  return null;
}

function fallbackChatReply(input: {
  pet: Pet;
  mood: PetMood;
  activity?: string;
  message: string;
  isOwner: boolean;
  zoneName?: string;
  bestFriendName?: string;
  rivalName?: string;
  familiarPetName?: string;
  likedPetName?: string;
  dislikedPetName?: string;
}): FallbackChatDirective {
  if (/你叫啥|你叫什么|名字|name/i.test(input.message)) {
    return {
      reply:
        input.pet.species === "dog"
          ? `我叫 ${input.pet.name}，你一喊我就会回头。`
          : `${input.pet.name}。记住了，下次别装不认识我。`,
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/心情好吗|开心吗|状态怎么样|现在心情|今天心情怎么样|最近心情|今天怎么样/i.test(input.message)) {
    return {
      reply:
        input.mood === "lonely"
          ? "不算太好，这会儿有点想让熟面孔待在附近。"
          : input.mood === "playful"
            ? "还不错，正适合闹一会儿。"
            : input.mood === "grumpy"
              ? "一般，谁要是现在来烦我就不太妙。"
              : `还行，至少现在这股风不算讨厌。`,
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/去.*区域|去别的地方|去其他区域|换个区域|去池边|去果树|去灌木|去狗跑|去pond|去grove|去orchard|去dog-run|去别处玩/i.test(input.message)) {
    const targetZoneId = /池|pond/i.test(input.message)
      ? "pond"
      : /灌木|grove/i.test(input.message)
        ? "grove"
        : /狗跑|dog-run/i.test(input.message)
          ? "dog-run"
          : /果树|orchard/i.test(input.message)
            ? "orchard"
            : undefined;

    return {
      reply:
        targetZoneId && targetZoneId !== input.zoneName
          ? `可以，我也想去 ${targetZoneId} 那边换换气味，不过得按我的节奏走。`
          : "可以逛，但别把我当成会被你拖着走的巡游摆件。",
      action: input.isOwner ? "call" : null,
      goalHint: "move_to_zone",
      targetZoneId,
      stateChanges: { social: 4, stress: -1, energy: -2 },
    };
  }

  if (/在哪|在那里|在哪儿|位置|躲哪/i.test(input.message)) {
    return {
      reply: input.zoneName
        ? `${input.zoneName}。${input.activity ? `我刚刚还在${describeActivityForChat(input.activity)}。` : "这地方暂时还归我。"}`
        : "就在花园里，只是没必要让所有人都立刻找到我。",
      action: null,
      stateChanges: { social: 1, stress: -1 },
    };
  }

  if (/喜欢.*谁|和谁最好|好兄弟|最喜欢.*宠物/.test(input.message) && (input.bestFriendName || input.likedPetName)) {
    const targetName = input.bestFriendName ?? input.likedPetName;
    return {
      reply: `${targetName} 吧。至少它待在附近的时候，空气不会那么吵。`,
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/喜欢.*谁|和谁最好|好兄弟|最喜欢.*宠物/.test(input.message) && input.familiarPetName) {
    return {
      reply: `${input.familiarPetName} 还行。至少它的动静不至于让我想立刻换个方向。`,
      action: null,
      stateChanges: { social: 1, stress: -1 },
    };
  }

  if (/讨厌.*谁|烦谁|不喜欢.*宠物/.test(input.message) && (input.rivalName || input.dislikedPetName)) {
    const targetName = input.rivalName ?? input.dislikedPetName;
    return {
      reply: `${targetName}。它一靠近，我的毛就不太想顺着长。`,
      action: null,
      stateChanges: { social: 1, stress: 1 },
    };
  }

  if (/讨厌.*谁|烦谁|不喜欢.*宠物/.test(input.message)) {
    return {
      reply: "暂时还没有谁烦到让我非得把名字咬在嘴里。",
      action: null,
      stateChanges: { social: 1, stress: 0 },
    };
  }

  if (/为什么.*不开心|为什么不高兴|谁惹你|谁让你烦/i.test(input.message)) {
    return {
      reply:
        input.rivalName
          ? `${input.rivalName} 这阵子总在我边界附近晃，我还没决定要不要彻底记它一笔。`
          : input.mood === "grumpy"
            ? "今天花园里的动静有点碎，让我很难把尾巴彻底放松。"
            : "也不算真的糟，只是我还没找到最顺心的那一块节奏。",
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/喜欢什么|偏爱什么|最爱什么/.test(input.message)) {
    return {
      reply:
        input.pet.species === "cat"
          ? "高一点、暖一点、又能让我先看见别人的地方，我通常不会拒绝。"
          : "能跑、有气味、最好还能让我顺手把乐子扩大一圈的东西。",
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/不喜欢什么|讨厌什么|怕什么/.test(input.message)) {
    return {
      reply:
        input.pet.species === "cat"
          ? "太吵、太近、太快，这三件事凑一起的时候我会想立刻换地方。"
          : "完全没回应、又没新鲜气味的时候，我会觉得这片草地突然无聊透了。",
      action: null,
      stateChanges: { social: 1, stress: 1 },
    };
  }

  if (/风|天气|云|太阳|下雨/.test(input.message)) {
    return {
      reply: input.zoneName
        ? `${input.zoneName} 的风还行，至少没把我喜欢的味道吹散。`
        : "风还行，只要别把乱七八糟的动静一起卷过来。",
      action: null,
      stateChanges: { social: 1, stress: -1 },
    };
  }

  if (/玩具|球|扔玩具|ball/i.test(input.message)) {
    return {
      reply:
        input.pet.species === "dog"
          ? "你扔远一点，我会把整片草地都跑热。"
          : "可以，但别把玩具丢到我刚挑好的角落里。",
      action: "throw_toy" as OwnerAction,
      stateChanges: { social: 5, stress: -2, energy: -3 },
    };
  }

  if (/过来|过来呀|come/i.test(input.message)) {
    return {
      reply: input.pet.species === "dog" ? "来了来了，我听见你在叫我。" : "我可以过去，但你先别大惊小怪。",
      action: "call" as OwnerAction,
      stateChanges: { social: 6, stress: -2 },
    };
  }

  if (/好乖|真棒|爱你|抱抱|摸摸/.test(input.message)) {
    return {
      reply: input.pet.species === "dog" ? "再夸两句，我尾巴就要飞起来了。" : "哼，算你会说话。",
      action: "pet" as OwnerAction,
      stateChanges: { social: 8, stress: -4 },
    };
  }

  if (/🍖|🦴|吃|零食|罐头/.test(input.message)) {
    return {
      reply: input.pet.species === "dog" ? "你是不是偷偷带吃的来了？" : "我可以先闻一下再决定要不要吃。",
      action: "feed" as OwnerAction,
      stateChanges: { hunger: -10, stress: -1 },
    };
  }

  if (/在想什么|想啥|心里想/.test(input.message)) {
    return {
      reply:
        input.pet.species === "dog"
          ? input.mood === "playful"
            ? "我在想要不要再冲一圈，顺便把你的鞋味也记住。"
            : "我在想等会儿要不要去你那边蹭一圈。"
          : input.mood === "playful"
            ? "我在想那颗球如果滚进树影里，会不会更像是我赢了。"
            : "我在想今天的风声里是不是混着一点罐头味。",
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/干啥|干嘛|做什么|忙什么/.test(input.message)) {
    return {
      reply:
        input.activity === "sleep"
          ? input.pet.species === "dog"
            ? "我本来在补觉，你一叫我耳朵就先醒了。"
            : "我刚把自己团好，你最好给我一个值得起身的理由。"
          : input.activity === "play" || input.activity === "chase"
            ? input.pet.species === "dog"
              ? "我在热身，随时都能把这块草地跑出火星子。"
              : "我在巡逻，顺便决定谁配和我一起闹。"
            : input.pet.species === "dog"
              ? "我在闻风里的消息，看看今天有没有新乐子。"
              : "我在四处看看，确认这片地方还算顺眼。",
      action: null,
      stateChanges: { social: 2, stress: -1 },
    };
  }

  if (/聊聊|陪你|别啊|理理我|和我说话/.test(input.message)) {
    return {
      reply:
        input.isOwner
          ? "可以聊，但你别急着把每一句都当成要我立刻站好的命令。"
          : "你可以继续说，不过我要先判断你值不值得我把耳朵彻底转过来。",
      action: null,
      stateChanges: { social: input.isOwner ? 4 : 1, stress: -1 },
    };
  }

  return {
    reply:
      input.pet.species === "dog"
        ? input.isOwner
          ? "我在这儿，刚刚还在想你会不会来。"
          : "你看起来不像坏人，但我还是先闻闻。"
        : input.isOwner
          ? "我听见了，只是决定晚一点再回答你。"
          : "你可以说话，但别离我太近。",
    action: null,
    stateChanges: {
      social: input.isOwner ? 3 : 1,
      stress: input.isOwner ? -2 : 1,
    },
  };
}

function describeActivityForChat(activity?: string) {
  switch (activity) {
    case "seek_owner":
      return "找人";
    case "watch_fish":
      return "盯鱼";
    case "climb_tree":
      return "蹲在树上";
    case "look_around":
      return "东张西望";
    case "wander":
      return "慢慢溜达";
    case "play":
      return "玩闹";
    case "chase":
      return "追逐";
    case "sleep":
      return "补觉";
    case "sunbathe":
      return "晒太阳";
    case "groom":
      return "舔毛";
    default:
      return activity;
  }
}

type PreparedInteractiveChat = {
  pet: Pet;
  user: Profile;
  owner: Profile;
  state: AppStore["petStates"][number];
  session: ChatSession;
  sessionIsNew: boolean;
  userMessage: ChatMessage;
  context: ReturnType<typeof buildPersonaContextFromStore>;
  conversationMessages: Array<{ role: "user" | "assistant"; content: string }>;
  fallback: ReturnType<typeof fallbackChatReply>;
  systemPrompt: string;
  baseStateChanges: {
    social: number;
    stress: number;
    hunger: number;
    energy: number;
  };
  promptDigest: string;
};

type InteractiveChatStreamHooks = {
  onToken?: (token: string) => void | Promise<void>;
  onRepairing?: () => void | Promise<void>;
  onFallback?: (reason?: string) => void | Promise<void>;
};

async function prepareInteractiveChat(store: AppStore, input: {
  petId: string;
  userId: string;
  message: string;
}) {
  const pet = store.pets.find((entry) => entry.id === input.petId);
  const user = store.profiles.find((entry) => entry.id === input.userId);
  const state = store.petStates.find((entry) => entry.petId === input.petId);
  const owner = pet ? store.profiles.find((entry) => entry.id === pet.ownerId) : null;

  if (!pet || !user || !state || !owner) {
    throw new Error("chat-target-not-found");
  }

  ensurePetGoals(store, pet, state, new Date().toISOString());
  syncPetAutonomyState(store, pet, new Date().toISOString());

  const session =
    store.chatSessions.find((entry) => entry.petId === input.petId && entry.userId === input.userId) ??
    ({
      id: randomUUID(),
      petId: input.petId,
      userId: input.userId,
      messages: [],
      startedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    } satisfies ChatSession);
  const sessionIsNew = !store.chatSessions.some((entry) => entry.id === session.id);

  const userMessage: ChatMessage = {
    id: randomUUID(),
    petId: pet.id,
    participantType: "user",
    participantId: user.id,
    content: normalizePetChatMessage(input.message),
    createdAt: new Date().toISOString(),
  };

  const draftMessages = [...session.messages.slice(-19), userMessage];
  const existingConversationSummary = store.conversationSummaries.find(
    (entry) => entry.petId === pet.id && entry.userId === user.id,
  );
  const conversationSummary =
    existingConversationSummary
      ? {
          ...existingConversationSummary,
          summary: summarizeConversation(draftMessages, pet.name),
          highlights: deriveConversationHighlights(draftMessages),
          turnCount: draftMessages.length,
          updatedAt: new Date().toISOString(),
        }
      : ({
          id: randomUUID(),
          petId: pet.id,
          userId: user.id,
          summary: summarizeConversation(draftMessages, pet.name),
          highlights: deriveConversationHighlights(draftMessages),
          source: "derived",
          turnCount: draftMessages.length,
          updatedAt: new Date().toISOString(),
        } satisfies ConversationSummary);
  const baseContext = buildPersonaContextFromStore(
    store,
    pet,
    state,
    createWorldState(),
    user.id === pet.ownerId ? owner : undefined,
  );
  const context = {
    ...baseContext,
    memories: (() => {
      const memories = selectRelevantMemories(store, pet.id, userMessage.content, 4);
      return memories.length > 0 ? memories : baseContext.memories;
    })(),
    ledgerFacts: (() => {
      const facts = listRelevantGardenFacts(store, pet.id, userMessage.content, 4);
      return facts.length > 0 ? facts : baseContext.ledgerFacts;
    })(),
    semanticMemoryDigest:
      store.petSemanticMemoryDigests.find((entry) => entry.petId === pet.id) ??
      buildSemanticMemoryDigest(store, pet),
    conversationSummary,
    currentGoals: listPetGoals(store, pet.id).slice(0, 2),
  };
  const fallback =
    buildOwnerMovementFallback({
      store,
      pet,
      state,
      message: userMessage.content,
      context,
      isOwner: user.id === pet.ownerId,
    }) ??
    fallbackChatReply({
      pet,
      mood: state.mood,
      activity: state.activity,
      message: userMessage.content,
      isOwner: user.id === pet.ownerId,
      zoneName: context.zone.name,
      bestFriendName:
        context.bonds.find((bond) => bond.status === "friend")?.otherPetName ??
        context.ledgerFacts.find((fact) => ["likes", "bonded_with", "trusts"].includes(fact.predicate))?.objectLabel,
      rivalName:
        context.bonds.find((bond) => bond.status === "enemy")?.otherPetName ??
        context.ledgerFacts.find((fact) => ["dislikes", "avoids", "rival_of", "fears"].includes(fact.predicate))?.objectLabel,
      familiarPetName: context.gardenAcquaintances[0]?.petName,
      likedPetName: context.ledgerFacts.find((fact) => ["likes", "bonded_with", "trusts"].includes(fact.predicate))?.objectLabel,
      dislikedPetName: context.ledgerFacts.find((fact) => ["dislikes", "avoids", "rival_of", "fears"].includes(fact.predicate))?.objectLabel,
    });
  const hoursSinceLastSeen = Math.max(
    0,
    (Date.now() - new Date(session.lastMessageAt).getTime()) / (1000 * 60 * 60),
  );
  const personality = context.personality;
  const baseStateChanges = {
    social: user.id === pet.ownerId ? 3 : Math.max(1, Math.round(personality.sociability / 36)),
    stress:
      user.id === pet.ownerId
        ? personality.archetype === "velcro heart" && hoursSinceLastSeen >= 10
          ? 1
          : -2
        : personality.boldness >= 58
          ? -1
          : 2,
    hunger: 0,
    energy: 0,
  };
  const systemPrompt = buildPetChatPrompt(pet, state, context);

  return {
    pet,
    user,
    owner,
    state,
    session,
    sessionIsNew,
    userMessage,
    context,
    conversationMessages: buildInteractiveConversation(draftMessages),
    fallback,
    systemPrompt,
    baseStateChanges,
    promptDigest: buildPromptDigest({
      petId: pet.id,
      userId: user.id,
      message: userMessage.content,
      summary: conversationSummary.summary,
    }),
  } satisfies PreparedInteractiveChat;
}

async function generateInteractiveReply(
  prepared: PreparedInteractiveChat,
  hooks?: InteractiveChatStreamHooks,
): Promise<{
  reply: string;
  result: LLMChatResult;
  source: ChatReplySource;
  repaired: boolean;
  fallbackReason?: string;
}> {
  if (shouldResolveOwnerChatWorldCommandImmediately(prepared.fallback)) {
    const reply = prepared.fallback.reply;

    return {
      reply,
      result: {
        content: reply,
        finishReason: "stop",
        elapsedMs: 0,
        tokenCount: Math.max(1, Math.ceil(reply.length / 3)),
        provider: "local-command",
        truncated: false,
        source: "fallback",
      },
      source: "fallback",
      repaired: false,
      fallbackReason: "owner-world-command",
    };
  }

  try {
    const result = await executeLLMTask({
      cacheKey: `chat:${prepared.promptDigest}`,
      ttlMs: 1000 * 60 * 5,
      petId: prepared.pet.id,
      userId: prepared.user.id,
      estimatedTokens: estimateTokensFromText(
        prepared.systemPrompt,
        ...prepared.conversationMessages.map((message) => message.content),
      ),
      priority: "interactive",
      skipCache: true,
      task: async () => {
        const provider = getLLMProvider();

        if (provider.streamChat) {
          const iterator = provider.streamChat({
            systemPrompt: prepared.systemPrompt,
            messages: prepared.conversationMessages,
            model: env.llmModelChat,
            maxTokens: 160,
            temperature: 0.55,
            timeoutMs: 120000,
          });

          let streamedContent = "";
          let finalResult: LLMChatResult | null = null;

          while (true) {
            const step = await iterator.next();
            if (step.done) {
              finalResult = step.value;
              break;
            }

            const token = step.value;
            streamedContent += token;
          }

          return (
            finalResult ?? {
              content: streamedContent.trim(),
              finishReason: "unknown",
              elapsedMs: 0,
              tokenCount: Math.max(1, Math.ceil(streamedContent.length / 3.3)),
              provider: "unknown",
              truncated: false,
              source: "llm",
            }
          );
        }

        return provider.chat({
          systemPrompt: prepared.systemPrompt,
          messages: prepared.conversationMessages,
          model: env.llmModelChat,
          maxTokens: 160,
          temperature: 0.55,
          timeoutMs: 120000,
        });
      },
    });

    if (result.finishReason === "timeout" || result.timedOut || !result.content.trim()) {
      await hooks?.onFallback?.(result.timedOut ? "timeout" : "empty");
      return {
        reply: prepared.fallback.reply,
        result: {
          ...result,
          content: prepared.fallback.reply,
          source: "fallback",
        },
        source: "fallback",
        repaired: false,
        fallbackReason: result.timedOut ? "timeout" : "empty",
      };
    }

    const rawLooksMeta = looksLikeMetaReasoning(result.content);
    let reply = rawLooksMeta
      ? ""
      : sanitizePetUtterance(result.content, {
          maxChars: 160,
          fallback: prepared.fallback.reply,
        });
    let source: ChatReplySource = "llm";
    let repaired = false;

    if (rawLooksMeta || result.finishReason === "length" || result.truncated || !looksCompleteUtterance(reply)) {
      const leadUtterance = sanitizePetUtterance(extractLeadUtterance(result.content), {
        maxChars: 160,
        fallback: "",
      });

      if (!rawLooksMeta && leadUtterance && looksCompleteUtterance(leadUtterance)) {
        reply = leadUtterance;
      } else {
        try {
          await hooks?.onRepairing?.();
          reply = await repairPetReply({
            systemPrompt: prepared.systemPrompt,
            partialReply: rawLooksMeta ? result.content : reply,
            fallback: prepared.fallback.reply,
            userMessage: prepared.userMessage.content,
          });
          source = "repair";
          repaired = true;
        } catch {
          if (!looksCompleteUtterance(reply)) {
            reply = prepared.fallback.reply;
            source = "fallback";
            await hooks?.onFallback?.("repair-failed");
          }
        }
      }
    }

    return {
      reply,
      result: {
        ...result,
        content: reply,
        truncated: source === "repair" ? false : result.truncated,
        finishReason: source === "repair" ? "stop" : result.finishReason,
        source,
      },
      source,
      repaired,
    };
  } catch (error) {
    const fallbackReason =
      error instanceof Error && error.message
        ? `provider-error:${error.message}`
        : "provider-error";
    await hooks?.onFallback?.(fallbackReason);
    return {
      reply: prepared.fallback.reply,
      result: {
        content: prepared.fallback.reply,
        finishReason: "error",
        elapsedMs: 0,
        tokenCount: 0,
        provider: "fallback",
        truncated: false,
        source: "fallback",
      },
      source: "fallback",
      repaired: false,
      fallbackReason,
    };
  }
}

async function finalizeInteractiveChat(
  store: AppStore,
  prepared: PreparedInteractiveChat,
  generated: Awaited<ReturnType<typeof generateInteractiveReply>>,
) {
  if (prepared.sessionIsNew) {
    store.chatSessions.unshift(prepared.session);
  }

  prepared.session.messages.push(prepared.userMessage);

  if (prepared.user.id === prepared.pet.ownerId && prepared.fallback.action) {
    applyOwnerActionToStore(store, {
      owner: prepared.user,
      pet: prepared.pet,
      action: prepared.fallback.action,
    });
  }

  if (prepared.user.id === prepared.pet.ownerId && prepared.fallback.command) {
    applyOwnerPetCommandToStore(store, {
      owner: prepared.user,
      pet: prepared.pet,
      command: prepared.fallback.command,
    });
    prepared.state.activeGoals = listPetGoals(store, prepared.pet.id).map((goal) => goal.id);
  }

  if (prepared.user.id === prepared.pet.ownerId && prepared.fallback.goalHint) {
    upsertPetGoal(store, {
      petId: prepared.pet.id,
      goalType: prepared.fallback.goalHint,
      priority: 74,
      targetZoneId: prepared.fallback.targetZoneId,
      status: "active",
      progress: 8,
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      reason: `${prepared.user.displayName} 刚刚邀请 ${prepared.pet.name} 换个区域活动。`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    prepared.state.activeGoals = listPetGoals(store, prepared.pet.id).map((goal) => goal.id);
  }

  prepared.state.social = Math.max(
    0,
    Math.min(100, prepared.state.social + prepared.baseStateChanges.social + (prepared.fallback.stateChanges.social ?? 0)),
  );
  prepared.state.stress = Math.max(
    0,
    Math.min(100, prepared.state.stress + prepared.baseStateChanges.stress + (prepared.fallback.stateChanges.stress ?? 0)),
  );
  prepared.state.hunger = Math.max(
    0,
    Math.min(100, prepared.state.hunger + prepared.baseStateChanges.hunger + (prepared.fallback.stateChanges.hunger ?? 0)),
  );
  prepared.state.energy = Math.max(
    0,
    Math.min(100, prepared.state.energy + prepared.baseStateChanges.energy + (prepared.fallback.stateChanges.energy ?? 0)),
  );
  prepared.state.mood = deriveMood(prepared.state);

  const petMessage: ChatMessage = {
    id: randomUUID(),
    petId: prepared.pet.id,
    participantType: "pet",
    participantId: prepared.pet.id,
    content: generated.reply,
    mood: prepared.state.mood,
    createdAt: new Date().toISOString(),
    source: generated.source,
  };

  prepared.state.currentBubble = {
    text: clampBubbleText(generated.reply, prepared.fallback.reply),
    kind: "speech",
    expiresAt: new Date(Date.now() + 1000 * 6).toISOString(),
  };

  prepared.session.messages.push(petMessage);
  prepared.session.messages = prepared.session.messages.slice(-20);
  prepared.session.lastMessageAt = petMessage.createdAt;

  const summary = upsertConversationSummary(store, {
    petId: prepared.pet.id,
    userId: prepared.user.id,
    messages: prepared.session.messages,
  });
  prepared.session.summaryId = summary.id;
  prepared.state.conversationSummary = summary.summary;

  const trace = {
    id: randomUUID(),
    petId: prepared.pet.id,
    userId: prepared.user.id,
    sessionId: prepared.session.id,
    provider: generated.result.provider,
    source: generated.source,
    finishReason: generated.result.finishReason,
    elapsedMs: generated.result.elapsedMs,
    tokenCount: generated.result.tokenCount,
    truncated: generated.result.truncated,
    repaired: generated.repaired,
    fallbackReason: generated.fallbackReason,
    promptDigest: prepared.promptDigest,
    createdAt: petMessage.createdAt,
  };
  store.petChatTraces.unshift(trace);
  store.petChatTraces = store.petChatTraces.slice(0, 400);
  prepared.state.lastChatTrace = trace;

  recordGardenLedgerEvent(store, {
    type: "chat",
    participants: [prepared.pet.id],
    zoneId: prepared.state.zoneId,
    body: `${prepared.pet.name} 对 ${prepared.user.displayName} 说：${generated.reply}`,
    salience: generated.source === "fallback" ? 34 : 58,
    semanticTags: ["chat", generated.source],
    nowIso: petMessage.createdAt,
  });

  const memory = await extractMemory(prepared.session.messages, prepared.pet, prepared.context);
  if (memory) {
    rememberPet(store, {
      petId: prepared.pet.id,
      kind:
        prepared.user.id === prepared.pet.ownerId
          ? memory.kind === "stranger_chat"
            ? "owner_chat"
            : memory.kind
          : memory.kind === "owner_chat"
            ? "stranger_chat"
            : memory.kind,
      body: memory.body,
      weight: memory.weight,
      zoneId: prepared.state.zoneId,
      nowIso: new Date().toISOString(),
    });
  }

  syncPetAutonomyState(store, prepared.pet, new Date().toISOString());

  return {
    session: prepared.session,
    reply: generated.reply,
    mood: prepared.state.mood,
    suggestedAction: prepared.fallback.action,
    stateChanges: prepared.fallback.stateChanges,
    trace,
  };
}

export async function sendChatToPet(input: {
  petId: string;
  userId: string;
  message: string;
  onToken?: (token: string) => void | Promise<void>;
  onRepairing?: () => void | Promise<void>;
  onFallback?: (reason?: string) => void | Promise<void>;
}) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    const prepared = await prepareInteractiveChat(store, input);
    const generated = await generateInteractiveReply(prepared, {
      onToken: input.onToken,
      onRepairing: input.onRepairing,
      onFallback: input.onFallback,
    });
    return finalizeInteractiveChat(store, prepared, generated);
  });
}

export async function generatePetInnerVoicePreview(input: { petId: string }) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    const pet = store.pets.find((entry) => entry.id === input.petId);
    const state = store.petStates.find((entry) => entry.petId === input.petId);
    const owner = pet ? store.profiles.find((entry) => entry.id === pet.ownerId) : null;

    if (!pet || !state || !owner) {
      return null;
    }

    const context = buildPersonaContextFromStore(store, pet, state, createWorldState(), owner);
    if (!state.currentBubble || new Date(state.currentBubble.expiresAt).getTime() <= Date.now()) {
      const bubble = await generateInnerVoice(pet, state, context, "random", "blocking");
      state.currentBubble = {
        text: bubble.text,
        kind: bubble.kind,
        expiresAt: new Date(Date.now() + 1000 * 5).toISOString(),
      };
    }

    return {
      bubble: state.currentBubble,
      context,
    };
  });
}

export async function generatePetSocialChatPreview(input: {
  petId: string;
  interaction?: SocialInteraction;
  otherPetId?: string;
}) {
  return mutateStore(async (store) => {
    await advanceStoreToNow(store, new Date(), { llmMode: "off" });
    const pet = store.pets.find((entry) => entry.id === input.petId);
    const state = store.petStates.find((entry) => entry.petId === input.petId);
    const owner = pet ? store.profiles.find((entry) => entry.id === pet.ownerId) : null;

    if (!pet || !state || !owner) {
      return null;
    }

    const otherPet =
      (input.otherPetId && store.pets.find((entry) => entry.id === input.otherPetId)) ??
      store.pets.find((entry) => entry.id !== input.petId && entry.visibility === "public");
    const otherState = otherPet ? store.petStates.find((entry) => entry.petId === otherPet.id) : null;

    if (!otherPet || !otherState) {
      return null;
    }

    const petAContext = buildPersonaContextFromStore(store, pet, state, createWorldState(), owner);
    const petBOwner = store.profiles.find((entry) => entry.id === otherPet.ownerId);
    const petBContext = buildPersonaContextFromStore(
      store,
      otherPet,
      otherState,
      createWorldState(),
      petBOwner,
    );
    const socialDecision = await decideSocialIntent({
      petA: pet,
      petB: otherPet,
      interaction: input.interaction ?? "play",
      petAContext,
      petBContext,
      mode: "blocking",
    });

    return generateSocialExchange(
      pet,
      otherPet,
      socialDecision.interaction,
      {
        petAContext,
        petBContext,
      },
      socialDecision.intent,
      "blocking",
    );
  });
}
