import type {
  AppStore,
  GardenEncounter,
  GardenEncounterMapMarker,
  GardenEncounterThread,
  GardenEncounterStage,
  GardenEncounterWorldAction,
  GardenZoneId,
  OwnerAction,
  PetEvent,
  PetState,
} from "@/lib/types";

const RECENT_EVENT_WINDOW_MS = 1000 * 60 * 90;
const MAX_ENCOUNTERS = 5;
const THREAD_TTL_MS = 1000 * 60 * 60 * 6;
const THREAD_RESOLUTION_MS = 1000 * 60 * 20;

type BuildGardenEncounterInput = {
  zoneId: GardenZoneId;
  visiblePetIds: string[];
  nowIso?: string;
};

function timeMs(iso: string) {
  const value = new Date(iso).getTime();
  return Number.isFinite(value) ? value : 0;
}

function petName(store: AppStore, petId: string) {
  return store.pets.find((pet) => pet.id === petId)?.name ?? "Unknown";
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function stableThreadId(encounter: Pick<GardenEncounter, "kind" | "zoneId" | "participantPetIds">) {
  return [
    "thread",
    encounter.kind,
    encounter.zoneId,
    ...[...encounter.participantPetIds].sort(),
  ].join(":");
}

function stageForEvent(event: PetEvent, nowMs: number): GardenEncounterStage {
  const ageMs = nowMs - timeMs(event.createdAt);

  if (ageMs < 1000 * 60 * 3) {
    return "spark";
  }

  if (ageMs < 1000 * 60 * 45) {
    return "unfolding";
  }

  return "cooldown";
}

function conflictEncounter(store: AppStore, event: PetEvent, nowMs: number): GardenEncounter | null {
  if (!event.relatedPetId) {
    return null;
  }

  const primaryName = petName(store, event.petId);
  const relatedName = petName(store, event.relatedPetId);

  return {
    id: `encounter-conflict-${event.id}`,
    kind: "conflict",
    tone: "conflict",
    stage: stageForEvent(event, nowMs),
    zoneId: event.zoneId,
    title: `${primaryName} and ${relatedName} are tense`,
    summary: event.body,
    participantPetIds: [event.petId, event.relatedPetId],
    relatedEventIds: [event.id],
    suggestedOwnerActions: ["call", "pet", "scold"],
    updatedAt: event.createdAt,
  };
}

function socialEncounter(store: AppStore, event: PetEvent, nowMs: number): GardenEncounter | null {
  if (!event.relatedPetId) {
    return null;
  }

  const primaryName = petName(store, event.petId);
  const relatedName = petName(store, event.relatedPetId);

  return {
    id: `encounter-social-${event.id}`,
    kind: "social",
    tone: "social",
    stage: stageForEvent(event, nowMs),
    zoneId: event.zoneId,
    title: `${primaryName} and ${relatedName} are interacting`,
    summary: event.body,
    participantPetIds: [event.petId, event.relatedPetId],
    relatedEventIds: [event.id],
    suggestedOwnerActions: ["gift", "throw_toy", "photo"],
    updatedAt: event.createdAt,
  };
}

function needsSummary(state: PetState, name: string) {
  const needs: string[] = [];

  if (state.hunger >= 72) {
    needs.push("hungry");
  }

  if (state.stress >= 70) {
    needs.push("stressed");
  }

  if (state.energy <= 32) {
    needs.push("tired");
  }

  if (state.hygiene <= 34) {
    needs.push("messy");
  }

  if (state.bladder >= 82) {
    needs.push("restless");
  }

  return {
    needs,
    summary: `${name} is ${needs.join(", ")} and could use direct attention.`,
  };
}

function needsEncounter(store: AppStore, state: PetState, nowIso: string): GardenEncounter | null {
  const pet = store.pets.find((entry) => entry.id === state.petId);

  if (!pet) {
    return null;
  }

  const { needs, summary } = needsSummary(state, pet.name);

  if (needs.length === 0) {
    return null;
  }

  const suggestedOwnerActions: OwnerAction[] = [];

  if (state.hunger >= 72) {
    suggestedOwnerActions.push("feed");
  }

  if (state.stress >= 70 || state.energy <= 32) {
    suggestedOwnerActions.push("pet");
  }

  suggestedOwnerActions.push("call");

  return {
    id: `encounter-needs-${state.petId}`,
    kind: "needs_attention",
    tone: "care",
    stage: needs.length >= 2 ? "unfolding" : "spark",
    zoneId: state.zoneId,
    title: `${pet.name} needs attention`,
    summary,
    participantPetIds: [state.petId],
    relatedEventIds: [],
    suggestedOwnerActions: unique(suggestedOwnerActions),
    updatedAt: nowIso,
  };
}

function territoryEncounter(store: AppStore, state: PetState, nowIso: string): GardenEncounter | null {
  if (
    state.activity !== "claim_spot" &&
    state.activity !== "climb_tree" &&
    state.lastAutonomyDecision?.goal !== "guard_spot"
  ) {
    return null;
  }

  const pet = store.pets.find((entry) => entry.id === state.petId);

  if (!pet) {
    return null;
  }

  return {
    id: `encounter-territory-${state.petId}`,
    kind: "territory",
    tone: "explore",
    stage: "unfolding",
    zoneId: state.zoneId,
    title: `${pet.name} is marking a place`,
    summary: `${pet.name} is treating this part of the garden like a meaningful spot.`,
    participantPetIds: [state.petId],
    relatedEventIds: [],
    suggestedOwnerActions: ["photo", "rename_spot", "gift"],
    updatedAt: nowIso,
  };
}

export function buildGardenEncounters(store: AppStore, input: BuildGardenEncounterInput): GardenEncounter[] {
  const nowIso = input.nowIso ?? new Date().toISOString();
  const nowMs = timeMs(nowIso);
  const visiblePetIds = new Set(input.visiblePetIds);
  const encounters: GardenEncounter[] = [];
  const recentEvents = store.petEvents
    .filter((event) => {
      if (event.zoneId !== input.zoneId || event.hidden || !visiblePetIds.has(event.petId)) {
        return false;
      }

      if (event.relatedPetId && !visiblePetIds.has(event.relatedPetId)) {
        return false;
      }

      const ageMs = nowMs - timeMs(event.createdAt);
      return ageMs >= 0 && ageMs <= RECENT_EVENT_WINDOW_MS;
    })
    .sort((left, right) => timeMs(right.createdAt) - timeMs(left.createdAt));

  for (const event of recentEvents) {
    const encounter =
      event.type === "scuffle" || event.type === "chased"
        ? conflictEncounter(store, event, nowMs)
        : event.type === "social_chat" || event.type === "bonded"
          ? socialEncounter(store, event, nowMs)
          : null;

    if (encounter) {
      encounters.push(encounter);
    }
  }

  for (const state of store.petStates) {
    if (state.zoneId !== input.zoneId || !visiblePetIds.has(state.petId)) {
      continue;
    }

    const need = needsEncounter(store, state, nowIso);
    if (need) {
      encounters.push(need);
    }

    const territory = territoryEncounter(store, state, nowIso);
    if (territory) {
      encounters.push(territory);
    }
  }

  const seen = new Set<string>();
  const derived = encounters
    .filter((encounter) => {
      const key = `${encounter.kind}:${encounter.participantPetIds.join(":")}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, MAX_ENCOUNTERS);

  const threadById = new Map((store.gardenEncounterThreads ?? []).map((thread) => [thread.id, thread]));
  return derived.map((encounter) => {
    const thread = threadById.get(stableThreadId(encounter));

    if (!thread) {
      return encounter;
    }

    return {
      ...encounter,
      threadId: thread.id,
      stage: thread.stage,
      status: thread.status,
      lastIntervention: thread.lastIntervention,
      lastWorldAction: thread.lastWorldAction,
      relatedEventIds: thread.relatedEventIds,
    };
  });
}

export function buildGardenEncounterMapMarkers(
  store: AppStore,
  encounters: GardenEncounter[],
): GardenEncounterMapMarker[] {
  return encounters.flatMap((encounter) => {
    const participantStates = encounter.participantPetIds
      .map((petId) => store.petStates.find((state) => state.petId === petId && state.zoneId === encounter.zoneId))
      .filter((state): state is PetState => Boolean(state));

    if (participantStates.length === 0) {
      return [];
    }

    const tileX = Math.round(
      participantStates.reduce((sum, state) => sum + state.tileX, 0) / participantStates.length,
    );
    const tileY = Math.round(
      participantStates.reduce((sum, state) => sum + state.tileY, 0) / participantStates.length,
    );

    return [
      {
        id: `marker-${encounter.threadId ?? encounter.id}`,
        encounterId: encounter.id,
        threadId: encounter.threadId,
        zoneId: encounter.zoneId,
        tileX,
        tileY,
        tone: encounter.tone,
        stage: encounter.stage,
        status: encounter.status,
        title: encounter.title,
        participantPetIds: encounter.participantPetIds,
      },
    ];
  });
}

export function syncGardenEncounterThreads(
  store: AppStore,
  encounters: GardenEncounter[],
  nowIso = new Date().toISOString(),
): GardenEncounterThread[] {
  store.gardenEncounterThreads ??= [];
  const nowMs = timeMs(nowIso);
  const activeIds = new Set<string>();

  for (const encounter of encounters) {
    const id = stableThreadId(encounter);
    activeIds.add(id);
    const existing = store.gardenEncounterThreads.find((thread) => thread.id === id);
    const expiresAt = new Date(nowMs + THREAD_TTL_MS).toISOString();

    if (existing) {
      existing.stage = existing.status === "resolving" ? "cooldown" : encounter.stage;
      existing.status = existing.status === "resolved" ? "resolved" : existing.status;
      existing.tone = encounter.tone;
      existing.title = encounter.title;
      existing.summary = encounter.summary;
      existing.relatedEventIds = unique([...existing.relatedEventIds, ...encounter.relatedEventIds]);
      existing.suggestedOwnerActions = encounter.suggestedOwnerActions;
      existing.updatedAt = encounter.updatedAt;
      existing.expiresAt = expiresAt;
      continue;
    }

    store.gardenEncounterThreads.push({
      id,
      kind: encounter.kind,
      tone: encounter.tone,
      stage: encounter.stage,
      status: "active",
      zoneId: encounter.zoneId,
      title: encounter.title,
      summary: encounter.summary,
      participantPetIds: encounter.participantPetIds,
      relatedEventIds: encounter.relatedEventIds,
      suggestedOwnerActions: encounter.suggestedOwnerActions,
      createdAt: nowIso,
      updatedAt: encounter.updatedAt,
      expiresAt,
    });
  }

  for (const thread of store.gardenEncounterThreads) {
    if (thread.status === "active" && !activeIds.has(thread.id) && timeMs(thread.expiresAt) <= nowMs) {
      thread.status = "expired";
      thread.stage = "cooldown";
      thread.updatedAt = nowIso;
    }

    const resolvingSinceMs = timeMs(thread.lastIntervention?.createdAt ?? thread.updatedAt);
    if (thread.status === "resolving" && resolvingSinceMs + THREAD_RESOLUTION_MS <= nowMs) {
      thread.status = "resolved";
      thread.stage = "cooldown";
      thread.updatedAt = nowIso;
    }
  }

  store.gardenEncounterThreads = store.gardenEncounterThreads
    .filter((thread) => thread.status !== "expired" || timeMs(thread.expiresAt) > nowMs - THREAD_TTL_MS)
    .slice(-80);

  return encounters.map((encounter) => {
    const id = stableThreadId(encounter);
    return store.gardenEncounterThreads.find((thread) => thread.id === id)!;
  });
}

export function recordEncounterIntervention(
  store: AppStore,
  input: {
    threadId: string;
    ownerId: string;
    petId: string;
    action: OwnerAction;
    nowIso?: string;
  },
) {
  const nowIso = input.nowIso ?? new Date().toISOString();
  const thread = store.gardenEncounterThreads?.find((entry) => entry.id === input.threadId);

  if (!thread) {
    return null;
  }

  thread.status = "resolving";
  thread.stage = "cooldown";
  thread.lastIntervention = {
    ownerId: input.ownerId,
    petId: input.petId,
    action: input.action,
    createdAt: nowIso,
  };
  thread.updatedAt = nowIso;
  thread.expiresAt = new Date(timeMs(nowIso) + THREAD_TTL_MS).toISOString();

  return thread;
}

export function recordEncounterWorldAction(
  store: AppStore,
  input: {
    threadId: string;
    viewerId: string;
    action: GardenEncounterWorldAction;
    actorPetId?: string;
    targetPetId?: string;
    nowIso?: string;
  },
) {
  const nowIso = input.nowIso ?? new Date().toISOString();
  const thread = store.gardenEncounterThreads?.find((entry) => entry.id === input.threadId);

  if (!thread) {
    return null;
  }

  thread.lastWorldAction = {
    viewerId: input.viewerId,
    action: input.action,
    actorPetId: input.actorPetId,
    targetPetId: input.targetPetId,
    createdAt: nowIso,
  };

  if (input.action === "approach" && thread.status === "active") {
    thread.stage = "unfolding";
  }

  thread.updatedAt = nowIso;
  thread.expiresAt = new Date(timeMs(nowIso) + THREAD_TTL_MS).toISOString();

  return thread;
}
