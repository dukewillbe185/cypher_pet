import type { GardenPetSnapshot, PetActivity, PetDrive, PetMood } from "@/lib/types";

export type ActivityTone = "social" | "conflict" | "rest" | "care" | "explore" | "neutral";

export type IntentSummary = {
  activity: string;
  goal: string;
  reason: string;
  source: "fallback" | "llm" | "state";
  tone: ActivityTone;
};

export type RelationshipPulse = {
  label: string;
  status: string;
  detail: string;
  tone: Extract<ActivityTone, "social" | "conflict">;
};

const activityLabels: Record<PetActivity, string> = {
  idle: "idling",
  wander: "wandering",
  sleep: "sleeping",
  eat: "eating",
  drink: "drinking",
  climb_tree: "climbing",
  hide: "hiding",
  poop: "pooping",
  chase: "chasing",
  scuffle: "scuffling",
  seek_owner: "seeking owner",
  play: "playing",
  look_around: "looking around",
  sunbathe: "sunbathing",
  watch_fish: "watching fish",
  groom: "grooming",
  dig: "digging",
  approach_pet: "approaching",
  observe_from_distance: "observing",
  claim_spot: "claiming spot",
  escort_owner: "escorting owner",
  offer_toy: "offering toy",
  reconcile: "reconciling",
  ignore: "ignoring",
  steal_spot: "stealing spot",
  move_to_zone: "moving zones",
};

const goalLabels: Record<PetDrive, string> = {
  seek_rest: "looking for rest",
  seek_food: "looking for food",
  seek_play: "looking for play",
  seek_owner: "seeking owner",
  seek_friend: "seeking a friend",
  avoid_threat: "seeking safety",
  guard_spot: "guarding a spot",
  self_maintain: "taking care",
  explore: "exploring",
};

const moodLabels: Record<PetMood, string> = {
  happy: "happy",
  curious: "curious",
  playful: "playful",
  sleepy: "sleepy",
  lonely: "lonely",
  grumpy: "grumpy",
  dirty: "dirty",
};

const socialActivities = new Set<PetActivity>([
  "play",
  "approach_pet",
  "offer_toy",
  "reconcile",
  "escort_owner",
  "seek_owner",
]);

const conflictActivities = new Set<PetActivity>(["scuffle", "chase", "steal_spot", "ignore"]);
const restActivities = new Set<PetActivity>(["sleep", "sunbathe", "hide"]);
const careActivities = new Set<PetActivity>(["eat", "drink", "groom", "poop"]);
const exploreActivities = new Set<PetActivity>([
  "wander",
  "look_around",
  "watch_fish",
  "climb_tree",
  "dig",
  "claim_spot",
  "observe_from_distance",
  "move_to_zone",
]);

function enumFallback(value: string) {
  return value.replaceAll("_", " ");
}

export function activityLabel(activity: PetActivity) {
  return activityLabels[activity] ?? enumFallback(activity);
}

export function goalLabel(goal?: PetDrive | string) {
  if (!goal) {
    return "reading the room";
  }

  return goal in goalLabels ? goalLabels[goal as PetDrive] : enumFallback(goal);
}

export function moodLabel(mood: PetMood) {
  return moodLabels[mood] ?? mood;
}

export function activityTone(activity: PetActivity): ActivityTone {
  if (socialActivities.has(activity)) {
    return "social";
  }

  if (conflictActivities.has(activity)) {
    return "conflict";
  }

  if (restActivities.has(activity)) {
    return "rest";
  }

  if (careActivities.has(activity)) {
    return "care";
  }

  if (exploreActivities.has(activity)) {
    return "explore";
  }

  return "neutral";
}

export function buildIntentSummary(pet: GardenPetSnapshot): IntentSummary {
  const decision = pet.state.lastAutonomyDecision;
  const activity = decision?.chosenActivity ?? pet.state.activity;

  return {
    activity: activityLabel(activity),
    goal: goalLabel(decision?.goal),
    reason:
      decision?.reason ??
      `${pet.pet.name} is ${moodLabel(pet.state.mood)} and currently ${activityLabel(pet.state.activity)}.`,
    source: decision?.source ?? "state",
    tone: activityTone(activity),
  };
}

export function relationshipPulse(pet: GardenPetSnapshot): RelationshipPulse | null {
  const strongestBond = [...pet.bonds].sort(
    (left, right) =>
      Math.max(right.affinity, right.rivalry) - Math.max(left.affinity, left.rivalry),
  )[0];

  if (strongestBond) {
    return {
      label: strongestBond.otherPetName,
      status: strongestBond.status,
      detail: `affinity ${strongestBond.affinity} / rivalry ${strongestBond.rivalry}`,
      tone: strongestBond.rivalry > strongestBond.affinity ? "conflict" : "social",
    };
  }

  const model = [...pet.relationshipModels].sort(
    (left, right) =>
      Math.max(right.trust, right.resentment) - Math.max(left.trust, left.resentment),
  )[0];

  if (!model) {
    return null;
  }

  return {
    label: "relationship model",
    status: model.attachmentPattern,
    detail: `trust ${model.trust} / resentment ${model.resentment}`,
    tone: model.resentment > model.trust ? "conflict" : "social",
  };
}
