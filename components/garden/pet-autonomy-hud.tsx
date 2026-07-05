"use client";

import { MessageCircle } from "lucide-react";

import { OwnerActionButtons, ReportForm } from "@/components/forms/cyber-forms";
import { SpeechBubble } from "@/components/garden/speech-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  activityLabel,
  buildIntentSummary,
  moodLabel,
  relationshipPulse,
  type ActivityTone,
} from "@/components/garden/garden-labels";
import type { GardenPetSnapshot, Profile } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

type PetAutonomyHudProps = {
  pet: GardenPetSnapshot | null;
  viewer: Profile | null;
  onChat: () => void;
  onRefresh: () => void;
};

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/22 bg-cyan-300/[0.08] text-cyan-50",
  conflict: "border-rose-300/24 bg-rose-300/[0.08] text-rose-50",
  rest: "border-violet-300/20 bg-violet-300/[0.08] text-violet-50",
  care: "border-lime-300/20 bg-lime-300/[0.08] text-lime-50",
  explore: "border-amber-300/20 bg-amber-300/[0.08] text-amber-50",
  neutral: "border-white/10 bg-white/[0.05] text-white/72",
};

const meterStyles = {
  energy: "from-cyan-300 to-sky-300",
  hunger: "from-amber-300 to-orange-300",
  hygiene: "from-lime-300 to-emerald-300",
  bladder: "from-blue-300 to-cyan-300",
  social: "from-fuchsia-300 to-cyan-300",
  stress: "from-rose-300 to-amber-300",
} as const;

function NeedMeter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: keyof typeof meterStyles;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-white/42">
        <span>{label}</span>
        <span className="font-mono text-white/62">{Math.round(safeValue)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", meterStyles[tone])}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function EmptySelection() {
  return (
    <Card className="space-y-4">
      <Badge>Observer HUD</Badge>
      <div>
        <h2 className="text-2xl font-semibold text-white">Select a pet</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">
          点地图里的宠物，查看它现在的意图、关系、最近事件和可以介入的动作。
        </p>
      </div>
    </Card>
  );
}

export function PetAutonomyHud({ pet, viewer, onChat, onRefresh }: PetAutonomyHudProps) {
  if (!pet) {
    return <EmptySelection />;
  }

  const intent = buildIntentSummary(pet);
  const pulse = relationshipPulse(pet);
  const isOwner = viewer?.id === pet.pet.ownerId;
  const recentEvent = pet.recentEvent;
  const decision = pet.state.lastAutonomyDecision;

  return (
    <Card className="space-y-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <Badge className={toneStyles[intent.tone]}>Selected Pet</Badge>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
          {pet.state.zoneId}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-black/30">
          <img
            alt={pet.pet.name}
            className="h-14 w-14 object-contain [image-rendering:pixelated]"
            src={pet.generation.worldSpritePath}
          />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-3xl font-semibold text-white">{pet.pet.name}</h2>
          <p className="mt-1 text-sm text-cyan-100/65">@{pet.owner.handle}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-lime-100/62">
            {pet.personality.archetype}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Mood</p>
          <p className="mt-1 font-semibold text-white">{moodLabel(pet.state.mood)}</p>
        </div>
        <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Activity</p>
          <p className="mt-1 font-semibold text-white">{activityLabel(pet.state.activity)}</p>
        </div>
      </div>

      {pet.growth ? (
        <section className="rounded-[22px] border border-lime-300/14 bg-lime-300/[0.05] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-lime-100/55">Growth</p>
            <span className="rounded-full border border-lime-200/30 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime-100">
              {pet.growth.stageLabel}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-white/42">
            <span>羁绊 bond</span>
            <span className="font-mono text-lime-100/80">{pet.growth.bond}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lime-300 to-cyan-300"
              style={{ width: `${Math.round(pet.growth.stageProgress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/45">
            {pet.growth.stage === "awakened"
              ? "已完全觉醒，和你同步率最高。"
              : `距离下一次进化还差 ${Math.round((1 - pet.growth.stageProgress) * 100)}% 的共同经历。`}
          </p>
        </section>
      ) : null}

      <section className={cn("rounded-[22px] border p-4", toneStyles[intent.tone])}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] opacity-65">Current Intent</p>
            <p className="mt-2 text-lg font-semibold text-white">{intent.goal}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
            {intent.source}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/74">{intent.reason}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-white/48">
          <span>{intent.activity}</span>
          {decision?.socialIntent ? <span>social: {decision.socialIntent}</span> : null}
        </div>
      </section>

      {pet.state.currentBubble?.text ? (
        <SpeechBubble kind={pet.state.currentBubble.kind} text={pet.state.currentBubble.text} />
      ) : null}

      {recentEvent ? (
        <section className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Recent Event</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35" suppressHydrationWarning>
              {formatRelativeTime(recentEvent.createdAt)}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/72">{recentEvent.body}</p>
          {recentEvent.socialLines?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {recentEvent.socialLines.slice(0, 2).map((line, index) => (
                <SpeechBubble
                  className={index % 2 === 0 ? "" : "border-lime-300/18 bg-lime-300/[0.08] text-lime-50"}
                  key={`${recentEvent.id}-${line.petId}-${index}`}
                  kind="speech"
                  text={line.text}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Relationship Pulse</p>
        {pulse ? (
          <div className="mt-3">
            <p className={cn("inline-flex rounded-full border px-3 py-1 text-xs", toneStyles[pulse.tone])}>
              {pulse.label} · {pulse.status}
            </p>
            <p className="mt-2 text-sm text-white/58">{pulse.detail}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/50">No strong social signal yet.</p>
        )}
      </section>

      <section className="grid gap-3">
        <NeedMeter label="energy" tone="energy" value={pet.state.energy} />
        <NeedMeter label="hunger" tone="hunger" value={pet.state.hunger} />
        <NeedMeter label="hygiene" tone="hygiene" value={pet.state.hygiene} />
        <NeedMeter label="bladder" tone="bladder" value={pet.state.bladder} />
        <NeedMeter label="social" tone="social" value={pet.state.social} />
        <NeedMeter label="stress" tone="stress" value={pet.state.stress} />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button className="gap-2" onClick={onChat} type="button" variant="secondary">
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Chat
        </Button>
      </div>

      {isOwner ? (
        <section className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Intervene</p>
          <OwnerActionButtons onDone={onRefresh} petId={pet.pet.id} />
        </section>
      ) : viewer ? (
        <p className="rounded-[18px] border border-amber-300/12 bg-amber-300/[0.05] px-4 py-3 text-sm leading-6 text-amber-50/78">
          这是 {pet.owner.displayName} 的宠物。你可以观察它的行为，也可以从公共事件里理解它和其他 pet 的关系。
        </p>
      ) : (
        <p className="rounded-[18px] border border-amber-300/12 bg-amber-300/[0.05] px-4 py-3 text-sm leading-6 text-amber-50/78">
          当前是公共观景模式。登录后可以指挥自己的宠物移动和互动。
        </p>
      )}

      {!isOwner ? <ReportForm targetId={pet.pet.id} targetType="pet" /> : null}
    </Card>
  );
}
