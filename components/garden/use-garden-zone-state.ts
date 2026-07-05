"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { readJsonResponse } from "@/lib/api-client";
import { cacheKeys } from "@/lib/client/cache-keys";
import { hydrateCache, type UiLoadState, useUiResource } from "@/lib/client/ui-cache";
import { markPerformance, measurePerformance } from "@/lib/client/perf";
import type { GardenSnapshot, GardenZoneId, PetEvent } from "@/lib/types";

const SNAPSHOT_TTL_MS = 3_000;
const SNAPSHOT_POLL_MS = 3_500;

export type GardenZoneTransport = "live" | "polling" | "paused";

export type GardenZoneResource = {
  snapshot: GardenSnapshot | null;
  events: PetEvent[];
  error?: Error;
  status: UiLoadState;
  transport: GardenZoneTransport;
  updatedAt: number;
  hasData: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<GardenSnapshot>;
};

async function fetchZoneSnapshot(zoneId: GardenZoneId) {
  const payload = await readJsonResponse<{
    snapshot: GardenSnapshot;
  }>(
    await fetch(`/api/garden/snapshot?zoneId=${zoneId}`, {
      cache: "no-store",
    }),
    "花园同步失败。",
  );

  hydrateCache(cacheKeys.gardenEvents(zoneId), payload.snapshot.recentEvents, SNAPSHOT_TTL_MS);
  return payload.snapshot;
}

function areEventsEqual(left: PetEvent[], right: PetEvent[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((event, index) => event.id === right[index]?.id);
}

export function useGardenZoneState(zoneId: GardenZoneId, initialSnapshot?: GardenSnapshot): GardenZoneResource {
  const matchingInitialSnapshot = initialSnapshot?.zone.id === zoneId ? initialSnapshot : undefined;
  const [transport, setTransport] = useState<GardenZoneTransport>("paused");
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );
  const animationFrameRef = useRef<number | null>(null);
  const queuedEventsRef = useRef<PetEvent[] | null>(null);
  const switchMarkRef = useRef<string | null>(null);

  const resource = useUiResource<GardenSnapshot>(cacheKeys.gardenSnapshot(zoneId), {
    enabled: true,
    fetcher: () => fetchZoneSnapshot(zoneId),
    initialData: matchingInitialSnapshot,
    keepPreviousData: true,
    ttlMs: SNAPSHOT_TTL_MS,
  });
  const eventsResource = useUiResource<PetEvent[]>(cacheKeys.gardenEvents(zoneId), {
    enabled: true,
    fetcher: async () => {
      const snapshot = await fetchZoneSnapshot(zoneId);
      return snapshot.recentEvents;
    },
    initialData: matchingInitialSnapshot?.recentEvents,
    keepPreviousData: true,
    ttlMs: SNAPSHOT_TTL_MS,
  });
  const refreshRef = useRef(resource.refresh);

  useEffect(() => {
    if (!matchingInitialSnapshot) {
      return;
    }

    hydrateCache(cacheKeys.gardenSnapshot(zoneId), matchingInitialSnapshot, SNAPSHOT_TTL_MS);
    hydrateCache(cacheKeys.gardenEvents(zoneId), matchingInitialSnapshot.recentEvents, SNAPSHOT_TTL_MS);
  }, [matchingInitialSnapshot, zoneId]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState !== "hidden");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    refreshRef.current = resource.refresh;
  }, [resource.refresh]);

  useEffect(() => {
    const displayingRequestedZone = resource.data?.zone.id === zoneId;

    if (!displayingRequestedZone && !switchMarkRef.current) {
      const markName = `garden-zone-switch:start:${zoneId}:${Date.now()}`;
      switchMarkRef.current = markName;
      markPerformance(markName);
    }

    if (displayingRequestedZone && switchMarkRef.current) {
      const endMarkName = `garden-zone-switch:end:${zoneId}:${Date.now()}`;
      markPerformance(endMarkName);
      measurePerformance(`garden-zone-switch:${zoneId}`, switchMarkRef.current, endMarkName);
      switchMarkRef.current = null;
    }
  }, [resource.data, zoneId]);

  useEffect(() => {
    if (!isPageVisible) {
      return;
    }

    let disposed = false;
    let eventSource: EventSource | null = null;
    let snapshotInterval: number | null = null;

    const cancelQueuedFlush = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      queuedEventsRef.current = null;
    };

    const flushEvents = () => {
      animationFrameRef.current = null;

      if (disposed || !queuedEventsRef.current) {
        return;
      }

      const nextEvents = queuedEventsRef.current;
      queuedEventsRef.current = null;
      hydrateCache(cacheKeys.gardenEvents(zoneId), nextEvents, SNAPSHOT_TTL_MS);
    };

    const scheduleEvents = (nextEvents: PetEvent[]) => {
      queuedEventsRef.current = nextEvents;

      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(flushEvents);
      }
    };

    const stopSnapshotPolling = () => {
      if (snapshotInterval) {
        window.clearInterval(snapshotInterval);
        snapshotInterval = null;
      }
    };

    const pullSnapshot = async () => {
      try {
        const snapshot = await fetchZoneSnapshot(zoneId);

        if (disposed) {
          return;
        }

        hydrateCache(cacheKeys.gardenSnapshot(zoneId), snapshot, SNAPSHOT_TTL_MS);
        scheduleEvents(snapshot.recentEvents);
      } catch {
        // ignore poll failures; the next interval retries
      }
    };

    // Positions, needs and objects only travel through the snapshot, so the
    // poll must run continuously — SSE below only carries narrative events.
    const startSnapshotPolling = () => {
      if (snapshotInterval) {
        return;
      }

      snapshotInterval = window.setInterval(() => {
        void pullSnapshot();
      }, SNAPSHOT_POLL_MS);
    };

    const connectStream = () => {
      eventSource = new EventSource(`/api/garden/events-stream?zoneId=${zoneId}`);
      setTransport("live");

      eventSource.onmessage = (message) => {
        try {
          const payload = JSON.parse(message.data) as { events?: PetEvent[] };

          if (Array.isArray(payload.events)) {
            scheduleEvents(payload.events);
          }
        } catch {
          // ignore malformed events
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        eventSource = null;
        setTransport("polling");
      };
    };

    void refreshRef.current().catch(() => undefined);
    startSnapshotPolling();
    connectStream();

    return () => {
      disposed = true;
      eventSource?.close();
      stopSnapshotPolling();
      cancelQueuedFlush();
    };
  }, [isPageVisible, zoneId]);

  const events = useMemo(
    () =>
      eventsResource.data ??
      resource.data?.recentEvents ??
      matchingInitialSnapshot?.recentEvents ??
      [],
    [eventsResource.data, matchingInitialSnapshot?.recentEvents, resource.data?.recentEvents],
  );

  const snapshot = useMemo(() => {
    if (!resource.data) {
      return matchingInitialSnapshot ?? null;
    }

    if (events.length === 0 || areEventsEqual(resource.data.recentEvents, events)) {
      return resource.data;
    }

    return {
      ...resource.data,
      recentEvents: events,
    };
  }, [events, matchingInitialSnapshot, resource.data]);

  return useMemo(
    () => ({
      snapshot,
      events,
      error: resource.error,
      status: resource.status,
      transport: isPageVisible ? transport : "paused",
      updatedAt: resource.updatedAt,
      hasData: resource.hasData,
      isLoading: resource.isLoading,
      isRefreshing: resource.isRefreshing,
      refresh: async () => {
        const nextSnapshot = await resource.refresh();
        hydrateCache(cacheKeys.gardenEvents(zoneId), nextSnapshot.recentEvents, SNAPSHOT_TTL_MS);
        return nextSnapshot;
      },
    }),
    [events, isPageVisible, resource, snapshot, transport, zoneId],
  );
}
