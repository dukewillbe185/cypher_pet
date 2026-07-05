import { randomUUID } from "node:crypto";

import type { AppStore, PairRelationshipModel } from "@/lib/types";

const HOUR_MS = 1000 * 60 * 60;

function canonicalPair(petAId: string, petBId: string) {
  return [petAId, petBId].sort() as [string, string];
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function upsertPairRelationshipModel(
  store: AppStore,
  petAId: string,
  petBId: string,
  input: Partial<Omit<PairRelationshipModel, "id" | "petAId" | "petBId">> & { updatedAt: string },
) {
  store.pairRelationshipModels ??= [];
  const [leftId, rightId] = canonicalPair(petAId, petBId);
  const existing = store.pairRelationshipModels.find(
    (entry) => entry.petAId === leftId && entry.petBId === rightId,
  );

  if (existing) {
    existing.trust = clamp(input.trust ?? existing.trust);
    existing.playCompatibility = clamp(input.playCompatibility ?? existing.playCompatibility);
    existing.intimidation = clamp(input.intimidation ?? existing.intimidation);
    existing.curiosity = clamp(input.curiosity ?? existing.curiosity);
    existing.resentment = clamp(input.resentment ?? existing.resentment);
    existing.attachmentPattern = input.attachmentPattern ?? existing.attachmentPattern;
    existing.updatedAt = input.updatedAt;
    return existing;
  }

  const created: PairRelationshipModel = {
    id: randomUUID(),
    petAId: leftId,
    petBId: rightId,
    trust: clamp(input.trust ?? 42),
    playCompatibility: clamp(input.playCompatibility ?? 50),
    intimidation: clamp(input.intimidation ?? 18),
    curiosity: clamp(input.curiosity ?? 48),
    resentment: clamp(input.resentment ?? 12),
    attachmentPattern: input.attachmentPattern ?? "cautious acquaintances",
    updatedAt: input.updatedAt,
  };

  store.pairRelationshipModels.unshift(created);
  return created;
}

export function getPairRelationshipModel(store: AppStore, petAId: string, petBId: string) {
  store.pairRelationshipModels ??= [];
  const [leftId, rightId] = canonicalPair(petAId, petBId);
  return store.pairRelationshipModels.find(
    (entry) => entry.petAId === leftId && entry.petBId === rightId,
  );
}

export function listPairRelationshipModels(store: AppStore, petId: string, limit = 4) {
  store.pairRelationshipModels ??= [];
  return store.pairRelationshipModels
    .filter((entry) => entry.petAId === petId || entry.petBId === petId)
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, limit);
}

export function agePairRelationshipModels(store: AppStore, nowIso: string) {
  store.pairRelationshipModels ??= [];
  const nowMs = new Date(nowIso).getTime();

  store.pairRelationshipModels = store.pairRelationshipModels
    .map((entry) => {
      const elapsedHours = Math.max(0, (nowMs - new Date(entry.updatedAt).getTime()) / HOUR_MS);
      if (elapsedHours <= 18) {
        return entry;
      }

      const drift = Math.floor((elapsedHours - 18) / 8);

      return {
        ...entry,
        trust: clamp(entry.trust - Math.max(0, drift - 1)),
        resentment: clamp(entry.resentment - Math.max(0, drift - 1)),
        curiosity: clamp(entry.curiosity - Math.max(0, drift)),
        intimidation: clamp(entry.intimidation - Math.max(0, drift - 2)),
      };
    })
    .filter((entry) => entry.trust >= 12 || entry.resentment >= 12 || entry.curiosity >= 14);
}
