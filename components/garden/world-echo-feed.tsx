"use client";

import { useMemo } from "react";
import { AlertTriangle, Bell, MapPinned, MessageCircle, RadioTower } from "lucide-react";

import type { ActivityTone } from "@/components/garden/garden-labels";
import type { GardenEncounterTone, GardenSnapshot, GardenZoneId, PetEvent } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

export type WorldEchoKind = "encounter" | "event";

export type WorldEchoItem = {
  id: string;
  kind: WorldEchoKind;
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

type WorldEchoInput = {
  snapshots: GardenSnapshot[];
  activeZoneId: GardenZoneId;
  limit?: number;
};

type WorldEchoFeedProps = WorldEchoInput & {
  selectedZoneId?: GardenZoneId;
  onSelectEcho: (item: WorldEchoItem) => void;
};

const DEFAULT_LIMIT = 6;

const encounterPriority: Record<GardenEncounterTone, number> = {
  conflict: 42,
  care: 34,
  social: 26,
  explore: 18,
  rest: 10,
};

const eventPriority: Partial<Record<PetEvent["type"], number>> = {
  scuffle: 36,
  chased: 34,
  mood_change: 24,
  pooped: 22,
  bonded: 20,
  social_chat: 20,
  zone_move: 19,
  owner_action: 18,
  climbed_tree: 16,
  dug: 14,
  watched_fish: 12,
  inner_voice: 10,
  groomed: 8,
  slept: 6,
};

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/18 bg-cyan-300/[0.07] text-cyan-50",
  conflict: "border-rose-300/24 bg-rose-300/[0.08] text-rose-50",
  rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
  care: "border-lime-300/18 bg-lime-300/[0.07] text-lime-50",
  explore: "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
  neutral: "border-white/8 bg-white/[0.04] text-white/70",
};

function eventTone(event: PetEvent): ActivityTone {
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

  if (
    event.type === "owner_action" ||
    event.type === "zone_move" ||
    event.type === "watched_fish" ||
    event.type === "climbed_tree" ||
    event.type === "dug"
  ) {
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

export function buildWorldEchoItems({
  snapshots,
  activeZoneId,
  limit = DEFAULT_LIMIT,
}: WorldEchoInput): WorldEchoItem[] {
  const representedEventIds = new Set(
    snapshots.flatMap((snapshot) => snapshot.encounters.flatMap((encounter) => encounter.relatedEventIds)),
  );
  const items: WorldEchoItem[] = [];

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
        tone: encounter.tone,
        priority: 100 + encounterPriority[encounter.tone] + (isOffPage ? 18 : 0),
        actionLabel: isOffPage ? "Go to zone" : "Inspect",
        isOffPage,
        timestamp: encounter.updatedAt,
        encounterId: encounter.id,
      });
    }

    for (const event of snapshot.recentEvents) {
      if (representedEventIds.has(event.id)) {
        continue;
      }

      items.push({
        id: `event:${event.id}`,
        kind: "event",
        zoneId: snapshot.zone.id,
        zoneName: snapshot.zone.name,
        title: eventTitle(event),
        summary: event.body,
        petIds: uniquePetIds([event.petId, event.relatedPetId]),
        tone: eventTone(event),
        priority: 50 + (eventPriority[event.type] ?? 7) + (isOffPage ? 12 : 0),
        actionLabel: isOffPage ? "Go to zone" : "Locate",
        isOffPage,
        timestamp: event.createdAt,
        eventId: event.id,
      });
    }
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

export function WorldEchoFeed({
  activeZoneId,
  limit = DEFAULT_LIMIT,
  onSelectEcho,
  selectedZoneId,
  snapshots,
}: WorldEchoFeedProps) {
  const items = useMemo(
    () => buildWorldEchoItems({ activeZoneId, snapshots, limit }),
    [activeZoneId, limit, snapshots],
  );

  return (
    <section className="space-y-3" data-testid="world-echo-feed">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower aria-hidden="true" className="h-4 w-4 text-cyan-200/70" />
            <h2 className="text-xl font-semibold text-white">World Echo</h2>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">off-page incidents</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {items.filter((item) => item.isOffPage).length} away
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48">
          The wider garden is quiet for now.
        </p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const selected = selectedZoneId === item.zoneId;
            const Icon = item.kind === "encounter" ? AlertTriangle : item.tone === "social" ? MessageCircle : Bell;

            return (
              <button
                className={cn(
                  "w-full rounded-[20px] border p-3 text-left transition-[transform,border-color,background-color,box-shadow] hover:scale-[1.01]",
                  toneStyles[item.tone],
                  selected ? "shadow-[0_0_0_1px_rgba(255,255,255,0.24)]" : "",
                )}
                data-echo-id={item.id}
                data-testid="world-echo-item"
                key={item.id}
                onClick={() => onSelectEcho(item)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/24">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                        {item.zoneName}
                      </span>
                      {item.isOffPage ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/14 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50/70">
                          <MapPinned aria-hidden="true" className="h-3 w-3" />
                          off-page
                        </span>
                      ) : null}
                      {item.timestamp ? (
                        <span className="text-[10px] uppercase tracking-[0.14em] text-white/35" suppressHydrationWarning>
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
                    <span className="mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/52">
                      {item.actionLabel}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
