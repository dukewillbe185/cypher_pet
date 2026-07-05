import type { AppStore, Pet, PetGoal, PetState } from "@/lib/types";

import { ensurePetGoals, listPetGoals } from "@/lib/domain/goals";

export function planPetGoals(store: AppStore, pet: Pet, state: PetState, nowIso = new Date().toISOString()) {
  const goals = ensurePetGoals(store, pet, state, nowIso);
  state.activeGoals = goals.map((goal) => goal.id);
  state.lastKnownZonePreference = goals.find((goal) => goal.targetZoneId)?.targetZoneId ?? state.lastKnownZonePreference;
  return goals;
}

export function rankActivitiesAgainstGoals(
  goals: PetGoal[],
  candidates: Array<{ activity: string; targetPetId?: string; zoneId?: string }>,
) {
  if (goals.length === 0) {
    return candidates;
  }

  return [...candidates].sort((left, right) => scoreCandidate(right, goals) - scoreCandidate(left, goals));
}

function scoreCandidate(candidate: { activity: string; targetPetId?: string; zoneId?: string }, goals: PetGoal[]) {
  let score = 0;

  for (const goal of goals) {
    if (goal.status !== "active") {
      continue;
    }

    if (goal.goalType === "seek_reassurance_from_owner" && ["seek_owner", "escort_owner"].includes(candidate.activity)) {
      score += goal.priority + 24;
    }

    if (goal.goalType === "guard_favorite_spot" && ["claim_spot", "observe_from_distance", "idle"].includes(candidate.activity)) {
      score += goal.priority + 18;
    }

    if (goal.goalType === "avoid_pet" && ["hide", "move_to_zone", "observe_from_distance", "ignore"].includes(candidate.activity)) {
      score += goal.priority + 20;
    }

    if (goal.goalType === "repair_bond" && ["reconcile", "approach_pet", "play"].includes(candidate.activity)) {
      score += goal.priority + 18;
    }

    if (goal.goalType === "explore_zone" && ["wander", "move_to_zone", "look_around"].includes(candidate.activity)) {
      score += goal.priority + 16;
    }

    if (goal.goalType === "inspect_new_toy" && ["play", "offer_toy", "approach_pet"].includes(candidate.activity)) {
      score += goal.priority + 16;
    }

    if (goal.goalType === "seek_food" && ["eat", "wander"].includes(candidate.activity)) {
      score += goal.priority + 14;
    }

    if (goal.goalType === "rest_and_reset" && ["sleep", "sunbathe", "idle"].includes(candidate.activity)) {
      score += goal.priority + 22;
    }

    if (goal.goalType === "move_to_zone" && candidate.zoneId && candidate.zoneId === goal.targetZoneId) {
      score += goal.priority + 18;
    }
  }

  return score;
}

export function getActiveGoalSnippets(store: AppStore, petId: string) {
  return listPetGoals(store, petId).slice(0, 3);
}

