"use client";

import { cn } from "@/lib/utils";
import type { SpeechBubbleKind } from "@/lib/types";

export function SpeechBubble({
  text,
  kind = "thought",
  className,
}: {
  text: string;
  kind?: SpeechBubbleKind;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-[22px] border px-3 py-2 text-xs font-semibold leading-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
        kind === "speech"
          ? "border-cyan-300/25 bg-cyan-300/12 text-cyan-50"
          : "border-white/12 bg-white/10 text-white/80",
        className,
      )}
    >
      {text}
    </div>
  );
}
