"use client";

import { useMemo } from "react";
import { AlertTriangle, Footprints, MapPinned, MessageCircle, Radio, Sparkles } from "lucide-react";

import type { ActivityTone } from "@/components/garden/garden-labels";
import type { GardenEncounterTone, GardenPetSnapshot, GardenSnapshot, GardenZoneId, PetEvent } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

export type WorldActivityTapeKind = "encounter" | "event";

export type WorldActivityTapeItem = {
  id: string;
  kind: WorldActivityTapeKind;
  zoneId: GardenZoneId;
  zoneName: string;
  title: string;
  summary: string;
  petIds: string[];
  petNames: string[];
  tone: ActivityTone;
  actionLabel: string;
  isOffPage: boolean;
  timestamp: string;
  encounterId?: string;
  eventId?: string;
};

type WorldActivityTapeInput = {
  activeZoneId: GardenZoneId;
  snapshots: GardenSnapshot[];
  limit?: number;
};

type WorldActivityTapeProps = WorldActivityTapeInput & {
  selectedEncounterId?: string;
  selectedPetId?: string;
  onSelectItem: (item: WorldActivityTapeItem) => void;
};

const DEFAULT_LIMIT = 10;

const encounterToneOrder: Record<GardenEncounterTone, number> = {
  conflict: 5,
  care: 4,
  social: 3,
  explore: 2,
  rest: 1,
};

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/22 bg-cyan-300/[0.08] text-cyan-50",
  conflict: "border-rose-300/26 bg-rose-300/[0.08] text-rose-50",
  rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
  care: "border-lime-300/22 bg-lime-300/[0.08] text-lime-50",
  explore: "border-amber-300/22 bg-amber-300/[0.08] text-amber-50",
  neutral: "border-white/10 bg-white/[0.045] text-white/70",
};

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

function eventTitle(event: PetEvent) {
  return event.type.replaceAll("_", " ");
}

function uniquePetIds(ids: Array<string | undefined>) {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))];
}

function petNamesFor(petsById: Map<string, GardenPetSnapshot>, petIds: string[]) {
  return petIds
    .map((petId) => petsById.get(petId)?.pet.name)
    .filter((name): name is string => Boolean(name));
}

export function buildWorldActivityTapeItems({
  activeZoneId,
  snapshots,
  limit = DEFAULT_LIMIT,
}: WorldActivityTapeInput): WorldActivityTapeItem[] {
  const petsById = new Map(snapshots.flatMap((snapshot) => snapshot.pets.map((pet) => [pet.pet.id, pet] as const)));
  const representedEventIds = new Set(
    snapshots.flatMap((snapshot) => snapshot.encounters.flatMap((encounter) => encounter.relatedEventIds)),
  );
  const items: Array<WorldActivityTapeItem & { priority: number }> = [];

  for (const snapshot of snapshots) {
    const isOffPage = snapshot.zone.id !== activeZoneId;

    for (const encounter of snapshot.encounters) {
      if (encounter.status === "resolved" || encounter.status === "expired") {
        continue;
      }

      items.push({
        id: `encounter:${encounter.id}`,
        kind: "encounter",
        zoneId: snapshot.zone.id,
        zoneName: snapshot.zone.name,
        title: encounter.title,
        summary: encounter.summary,
        petIds: encounter.participantPetIds,
        petNames: petNamesFor(petsById, encounter.participantPetIds),
        tone: encounter.tone,
        actionLabel: isOffPage ? "Go" : "Inspect",
        isOffPage,
        timestamp: encounter.updatedAt,
        encounterId: encounter.id,
        priority: 100 + encounterToneOrder[encounter.tone],
      });
    }

    for (const event of snapshot.recentEvents) {
      if (representedEventIds.has(event.id)) {
        continue;
      }

      const petIds = uniquePetIds([event.petId, event.relatedPetId]);

      items.push({
        id: `event:${event.id}`,
        kind: "event",
        zoneId: snapshot.zone.id,
        zoneName: snapshot.zone.name,
        title: eventTitle(event),
        summary: event.body,
        petIds,
        petNames: petNamesFor(petsById, petIds),
        tone: eventTone(event),
        actionLabel: isOffPage ? "Go" : "Track",
        isOffPage,
        timestamp: event.createdAt,
        eventId: event.id,
        priority: 50,
      });
    }
  }

  return items
    .sort((left, right) => {
      const timestampOrder = right.timestamp.localeCompare(left.timestamp);
      if (timestampOrder !== 0) {
        return timestampOrder;
      }

      return right.priority - left.priority;
    })
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      zoneId: item.zoneId,
      zoneName: item.zoneName,
      title: item.title,
      summary: item.summary,
      petIds: item.petIds,
      petNames: item.petNames,
      tone: item.tone,
      actionLabel: item.actionLabel,
      isOffPage: item.isOffPage,
      timestamp: item.timestamp,
      encounterId: item.encounterId,
      eventId: item.eventId,
    }));
}

export function WorldActivityTape({
  activeZoneId,
  limit,
  onSelectItem,
  selectedEncounterId,
  selectedPetId,
  snapshots,
}: WorldActivityTapeProps) {
  const items = useMemo(
    () => buildWorldActivityTapeItems({ activeZoneId, snapshots, limit }),
    [activeZoneId, limit, snapshots],
  );

  return (
    <section className="space-y-3" data-testid="world-activity-tape">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio aria-hidden="true" className="h-4 w-4 text-cyan-100/70" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Activity Tape</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {items.length} live beats
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48">
          No fresh world activity yet.
        </p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => {
            const selected =
              (item.encounterId && item.encounterId === selectedEncounterId) ||
              item.petIds.some((petId) => petId === selectedPetId);
            const Icon =
              item.kind === "encounter" ? AlertTriangle : item.tone === "social" ? MessageCircle : Footprints;

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "min-h-[10rem] w-[18rem] shrink-0 rounded-[20px] border p-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5",
                  toneStyles[item.tone],
                  selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.22)]" : "",
                )}
                data-activity-id={item.id}
                data-testid="world-activity-tape-item"
                key={item.id}
                onClick={() => onSelectItem(item)}
                type="button"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                        {item.zoneName}
                      </span>
                      {item.isOffPage ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/14 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50/70">
                          <MapPinned aria-hidden="true" className="h-3 w-3" />
                          away
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 block text-[10px] uppercase tracking-[0.14em] text-white/35" suppressHydrationWarning>
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/24">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </span>

                <span className="mt-3 block line-clamp-2 min-h-10 break-words text-sm font-semibold leading-5 text-white">
                  {item.title}
                </span>
                <span className="mt-1 line-clamp-2 block break-words text-xs leading-5 text-white/60">
                  {item.summary}
                </span>
                <span className="mt-3 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-xs text-white/50">
                    {item.petNames.length > 0 ? item.petNames.join(" x ") : "Garden signal"}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/56">
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    {item.actionLabel}
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
