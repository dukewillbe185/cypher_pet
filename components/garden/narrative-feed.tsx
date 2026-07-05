"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SpeechBubble } from "@/components/garden/speech-bubble";
import { activityTone, type ActivityTone } from "@/components/garden/garden-labels";
import { formatRelativeTime } from "@/lib/utils";
import type { GardenPetSnapshot, GardenZoneId, PetEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type NarrativeFeedProps = {
  events: PetEvent[];
  pets: GardenPetSnapshot[];
  transport: "live" | "polling" | "paused";
  zoneId: GardenZoneId;
  onSelectPet: (petId: string) => void;
};

function eventMoodBadge(event: PetEvent) {
  switch (event.emotion) {
    case "playful":
      return "✦";
    case "grumpy":
      return "↯";
    case "sleepy":
      return "z";
    case "lonely":
      return "…";
    case "dirty":
      return "≈";
    case "curious":
      return "?";
    case "happy":
    default:
      return "•";
  }
}

const toneStyles: Record<ActivityTone, string> = {
  social: "border-cyan-300/18 bg-cyan-300/[0.07]",
  conflict: "border-rose-300/22 bg-rose-300/[0.07]",
  rest: "border-violet-300/18 bg-violet-300/[0.07]",
  care: "border-lime-300/18 bg-lime-300/[0.07]",
  explore: "border-amber-300/18 bg-amber-300/[0.07]",
  neutral: "border-white/8 bg-white/[0.035]",
};

function toneForEvent(event: PetEvent, pet?: GardenPetSnapshot): ActivityTone {
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

export function NarrativeFeed({
  events,
  pets,
  transport,
  zoneId,
  onSelectPet,
}: NarrativeFeedProps) {
  const petMap = useMemo(
    () => new Map(pets.map((entry) => [entry.pet.id, entry])),
    [pets],
  );
  const transportLabel =
    transport === "live" ? "Live Narrative Feed" : transport === "polling" ? "Polling Narrative Feed" : "Narrative Feed Paused";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">World Feed</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">{zoneId}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
          {transportLabel}
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {events.map((event) => {
            const pet = petMap.get(event.petId);
            const relatedPet = event.relatedPetId ? petMap.get(event.relatedPetId) : undefined;
            const tone = toneForEvent(event, pet);

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
                key={event.id}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                <div
                  className={cn(
                    "ease-smooth motion-fast cursor-pointer rounded-[22px] border p-3 transition-[background-color,border-color,transform] hover:-translate-y-0.5",
                    toneStyles[tone],
                  )}
                  onClick={() => {
                    if (pet) {
                      onSelectPet(pet.pet.id);
                    }
                  }}
                  onKeyDown={(keyboardEvent) => {
                    if ((keyboardEvent.key === "Enter" || keyboardEvent.key === " ") && pet) {
                      keyboardEvent.preventDefault();
                      onSelectPet(pet.pet.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex shrink-0 -space-x-2">
                      {pet?.generation.worldSpritePath ? (
                        <button
                          aria-label={`Select ${pet.pet.name}`}
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            onSelectPet(event.petId);
                          }}
                          type="button"
                        >
                          <img
                            alt={pet.pet.name}
                            className="h-11 w-11 rounded-2xl border border-white/10 bg-black/35 object-contain p-1 [image-rendering:pixelated]"
                            src={pet.generation.worldSpritePath}
                          />
                        </button>
                      ) : null}
                      {relatedPet?.generation.worldSpritePath ? (
                        <button
                          aria-label={`Select ${relatedPet.pet.name}`}
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            onSelectPet(relatedPet.pet.id);
                          }}
                          type="button"
                        >
                          <img
                            alt={relatedPet.pet.name}
                            className="h-11 w-11 rounded-2xl border border-cyan-300/20 bg-black/35 object-contain p-1 [image-rendering:pixelated]"
                            src={relatedPet.generation.worldSpritePath}
                          />
                        </button>
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white/86">
                            {pet?.pet.name ?? "Unknown"} {relatedPet ? `× ${relatedPet.pet.name}` : ""}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-lime-300/18 bg-lime-300/[0.08] text-[10px] text-lime-50">
                              {eventMoodBadge(event)}
                            </span>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{event.type}</p>
                          </div>
                        </div>
                        <p className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-white/35" suppressHydrationWarning>
                          {formatRelativeTime(event.createdAt)}
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/72">{event.body}</p>

                      {event.socialLines?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {event.socialLines.map((line, index) => (
                            <SpeechBubble
                              className={index % 2 === 0 ? "" : "border-lime-300/18 bg-lime-300/[0.08] text-lime-50"}
                              key={`${event.id}-${line.petId}-${index}`}
                              kind="speech"
                              text={line.text}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 ? (
          <p className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48">
            这个分区暂时很安静。
          </p>
        ) : null}
      </div>
    </div>
  );
}
