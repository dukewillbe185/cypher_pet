"use client";

import { useMemo } from "react";
import { Activity, Gauge, MapPinned, PawPrint, Route, Sparkles } from "lucide-react";

import {
  activityLabel,
  buildIntentSummary,
  goalLabel,
  moodLabel,
  type ActivityTone,
} from "@/components/garden/garden-labels";
import type { GardenPetSnapshot, PetGoal } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

export type AutonomyRosterItem = {
  petId: string;
  name: string;
  ownerHandle: string;
  spritePath?: string;
  mood: string;
  activity: string;
  goalLabel: string;
  reason: string;
  source: "fallback" | "llm" | "state";
  tone: ActivityTone;
  urgency: number;
  urgencyLabel: "needs intervention" | "active thread" | "ambient intent" | "steady";
  targetLabel: string;
  routeLabel: string | null;
  positionLabel: string;
  decidedAt?: string;
  pressureLabel: string | null;
};

type AutonomyRosterProps = {
  pets: GardenPetSnapshot[];
  selectedPetId?: string;
  onSelectPet: (petId: string) => void;
  limit?: number;
};

const DEFAULT_LIMIT = 8;

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/24 bg-cyan-300/[0.08] text-cyan-50",
  conflict: "border-rose-300/28 bg-rose-300/[0.08] text-rose-50",
  rest: "border-violet-300/22 bg-violet-300/[0.08] text-violet-50",
  care: "border-lime-300/24 bg-lime-300/[0.08] text-lime-50",
  explore: "border-amber-300/22 bg-amber-300/[0.08] text-amber-50",
  neutral: "border-white/10 bg-white/[0.045] text-white/72",
};

const urgencyStyles: Record<AutonomyRosterItem["urgencyLabel"], string> = {
  "needs intervention": "border-lime-300/26 bg-lime-300/[0.08] text-lime-50",
  "active thread": "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-50",
  "ambient intent": "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
  steady: "border-white/10 bg-white/[0.04] text-white/52",
};

const toneIcons = {
  social: Sparkles,
  conflict: Gauge,
  rest: Activity,
  care: Gauge,
  explore: MapPinned,
  neutral: PawPrint,
} satisfies Record<ActivityTone, typeof Activity>;

function highestActiveGoal(pet: GardenPetSnapshot) {
  return [...pet.currentGoals]
    .filter((goal) => goal.status === "active" || goal.status === "paused")
    .sort((left, right) => right.priority - left.priority)[0];
}

function pressureSignals(pet: GardenPetSnapshot) {
  const signals = [
    { label: "hunger", value: Math.max(0, pet.state.hunger - 68) },
    { label: "stress", value: Math.max(0, pet.state.stress - 64) },
    { label: "energy", value: Math.max(0, 34 - pet.state.energy) },
    { label: "hygiene", value: Math.max(0, 42 - pet.state.hygiene) },
    { label: "bladder", value: Math.max(0, pet.state.bladder - 72) },
    { label: "social", value: Math.max(0, 36 - pet.state.social) },
  ].filter((signal) => signal.value > 0);

  return signals.sort((left, right) => right.value - left.value);
}

function urgencyLabel(urgency: number): AutonomyRosterItem["urgencyLabel"] {
  if (urgency >= 60) {
    return "needs intervention";
  }

  if (urgency >= 34) {
    return "active thread";
  }

  if (urgency > 0) {
    return "ambient intent";
  }

  return "steady";
}

function targetName(petsById: Map<string, GardenPetSnapshot>, petId?: string) {
  return petId ? petsById.get(petId)?.pet.name : undefined;
}

function objectLabel(objectId?: string) {
  return objectId?.replace(/^object-/, "").replaceAll("-", " ");
}

function targetLabelFor(
  pet: GardenPetSnapshot,
  primaryGoal: PetGoal | undefined,
  petsById: Map<string, GardenPetSnapshot>,
) {
  const decision = pet.state.lastAutonomyDecision;
  const decisionTargetPet = targetName(petsById, decision?.targetPetId);
  if (decisionTargetPet) {
    return `toward ${decisionTargetPet}`;
  }

  const decisionObject = objectLabel(decision?.targetObjectId);
  if (decisionObject) {
    return `toward ${decisionObject}`;
  }

  const goalTargetPet = targetName(petsById, primaryGoal?.targetPetId);
  if (goalTargetPet) {
    return `tracking ${goalTargetPet}`;
  }

  const goalObject = objectLabel(primaryGoal?.targetObjectId);
  if (goalObject) {
    return `tracking ${goalObject}`;
  }

  return `tile ${pet.state.tileX},${pet.state.tileY}`;
}

function routeLabelFor(pet: GardenPetSnapshot, primaryGoal?: PetGoal) {
  if (primaryGoal?.targetZoneId && primaryGoal.targetZoneId !== pet.state.zoneId) {
    return `route to ${primaryGoal.targetZoneId}`;
  }

  if (pet.state.lastKnownZonePreference && pet.state.lastKnownZonePreference !== pet.state.zoneId) {
    return `prefers ${pet.state.lastKnownZonePreference}`;
  }

  return null;
}

export function buildAutonomyRosterItems(
  pets: GardenPetSnapshot[],
  limit = DEFAULT_LIMIT,
): AutonomyRosterItem[] {
  const petsById = new Map(pets.map((pet) => [pet.pet.id, pet]));

  return pets
    .map((pet) => {
      const intent = buildIntentSummary(pet);
      const primaryGoal = highestActiveGoal(pet);
      const signals = pressureSignals(pet);
      const pressure = signals.reduce((sum, signal) => sum + signal.value, 0);
      const goalBoost = primaryGoal ? Math.round(primaryGoal.priority * 0.18) : 0;
      const sourceBoost = pet.state.lastAutonomyDecision?.source === "llm" ? 5 : 0;
      const toneBoost = intent.tone === "conflict" ? 12 : intent.tone === "care" ? 8 : 0;
      const urgency = Math.round(pressure + goalBoost + sourceBoost + toneBoost);
      const tone = pressure >= 34 ? "care" : intent.tone;

      return {
        petId: pet.pet.id,
        name: pet.pet.name,
        ownerHandle: pet.owner.handle,
        spritePath: pet.generation.worldSpritePath,
        mood: moodLabel(pet.state.mood),
        activity: activityLabel(pet.state.activity),
        goalLabel: goalLabel(pet.state.lastAutonomyDecision?.goal ?? primaryGoal?.goalType),
        reason: intent.reason,
        source: intent.source,
        tone,
        urgency,
        urgencyLabel: urgencyLabel(urgency),
        targetLabel: targetLabelFor(pet, primaryGoal, petsById),
        routeLabel: routeLabelFor(pet, primaryGoal),
        positionLabel: `${pet.state.zoneId} · ${pet.state.tileX},${pet.state.tileY}`,
        decidedAt: pet.state.lastAutonomyDecision?.decidedAt ?? pet.state.lastSimulatedAt,
        pressureLabel: signals[0] ? signals.slice(0, 2).map((signal) => signal.label).join(" / ") : null,
      };
    })
    .sort((left, right) => {
      if (right.urgency !== left.urgency) {
        return right.urgency - left.urgency;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, limit);
}

export function AutonomyRoster({
  pets,
  selectedPetId,
  onSelectPet,
  limit = DEFAULT_LIMIT,
}: AutonomyRosterProps) {
  const items = useMemo(() => buildAutonomyRosterItems(pets, limit), [limit, pets]);

  return (
    <section className="space-y-4" data-testid="autonomy-roster">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Autonomy Roster</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Visible life</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
          {items.length} tracked
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white/52">
          No public pets are visible in this zone yet.
        </p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const selected = selectedPetId === item.petId;
            const Icon = toneIcons[item.tone];

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "group w-full rounded-[20px] border p-3 text-left transition-[transform,border-color,background-color,box-shadow]",
                  toneStyles[item.tone],
                  selected
                    ? "scale-[1.01] shadow-[0_0_0_1px_rgba(255,255,255,0.24)]"
                    : "hover:scale-[1.01] hover:border-white/22",
                )}
                data-testid="autonomy-roster-item"
                key={item.petId}
                onClick={() => onSelectPet(item.petId)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-black/24">
                    {item.spritePath ? (
                      <img
                        alt=""
                        className="h-10 w-10 object-contain [image-rendering:pixelated]"
                        src={item.spritePath}
                      />
                    ) : (
                      <PawPrint aria-hidden="true" className="h-5 w-5 opacity-70" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <p className="truncate font-semibold text-white">{item.name}</p>
                      <span className={cn("shrink-0 rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.14em]", urgencyStyles[item.urgencyLabel])}>
                        {item.urgencyLabel}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/48">
                      @{item.ownerHandle} · {item.mood} · {item.activity}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-[16px] border border-black/10 bg-black/18 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-76" />
                    <p className="min-w-0 truncate text-sm font-semibold text-white">{item.goalLabel}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/64">{item.reason}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-black/16 px-2 py-1">
                    <MapPinned aria-hidden="true" className="h-3 w-3" />
                    {item.targetLabel}
                  </span>
                  {item.routeLabel ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-black/16 px-2 py-1">
                      <Route aria-hidden="true" className="h-3 w-3" />
                      {item.routeLabel}
                    </span>
                  ) : null}
                  {item.pressureLabel ? <span>{item.pressureLabel}</span> : null}
                  <span>{item.source}</span>
                  {item.decidedAt ? (
                    <span suppressHydrationWarning>{formatRelativeTime(item.decidedAt)}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
