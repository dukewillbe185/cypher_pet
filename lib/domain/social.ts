import { randomUUID } from "node:crypto";

import { recordGardenLedgerEvent, upsertGardenSemanticFact } from "@/lib/domain/garden-memory";
import { upsertPairRelationshipModel } from "@/lib/domain/social-model";
import type { AppStore, PetBond, PetMemory, PetMemoryKind, RelationshipStatus } from "@/lib/types";

const HOUR_MS = 1000 * 60 * 60;
const MEMORY_DECAY_START_HOURS = 6;
const RELATIONSHIP_DECAY_START_HOURS = 12;

function canonicalPair(petAId: string, petBId: string) {
  return [petAId, petBId].sort() as [string, string];
}

function relationshipStatus(affinity: number, rivalry: number): RelationshipStatus {
  if (rivalry >= Math.max(48, affinity + 10)) {
    return "enemy";
  }

  if (affinity >= Math.max(54, rivalry + 10)) {
    return "friend";
  }

  return "neutral";
}

export function upsertRelationship(
  store: AppStore,
  petAId: string,
  petBId: string,
  input: { affinityDelta?: number; rivalryDelta?: number; nowIso: string },
) {
  const [leftId, rightId] = canonicalPair(petAId, petBId);
  const existing = store.petRelationships.find(
    (relationship) => relationship.petAId === leftId && relationship.petBId === rightId,
  );

  if (existing) {
    existing.affinity = Math.max(0, Math.min(100, existing.affinity + (input.affinityDelta ?? 0)));
    existing.rivalry = Math.max(0, Math.min(100, existing.rivalry + (input.rivalryDelta ?? 0)));
    existing.updatedAt = input.nowIso;
    upsertPairRelationshipModel(store, leftId, rightId, {
      trust: Math.max(0, Math.min(100, existing.affinity)),
      resentment: Math.max(0, Math.min(100, existing.rivalry)),
      curiosity: Math.max(24, Math.min(100, 42 + Math.round((existing.affinity + existing.rivalry) / 4))),
      playCompatibility: Math.max(10, Math.min(100, existing.affinity - Math.floor(existing.rivalry / 2))),
      intimidation: Math.max(0, Math.min(100, Math.floor(existing.rivalry * 0.8))),
      attachmentPattern:
        existing.affinity >= existing.rivalry + 12
          ? "habitually close"
          : existing.rivalry >= existing.affinity + 12
            ? "tense avoidance"
            : "watchful orbit",
      updatedAt: input.nowIso,
    });
    return existing;
  }

  const created = {
    id: randomUUID(),
    petAId: leftId,
    petBId: rightId,
    affinity: Math.max(0, Math.min(100, 42 + (input.affinityDelta ?? 0))),
    rivalry: Math.max(0, Math.min(100, 8 + (input.rivalryDelta ?? 0))),
    updatedAt: input.nowIso,
  };

  store.petRelationships.unshift(created);
  upsertPairRelationshipModel(store, leftId, rightId, {
    trust: created.affinity,
    resentment: created.rivalry,
    curiosity: 52,
    playCompatibility: Math.max(10, created.affinity - Math.floor(created.rivalry / 2)),
    intimidation: Math.floor(created.rivalry * 0.75),
    attachmentPattern: "forming pattern",
    updatedAt: input.nowIso,
  });
  return created;
}

export function rememberPet(
  store: AppStore,
  input: {
    petId: string;
    kind: PetMemoryKind;
    body: string;
    zoneId?: string;
    relatedPetId?: string;
    weight?: number;
    nowIso: string;
  },
) {
  const existing = store.petMemories.find(
    (memory) =>
      memory.petId === input.petId &&
      memory.kind === input.kind &&
      memory.relatedPetId === input.relatedPetId &&
      memory.zoneId === input.zoneId,
  );

  if (existing) {
    existing.body = input.body;
    existing.weight = Math.max(existing.weight, input.weight ?? existing.weight);
    existing.updatedAt = input.nowIso;
    return existing;
  }

  const memory: PetMemory = {
    id: randomUUID(),
    petId: input.petId,
    kind: input.kind,
    body: input.body,
    zoneId: input.zoneId as PetMemory["zoneId"],
    relatedPetId: input.relatedPetId,
    weight: input.weight ?? 50,
    createdAt: input.nowIso,
    updatedAt: input.nowIso,
  };

  store.petMemories.unshift(memory);

  if (input.relatedPetId) {
    const otherPet = store.pets.find((pet) => pet.id === input.relatedPetId);
    if (otherPet) {
      if (input.kind === "friend_pet") {
        upsertGardenSemanticFact(store, {
          subjectType: "pet",
          subjectId: input.petId,
          predicate: "likes",
          objectType: "pet",
          objectId: otherPet.id,
          objectLabel: otherPet.name,
          weight: input.weight ?? 60,
          updatedAt: input.nowIso,
        });
      }

      if (["enemy_pet", "chased_by_dog", "dislike", "scary_moment"].includes(input.kind)) {
        upsertGardenSemanticFact(store, {
          subjectType: "pet",
          subjectId: input.petId,
          predicate: input.kind === "enemy_pet" ? "rival_of" : "avoids",
          objectType: "pet",
          objectId: otherPet.id,
          objectLabel: otherPet.name,
          weight: input.weight ?? 58,
          updatedAt: input.nowIso,
        });
      }

      recordGardenLedgerEvent(store, {
        type: "chat",
        participants: [input.petId, otherPet.id],
        zoneId: (input.zoneId as PetMemory["zoneId"]) ?? "orchard",
        body: input.body,
        salience: input.weight ?? 50,
        semanticTags: [input.kind],
        facts:
          input.kind === "friend_pet"
            ? [
                {
                  subjectType: "pet",
                  subjectId: input.petId,
                  predicate: "likes",
                  objectType: "pet",
                  objectId: otherPet.id,
                  objectLabel: otherPet.name,
                  weight: input.weight ?? 60,
                },
              ]
            : ["enemy_pet", "chased_by_dog", "dislike", "scary_moment"].includes(input.kind)
              ? [
                  {
                    subjectType: "pet",
                    subjectId: input.petId,
                    predicate: input.kind === "enemy_pet" ? "rival_of" : "avoids",
                    objectType: "pet",
                    objectId: otherPet.id,
                    objectLabel: otherPet.name,
                    weight: input.weight ?? 58,
                  },
                ]
              : [],
        nowIso: input.nowIso,
      });
    }
  }

  if (input.zoneId && input.kind === "favorite_spot") {
    upsertGardenSemanticFact(store, {
      subjectType: "pet",
      subjectId: input.petId,
      predicate: "prefers_zone",
      objectType: "zone",
      objectId: input.zoneId,
      objectLabel: input.zoneId,
      weight: input.weight ?? 64,
      updatedAt: input.nowIso,
    });
  }

  return memory;
}

export function ageSocialGraph(store: AppStore, nowIso: string) {
  const nowMs = new Date(nowIso).getTime();

  store.petMemories = store.petMemories
    .map((memory) => {
      const elapsedHours = Math.max(0, (nowMs - new Date(memory.updatedAt).getTime()) / HOUR_MS);
      if (elapsedHours <= MEMORY_DECAY_START_HOURS) {
        return memory;
      }

      const fadedWeight = Math.max(
        0,
        memory.weight - Math.floor((elapsedHours - MEMORY_DECAY_START_HOURS) * 2.4),
      );

      return {
        ...memory,
        weight: fadedWeight,
      };
    })
    .filter((memory) => memory.weight >= 14 || nowMs - new Date(memory.updatedAt).getTime() < HOUR_MS * 30);

  store.petRelationships = store.petRelationships
    .map((relationship) => {
      const elapsedHours = Math.max(0, (nowMs - new Date(relationship.updatedAt).getTime()) / HOUR_MS);
      if (elapsedHours <= RELATIONSHIP_DECAY_START_HOURS) {
        return relationship;
      }

      const drift = Math.floor((elapsedHours - RELATIONSHIP_DECAY_START_HOURS) / 6);
      const affinity = Math.max(0, relationship.affinity - drift);
      const rivalry = Math.max(0, relationship.rivalry - Math.max(0, drift - 1));

      return {
        ...relationship,
        affinity,
        rivalry,
      };
    })
    .filter(
      (relationship) =>
        relationship.affinity >= 10 ||
        relationship.rivalry >= 10 ||
        nowMs - new Date(relationship.updatedAt).getTime() < HOUR_MS * 48,
    );
}

export function strongestMemory(
  store: AppStore,
  petId: string,
  kinds: PetMemoryKind[],
  zoneId?: string,
) {
  return store.petMemories
    .filter(
      (memory) =>
        memory.petId === petId &&
        kinds.includes(memory.kind) &&
        (!zoneId || memory.zoneId === zoneId),
    )
    .sort((left, right) => {
      if (right.weight !== left.weight) {
        return right.weight - left.weight;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })[0];
}

export function listPetMemories(store: AppStore, petId: string, limit = 3) {
  return store.petMemories
    .filter((memory) => memory.petId === petId)
    .sort((left, right) => {
      if (right.weight !== left.weight) {
        return right.weight - left.weight;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })
    .slice(0, limit);
}

export function buildPetBonds(store: AppStore, petId: string, limit = 3): PetBond[] {
  return store.petRelationships
    .filter((relationship) => relationship.petAId === petId || relationship.petBId === petId)
    .map((relationship) => {
      const otherPetId = relationship.petAId === petId ? relationship.petBId : relationship.petAId;
      const otherPetName = store.pets.find((pet) => pet.id === otherPetId)?.name ?? "Unknown";

      return {
        otherPetId,
        otherPetName,
        status: relationshipStatus(relationship.affinity, relationship.rivalry),
        affinity: relationship.affinity,
        rivalry: relationship.rivalry,
        updatedAt: relationship.updatedAt,
      } satisfies PetBond;
    })
    .sort((left, right) => {
      const scoreLeft = Math.max(left.affinity, left.rivalry);
      const scoreRight = Math.max(right.affinity, right.rivalry);
      if (scoreRight !== scoreLeft) {
        return scoreRight - scoreLeft;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })
    .slice(0, limit);
}
