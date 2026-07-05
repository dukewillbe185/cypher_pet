import {
  activityLabel,
  activityTone,
  buildIntentSummary,
  type ActivityTone,
} from "@/components/garden/garden-labels";
import { clampTileX, clampTileY } from "@/lib/domain/world";
import type { GardenPetSnapshot, GardenSnapshot, GardenZoneId, PetActivity, PetGoal } from "@/lib/types";

export type AutonomyMapTargetKind = "pet" | "object" | "zone" | "tile";

export type AutonomyMapOverlay = {
  id: string;
  actorPetId: string;
  actorName: string;
  zoneId: GardenZoneId;
  targetKind: AutonomyMapTargetKind;
  targetLabel: string;
  routeLabel: string;
  reason: string;
  tone: ActivityTone;
  priority: number;
  start: {
    tileX: number;
    tileY: number;
  };
  target: {
    tileX: number;
    tileY: number;
  };
  targetPetId?: string;
  targetObjectId?: string;
  targetZoneId?: GardenZoneId;
};

const DEFAULT_LIMIT = 8;
const currentActivityRouteOverrides = new Set<PetActivity>(["scuffle", "chase"]);

const zoneExitTiles: Record<GardenZoneId, Record<GardenZoneId, { tileX: number; tileY: number }>> = {
  orchard: {
    orchard: { tileX: 24, tileY: 24 },
    pond: { tileX: 43, tileY: 24 },
    grove: { tileX: 17, tileY: 43 },
    "dog-run": { tileX: 43, tileY: 38 },
  },
  pond: {
    orchard: { tileX: 4, tileY: 22 },
    pond: { tileX: 24, tileY: 24 },
    grove: { tileX: 16, tileY: 43 },
    "dog-run": { tileX: 43, tileY: 34 },
  },
  grove: {
    orchard: { tileX: 10, tileY: 6 },
    pond: { tileX: 43, tileY: 19 },
    grove: { tileX: 24, tileY: 24 },
    "dog-run": { tileX: 43, tileY: 30 },
  },
  "dog-run": {
    orchard: { tileX: 8, tileY: 7 },
    pond: { tileX: 4, tileY: 24 },
    grove: { tileX: 10, tileY: 43 },
    "dog-run": { tileX: 24, tileY: 24 },
  },
};

function highestGoal(pet: GardenPetSnapshot) {
  return [...pet.currentGoals]
    .filter((goal) => goal.status === "active" || goal.status === "paused")
    .sort((left, right) => right.priority - left.priority)[0];
}

function needPressure(pet: GardenPetSnapshot) {
  return Math.max(
    pet.state.hunger - 70,
    pet.state.stress - 66,
    32 - pet.state.energy,
    40 - pet.state.hygiene,
    pet.state.bladder - 74,
    34 - pet.state.social,
    0,
  );
}

function objectLabel(objectId: string) {
  return objectId.replace(/^object-/, "").replaceAll("-", " ");
}

function petTargetOverlay(
  pet: GardenPetSnapshot,
  targetPet: GardenPetSnapshot,
  snapshot: GardenSnapshot,
  priority: number,
): AutonomyMapOverlay {
  const intent = buildIntentSummary(pet);
  const routeActivity = currentActivityRouteOverrides.has(pet.state.activity)
    ? pet.state.activity
    : "approach_pet";
  const tone = activityTone(
    currentActivityRouteOverrides.has(pet.state.activity)
      ? pet.state.activity
      : pet.state.lastAutonomyDecision?.chosenActivity ?? pet.state.activity,
  );

  return {
    id: `intent-route:${pet.pet.id}:${targetPet.pet.id}`,
    actorPetId: pet.pet.id,
    actorName: pet.pet.name,
    zoneId: snapshot.zone.id,
    targetKind: "pet",
    targetLabel: targetPet.pet.name,
    routeLabel:
      routeActivity === "scuffle"
        ? `scuffling with ${targetPet.pet.name}`
        : routeActivity === "chase"
          ? `chasing ${targetPet.pet.name}`
          : `approaching ${targetPet.pet.name}`,
    reason: intent.reason,
    tone,
    priority,
    start: {
      tileX: pet.state.tileX,
      tileY: pet.state.tileY,
    },
    target: {
      tileX: targetPet.state.tileX,
      tileY: targetPet.state.tileY,
    },
    targetPetId: targetPet.pet.id,
  };
}

function objectTargetOverlay(
  pet: GardenPetSnapshot,
  snapshot: GardenSnapshot,
  targetObjectId: string,
  priority: number,
): AutonomyMapOverlay | null {
  const object = snapshot.objects.find((entry) => entry.id === targetObjectId && !entry.removedAt);
  if (!object) {
    return null;
  }

  const intent = buildIntentSummary(pet);

  return {
    id: `intent-route:${pet.pet.id}:${object.id}`,
    actorPetId: pet.pet.id,
    actorName: pet.pet.name,
    zoneId: snapshot.zone.id,
    targetKind: "object",
    targetLabel: objectLabel(object.id),
    routeLabel: `tracking ${objectLabel(object.id)}`,
    reason: intent.reason,
    tone: intent.tone,
    priority,
    start: {
      tileX: pet.state.tileX,
      tileY: pet.state.tileY,
    },
    target: {
      tileX: object.tileX,
      tileY: object.tileY,
    },
    targetObjectId: object.id,
  };
}

function zoneTargetOverlay(
  pet: GardenPetSnapshot,
  snapshot: GardenSnapshot,
  goal: PetGoal,
  priority: number,
): AutonomyMapOverlay | null {
  if (!goal.targetZoneId || goal.targetZoneId === snapshot.zone.id) {
    return null;
  }

  const intent = buildIntentSummary(pet);
  const target = zoneExitTiles[snapshot.zone.id]?.[goal.targetZoneId];

  if (!target) {
    return null;
  }

  return {
    id: `intent-route:${pet.pet.id}:zone-${goal.targetZoneId}`,
    actorPetId: pet.pet.id,
    actorName: pet.pet.name,
    zoneId: snapshot.zone.id,
    targetKind: "zone",
    targetLabel: goal.targetZoneId,
    routeLabel: `route to ${goal.targetZoneId}`,
    reason: goal.reason || intent.reason,
    tone: "explore",
    priority,
    start: {
      tileX: pet.state.tileX,
      tileY: pet.state.tileY,
    },
    target,
    targetZoneId: goal.targetZoneId,
  };
}

function ambientOffset(activity: PetActivity) {
  switch (activity) {
    case "chase":
    case "play":
    case "dig":
      return { dx: 7, dy: 2 };
    case "wander":
    case "move_to_zone":
      return { dx: 6, dy: 3 };
    case "look_around":
      return { dx: 4, dy: -2 };
    case "climb_tree":
      return { dx: 2, dy: -5 };
    case "hide":
      return { dx: -4, dy: 2 };
    case "watch_fish":
    case "drink":
      return { dx: 5, dy: 1 };
    case "sleep":
    case "sunbathe":
      return { dx: 2, dy: 1 };
    case "seek_owner":
      return { dx: -5, dy: 1 };
    default:
      return { dx: 3, dy: 2 };
  }
}

function ambientTargetOverlay(
  pet: GardenPetSnapshot,
  snapshot: GardenSnapshot,
  priority: number,
): AutonomyMapOverlay | null {
  const decision = pet.state.lastAutonomyDecision;
  const pressure = needPressure(pet);

  if (!decision && pressure <= 0) {
    return null;
  }

  const activity = currentActivityRouteOverrides.has(pet.state.activity)
    ? pet.state.activity
    : decision?.chosenActivity ?? pet.state.activity;
  const isCurrentActivityOverride = currentActivityRouteOverrides.has(pet.state.activity);
  const intent = buildIntentSummary(pet);
  const offset = ambientOffset(activity);

  return {
    id: `intent-route:${pet.pet.id}:ambient`,
    actorPetId: pet.pet.id,
    actorName: pet.pet.name,
    zoneId: snapshot.zone.id,
    targetKind: "tile",
    targetLabel: "next tile",
    routeLabel: `${activityLabel(activity)} route`,
    reason: intent.reason,
    tone: isCurrentActivityOverride ? activityTone(activity) : pressure > 20 ? "care" : intent.tone,
    priority,
    start: {
      tileX: pet.state.tileX,
      tileY: pet.state.tileY,
    },
    target: {
      tileX: clampTileX(pet.state.tileX + offset.dx),
      tileY: clampTileY(pet.state.tileY + offset.dy),
    },
  };
}

function overlayPriority(pet: GardenPetSnapshot, goal?: PetGoal) {
  return (
    needPressure(pet) +
    (goal?.priority ?? 0) +
    (pet.state.lastAutonomyDecision?.source === "llm" ? 10 : 0) +
    (pet.state.lastAutonomyDecision?.targetPetId ? 16 : 0)
  );
}

export function buildAutonomyMapOverlays(
  snapshot: GardenSnapshot,
  selectedPetId?: string,
  limit = DEFAULT_LIMIT,
): AutonomyMapOverlay[] {
  const petsById = new Map(snapshot.pets.map((pet) => [pet.pet.id, pet]));
  const overlays: AutonomyMapOverlay[] = [];

  for (const pet of snapshot.pets) {
    const decision = pet.state.lastAutonomyDecision;
    const goal = highestGoal(pet);
    const priority = overlayPriority(pet, goal) + (pet.pet.id === selectedPetId ? 120 : 0);

    if (decision?.targetPetId) {
      const targetPet = petsById.get(decision.targetPetId);
      if (targetPet) {
        overlays.push(petTargetOverlay(pet, targetPet, snapshot, priority));
        continue;
      }
    }

    if (decision?.targetObjectId) {
      const objectOverlay = objectTargetOverlay(pet, snapshot, decision.targetObjectId, priority);
      if (objectOverlay) {
        overlays.push(objectOverlay);
        continue;
      }
    }

    if (goal?.targetPetId) {
      const targetPet = petsById.get(goal.targetPetId);
      if (targetPet) {
        overlays.push(petTargetOverlay(pet, targetPet, snapshot, priority));
        continue;
      }
    }

    if (goal?.targetObjectId) {
      const objectOverlay = objectTargetOverlay(pet, snapshot, goal.targetObjectId, priority);
      if (objectOverlay) {
        overlays.push(objectOverlay);
        continue;
      }
    }

    if (goal?.targetZoneId) {
      const zoneOverlay = zoneTargetOverlay(pet, snapshot, goal, priority);
      if (zoneOverlay) {
        overlays.push(zoneOverlay);
        continue;
      }
    }

    const ambientOverlay = ambientTargetOverlay(pet, snapshot, priority);
    if (ambientOverlay) {
      overlays.push(ambientOverlay);
    }
  }

  return overlays
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return left.actorName.localeCompare(right.actorName);
    })
    .slice(0, limit);
}
