"use client";

import { useState } from "react";
import { Crosshair, Footprints, MapPin, Route, X } from "lucide-react";

import { buildAutonomyRouteAction } from "@/components/garden/autonomy-route-actions";
import type { AutonomyMapOverlay } from "@/components/garden/autonomy-map-overlays";
import {
  buildProjectedRouteConsequence,
  type PetCommandResult,
} from "@/components/garden/world-action-feedback";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/api-client";
import type { GardenPetSnapshot, Profile } from "@/lib/types";

type AutonomyRoutePanelProps = {
  overlay: AutonomyMapOverlay;
  pets: GardenPetSnapshot[];
  viewer: Profile | null;
  onClear: () => void;
  onActionComplete?: (result: PetCommandResult) => void;
  onRefresh: () => void;
  onSelectPet: (petId: string) => void;
};

function petName(pets: GardenPetSnapshot[], petId?: string) {
  return petId ? pets.find((pet) => pet.pet.id === petId)?.pet.name : undefined;
}

export function AutonomyRoutePanel({
  overlay,
  pets,
  viewer,
  onClear,
  onActionComplete,
  onRefresh,
  onSelectPet,
}: AutonomyRoutePanelProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const action = buildAutonomyRouteAction(overlay, pets, viewer);
  const targetPetName = petName(pets, overlay.targetPetId);
  const projectedConsequence = buildProjectedRouteConsequence({
    actorName: overlay.actorName,
    commandLabel: action.label,
    disabledReason: action.disabledReason,
    routeLabel: overlay.routeLabel,
    targetLabel: targetPetName ?? overlay.targetLabel,
  });

  async function runAction() {
    if (!action.actorPetId || !action.command) {
      setError(action.disabledReason ?? "这条路线现在不能操作。");
      return;
    }

    try {
      setError(null);
      setPending(true);
      const response = await fetch(`/api/pets/${encodeURIComponent(action.actorPetId)}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: action.command }),
      });
      const result = await readJsonResponse<PetCommandResult>(response, "路线互动失败。");
      onActionComplete?.(result);
      onSelectPet(action.actorPetId);
      onRefresh();
    } catch (routeError) {
      setError(routeError instanceof Error ? routeError.message : "路线互动失败。");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      className="rounded-[24px] border border-amber-300/16 bg-amber-300/[0.055] p-4 shadow-[0_18px_50px_rgba(69,26,3,0.2)]"
      data-testid="autonomy-route-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Route aria-hidden="true" className="h-4 w-4 text-amber-100/72" />
            <p className="break-words text-sm font-semibold text-white">{overlay.routeLabel}</p>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              {overlay.targetKind}
            </span>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-white/66">{overlay.reason}</p>
        </div>
        <button
          aria-label="Close route panel"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition-colors hover:bg-white/10 hover:text-white"
          onClick={onClear}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/58">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 transition-colors hover:border-amber-200/35 hover:text-white"
          onClick={() => onSelectPet(overlay.actorPetId)}
          type="button"
        >
          <Crosshair aria-hidden="true" className="h-3.5 w-3.5" />
          Focus {overlay.actorName}
        </button>
        {overlay.targetPetId ? (
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 transition-colors hover:border-amber-200/35 hover:text-white"
            onClick={() => onSelectPet(overlay.targetPetId!)}
            type="button"
          >
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            Locate {targetPetName ?? overlay.targetLabel}
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {overlay.targetLabel}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          className="h-9 gap-2 px-3 text-[11px] tracking-[0.12em]"
          disabled={pending || Boolean(action.disabledReason)}
          onClick={runAction}
          type="button"
          variant="secondary"
        >
          <Footprints aria-hidden="true" className="h-3.5 w-3.5" />
          {pending ? "Acting..." : action.label}
        </Button>
        {action.disabledReason ? <p className="text-xs leading-5 text-white/42">{action.disabledReason}</p> : null}
      </div>

      <div className="mt-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3" data-testid="route-consequence-preview">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/36">Projected consequence</p>
        <p className="mt-2 text-sm leading-6 text-white/68">{projectedConsequence}</p>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
