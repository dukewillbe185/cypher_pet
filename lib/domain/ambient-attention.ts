import { randomUUID } from "node:crypto";

import type { AppStore, GardenZoneId, PetEvent, SpeechBubbleKind } from "@/lib/types";

export const AMBIENT_PRESENCE_FRESH_MS = 1000 * 30;
export const AMBIENT_RADIUS_TILES = 7;
export const AMBIENT_BUBBLE_LIFETIME_MS = 1000 * 9;

export interface AmbientCandidate {
  petId: string;
  petName: string;
  ownedByViewer: boolean;
  distance: number;
}

/**
 * Picks the pet most deserving of a "thinking out loud" moment while the
 * viewer's avatar stands nearby: closest first, own pets favored, pets that
 * already have an active bubble or spoke recently skipped.
 */
export function pickAmbientCandidate(
  store: AppStore,
  input: {
    zoneId: GardenZoneId;
    viewerId: string;
    nowMs: number;
    petCooldownUntil: (petId: string) => number;
  },
): AmbientCandidate | null {
  const presence = store.gardenPresences?.find(
    (entry) => entry.profileId === input.viewerId && entry.zoneId === input.zoneId,
  );

  if (!presence || input.nowMs - new Date(presence.updatedAt).getTime() > AMBIENT_PRESENCE_FRESH_MS) {
    return null;
  }

  const candidates = store.pets
    .filter((pet) => !pet.isFrozen)
    .map((pet) => {
      const state = store.petStates.find((entry) => entry.petId === pet.id);
      return state ? { pet, state } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .filter(({ state }) => state.zoneId === input.zoneId)
    .filter(({ state }) => state.activity !== "sleep" && state.activity !== "hide")
    .filter(({ state }) => {
      const bubbleActive =
        state.currentBubble && new Date(state.currentBubble.expiresAt).getTime() > input.nowMs;
      return !bubbleActive;
    })
    .filter(({ pet }) => input.petCooldownUntil(pet.id) <= input.nowMs)
    .map(({ pet, state }) => ({
      petId: pet.id,
      petName: pet.name,
      ownedByViewer: pet.ownerId === input.viewerId,
      distance: Math.hypot(state.tileX - presence.tileX, state.tileY - presence.tileY),
    }))
    .filter((entry) => entry.distance <= AMBIENT_RADIUS_TILES)
    .sort((left, right) =>
      left.ownedByViewer === right.ownedByViewer
        ? left.distance - right.distance
        : left.ownedByViewer
          ? -1
          : 1,
    );

  return candidates[0] ?? null;
}

/**
 * Writes the generated thought into the world if the pet is still receptive
 * (same zone, no bubble raced in while the LLM was thinking).
 */
export function commitAmbientBubble(
  store: AppStore,
  input: {
    petId: string;
    zoneId: GardenZoneId;
    text: string;
    kind: SpeechBubbleKind;
    nowMs: number;
    source: "llm" | "fallback";
    /** Overrides the default "looked at you" event framing for drama lines. */
    body?: string;
  },
): PetEvent | null {
  const pet = store.pets.find((entry) => entry.id === input.petId);
  const state = store.petStates.find((entry) => entry.petId === input.petId);

  if (!pet || !state || state.zoneId !== input.zoneId || !input.text.trim()) {
    return null;
  }

  const bubbleActive =
    state.currentBubble && new Date(state.currentBubble.expiresAt).getTime() > input.nowMs;

  if (bubbleActive) {
    return null;
  }

  state.currentBubble = {
    text: input.text,
    kind: input.kind,
    expiresAt: new Date(input.nowMs + AMBIENT_BUBBLE_LIFETIME_MS).toISOString(),
  };

  const event: PetEvent = {
    id: randomUUID(),
    petId: pet.id,
    zoneId: input.zoneId,
    type: "inner_voice",
    body:
      input.body ??
      `${pet.name} 看了你一眼，${input.kind === "speech" ? "冒出一句" : "心里闪过一句"}：「${input.text}」`,
    createdAt: new Date(input.nowMs).toISOString(),
    narrationSource: input.source === "llm" ? "llm" : "template",
    emotion: state.mood,
    // Raw line kept so the next generation can avoid repeating it.
    spokenText: input.text,
  };

  store.petEvents.unshift(event);
  return event;
}
