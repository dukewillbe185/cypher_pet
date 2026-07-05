"use client";

import { useMemo } from "react";
import { AlertTriangle, Compass, HeartPulse, RadioTower, Route, Sparkles } from "lucide-react";

import { activityLabel, buildIntentSummary, type ActivityTone } from "@/components/garden/garden-labels";
import type { GardenEncounterTone, GardenPetSnapshot, GardenSnapshot, GardenZoneId, PetEvent } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

export type WorldDirectorBeatKind = "encounter" | "need" | "intent" | "event";

export type WorldDirectorBeat = {
  id: string;
  kind: WorldDirectorBeatKind;
  zoneId: GardenZoneId;
  zoneName: string;
  title: string;
  summary: string;
  petIds: string[];
  tone: ActivityTone;
  priority: number;
  actionLabel: string;
  isOffPage: boolean;
  timestamp?: string;
  encounterId?: string;
  eventId?: string;
};

type WorldDirectorInput = {
  activeZoneId: GardenZoneId;
  snapshots: GardenSnapshot[];
  limit?: number;
};

type WorldDirectorProps = WorldDirectorInput & {
  selectedEncounterId?: string;
  selectedPetId?: string;
  onSelectBeat: (beat: WorldDirectorBeat) => void;
};

const DEFAULT_LIMIT = 4;

const encounterPriority: Record<GardenEncounterTone, number> = {
  conflict: 48,
  care: 42,
  social: 30,
  explore: 22,
  rest: 12,
};

const eventPriority: Partial<Record<PetEvent["type"], number>> = {
  scuffle: 34,
  chased: 32,
  pooped: 24,
  mood_change: 22,
  bonded: 18,
  social_chat: 18,
  zone_move: 16,
  climbed_tree: 14,
  watched_fish: 12,
  dug: 12,
  owner_action: 10,
};

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/24 bg-cyan-300/[0.08] text-cyan-50",
  conflict: "border-rose-300/28 bg-rose-300/[0.08] text-rose-50",
  rest: "border-violet-300/20 bg-violet-300/[0.07] text-violet-50",
  care: "border-lime-300/24 bg-lime-300/[0.08] text-lime-50",
  explore: "border-amber-300/22 bg-amber-300/[0.08] text-amber-50",
  neutral: "border-white/10 bg-white/[0.045] text-white/70",
};

const kindLabels: Record<WorldDirectorBeatKind, string> = {
  encounter: "live thread",
  need: "care lead",
  intent: "free roam",
  event: "world beat",
};

const kindIcons = {
  encounter: AlertTriangle,
  need: HeartPulse,
  intent: Route,
  event: RadioTower,
} satisfies Record<WorldDirectorBeatKind, typeof AlertTriangle>;

function needSignals(pet: GardenPetSnapshot) {
  const signals = [
    { label: "hunger", value: Math.max(0, pet.state.hunger - 72) },
    { label: "hygiene", value: Math.max(0, 38 - pet.state.hygiene) },
    { label: "stress", value: Math.max(0, pet.state.stress - 70) },
    { label: "energy", value: Math.max(0, 28 - pet.state.energy) },
    { label: "bladder", value: Math.max(0, pet.state.bladder - 78) },
    { label: "social", value: Math.max(0, 32 - pet.state.social) },
  ].filter((signal) => signal.value > 0);

  return signals.sort((left, right) => right.value - left.value);
}

function eventTone(event: PetEvent): ActivityTone {
  if (event.type === "scuffle" || event.type === "chased") {
    return "conflict";
  }

  if (event.type === "social_chat" || event.type === "bonded") {
    return "social";
  }

  if (event.type === "pooped" || event.type === "groomed") {
    return "care";
  }

  if (event.type === "slept") {
    return "rest";
  }

  if (event.type === "zone_move" || event.type === "climbed_tree" || event.type === "watched_fish" || event.type === "dug") {
    return "explore";
  }

  return "neutral";
}

function eventTitle(event: PetEvent, petsById: Map<string, GardenPetSnapshot>) {
  const pet = petsById.get(event.petId);
  const relatedPet = event.relatedPetId ? petsById.get(event.relatedPetId) : undefined;

  if (pet && relatedPet) {
    return `${pet.pet.name} x ${relatedPet.pet.name}`;
  }

  return pet?.pet.name ?? event.type.replaceAll("_", " ");
}

function uniquePetIds(ids: Array<string | undefined>) {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))];
}

export function buildWorldDirectorBeats({
  activeZoneId,
  snapshots,
  limit = DEFAULT_LIMIT,
}: WorldDirectorInput): WorldDirectorBeat[] {
  const petsById = new Map(snapshots.flatMap((snapshot) => snapshot.pets.map((pet) => [pet.pet.id, pet] as const)));
  const representedEventIds = new Set(
    snapshots.flatMap((snapshot) => snapshot.encounters.flatMap((encounter) => encounter.relatedEventIds)),
  );
  const coveredPetIds = new Set<string>();
  const beats: WorldDirectorBeat[] = [];

  for (const snapshot of snapshots) {
    const isOffPage = snapshot.zone.id !== activeZoneId;

    for (const encounter of snapshot.encounters) {
      if (encounter.status === "resolved" || encounter.status === "expired") {
        continue;
      }

      encounter.participantPetIds.forEach((petId) => coveredPetIds.add(petId));
      beats.push({
        id: `encounter:${encounter.id}`,
        kind: "encounter",
        zoneId: snapshot.zone.id,
        zoneName: snapshot.zone.name,
        title: encounter.title,
        summary: encounter.summary,
        petIds: encounter.participantPetIds,
        tone: encounter.tone,
        priority: 150 + encounterPriority[encounter.tone] + (isOffPage ? 16 : 0),
        actionLabel: isOffPage ? "Go to zone" : "Inspect",
        isOffPage,
        timestamp: encounter.updatedAt,
        encounterId: encounter.id,
      });
    }
  }

  for (const snapshot of snapshots) {
    const isOffPage = snapshot.zone.id !== activeZoneId;

    for (const pet of snapshot.pets) {
      if (coveredPetIds.has(pet.pet.id)) {
        continue;
      }

      const signals = needSignals(pet);
      const pressure = signals.reduce((sum, signal) => sum + signal.value, 0);
      if (pressure > 0) {
        beats.push({
          id: `need:${pet.pet.id}`,
          kind: "need",
          zoneId: snapshot.zone.id,
          zoneName: snapshot.zone.name,
          title: `${pet.pet.name} needs attention`,
          summary: `${signals
            .slice(0, 2)
            .map((signal) => signal.label)
            .join(" / ")} pressure is shaping the next move.`,
          petIds: [pet.pet.id],
          tone: "care",
          priority: 110 + pressure + (isOffPage ? 12 : 0),
          actionLabel: isOffPage ? "Go to zone" : "Track",
          isOffPage,
          timestamp: pet.state.lastSimulatedAt,
        });
        coveredPetIds.add(pet.pet.id);
        continue;
      }

      if (!pet.state.lastAutonomyDecision) {
        continue;
      }

      const intent = buildIntentSummary(pet);
      beats.push({
        id: `intent:${pet.pet.id}`,
        kind: "intent",
        zoneId: snapshot.zone.id,
        zoneName: snapshot.zone.name,
        title: `${pet.pet.name} is ${activityLabel(pet.state.lastAutonomyDecision.chosenActivity)}`,
        summary: intent.reason,
        petIds: [pet.pet.id],
        tone: intent.tone,
        priority: 58 + (pet.state.lastAutonomyDecision.source === "llm" ? 8 : 0) + (isOffPage ? 8 : 0),
        actionLabel: isOffPage ? "Go to zone" : "Follow",
        isOffPage,
        timestamp: pet.state.lastAutonomyDecision.decidedAt,
      });
    }

    for (const event of snapshot.recentEvents) {
      if (representedEventIds.has(event.id)) {
        continue;
      }

      const petIds = uniquePetIds([event.petId, event.relatedPetId]);
      if (petIds.some((petId) => coveredPetIds.has(petId))) {
        continue;
      }

      const tone = eventTone(event);
      beats.push({
        id: `event:${event.id}`,
        kind: "event",
        zoneId: snapshot.zone.id,
        zoneName: snapshot.zone.name,
        title: eventTitle(event, petsById),
        summary: event.body,
        petIds,
        tone,
        priority: 72 + (eventPriority[event.type] ?? 7) + (isOffPage ? 10 : 0),
        actionLabel: isOffPage ? "Go to zone" : "Locate",
        isOffPage,
        timestamp: event.createdAt,
        eventId: event.id,
      });
    }
  }

  return beats
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return (right.timestamp ?? "").localeCompare(left.timestamp ?? "");
    })
    .slice(0, limit);
}

export function WorldDirector({
  activeZoneId,
  limit,
  onSelectBeat,
  selectedEncounterId,
  selectedPetId,
  snapshots,
}: WorldDirectorProps) {
  const beats = useMemo(
    () => buildWorldDirectorBeats({ activeZoneId, snapshots, limit }),
    [activeZoneId, limit, snapshots],
  );

  return (
    <section className="space-y-3" data-testid="world-director">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass aria-hidden="true" className="h-4 w-4 text-amber-100/70" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Live Leads</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {beats.length} followable
        </span>
      </div>

      {beats.length === 0 ? (
        <p className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48">
          The garden is in a quiet roam state.
        </p>
      ) : (
        <div className="grid gap-2 lg:grid-cols-2 2xl:grid-cols-4">
          {beats.map((beat) => {
            const Icon = kindIcons[beat.kind];
            const selected =
              (beat.encounterId && beat.encounterId === selectedEncounterId) ||
              beat.petIds.some((petId) => petId === selectedPetId);

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "min-w-0 rounded-[20px] border p-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5",
                  toneStyles[beat.tone],
                  selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.22)]" : "",
                )}
                data-beat-id={beat.id}
                data-testid="world-director-beat"
                key={beat.id}
                onClick={() => onSelectBeat(beat)}
                type="button"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                        {kindLabels[beat.kind]}
                      </span>
                      {beat.isOffPage ? (
                        <span className="rounded-full border border-cyan-300/14 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50/70">
                          away
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 block truncate text-sm font-semibold text-white">{beat.zoneName}</span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/24">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </span>
                <span className="mt-3 block line-clamp-2 min-h-10 break-words text-sm leading-5 text-white/76">
                  {beat.title}
                </span>
                <span className="mt-2 line-clamp-2 block break-words text-xs leading-5 text-white/55">
                  {beat.summary}
                </span>
                <span className="mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-white/46">
                  <span>{beat.timestamp ? formatRelativeTime(beat.timestamp) : "live"}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-white/56">
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    {beat.actionLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
