import type { OwnerAction, PetGrowthStage, PetGrowthSummary, PetState } from "@/lib/types";

export const DEFAULT_BOND = 24;
export const SYNCED_STAGE_XP = 120;
export const AWAKENED_STAGE_XP = 480;
export const DAILY_REUNION_XP = 30;
export const DAILY_REUNION_BOND = 6;

const STAGE_LABELS: Record<PetGrowthStage, string> = {
  proto: "数据幼体",
  synced: "同步体",
  awakened: "觉醒体",
};

const OWNER_ACTION_GROWTH: Record<OwnerAction, { xp: number; bond: number }> = {
  feed: { xp: 8, bond: 3 },
  pet: { xp: 5, bond: 4 },
  throw_toy: { xp: 10, bond: 5 },
  clean_poop: { xp: 6, bond: 2 },
  call: { xp: 3, bond: 2 },
  scold: { xp: 0, bond: -4 },
  gift: { xp: 12, bond: 6 },
  photo: { xp: 4, bond: 2 },
  rename_spot: { xp: 6, bond: 3 },
};

function clampBond(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function ensureGrowthState(state: PetState) {
  if (typeof state.bond !== "number" || Number.isNaN(state.bond)) {
    state.bond = DEFAULT_BOND;
  }

  if (typeof state.growthXp !== "number" || Number.isNaN(state.growthXp)) {
    state.growthXp = 0;
  }

  return state as PetState & { bond: number; growthXp: number };
}

export function growthStageForXp(xp: number): PetGrowthStage {
  if (xp >= AWAKENED_STAGE_XP) {
    return "awakened";
  }

  if (xp >= SYNCED_STAGE_XP) {
    return "synced";
  }

  return "proto";
}

export function growthStageLabel(stage: PetGrowthStage) {
  return STAGE_LABELS[stage];
}

export function growthSummary(state: PetState): PetGrowthSummary {
  const vitals = ensureGrowthState(state);
  const stage = growthStageForXp(vitals.growthXp);
  const stageProgress =
    stage === "awakened"
      ? 1
      : stage === "synced"
        ? (vitals.growthXp - SYNCED_STAGE_XP) / (AWAKENED_STAGE_XP - SYNCED_STAGE_XP)
        : vitals.growthXp / SYNCED_STAGE_XP;

  return {
    stage,
    stageLabel: growthStageLabel(stage),
    bond: Math.round(vitals.bond),
    xp: Math.round(vitals.growthXp),
    stageProgress: Math.max(0, Math.min(1, stageProgress)),
  };
}

export interface GrowthAward {
  xp: number;
  bond: number;
}

export function ownerActionGrowthAward(action: OwnerAction): GrowthAward {
  return OWNER_ACTION_GROWTH[action];
}

/** Applies a growth award and reports whether the pet crossed into a new stage. */
export function applyGrowthAward(state: PetState, award: GrowthAward) {
  const vitals = ensureGrowthState(state);
  const previousStage = growthStageForXp(vitals.growthXp);

  vitals.growthXp = Math.max(0, vitals.growthXp + Math.max(0, award.xp));
  vitals.bond = clampBond(vitals.bond + award.bond);

  const nextStage = growthStageForXp(vitals.growthXp);

  return {
    stageChanged: nextStage !== previousStage,
    stage: nextStage,
    stageLabel: growthStageLabel(nextStage),
  };
}

/** Bond drifts down very slowly while the owner stays away. */
export function applyBondDecay(state: PetState, elapsedMs: number) {
  const vitals = ensureGrowthState(state);
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  vitals.bond = clampBond(vitals.bond - elapsedHours * 0.35);
}

export function utcDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
