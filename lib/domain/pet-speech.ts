import type { AppStore, OwnerAction } from "@/lib/types";

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
 * The "slice" pet: whichever un-frozen pet is most entangled in the garden's
 * social web (relationship models + relationships + recent shared history), so
 * the scarce real-speech budget lands where the most drama can happen. Falls
 * back to the lexicographically-first pet when nobody has any history yet.
 */
export function pickSliceFocusPetId(store: AppStore): string | null {
  const scores = new Map<string, number>();
  const bump = (petId: string | undefined, amount: number) => {
    if (!petId) {
      return;
    }
    scores.set(petId, (scores.get(petId) ?? 0) + amount);
  };

  for (const model of store.pairRelationshipModels ?? []) {
    bump(model.petAId, 3);
    bump(model.petBId, 3);
  }
  for (const rel of store.petRelationships ?? []) {
    bump(rel.petAId, 2);
    bump(rel.petBId, 2);
  }
  for (const event of store.gardenLedgerEvents ?? []) {
    for (const participant of event.participants) {
      bump(participant, 1);
    }
  }

  let bestId: string | null = null;
  let bestScore = -1;

  for (const pet of store.pets) {
    if (pet.isFrozen) {
      continue;
    }

    const score = scores.get(pet.id) ?? 0;
    if (score > bestScore || (score === bestScore && bestId !== null && pet.id < bestId)) {
      bestScore = score;
      bestId = pet.id;
    }
  }

  return bestId;
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
