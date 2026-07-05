"use client";

import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GardenZoneId, PetActivity } from "@/lib/types";

export type PetCommandResult = {
  petId: string;
  zoneId: GardenZoneId;
  previousZoneId: GardenZoneId;
  activity: PetActivity;
  summary: string;
};

export type WorldActionFeedbackItem = {
  title: string;
  body: string;
  meta: string;
  petId: string;
  zoneId: GardenZoneId;
};

export type ProjectedRouteConsequenceInput = {
  actorName: string;
  targetLabel: string;
  routeLabel: string;
  commandLabel: string;
  disabledReason: string | null;
};

type WorldActionFeedbackProps = {
  feedback: WorldActionFeedbackItem | null;
  onClear: () => void;
  onSelectPet?: (petId: string) => void;
};

function activityMeta(activity: PetActivity) {
  return activity.replaceAll("_", " ");
}

export function buildWorldActionFeedback(result: PetCommandResult): WorldActionFeedbackItem {
  const zoneMeta =
    result.previousZoneId !== result.zoneId
      ? `${result.previousZoneId} -> ${result.zoneId}`
      : result.zoneId;

  return {
    title: "World action recorded",
    body: result.summary,
    meta: `${activityMeta(result.activity)} · ${zoneMeta}`,
    petId: result.petId,
    zoneId: result.zoneId,
  };
}

export function buildProjectedRouteConsequence(input: ProjectedRouteConsequenceInput) {
  if (input.disabledReason) {
    return `${input.actorName} is on ${input.routeLabel} toward ${input.targetLabel}. ${input.disabledReason}`;
  }

  return `${input.commandLabel} will turn ${input.routeLabel} into a world action involving ${input.targetLabel}.`;
}

export function WorldActionFeedback({
  feedback,
  onClear,
  onSelectPet,
}: WorldActionFeedbackProps) {
  if (!feedback) {
    return null;
  }

  return (
    <section
      className="rounded-[24px] border border-lime-300/18 bg-lime-300/[0.07] p-4 shadow-[0_18px_50px_rgba(26,46,5,0.22)]"
      data-testid="world-action-feedback"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-lime-100/76" />
            <p className="text-sm font-semibold text-white">{feedback.title}</p>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              {feedback.meta}
            </span>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-white/72">{feedback.body}</p>
        </div>
        <button
          aria-label="Dismiss world action feedback"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition-colors hover:bg-white/10 hover:text-white"
          onClick={onClear}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {onSelectPet ? (
        <div className="mt-3">
          <Button
            className="h-9 px-3 text-[11px] tracking-[0.12em]"
            onClick={() => onSelectPet(feedback.petId)}
            type="button"
            variant="ghost"
          >
            Focus pet
          </Button>
        </div>
      ) : null}
    </section>
  );
}
