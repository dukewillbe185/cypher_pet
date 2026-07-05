"use client";

import { AlertTriangle, Map, PawPrint, RadioTower, Route } from "lucide-react";

import { buildWorldTransitionMarkers } from "@/components/garden/world-transition-markers";
import type { GardenEncounterTone, GardenSnapshot, GardenZoneId } from "@/lib/types";
import { cn } from "@/lib/utils";

export type WorldZoneRadarTone = GardenEncounterTone | "event" | "quiet";

export type WorldZoneRadarItem = {
  zoneId: GardenZoneId;
  zoneName: string;
  active: boolean;
  tone: WorldZoneRadarTone;
  petCount: number;
  encounterCount: number;
  eventCount: number;
  markerCount: number;
  arrivalCount: number;
  topSignal: string;
  summary: string;
};

type WorldMapRadarProps = {
  activeZoneId: GardenZoneId;
  disabled?: boolean;
  snapshots: GardenSnapshot[];
  onSelectZone: (zoneId: GardenZoneId) => void;
};

const toneStyles: Record<WorldZoneRadarTone, string> = {
  conflict: "border-rose-300/35 bg-rose-300/[0.09] text-rose-50",
  social: "border-cyan-300/26 bg-cyan-300/[0.08] text-cyan-50",
  care: "border-lime-300/24 bg-lime-300/[0.08] text-lime-50",
  explore: "border-amber-300/24 bg-amber-300/[0.08] text-amber-50",
  rest: "border-violet-300/22 bg-violet-300/[0.08] text-violet-50",
  event: "border-sky-300/22 bg-sky-300/[0.07] text-sky-50",
  quiet: "border-white/10 bg-white/[0.035] text-white/66",
};

const toneIcons = {
  conflict: AlertTriangle,
  social: RadioTower,
  care: PawPrint,
  explore: Route,
  rest: PawPrint,
  event: RadioTower,
  quiet: Map,
} satisfies Record<WorldZoneRadarTone, typeof Map>;

function radarTone(snapshot: GardenSnapshot, arrivalCount: number): WorldZoneRadarTone {
  const activeEncounter = snapshot.encounters.find(
    (encounter) => encounter.status !== "resolved" && encounter.status !== "expired",
  );

  if (activeEncounter) {
    return activeEncounter.tone;
  }

  if (arrivalCount > 0) {
    return "explore";
  }

  return snapshot.recentEvents.length > 0 ? "event" : "quiet";
}

function topSignal(snapshot: GardenSnapshot) {
  const activeEncounter = snapshot.encounters.find(
    (encounter) => encounter.status !== "resolved" && encounter.status !== "expired",
  );

  if (activeEncounter) {
    return {
      title: activeEncounter.title,
      summary: activeEncounter.summary,
    };
  }

  const recentEvent = snapshot.recentEvents[0];
  if (recentEvent) {
    return {
      title: recentEvent.body,
      summary: recentEvent.type.replaceAll("_", " "),
    };
  }

  return {
    title: "Quiet patrol",
    summary: "No major visible signal.",
  };
}

export function buildWorldZoneRadarItems(
  snapshots: GardenSnapshot[],
  activeZoneId: GardenZoneId,
): WorldZoneRadarItem[] {
  return snapshots.map((snapshot) => {
    const signal = topSignal(snapshot);
    const arrivalCount = buildWorldTransitionMarkers(snapshot).length;
    const encounterMarkerCount = snapshot.encounterMarkers.length;

    return {
      zoneId: snapshot.zone.id,
      zoneName: snapshot.zone.name,
      active: snapshot.zone.id === activeZoneId,
      tone: radarTone(snapshot, arrivalCount),
      petCount: snapshot.pets.length,
      encounterCount: snapshot.encounters.filter(
        (encounter) => encounter.status !== "resolved" && encounter.status !== "expired",
      ).length,
      eventCount: snapshot.recentEvents.length,
      markerCount: encounterMarkerCount + arrivalCount,
      arrivalCount,
      topSignal: signal.title,
      summary: signal.summary,
    };
  });
}

export function WorldMapRadar({
  activeZoneId,
  disabled,
  snapshots,
  onSelectZone,
}: WorldMapRadarProps) {
  const items = buildWorldZoneRadarItems(snapshots, activeZoneId);

  return (
    <section className="space-y-3" data-testid="world-map-radar">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Map aria-hidden="true" className="h-4 w-4 text-lime-200/70" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">World Map</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {items.reduce((sum, item) => sum + item.encounterCount, 0)} signals
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = toneIcons[item.tone];

          return (
            <button
              aria-current={item.active ? "true" : undefined}
              className={cn(
                "min-w-0 rounded-[20px] border p-3 text-left transition-[border-color,background-color,box-shadow,transform,opacity] hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-70",
                toneStyles[item.tone],
                item.active ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.22)]" : "",
              )}
              data-testid="world-map-radar-zone"
              disabled={disabled || item.active}
              key={item.zoneId}
              onClick={() => onSelectZone(item.zoneId)}
              type="button"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold text-white">{item.zoneName}</span>
                  <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.16em] text-white/42">
                    {item.petCount} pets · {item.markerCount} markers
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/22">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
              </span>
              <span className="mt-3 block line-clamp-2 min-h-10 break-words text-sm leading-5 text-white/72">
                {item.topSignal}
              </span>
              <span className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/42">
                <span>{item.encounterCount} encounters</span>
                <span>{item.eventCount} events</span>
                {item.arrivalCount > 0 ? <span>{item.arrivalCount} arrivals</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
