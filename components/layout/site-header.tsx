import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { SmartLink } from "@/components/ui/smart-link";

export function SiteHeaderShell({ accountSlot }: { accountSlot?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <SmartLink className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-300/40 bg-lime-300/15 shadow-[0_0_40px_rgba(163,230,53,0.25)]">
            <Sparkles className="h-5 w-5 text-lime-200" />
          </div>
          <div>
            <p className="font-display text-base tracking-[0.28em] text-white uppercase">
              Cypher Garden
            </p>
            <p className="text-xs text-white/45">赛博像素花园</p>
          </div>
        </SmartLink>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <SmartLink className="hover:text-white" href="/garden">
            Garden
          </SmartLink>
          <SmartLink className="hover:text-white" href="/pets/new">
            Upload
          </SmartLink>
          <SmartLink className="hover:text-white" href="/notifications">
            Signals
          </SmartLink>
          <SmartLink className="hover:text-white" href="/me">
            Me
          </SmartLink>
        </nav>

        {accountSlot}
      </div>
    </header>
  );
}
