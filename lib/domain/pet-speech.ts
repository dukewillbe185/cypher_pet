import { AMBIENT_PRESENCE_FRESH_MS, AMBIENT_RADIUS_TILES } from "@/lib/domain/ambient-attention";
import type { AppStore, GardenZoneId, OwnerAction } from "@/lib/types";

/** How far back a world signal still reads as "just happened" for speech. */
export const SPEECH_SIGNAL_WINDOW_MS = 1000 * 75;
/** Fresh owner presence this close reads as a reunion moment. */
const REUNION_PRESENCE_FRESH_MS = 1000 * 12;
const REUNION_RADIUS_TILES = 3;
/** Affinity has to clear rivalry by this margin to count as a warming bond. */
const FRIEND_AFFINITY_MIN = 50;

export type SpeechMomentTrigger =
  | "conflict"
  | "owner_action"
  | "reunion"
  | "new_friendship"
  | "mood_shift"
  | "activity_change"
  | "idle";

export interface SpeechMoment {
  trigger: SpeechMomentTrigger;
  /** Concrete, in-world description injected into the speech prompt. */
  situation: string;
  salience: number;
  relatedPetId?: string;
}

/** Higher salience wins the scarce real-speech budget. */
const TRIGGER_SALIENCE: Record<SpeechMomentTrigger, number> = {
  conflict: 100,
  owner_action: 88,
  reunion: 84,
  new_friendship: 76,
  mood_shift: 58,
  activity_change: 40,
  idle: 20,
};

const IDLE_MOMENT: SpeechMoment = {
  trigger: "idle",
  situation: "眼下没什么大事，你只是在打量这片花园。",
  salience: TRIGGER_SALIENCE.idle,
};

function withinWindow(iso: string, nowMs: number) {
  const time = new Date(iso).getTime();
  return Number.isFinite(time) && time <= nowMs + 2000 && nowMs - time <= SPEECH_SIGNAL_WINDOW_MS;
}

function byNewest(left: { createdAt: string }, right: { createdAt: string }) {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

function isWarmingBond(store: AppStore, petId: string, otherId?: string) {
  if (!otherId) {
    return false;
  }

  return (store.petRelationships ?? []).some(
    (rel) =>
      ((rel.petAId === petId && rel.petBId === otherId) ||
        (rel.petAId === otherId && rel.petBId === petId)) &&
      rel.affinity >= FRIEND_AFFINITY_MIN &&
      rel.affinity > rel.rivalry,
  );
}

function ownerActionSituation(action: OwnerAction, ownerName = "主人"): string {
  switch (action) {
    case "feed":
      return `${ownerName}刚喂了你，嘴里还留着味道。`;
    case "pet":
      return `${ownerName}刚俯身摸了摸你。`;
    case "throw_toy":
      return `${ownerName}刚丢出一个玩具逗你。`;
    case "clean_poop":
      return `${ownerName}刚把你弄脏的地方收拾干净。`;
    case "call":
      return `${ownerName}刚朝你这边喊了一声。`;
    case "scold":
      return `${ownerName}刚沉下脸训了你两句。`;
    case "gift":
      return `${ownerName}刚塞给你一个小礼物。`;
    case "photo":
      return `${ownerName}刚举起相机给你拍照。`;
    case "rename_spot":
      return `${ownerName}刚给你这块地盘起了个新名字。`;
    default:
      return `${ownerName}刚对你做了点什么。`;
  }
}

/**
 * Presence for dialogue RESERVATION: here, un-frozen and awake — an active
 * bubble doesn't disqualify, it just means "wait a beat". Without this laxer
 * check, solo lines ping-pong between a feuding pair (bubble 9s vs zone beat
 * 10s) and the two are never simultaneously quiet enough to stage the talk.
 */
export function isPetPresentAndAwake(
  store: AppStore,
  petId: string,
  zoneId: GardenZoneId,
): boolean {
  const pet = store.pets.find((entry) => entry.id === petId);
  const state = store.petStates.find((entry) => entry.petId === petId);

  if (!pet || !state || pet.isFrozen || state.zoneId !== zoneId) {
    return false;
  }

  return state.activity !== "sleep" && state.activity !== "hide";
}

/** Free to speak = here, un-frozen, awake, and not mid-bubble. */
export function isPetFreeToSpeak(
  store: AppStore,
  petId: string,
  zoneId: GardenZoneId,
  nowMs: number,
): boolean {
  const pet = store.pets.find((entry) => entry.id === petId);
  const state = store.petStates.find((entry) => entry.petId === petId);

  if (!pet || !state || pet.isFrozen || state.zoneId !== zoneId) {
    return false;
  }

  if (state.activity === "sleep" || state.activity === "hide") {
    return false;
  }

  return !(state.currentBubble && new Date(state.currentBubble.expiresAt).getTime() > nowMs);
}

export interface RankedSpeechCandidate {
  petId: string;
  moment: SpeechMoment;
  /** Tiles to the viewer's avatar; null when the viewer isn't here (or stale). */
  distanceToViewer: number | null;
  ownedByViewer: boolean;
}

/**
 * Every pet in the zone competes for the scarce real-speech budget on the
 * strength of its current moment: a scuffle across the map outranks an idle
 * pet at the player's feet. Idle-tier moments still require the viewer close
 * by — background pets shouldn't burn model budget musing to nobody.
 */
export function rankSpeechCandidates(
  store: AppStore,
  input: {
    zoneId: GardenZoneId;
    viewerId: string;
    nowMs: number;
    /** Repository-side cooldown gate (in-memory last-spoke clock). */
    cooldownOkFor: (petId: string, salience: number) => boolean;
  },
): RankedSpeechCandidate[] {
  const presence = store.gardenPresences?.find(
    (entry) => entry.profileId === input.viewerId && entry.zoneId === input.zoneId,
  );
  const presenceFresh =
    presence && input.nowMs - new Date(presence.updatedAt).getTime() <= AMBIENT_PRESENCE_FRESH_MS;

  const candidates: RankedSpeechCandidate[] = [];

  for (const pet of store.pets) {
    if (!isPetFreeToSpeak(store, pet.id, input.zoneId, input.nowMs)) {
      continue;
    }

    const state = store.petStates.find((entry) => entry.petId === pet.id);
    if (!state) {
      continue;
    }

    const distanceToViewer = presenceFresh
      ? Math.hypot(state.tileX - presence.tileX, state.tileY - presence.tileY)
      : null;

    const moment = collectSpeechMoment(store, pet.id, input.nowMs);

    // Idle musings are for the player's ears only.
    if (moment.trigger === "idle") {
      if (distanceToViewer === null || distanceToViewer > AMBIENT_RADIUS_TILES) {
        continue;
      }
    }

    if (!input.cooldownOkFor(pet.id, moment.salience)) {
      continue;
    }

    candidates.push({
      petId: pet.id,
      moment,
      distanceToViewer,
      ownedByViewer: pet.ownerId === input.viewerId,
    });
  }

  return candidates.sort((left, right) => {
    if (left.moment.salience !== right.moment.salience) {
      return right.moment.salience - left.moment.salience;
    }
    if (left.ownedByViewer !== right.ownedByViewer) {
      return left.ownedByViewer ? -1 : 1;
    }
    const leftDistance = left.distanceToViewer ?? Number.POSITIVE_INFINITY;
    const rightDistance = right.distanceToViewer ?? Number.POSITIVE_INFINITY;
    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }
    return left.petId < right.petId ? -1 : 1;
  });
}

export type DialogueTrigger = "conflict" | "new_friendship" | "encounter";

export interface DialogueOpportunity {
  trigger: DialogueTrigger;
  /** Pair-level scene description handed to the dialogue director prompt. */
  situation: string;
  salience: number;
  /** The event's protagonist — opens the exchange. */
  petAId: string;
  petBId: string;
  sourceEventId: string;
}

/** Stable map key for a pet pair, order-independent. */
export function dialoguePairKey(petAId: string, petBId: string): string {
  return [petAId, petBId].sort().join("|");
}

const DIALOGUE_SALIENCE: Record<DialogueTrigger, number> = {
  conflict: TRIGGER_SALIENCE.conflict,
  new_friendship: TRIGGER_SALIENCE.new_friendship,
  encounter: TRIGGER_SALIENCE.activity_change,
};

/**
 * The freshest two-pet event worth staging as an overheard exchange: both
 * pets still here and free to talk, the pair not recently voiced. Returns the
 * highest-salience opportunity (newest wins ties) or null when the zone has
 * no fresh two-pet drama.
 */
export function collectDialogueOpportunity(
  store: AppStore,
  input: {
    zoneId: GardenZoneId;
    nowMs: number;
    isFree: (petId: string) => boolean;
    pairCooldownOkFor: (petAId: string, petBId: string) => boolean;
  },
): DialogueOpportunity | null {
  const nameOf = (id: string) => store.pets.find((entry) => entry.id === id)?.name ?? "另一只宠物";

  let best: DialogueOpportunity | null = null;

  // petEvents is newest-first, so the first hit per salience tier is freshest.
  for (const event of store.petEvents) {
    if (!event.relatedPetId || event.petId === event.relatedPetId) {
      continue;
    }
    if (event.type === "inner_voice" || !withinWindow(event.createdAt, input.nowMs)) {
      continue;
    }

    let trigger: DialogueTrigger;
    if (event.type === "scuffle" || event.type === "chased") {
      trigger = "conflict";
    } else if (event.type === "bonded" || event.type === "social_chat") {
      trigger = isWarmingBond(store, event.petId, event.relatedPetId) ? "new_friendship" : "encounter";
    } else {
      continue;
    }

    const salience = DIALOGUE_SALIENCE[trigger];
    if (best && salience <= best.salience) {
      continue;
    }

    if (!input.isFree(event.petId) || !input.isFree(event.relatedPetId)) {
      continue;
    }
    if (!input.pairCooldownOkFor(event.petId, event.relatedPetId)) {
      continue;
    }

    const nameA = nameOf(event.petId);
    const nameB = nameOf(event.relatedPetId);
    const situation =
      trigger === "conflict"
        ? `${nameA} 和 ${nameB} 刚闹了一场不愉快，两边火气都还没消。`
        : trigger === "new_friendship"
          ? `${nameA} 和 ${nameB} 刚才处得很好，正想多聊两句。`
          : `${nameA} 和 ${nameB} 刚打了个照面，停下来寒暄。`;

    best = {
      trigger,
      situation,
      salience,
      petAId: event.petId,
      petBId: event.relatedPetId,
      sourceEventId: event.id,
    };

    if (best.trigger === "conflict") {
      break;
    }
  }

  return best;
}

/** Recent lines the pet actually said, newest first — used to avoid repeats. */
export function collectRecentSpokenLines(store: AppStore, petId: string, limit = 6): string[] {
  const lines: string[] = [];

  for (const event of store.petEvents) {
    if (event.petId !== petId || event.type !== "inner_voice") {
      continue;
    }

    const text = event.spokenText?.trim();
    if (text) {
      lines.push(text);
      if (lines.length >= limit) {
        break;
      }
    }
  }

  return lines;
}

/**
 * The single most dramatic thing worth voicing for this pet right now. Always
 * returns something (falls back to a quiet idle moment) so callers can decide
 * whether the salience clears their bar.
 */
export function collectSpeechMoment(store: AppStore, petId: string, nowMs: number): SpeechMoment {
  const pet = store.pets.find((entry) => entry.id === petId);
  const state = store.petStates.find((entry) => entry.petId === petId);

  if (!pet || !state) {
    return IDLE_MOMENT;
  }

  const nameOf = (id: string | undefined) =>
    store.pets.find((entry) => entry.id === id)?.name ?? "另一只宠物";

  const candidates: SpeechMoment[] = [];

  // 1) The owner just acted on this pet.
  const ownerAction = (store.ownerActions ?? [])
    .filter((record) => record.petId === petId && withinWindow(record.createdAt, nowMs))
    .sort(byNewest)[0];
  if (ownerAction) {
    const ownerName = store.profiles.find((entry) => entry.id === ownerAction.ownerId)?.displayName;
    candidates.push({
      trigger: "owner_action",
      situation: ownerActionSituation(ownerAction.action, ownerName),
      salience: TRIGGER_SALIENCE.owner_action,
    });
  }

  // 2) The owner's avatar just arrived right next to the pet.
  const presence = (store.gardenPresences ?? []).find(
    (entry) => entry.profileId === pet.ownerId && entry.zoneId === state.zoneId,
  );
  if (
    presence &&
    nowMs - new Date(presence.updatedAt).getTime() <= REUNION_PRESENCE_FRESH_MS &&
    Math.abs(presence.tileX - state.tileX) + Math.abs(presence.tileY - state.tileY) <= REUNION_RADIUS_TILES
  ) {
    candidates.push({
      trigger: "reunion",
      situation: "主人的身影刚好凑到你旁边，你们又碰上了。",
      salience: TRIGGER_SALIENCE.reunion,
    });
  }

  // 3) Recent world events that touched this pet.
  const recentEvents = store.petEvents
    .filter(
      (event) =>
        (event.petId === petId || event.relatedPetId === petId) &&
        event.type !== "inner_voice" &&
        withinWindow(event.createdAt, nowMs),
    )
    .sort(byNewest);

  for (const event of recentEvents) {
    const otherId = event.petId === petId ? event.relatedPetId : event.petId;

    if (event.type === "scuffle" || event.type === "chased") {
      candidates.push({
        trigger: "conflict",
        situation: `你刚跟 ${nameOf(otherId)} 闹得不愉快，火气还没消。`,
        salience: TRIGGER_SALIENCE.conflict,
        relatedPetId: otherId,
      });
    } else if (event.type === "bonded" || event.type === "social_chat") {
      const warming = isWarmingBond(store, petId, otherId);
      candidates.push({
        trigger: warming ? "new_friendship" : "activity_change",
        situation: warming
          ? `你跟 ${nameOf(otherId)} 刚才处得不错，关系近了一点。`
          : `你刚和 ${nameOf(otherId)} 打了个照面。`,
        salience: warming ? TRIGGER_SALIENCE.new_friendship : TRIGGER_SALIENCE.activity_change,
        relatedPetId: otherId,
      });
    } else if (event.type === "mood_change") {
      candidates.push({
        trigger: "mood_shift",
        situation: `你的心情刚刚转成了「${state.mood}」。`,
        salience: TRIGGER_SALIENCE.mood_shift,
      });
    } else {
      candidates.push({
        trigger: "activity_change",
        situation: "你刚忙完手边的小事，正缓过神来。",
        salience: TRIGGER_SALIENCE.activity_change,
      });
    }
  }

  if (candidates.length === 0) {
    return IDLE_MOMENT;
  }

  return candidates.sort((left, right) => right.salience - left.salience)[0];
}
