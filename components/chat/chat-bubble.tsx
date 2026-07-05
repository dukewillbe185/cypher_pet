"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function ChatBubble({
  message,
  petName,
}: {
  message: ChatMessage;
  petName: string;
}) {
  const isPet = message.participantType === "pet";

  return (
    <div className={cn("flex", isPet ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-[0_12px_30px_rgba(0,0,0,0.18)]",
          isPet
            ? "border border-cyan-300/25 bg-cyan-300/10 text-cyan-50"
            : "border border-lime-300/25 bg-lime-300/10 text-lime-50",
        )}
      >
        <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-white/45">
          {isPet ? petName : "You"}
        </p>
        <p>{message.content}</p>
      </div>
    </div>
  );
}
