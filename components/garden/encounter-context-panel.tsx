"use client";

import { useState } from "react";
import { Eye, Footprints, X } from "lucide-react";

import {
  findEncounterActorPet,
  getEncounterWorldActionDisabledReason,
} from "@/components/garden/encounter-context-actions";
import {
  encounterWorldActionLabels,
  formatEncounterStatus,
  formatEncounterWorldAction,
} from "@/components/garden/encounter-thread-labels";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/api-client";
import type {
  GardenEncounter,
  GardenEncounterWorldAction,
  GardenPetSnapshot,
  Profile,
} from "@/lib/types";

type EncounterContextPanelProps = {
  encounter: GardenEncounter;
  pets: GardenPetSnapshot[];
  viewer: Profile | null;
  onClear: () => void;
  onRefresh: () => void;
  onSelectPet: (petId: string) => void;
};

const actionIcons = {
  observe: Eye,
  approach: Footprints,
} satisfies Record<GardenEncounterWorldAction, typeof Eye>;
const worldActions = ["observe", "approach"] satisfies GardenEncounterWorldAction[];

function participantsFor(encounter: GardenEncounter, pets: GardenPetSnapshot[]) {
  const participantIds = new Set(encounter.participantPetIds);
  return pets.filter((entry) => participantIds.has(entry.pet.id));
}

export function EncounterContextPanel({
  encounter,
  pets,
  viewer,
  onClear,
  onRefresh,
  onSelectPet,
}: EncounterContextPanelProps) {
  const [pendingAction, setPendingAction] = useState<GardenEncounterWorldAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const participants = participantsFor(encounter, pets);
  const lastWorldAction = formatEncounterWorldAction(encounter);
  const actorPet = findEncounterActorPet(encounter, pets, viewer);
  const firstDisabledReason = worldActions
    .map((action) =>
      getEncounterWorldActionDisabledReason({
        action,
        encounter,
        pets,
        viewer,
      }),
    )
    .find(Boolean);

  async function runWorldAction(action: GardenEncounterWorldAction) {
    if (!encounter.threadId) {
      setError("这个事件还没有稳定线程。");
      return;
    }

    try {
      setError(null);
      setPendingAction(action);
      const response = await fetch(`/api/garden/encounters/${encodeURIComponent(encounter.threadId)}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await readJsonResponse(response, "事件互动失败。");
      onRefresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "事件互动失败。");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section
      className="rounded-[24px] border border-cyan-300/14 bg-cyan-300/[0.045] p-4 shadow-[0_18px_50px_rgba(8,47,73,0.22)]"
      data-testid="encounter-context-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words text-sm font-semibold text-white">{encounter.title}</p>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              {encounter.stage}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              {formatEncounterStatus(encounter)}
            </span>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-white/66">{encounter.summary}</p>
          {lastWorldAction ? <p className="mt-1 text-xs text-cyan-100/55">{lastWorldAction}</p> : null}
        </div>
        <button
          aria-label="Close encounter panel"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition-colors hover:bg-white/10 hover:text-white"
          onClick={onClear}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {participants.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {participants.map((participant) => (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 py-1 pl-1 pr-3 text-xs text-white/72 transition-colors hover:border-cyan-300/30 hover:text-white"
              key={participant.pet.id}
              onClick={() => onSelectPet(participant.pet.id)}
              type="button"
            >
              <img
                alt={participant.pet.name}
                className="h-7 w-7 rounded-full bg-black/30 object-contain p-0.5 [image-rendering:pixelated]"
                src={participant.generation.worldSpritePath}
              />
              {participant.pet.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {worldActions.map((action) => {
          const Icon = actionIcons[action];
          const disabledReason = getEncounterWorldActionDisabledReason({
            action,
            encounter,
            pets,
            viewer,
          });
          const disabled = Boolean(disabledReason) || pendingAction !== null;
          const label =
            action === "approach" && actorPet
              ? `Approach with ${actorPet.pet.name}`
              : encounterWorldActionLabels[action];

          return (
            <Button
              className="h-9 gap-2 px-3 text-[11px] tracking-[0.12em]"
              disabled={disabled}
              key={action}
              onClick={() => runWorldAction(action)}
              type="button"
              variant={action === "observe" ? "secondary" : "ghost"}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {pendingAction === action ? "Writing..." : label}
            </Button>
          );
        })}
      </div>

      {firstDisabledReason ? <p className="mt-3 text-xs leading-5 text-white/42">{firstDisabledReason}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
