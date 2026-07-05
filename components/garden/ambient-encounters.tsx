"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Footprints, HeartHandshake, MapPin, Utensils } from "lucide-react";

import {
  formatEncounterIntervention,
  formatEncounterStatus,
  formatEncounterWorldAction,
  ownerActionLabels,
} from "@/components/garden/encounter-thread-labels";
import { findEncounterInterventionTarget } from "@/components/garden/garden-encounter-actions";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { GardenEncounter, GardenEncounterTone, GardenPetSnapshot, OwnerAction } from "@/lib/types";

type AmbientEncountersProps = {
  encounters: GardenEncounter[];
  pets: GardenPetSnapshot[];
  viewerId?: string;
  selectedEncounterId?: string;
  onRefresh: () => void;
  onSelectPet: (petId: string) => void;
};

const toneStyles: Record<GardenEncounterTone, string> = {
  conflict: "border-rose-300/22 bg-rose-300/[0.07] text-rose-50",
  social: "border-cyan-300/18 bg-cyan-300/[0.07] text-cyan-50",
  explore: "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
  care: "border-lime-300/18 bg-lime-300/[0.07] text-lime-50",
  rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
};

const toneIcons = {
  conflict: AlertTriangle,
  social: HeartHandshake,
  explore: MapPin,
  care: Utensils,
  rest: Footprints,
} satisfies Record<GardenEncounterTone, typeof AlertTriangle>;

function participantFor(pets: GardenPetSnapshot[], petId: string) {
  return pets.find((entry) => entry.pet.id === petId);
}

export function AmbientEncounters({
  encounters,
  pets,
  viewerId,
  selectedEncounterId,
  onRefresh,
  onSelectPet,
}: AmbientEncountersProps) {
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const encounterRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (!selectedEncounterId) {
      return;
    }

    encounterRefs.current.get(selectedEncounterId)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedEncounterId]);

  async function runAction(petId: string, action: OwnerAction, encounterThreadId?: string) {
    const actionKey = `${petId}:${action}`;

    try {
      setError(null);
      setPendingActionKey(actionKey);
      const response = await fetch(`/api/pets/${petId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, encounterThreadId }),
      });
      await readJsonResponse(response, "介入失败。");
      onRefresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "介入失败。");
    } finally {
      setPendingActionKey(null);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Ambient Encounters</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">discoverable situations</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {encounters.length}
        </span>
      </div>

      {encounters.length === 0 ? (
        <p className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48">
          这个分区暂时没有明显的遭遇链。继续观察，或者切换区域。
        </p>
      ) : (
        <div className="grid gap-3">
          {encounters.map((encounter) => {
            const Icon = toneIcons[encounter.tone];
            const participants = encounter.participantPetIds
              .map((petId) => participantFor(pets, petId))
              .filter((entry): entry is GardenPetSnapshot => Boolean(entry));
            const intervention = findEncounterInterventionTarget(encounter, pets, viewerId);
            const lastIntervention = formatEncounterIntervention(encounter);
            const lastWorldAction = formatEncounterWorldAction(encounter);
            const selected = selectedEncounterId === encounter.id;

            return (
              <article
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "rounded-[22px] border p-4 transition-[border-color,box-shadow,background-color]",
                  toneStyles[encounter.tone],
                  selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.26),0_0_34px_rgba(103,232,249,0.16)]" : "",
                )}
                key={encounter.id}
                ref={(node) => {
                  if (node) {
                    encounterRefs.current.set(encounter.id, node);
                  } else {
                    encounterRefs.current.delete(encounter.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
                      <p className="min-w-0 break-words font-semibold leading-6 text-white">{encounter.title}</p>
                      <span className="w-fit rounded-full border border-white/10 bg-black/18 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/48">
                        {encounter.stage}
                      </span>
                      <span className="w-fit rounded-full border border-white/10 bg-black/18 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/48">
                        {formatEncounterStatus(encounter)}
                      </span>
                    </div>
                    <p className="mt-2 break-words text-sm leading-6 text-white/70">{encounter.summary}</p>
                    {lastIntervention ? (
                      <p className="mt-2 break-words text-xs leading-5 text-white/50">{lastIntervention}</p>
                    ) : null}
                    {lastWorldAction ? (
                      <p className="mt-1 break-words text-xs leading-5 text-white/50">{lastWorldAction}</p>
                    ) : null}

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

                    {intervention ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {intervention.actions.map((action) => {
                          const actionKey = `${intervention.petId}:${action}`;

                          return (
                            <Button
                              className="h-9 px-3 text-[11px] tracking-[0.12em]"
                              disabled={pendingActionKey !== null}
                              key={action}
                              onClick={() => runAction(intervention.petId, action, encounter.threadId)}
                              type="button"
                              variant={encounter.tone === "conflict" && action === "scold" ? "danger" : "ghost"}
                            >
                              {pendingActionKey === actionKey ? "Acting..." : ownerActionLabels[action]}
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 break-words text-xs leading-5 text-white/45">
                        Observe only. You can directly intervene when one of your pets is involved.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
