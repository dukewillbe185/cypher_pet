import { randomUUID } from "node:crypto";

import type {
  AppStore,
  GardenLedgerEvent,
  GardenSemanticFact,
  GardenSemanticPredicate,
  GardenSemanticSubjectType,
  GardenZoneId,
} from "@/lib/types";

type SemanticFactInput = {
  subjectType: GardenSemanticSubjectType;
  subjectId: string;
  predicate: GardenSemanticPredicate;
  objectType: GardenSemanticSubjectType;
  objectId?: string;
  objectLabel: string;
  weight?: number;
};

function clampWeight(weight: number) {
  return Math.max(1, Math.min(100, Math.round(weight)));
}

export function recordGardenLedgerEvent(
  store: AppStore,
  input: {
    type: GardenLedgerEvent["type"];
    participants: string[];
    zoneId: GardenZoneId;
    body: string;
    semanticTags?: string[];
    salience?: number;
    objectId?: string;
    facts?: SemanticFactInput[];
    nowIso?: string;
  },
) {
  store.gardenLedgerEvents ??= [];
  store.gardenSemanticFacts ??= [];
  const createdAt = input.nowIso ?? new Date().toISOString();
  const event: GardenLedgerEvent = {
    id: randomUUID(),
    type: input.type,
    participants: [...new Set(input.participants)],
    zoneId: input.zoneId,
    objectId: input.objectId,
    salience: clampWeight(input.salience ?? 48),
    body: input.body,
    semanticTags: [...new Set(input.semanticTags ?? [])],
    createdAt,
  };

  store.gardenLedgerEvents.unshift(event);
  store.gardenLedgerEvents = store.gardenLedgerEvents
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 240);

  for (const fact of input.facts ?? []) {
    upsertGardenSemanticFact(store, {
      ...fact,
      evidenceEventId: event.id,
      updatedAt: createdAt,
    });
  }

  return event;
}

export function upsertGardenSemanticFact(
  store: AppStore,
  input: {
    subjectType: GardenSemanticSubjectType;
    subjectId: string;
    predicate: GardenSemanticPredicate;
    objectType: GardenSemanticSubjectType;
    objectId?: string;
    objectLabel: string;
    weight?: number;
    evidenceEventId?: string;
    updatedAt?: string;
  },
) {
  store.gardenSemanticFacts ??= [];
  const updatedAt = input.updatedAt ?? new Date().toISOString();
  const existing = store.gardenSemanticFacts.find(
    (fact) =>
      fact.subjectType === input.subjectType &&
      fact.subjectId === input.subjectId &&
      fact.predicate === input.predicate &&
      fact.objectType === input.objectType &&
      fact.objectId === input.objectId &&
      fact.objectLabel === input.objectLabel,
  );

  if (existing) {
    existing.weight = clampWeight(Math.max(existing.weight, input.weight ?? existing.weight));
    if (input.evidenceEventId && !existing.evidenceEventIds.includes(input.evidenceEventId)) {
      existing.evidenceEventIds.unshift(input.evidenceEventId);
      existing.evidenceEventIds = existing.evidenceEventIds.slice(0, 8);
    }
    existing.updatedAt = updatedAt;
    return existing;
  }

  const created: GardenSemanticFact = {
    id: randomUUID(),
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    predicate: input.predicate,
    objectType: input.objectType,
    objectId: input.objectId,
    objectLabel: input.objectLabel,
    weight: clampWeight(input.weight ?? 42),
    evidenceEventIds: input.evidenceEventId ? [input.evidenceEventId] : [],
    updatedAt,
  };

  store.gardenSemanticFacts.unshift(created);
  return created;
}

export function listGardenLedgerEvents(
  store: AppStore,
  input?: {
    zoneId?: GardenZoneId;
    participantId?: string;
    limit?: number;
    /** Restrict to these zones (e.g. the viewer's accessible set) before the limit. */
    zoneIds?: ReadonlySet<GardenZoneId>;
  },
) {
  store.gardenLedgerEvents ??= [];
  const limit = input?.limit ?? 12;

  return store.gardenLedgerEvents
    .filter((event) => !input?.zoneId || event.zoneId === input.zoneId)
    .filter((event) => !input?.zoneIds || input.zoneIds.has(event.zoneId))
    .filter((event) => !input?.participantId || event.participants.includes(input.participantId))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, limit);
}

export function listGardenFactsForPet(store: AppStore, petId: string, limit = 6) {
  store.gardenSemanticFacts ??= [];
  return store.gardenSemanticFacts
    .filter((fact) => fact.subjectId === petId || fact.objectId === petId)
    .sort((left, right) => {
      if (right.weight !== left.weight) {
        return right.weight - left.weight;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })
    .slice(0, limit);
}

export function listRelevantGardenFacts(store: AppStore, petId: string, message: string, limit = 8) {
  store.gardenSemanticFacts ??= [];
  const normalized = message.toLowerCase();
  const keywordBoosts = new Map<string, number>();

  if (/喜欢|好兄弟|最好|friend/i.test(normalized)) {
    keywordBoosts.set("likes", 16);
    keywordBoosts.set("bonded_with", 10);
  }

  if (/讨厌|烦|害怕|怕|enemy|宿敌/i.test(normalized)) {
    keywordBoosts.set("dislikes", 16);
    keywordBoosts.set("avoids", 12);
    keywordBoosts.set("fears", 12);
    keywordBoosts.set("rival_of", 10);
  }

  if (/去哪|区域|zone|pond|grove|orchard|dog-run/.test(normalized)) {
    keywordBoosts.set("prefers_zone", 16);
    keywordBoosts.set("claims", 10);
  }

  return store.gardenSemanticFacts
    .filter((fact) => fact.subjectId === petId || fact.objectId === petId)
    .sort((left, right) => {
      const leftScore = left.weight + (keywordBoosts.get(left.predicate) ?? 0);
      const rightScore = right.weight + (keywordBoosts.get(right.predicate) ?? 0);

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })
    .slice(0, limit);
}
