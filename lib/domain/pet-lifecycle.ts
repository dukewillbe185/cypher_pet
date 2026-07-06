import { randomUUID } from "node:crypto";

import { canPetEnterZone } from "@/lib/domain/zone-access";
import type { AppStore, GardenZoneId, Profile } from "@/lib/types";

const HOME_SETTLE_TILE = { x: 24, y: 33 };

/**
 * Assigns (or clears) a pet's home area. Setting a home moves the pet there
 * right away and retires wanderlust goals pointing anywhere else; the
 * simulation keeps it in (or returning to) its home from then on.
 */
export function setPetHomeInStore(
  store: AppStore,
  input: { owner: Profile; petId: string; zoneId: GardenZoneId | null },
) {
  const pet = store.pets.find((entry) => entry.id === input.petId);
  const state = store.petStates.find((entry) => entry.petId === input.petId);

  if (!pet || !state) {
    throw new Error("not-found");
  }

  if (pet.ownerId !== input.owner.id) {
    throw new Error("只有主人可以安排宠物的家。");
  }

  const nowIso = new Date().toISOString();

  if (input.zoneId === null) {
    pet.homeZoneId = undefined;
    state.currentBubble = {
      text: "又可以到处浪了。",
      kind: "thought",
      expiresAt: new Date(Date.now() + 6000).toISOString(),
    };

    store.petEvents.unshift({
      id: randomUUID(),
      petId: pet.id,
      zoneId: state.zoneId,
      type: "zone_move",
      body: `${pet.name} 恢复了自由漫游，整个花园又都是它的了。`,
      createdAt: nowIso,
    });

    return pet;
  }

  const zone = store.gardenZones.find((entry) => entry.id === input.zoneId);

  if (!zone || !canPetEnterZone(store, pet, input.zoneId)) {
    throw new Error("这个区域不能作为它的家。");
  }

  pet.homeZoneId = zone.id;
  state.zoneId = zone.id;
  state.tileX = HOME_SETTLE_TILE.x + (pet.id.charCodeAt(0) % 5) - 2;
  state.tileY = HOME_SETTLE_TILE.y + (pet.id.charCodeAt(1) % 3) - 1;
  state.activity = "look_around";
  state.actionEndsAt = new Date(Date.now() + 12000).toISOString();
  state.currentBubble = {
    text: "这里就是我的窝了。",
    kind: "thought",
    expiresAt: new Date(Date.now() + 8000).toISOString(),
  };

  // Old wanderlust goals must not fight the new home.
  for (const goal of store.petGoals) {
    if (goal.petId === pet.id && goal.targetZoneId && goal.targetZoneId !== zone.id) {
      goal.status = "expired";
      goal.updatedAt = nowIso;
    }
  }

  store.petEvents.unshift({
    id: randomUUID(),
    petId: pet.id,
    zoneId: zone.id,
    type: "zone_move",
    body: `${pet.name} 正式搬进了「${zone.name}」，把这里当成家。`,
    createdAt: nowIso,
  });

  return pet;
}

/**
 * Permanently removes a pet and every record that references it. The garden
 * keeps running as if the pet was never there; other pets' shared memories
 * of it are dropped alongside.
 */
export function deletePetFromStore(
  store: AppStore,
  input: { owner: Profile; petId: string },
) {
  const pet = store.pets.find((entry) => entry.id === input.petId);

  if (!pet) {
    throw new Error("not-found");
  }

  if (pet.ownerId !== input.owner.id) {
    throw new Error("只有主人可以删除这只宠物。");
  }

  const petId = pet.id;

  store.pets = store.pets.filter((entry) => entry.id !== petId);
  store.petStates = store.petStates.filter((entry) => entry.petId !== petId);
  store.sourcePhotos = store.sourcePhotos.filter((entry) => entry.petId !== petId);
  store.petGenerations = store.petGenerations.filter((entry) => entry.petId !== petId);
  store.petEvents = store.petEvents.filter(
    (entry) => entry.petId !== petId && entry.relatedPetId !== petId,
  );
  store.petMemories = store.petMemories.filter(
    (entry) => entry.petId !== petId && entry.relatedPetId !== petId,
  );
  store.petAutonomyProfiles = store.petAutonomyProfiles.filter((entry) => entry.petId !== petId);
  store.petMemoryDigests = store.petMemoryDigests.filter((entry) => entry.petId !== petId);
  store.petSemanticMemoryDigests = store.petSemanticMemoryDigests.filter(
    (entry) => entry.petId !== petId,
  );
  store.petGoals = store.petGoals.filter(
    (entry) => entry.petId !== petId && entry.targetPetId !== petId,
  );
  store.petChatTraces = store.petChatTraces.filter((entry) => entry.petId !== petId);
  store.conversationSummaries = store.conversationSummaries.filter(
    (entry) => entry.petId !== petId,
  );
  store.chatSessions = store.chatSessions.filter((entry) => entry.petId !== petId);
  store.notifications = store.notifications.filter((entry) => entry.petId !== petId);
  store.ownerActions = store.ownerActions.filter((entry) => entry.petId !== petId);
  store.petRelationships = store.petRelationships.filter(
    (entry) => entry.petAId !== petId && entry.petBId !== petId,
  );
  store.pairRelationshipModels = store.pairRelationshipModels.filter(
    (entry) => entry.petAId !== petId && entry.petBId !== petId,
  );
  store.worldObjects = store.worldObjects.filter((entry) => entry.petId !== petId);
  store.gardenSemanticFacts = store.gardenSemanticFacts.filter(
    (entry) =>
      !(entry.subjectType === "pet" && entry.subjectId === petId) &&
      !(entry.objectType === "pet" && entry.objectId === petId),
  );
  store.gardenLedgerEvents = store.gardenLedgerEvents.filter(
    (entry) => !entry.participants.includes(petId),
  );
  store.gardenEncounterThreads = store.gardenEncounterThreads
    .map((thread) => ({
      ...thread,
      participantPetIds: thread.participantPetIds.filter((id) => id !== petId),
    }))
    .filter((thread) => thread.participantPetIds.length >= 2);

  store.notifications.unshift({
    id: `delete-${petId}-${Date.now()}`,
    userId: input.owner.id,
    kind: "system",
    body: `${pet.name} 已经离开花园。它留下的数据痕迹已全部清除。`,
    createdAt: new Date().toISOString(),
  });

  return { petId, petName: pet.name };
}
