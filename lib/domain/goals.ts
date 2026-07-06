import { randomUUID } from "node:crypto";

import type { AppStore, Pet, PetGoal, PetGoalType, PetState } from "@/lib/types";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function listPetGoals(store: AppStore, petId: string, status: PetGoal["status"] = "active") {
  store.petGoals ??= [];
  return store.petGoals
    .filter((goal) => goal.petId === petId && goal.status === status)
    .sort((left, right) => right.priority - left.priority || new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
}

export function upsertPetGoal(
  store: AppStore,
  input: Omit<PetGoal, "id"> & { id?: string },
) {
  store.petGoals ??= [];
  const existing = input.id
    ? store.petGoals.find((goal) => goal.id === input.id)
    : store.petGoals.find(
        (goal) =>
          goal.petId === input.petId &&
          goal.goalType === input.goalType &&
          goal.status === "active" &&
          goal.targetPetId === input.targetPetId &&
          goal.targetZoneId === input.targetZoneId &&
          goal.targetObjectId === input.targetObjectId,
      );

  if (existing) {
    existing.priority = input.priority;
    existing.progress = input.progress;
    existing.reason = input.reason;
    existing.status = input.status;
    existing.expiresAt = input.expiresAt;
    existing.updatedAt = input.updatedAt;
    return existing;
  }

  const goal: PetGoal = {
    id: input.id ?? randomUUID(),
    ...input,
  };

  store.petGoals.unshift(goal);
  return goal;
}

export function expirePetGoals(store: AppStore, petId: string, nowIso: string) {
  store.petGoals ??= [];
  const nowMs = new Date(nowIso).getTime();

  for (const goal of store.petGoals) {
    if (goal.petId !== petId || goal.status !== "active" || !goal.expiresAt) {
      continue;
    }

    if (new Date(goal.expiresAt).getTime() <= nowMs) {
      goal.status = "expired";
      goal.updatedAt = nowIso;
    }
  }
}

export function ensurePetGoals(store: AppStore, pet: Pet, state: PetState, nowIso: string) {
  expirePetGoals(store, pet.id, nowIso);
  const active = listPetGoals(store, pet.id);
  if (active.length >= 1) {
    state.activeGoals = active.map((goal) => goal.id);
    return active.slice(0, 3);
  }

  const digest = store.petSemanticMemoryDigests.find((entry) => entry.petId === pet.id);
  const favoriteZoneFact = store.gardenSemanticFacts.find(
    (fact) => fact.subjectId === pet.id && fact.predicate === "prefers_zone",
  );
  const rivalFact = store.gardenSemanticFacts.find(
    (fact) => fact.subjectId === pet.id && (fact.predicate === "avoids" || fact.predicate === "rival_of"),
  );

  const goals: Array<{ type: PetGoalType; priority: number; reason: string; targetPetId?: string; targetZoneId?: PetGoal["targetZoneId"] }> = [];

  // Settled pets that got displaced always want to head home first.
  if (pet.homeZoneId && state.zoneId !== pet.homeZoneId) {
    goals.push({
      type: "move_to_zone",
      priority: 88,
      reason: `${pet.name} 想回自己的家。`,
      targetZoneId: pet.homeZoneId,
    });
  }

  if (state.social <= 34) {
    goals.push({
      type: "seek_reassurance_from_owner",
      priority: 86,
      reason: `${pet.name} 需要从主人那里确认安全感。`,
    });
  }

  if (state.energy <= 34) {
    goals.push({
      type: "rest_and_reset",
      priority: 82,
      reason: `${pet.name} 的体力已经掉到需要先休息的程度。`,
    });
  }

  if (state.hunger >= 56) {
    goals.push({
      type: "seek_food",
      priority: 84,
      reason: `${pet.name} 饿意上来了，注意力会转向食物。`,
    });
  }

  if (favoriteZoneFact?.objectId && favoriteZoneFact.objectType === "zone") {
    goals.push({
      type: "guard_favorite_spot",
      priority: 65,
      reason: `${pet.name} 对 ${favoriteZoneFact.objectLabel} 有地盘执念。`,
      targetZoneId: favoriteZoneFact.objectId as PetGoal["targetZoneId"],
    });
  } else {
    goals.push({
      type: "explore_zone",
      priority: 58,
      reason: digest?.placeMeanings[0]
        ? `${pet.name} 想再确认一下 ${digest.placeMeanings[0]}。`
        : `${pet.name} 需要给自己找点新鲜事。`,
      targetZoneId: state.zoneId,
    });
  }

  if (rivalFact?.objectId) {
    goals.push({
      type: "avoid_pet",
      priority: 77,
      reason: `${pet.name} 最近还记得 ${rivalFact.objectLabel} 带来的压迫感。`,
      targetPetId: rivalFact.objectId,
    });
  }

  const created = goals
    .slice(0, 3)
    .map((goal, index) =>
      upsertPetGoal(store, {
        petId: pet.id,
        goalType: goal.type,
        priority: clamp(goal.priority - index * 4),
        targetPetId: goal.targetPetId,
        targetZoneId: goal.targetZoneId,
        status: "active",
        progress: 0,
        expiresAt: hoursFromNow(goal.type === "explore_zone" ? 8 : 5),
        reason: goal.reason,
        createdAt: nowIso,
        updatedAt: nowIso,
      }),
    );

  state.activeGoals = created.map((goal) => goal.id);
  return created;
}

export function advanceGoalProgress(
  store: AppStore,
  petId: string,
  input: { matchedGoalTypes?: PetGoalType[]; progressDelta?: number; nowIso: string },
) {
  store.petGoals ??= [];
  const matched = new Set(input.matchedGoalTypes ?? []);

  for (const goal of store.petGoals) {
    if (goal.petId !== petId || goal.status !== "active") {
      continue;
    }

    if (!matched.has(goal.goalType)) {
      continue;
    }

    goal.progress = clamp(goal.progress + (input.progressDelta ?? 12));
    goal.updatedAt = input.nowIso;

    if (goal.progress >= 100) {
      goal.status = "completed";
    }
  }
}
