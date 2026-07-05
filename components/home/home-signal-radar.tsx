"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Radar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SmartLink } from "@/components/ui/smart-link";
import type { HomeSignalFeed, HomeSignalItem } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

const POLL_INTERVAL_MS = 12000;

function signalKindLabel(item: HomeSignalItem) {
  switch (item.kind) {
    case "mood_change":
      return "mood shift";
    case "important_event":
      return "important event";
    case "system":
      return "system";
    case "public_event":
    default:
      return "public feed";
  }
}

function signalAccent(item: HomeSignalItem) {
  if (item.source === "notification") {
    return "border-cyan-300/18 bg-cyan-300/10 text-cyan-100";
  }

  return "border-lime-300/18 bg-lime-300/10 text-lime-100";
}

function signalMeta(item: HomeSignalItem) {
  if (item.source === "notification") {
    return item.petName ? `${signalKindLabel(item)} · ${item.petName}` : signalKindLabel(item);
  }

  return item.zoneName ? `${item.zoneName} · public feed` : "public feed";
}

function signalFooterHref(feed: HomeSignalFeed) {
  return feed.audience === "viewer" ? "/notifications" : "/garden";
}

function signalFooterLabel(feed: HomeSignalFeed) {
  return feed.audience === "viewer" ? "打开我的 Signal Inbox" : "进入公共花园现场";
}

function signalHeadline(feed: HomeSignalFeed) {
  if (feed.audience === "viewer") {
    return feed.viewerName ? `${feed.viewerName}，花园正在找你` : "花园正在找你";
  }

  return "公共花园自己在冒信号";
}

function signalSubcopy(feed: HomeSignalFeed) {
  if (feed.audience === "viewer") {
    return "优先显示你家宠物的情绪变化、重要事件和系统提醒。";
  }

  return "未登录时也能看到公共区刚刚发生了什么。";
}

export function HomeSignalRadar({ initialFeed }: { initialFeed: HomeSignalFeed }) {
  const [feed, setFeed] = useState(initialFeed);
  const [toastSignal, setToastSignal] = useState<HomeSignalItem | null>(null);
  const topSignalIdRef = useRef(initialFeed.items[0]?.id ?? null);

  const refreshFeed = useEffectEvent(async () => {
    try {
      const response = await fetch("/api/home/signals", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { feed?: HomeSignalFeed };
      const nextFeed = payload.feed;

      if (!nextFeed) {
        return;
      }

      const previousTopSignalId = topSignalIdRef.current;
      const nextTopSignal = nextFeed.items[0] ?? null;

      topSignalIdRef.current = nextTopSignal?.id ?? null;

      startTransition(() => {
        setFeed(nextFeed);

        if (previousTopSignalId && nextTopSignal && nextTopSignal.id !== previousTopSignalId) {
          setToastSignal(nextTopSignal);
        }
      });
    } catch {
      // Home signals should fail quietly and keep the last good snapshot.
    }
  });

  useEffect(() => {
    let stopped = false;
    let timeoutId: number | null = null;

    async function scheduleRefresh() {
      if (document.visibilityState === "visible") {
        await refreshFeed();
      }

      if (!stopped) {
        timeoutId = window.setTimeout(scheduleRefresh, POLL_INTERVAL_MS);
      }
    }

    timeoutId = window.setTimeout(scheduleRefresh, POLL_INTERVAL_MS);

    return () => {
      stopped = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!toastSignal) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastSignal(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastSignal]);

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/28 p-5">
      <div className="home-radar-glow absolute inset-0" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge>{feed.audience === "viewer" ? "Live Signals" : "Public Radar"}</Badge>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">{signalHeadline(feed)}</h2>
              <p className="max-w-xl text-sm leading-7 text-white/64">{signalSubcopy(feed)}</p>
            </div>
          </div>

          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-300/10 text-cyan-100">
            <span className="absolute inset-0 rounded-2xl border border-cyan-200/25 animate-ping" />
            <Radar className="relative h-6 w-6" />
          </div>
        </div>

        <div className="space-y-3" aria-live="polite">
          {feed.items.length > 0 ? (
            feed.items.map((item) => (
              <SmartLink
                className="group block rounded-[22px] border border-white/8 bg-white/[0.035] p-4 transition hover:border-white/16 hover:bg-white/[0.05]"
                href={item.href}
                key={item.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em]",
                        signalAccent(item),
                      )}
                    >
                      {signalMeta(item)}
                    </div>
                    <p className="text-sm leading-7 text-white/78">{item.body}</p>
                  </div>

                  <span
                    className="shrink-0 text-[11px] uppercase tracking-[0.22em] text-white/34"
                    suppressHydrationWarning
                  >
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
              </SmartLink>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/12 bg-white/[0.025] p-4 text-sm leading-7 text-white/56">
              这会儿还很安静。等下一次情绪变化或公共事件出现，首页会自己冒出新的 signal。
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-white/36">
          <span>{signalFooterLabel(feed)}</span>
          <div className="flex items-center gap-3">
            <span suppressHydrationWarning>{formatRelativeTime(feed.refreshedAt)}</span>
            <SmartLink className="text-cyan-100 transition hover:text-white" href={signalFooterHref(feed)}>
              Open
            </SmartLink>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toastSignal ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute bottom-4 right-4 max-w-xs rounded-[22px] border border-lime-300/22 bg-slate-950/92 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 12 }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-lime-300/18 bg-lime-300/10 text-lime-100">
                <BellRing className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.24em] text-lime-100/74">Signal found you</p>
                <p className="text-sm leading-6 text-white/82">{toastSignal.body}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
