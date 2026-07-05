"use client";

import { useMemo } from "react";
import { Activity, AlertTriangle, Eye, HeartHandshake, MapPin, Radio, Sparkles, Utensils } from "lucide-react";

import { activityLabel, activityTone, buildIntentSummary, type ActivityTone } from "@/components/garden/garden-labels";
import type { GardenEncounter, GardenEncounterTone, GardenPetSnapshot, PetEvent } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

export type WorldPulseKind = "encounter" | "event" | "intent";

export type WorldPulseItem = {
  id: string;
  kind: WorldPulseKind;
  tone: ActivityTone;
  priority: number;
  title: string;
  summary: string;
  actionLabel: string;
  petIds: string[];
  encounterId?: string;
  eventId?: string;
  timestamp?: string;
};

type WorldPulseInput = {
  encounters: GardenEncounter[];
  events: PetEvent[];
  pets: GardenPetSnapshot[];
  limit?: number;
};

type WorldPulseProps = WorldPulseInput & {
  selectedEncounterId?: string;
  selectedPetId?: string;
  onSelectEncounter: (encounterId: string, participantPetId?: string) => void;
  onSelectPet: (petId: string) => void;
};

const DEFAULT_LIMIT = 5;

const encounterTonePriority: Record<GardenEncounterTone, number> = {
  conflict: 34,
  care: 28,
  social: 20,
  explore: 14,
  rest: 8,
};

const eventTypePriority: Partial<Record<PetEvent["type"], number>> = {
  scuffle: 32,
  chased: 30,
  mood_change: 20,
  pooped: 18,
  bonded: 18,
  social_chat: 16,
  zone_move: 15,
  climbed_tree: 14,
  dug: 12,
  watched_fish: 10,
  inner_voice: 8,
  groomed: 6,
  slept: 4,
};

const stagePriority: Record<GardenEncounter["stage"], number> = {
  spark: 18,
  unfolding: 12,
  cooldown: 3,
};

const statusPriority: Record<NonNullable<GardenEncounter["status"]>, number> = {
  active: 10,
  resolving: 4,
  resolved: -40,
  expired: -60,
};

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/18 bg-cyan-300/[0.07] text-cyan-50",
  conflict: "border-rose-300/24 bg-rose-300/[0.08] text-rose-50",
  rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
  care: "border-lime-300/18 bg-lime-300/[0.07] text-lime-50",
  explore: "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
  neutral: "border-white/8 bg-white/[0.04] text-white/70",
};

const toneIcons = {
  social: HeartHandshake,
  conflict: AlertTriangle,
  rest: Eye,
  care: Utensils,
  explore: MapPin,
  neutral: Activity,
} satisfies Record<ActivityTone, typeof Activity>;

function eventTone(event: PetEvent, pet?: GardenPetSnapshot): ActivityTone {
  if (event.type === "scuffle" || event.type === "chased") {
    return "conflict";
  }

  if (event.type === "social_chat" || event.type === "bonded") {
    return "social";
  }

  if (event.type === "slept") {
    return "rest";
  }

  if (event.type === "pooped" || event.type === "groomed") {
    return "care";
  }

  if (event.type === "zone_move" || event.type === "climbed_tree" || event.type === "watched_fish" || event.type === "dug") {
    return "explore";
  }

  return pet ? activityTone(pet.state.activity) : "neutral";
}

function needPressure(pet: GardenPetSnapshot) {
  const hunger = pet.state.hunger >= 72 ? pet.state.hunger - 60 : 0;
  const stress = pet.state.stress >= 68 ? pet.state.stress - 58 : 0;
  const hygiene = pet.state.hygiene <= 34 ? 38 - pet.state.hygiene : 0;
  const energy = pet.state.energy <= 30 ? 34 - pet.state.energy : 0;

  return Math.max(hunger, stress, hygiene, energy, 0);
}

function participantNames(petsById: Map<string, GardenPetSnapshot>, petIds: string[]) {
  return petIds
    .map((petId) => petsById.get(petId)?.pet.name)
    .filter((name): name is string => Boolean(name));
}

function eventTitle(event: PetEvent, petsById: Map<string, GardenPetSnapshot>) {
  const names = participantNames(
    petsById,
    event.relatedPetId ? [event.petId, event.relatedPetId] : [event.petId],
  );

  if (names.length > 1) {
    return `${names[0]} x ${names[1]}`;
  }

  return names[0] ?? "Garden signal";
}

function uniquePetIds(petIds: Array<string | undefined>) {
  return [...new Set(petIds.filter((petId): petId is string => Boolean(petId)))];
}

export function buildWorldPulseItems({
  encounters,
  events,
  pets,
  limit = DEFAULT_LIMIT,
}: WorldPulseInput): WorldPulseItem[] {
  const petsById = new Map(pets.map((pet) => [pet.pet.id, pet]));
  const representedEventIds = new Set(encounters.flatMap((encounter) => encounter.relatedEventIds));
  const activeEncounterPetIds = new Set(
    encounters
      .filter((encounter) => encounter.status !== "resolved" && encounter.status !== "expired")
      .flatMap((encounter) => encounter.participantPetIds),
  );
  const items: WorldPulseItem[] = [];

  for (const encounter of encounters) {
    if (encounter.status === "resolved" || encounter.status === "expired") {
      continue;
    }

    items.push({
      id: `encounter:${encounter.id}`,
      kind: "encounter",
      tone: encounter.tone,
      priority:
        100 +
        encounterTonePriority[encounter.tone] +
        stagePriority[encounter.stage] +
        statusPriority[encounter.status ?? "active"],
      title: encounter.title,
      summary: encounter.summary,
      actionLabel: "Inspect",
      petIds: encounter.participantPetIds,
      encounterId: encounter.id,
      timestamp: encounter.updatedAt,
    });
  }

  for (const event of events) {
    if (representedEventIds.has(event.id)) {
      continue;
    }

    const pet = petsById.get(event.petId);
    const tone = eventTone(event, pet);
    const petIds = uniquePetIds([event.petId, event.relatedPetId]);

    items.push({
      id: `event:${event.id}`,
      kind: "event",
      tone,
      priority: 60 + (eventTypePriority[event.type] ?? 7),
      title: eventTitle(event, petsById),
      summary: event.body,
      actionLabel: "Locate",
      petIds,
      eventId: event.id,
      timestamp: event.createdAt,
    });
  }

  for (const pet of pets) {
    const pressure = needPressure(pet);
    if (!pet.state.lastAutonomyDecision && pressure <= 0) {
      continue;
    }

    if (activeEncounterPetIds.has(pet.pet.id) && pressure <= 0) {
      continue;
    }

    const intent = buildIntentSummary(pet);
    const tone = pressure > 0 ? "care" : intent.tone;

    items.push({
      id: `intent:${pet.pet.id}`,
      kind: "intent",
      tone,
      priority: 40 + pressure + (intent.source === "llm" ? 8 : 0),
      title: `${pet.pet.name} is ${activityLabel(pet.state.lastAutonomyDecision?.chosenActivity ?? pet.state.activity)}`,
      summary: intent.reason,
      actionLabel: "Track",
      petIds: [pet.pet.id],
      timestamp: pet.state.lastAutonomyDecision?.decidedAt ?? pet.state.lastSimulatedAt,
    });
  }

  return items
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return (right.timestamp ?? "").localeCompare(left.timestamp ?? "");
    })
    .slice(0, limit);
}

function pulseLabel(kind: WorldPulseKind) {
  switch (kind) {
    case "encounter":
      return "Encounter";
    case "event":
      return "Event";
    case "intent":
      return "Autonomy";
  }
}

export function WorldPulse({
  encounters,
  events,
  pets,
  selectedEncounterId,
  selectedPetId,
  onSelectEncounter,
  onSelectPet,
  limit,
}: WorldPulseProps) {
  const items = useMemo(
    () => buildWorldPulseItems({ encounters, events, pets, limit }),
    [encounters, events, limit, pets],
  );
  const petsById = useMemo(() => new Map(pets.map((pet) => [pet.pet.id, pet])), [pets]);

  function selectItem(item: WorldPulseItem) {
    if (item.encounterId) {
      onSelectEncounter(item.encounterId, item.petIds[0]);
      return;
    }

    if (item.petIds[0]) {
      onSelectPet(item.petIds[0]);
    }
  }

  return (
    <section className="space-y-3" data-testid="world-pulse">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio aria-hidden="true" className="h-4 w-4 text-cyan-200/70" />
            <h2 className="text-xl font-semibold text-white">World Pulse</h2>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">autonomy, incidents, encounters</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48">
          当前分区没有强信号。宠物仍会继续自主行动，下一次刷新会更新这里。
        </p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const Icon = toneIcons[item.tone];
            const selected =
              (item.encounterId && item.encounterId === selectedEncounterId) ||
              item.petIds.some((petId) => petId === selectedPetId);

            return (
              <article
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "rounded-[22px] border p-3 transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5",
                  toneStyles[item.tone],
                  selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" : "",
                )}
                data-encounter-id={item.encounterId}
                data-kind={item.kind}
                data-testid="world-pulse-item"
                key={item.id}
              >
                <button
                  className="grid w-full grid-cols-[auto,minmax(0,1fr)_auto] items-start gap-3 text-left"
                  onClick={() => selectItem(item)}
                  type="button"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
                        {pulseLabel(item.kind)}
                      </span>
                      {item.timestamp ? (
                        <span
                          className="text-[10px] uppercase tracking-[0.16em] text-white/35"
                          suppressHydrationWarning
                        >
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 block break-words text-sm font-semibold leading-5 text-white">
                      {item.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block break-words text-xs leading-5 text-white/62">
                      {item.summary}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/56">
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    {item.actionLabel}
                  </span>
                </button>

                {item.petIds.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2 pl-[3.25rem]">
                    {item.petIds.map((petId) => {
                      const pet = petsById.get(petId);
                      if (!pet) {
                        return null;
                      }

                      return (
                        <button
                          aria-label={`Select ${pet.pet.name}`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 py-1 pl-1 pr-3 text-xs text-white/72 transition-colors hover:border-cyan-300/30 hover:text-white"
                          key={petId}
                          onClick={() => onSelectPet(petId)}
                          type="button"
                        >
                          <img
                            alt={pet.pet.name}
                            className="h-7 w-7 rounded-full bg-black/30 object-contain p-0.5 [image-rendering:pixelated]"
                            src={pet.generation.worldSpritePath}
                          />
                          {pet.pet.name}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
