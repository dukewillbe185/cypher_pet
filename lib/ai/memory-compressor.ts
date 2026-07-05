import type { AppStore, Pet, PetEpisodicMemoryIndex, PetSemanticMemoryDigest } from "@/lib/types";

import { buildPetBonds, listPetMemories } from "@/lib/domain/social";
import { listGardenFactsForPet } from "@/lib/domain/garden-memory";

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export function buildPetEpisodicMemoryIndex(store: AppStore, pet: Pet, limit = 10): PetEpisodicMemoryIndex {
  const memories = listPetMemories(store, pet.id, limit);
  const bonds = buildPetBonds(store, pet.id, 4);

  return {
    petId: pet.id,
    people: unique([
      ...bonds.map((bond) => `${bond.otherPetName}:${bond.status}`),
      ...memories.filter((memory) => memory.relatedPetId).map((memory) => memory.body),
    ]),
    places: unique(memories.filter((memory) => memory.zoneId).map((memory) => memory.body)),
    objects: unique(
      memories
        .filter((memory) => memory.kind === "favorite_toy" || memory.kind === "favorite_food")
        .map((memory) => memory.body),
    ),
    owner: unique(
      memories
        .filter((memory) => memory.kind === "owner_chat")
        .map((memory) => memory.body),
    ),
    conflicts: unique(
      memories
        .filter((memory) => ["enemy_pet", "chased_by_dog", "scary_moment", "dislike"].includes(memory.kind))
        .map((memory) => memory.body),
    ),
    comforts: unique(
      memories
        .filter((memory) => ["favorite_spot", "slept_well", "favorite_food", "friend_pet"].includes(memory.kind))
        .map((memory) => memory.body),
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function buildSemanticMemoryDigest(store: AppStore, pet: Pet, nowIso = new Date().toISOString()): PetSemanticMemoryDigest {
  const episodic = buildPetEpisodicMemoryIndex(store, pet, 10);
  const facts = listGardenFactsForPet(store, pet.id, 8);
  const preferences = unique([
    ...episodic.comforts.slice(0, 3),
    ...facts.filter((fact) => ["likes", "comforts_at", "prefers_zone", "favorite_object"].includes(fact.predicate)).map((fact) => `${fact.objectLabel}`),
  ]).slice(0, 4);
  const aversions = unique([
    ...episodic.conflicts.slice(0, 3),
    ...facts.filter((fact) => ["dislikes", "avoids", "fears", "rival_of"].includes(fact.predicate)).map((fact) => `${fact.objectLabel}`),
  ]).slice(0, 4);
  const socialJudgments = unique([
    ...episodic.people.slice(0, 3),
    ...facts.filter((fact) => ["likes", "dislikes", "bonded_with", "rival_of"].includes(fact.predicate)).map((fact) => `${fact.predicate}:${fact.objectLabel}`),
  ]).slice(0, 5);
  const placeMeanings = unique([
    ...episodic.places.slice(0, 3),
    ...facts.filter((fact) => ["prefers_zone", "comforts_at", "claims"].includes(fact.predicate)).map((fact) => `${fact.objectLabel}`),
  ]).slice(0, 4);
  const objectMeanings = episodic.objects.slice(0, 4);
  const ownerInteractionPattern =
    episodic.owner[0] ??
    `${pet.name} 会把主人的回应当成一个需要判断可信度和温度的信号。`;

  const summaryParts = [
    preferences[0] ? `长期偏爱：${preferences[0]}` : "",
    aversions[0] ? `长期警惕：${aversions[0]}` : "",
    socialJudgments[0] ? `社会判断：${socialJudgments[0]}` : "",
    placeMeanings[0] ? `地点意义：${placeMeanings[0]}` : "",
  ].filter(Boolean);

  return {
    petId: pet.id,
    source: "derived",
    summary:
      summaryParts.join("；") ||
      `${pet.name} 的长期语义记忆还在形成中，但已经开始把花园里的舒服点和危险点分开。`,
    longTermPreferences: preferences,
    longTermAversions: aversions,
    socialJudgments,
    placeMeanings,
    objectMeanings,
    ownerInteractionPattern,
    updatedAt: nowIso,
  };
}

