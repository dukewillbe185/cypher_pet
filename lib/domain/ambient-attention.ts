import { randomUUID } from "node:crypto";

import type { AppStore, GardenZoneId, PetEvent, SpeechBubbleKind } from "@/lib/types";

export const AMBIENT_PRESENCE_FRESH_MS = 1000 * 30;
export const AMBIENT_RADIUS_TILES = 7;
export const AMBIENT_BUBBLE_LIFETIME_MS = 1000 * 9;

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
    /** The other half of an exchange — lets later moments reference this line. */
    relatedPetId?: string;
    /**
     * Dialogue turns replace whatever the pet was musing about — the sim's
     * spontaneous chatter must not be able to block a staged exchange.
     */
    force?: boolean;
  },
): PetEvent | null {
  const pet = store.pets.find((entry) => entry.id === input.petId);
  const state = store.petStates.find((entry) => entry.petId === input.petId);

  if (!pet || !state || state.zoneId !== input.zoneId || !input.text.trim()) {
    return null;
  }

  const bubbleActive =
    state.currentBubble && new Date(state.currentBubble.expiresAt).getTime() > input.nowMs;

  if (bubbleActive && !input.force) {
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
    ...(input.relatedPetId ? { relatedPetId: input.relatedPetId } : {}),
  };

  store.petEvents.unshift(event);
  return event;
}
