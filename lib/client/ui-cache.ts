"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type UiCacheKey = string;
export type UiLoadState = "idle" | "loading" | "refreshing" | "ready" | "error";

export type UiCacheOptions<T> = {
  ttlMs: number;
  keepPreviousData?: boolean;
  fetcher: () => Promise<T>;
};

type CacheEntry<T> = {
  data?: T;
  error?: Error;
  updatedAt: number;
  status: UiLoadState;
  promise?: Promise<T>;
  ttlMs: number;
};

type InternalCacheOptions<T> = UiCacheOptions<T> & {
  force?: boolean;
};

type ResourceState<T> = {
  data?: T;
  error?: Error;
  status: UiLoadState;
  updatedAt: number;
};

const cacheStore = new Map<UiCacheKey, CacheEntry<unknown>>();
const cacheListeners = new Map<UiCacheKey, Set<() => void>>();

function ensureEntry<T>(key: UiCacheKey) {
  const existing = cacheStore.get(key) as CacheEntry<T> | undefined;
  if (existing) {
    return existing;
  }

  const created: CacheEntry<T> = {
    updatedAt: 0,
    status: "idle",
    ttlMs: 0,
  };

  cacheStore.set(key, created);
  return created;
}

function notify(key: UiCacheKey) {
  cacheListeners.get(key)?.forEach((listener) => listener());
}

function isFresh(entry: CacheEntry<unknown>, ttlMs: number) {
  return entry.updatedAt > 0 && Date.now() - entry.updatedAt < ttlMs;
}

async function fetchIntoCache<T>(key: UiCacheKey, options: InternalCacheOptions<T>) {
  const entry = ensureEntry<T>(key);

  if (entry.promise && !options.force) {
    return entry.promise;
  }

  entry.status = entry.data === undefined ? "loading" : "refreshing";
  entry.error = undefined;
  entry.ttlMs = options.ttlMs;
  notify(key);

  const promise = options.fetcher()
    .then((data) => {
      const nextEntry = ensureEntry<T>(key);
      nextEntry.data = data;
      nextEntry.updatedAt = Date.now();
      nextEntry.status = "ready";
      nextEntry.error = undefined;
      nextEntry.promise = undefined;
      nextEntry.ttlMs = options.ttlMs;
      notify(key);
      return data;
    })
    .catch((error: unknown) => {
      const nextEntry = ensureEntry<T>(key);
      nextEntry.error = error instanceof Error ? error : new Error("resource-fetch-failed");
      nextEntry.status = nextEntry.data === undefined ? "error" : "ready";
      nextEntry.promise = undefined;
      notify(key);
      throw nextEntry.error;
    });

  entry.promise = promise;
  return promise;
}

export function readOrFetch<T>(key: UiCacheKey, options: UiCacheOptions<T>) {
  const entry = ensureEntry<T>(key);
  entry.ttlMs = options.ttlMs;

  if (entry.data !== undefined && isFresh(entry, options.ttlMs)) {
    return Promise.resolve(entry.data);
  }

  if (entry.data !== undefined && !entry.promise) {
    void fetchIntoCache(key, options);
    return Promise.resolve(entry.data);
  }

  return fetchIntoCache(key, options);
}

export function prime<T>(key: UiCacheKey, options: UiCacheOptions<T>) {
  void readOrFetch(key, options);
}

export function hydrateCache<T>(key: UiCacheKey, data: T, ttlMs = 0) {
  const entry = ensureEntry<T>(key);
  entry.data = data;
  entry.updatedAt = Date.now();
  entry.status = "ready";
  entry.error = undefined;
  entry.promise = undefined;
  if (ttlMs > 0) {
    entry.ttlMs = ttlMs;
  }
  notify(key);
}

export function invalidate(key: UiCacheKey) {
  cacheStore.delete(key);
  notify(key);
}

export function invalidatePrefix(prefix: string) {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
      notify(key);
    }
  }
}

export function subscribeToCache(key: UiCacheKey, listener: () => void) {
  const listeners = cacheListeners.get(key) ?? new Set<() => void>();
  listeners.add(listener);
  cacheListeners.set(key, listeners);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      cacheListeners.delete(key);
    }
  };
}

export function readCacheSnapshot<T>(key: UiCacheKey): ResourceState<T> {
  const entry = cacheStore.get(key) as CacheEntry<T> | undefined;

  if (!entry) {
    return {
      status: "idle",
      updatedAt: 0,
    };
  }

  return {
    data: entry.data,
    error: entry.error,
    status: entry.status,
    updatedAt: entry.updatedAt,
  };
}

export function useUiResource<T>(
  key: UiCacheKey,
  options: UiCacheOptions<T> & {
    enabled?: boolean;
    initialData?: T;
  },
) {
  const {
    enabled = true,
    initialData,
    keepPreviousData = true,
    ttlMs,
  } = options;
  const fetcherRef = useRef(options.fetcher);
  useEffect(() => {
    fetcherRef.current = options.fetcher;
  }, [options.fetcher]);

  const [snapshot, setSnapshot] = useState<ResourceState<T>>(() => readCacheSnapshot<T>(key));
  const [previousData, setPreviousData] = useState<T | undefined>(initialData);

  useEffect(() => {
    if (initialData !== undefined) {
      hydrateCache(key, initialData, ttlMs);
    }
  }, [initialData, key, ttlMs]);

  useEffect(() => subscribeToCache(key, () => {
    setSnapshot(readCacheSnapshot<T>(key));
  }), [key]);

  useEffect(() => {
    setSnapshot(readCacheSnapshot<T>(key));
  }, [key]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void readOrFetch(key, {
      ttlMs,
      keepPreviousData,
      fetcher: () => fetcherRef.current(),
    });
  }, [enabled, key, keepPreviousData, ttlMs]);

  useEffect(() => {
    if (snapshot.data !== undefined) {
      setPreviousData(snapshot.data);
    }
  }, [snapshot.data]);

  const data = snapshot.data ?? (keepPreviousData ? previousData : undefined);

  return useMemo(
    () => ({
      data,
      error: snapshot.error,
      status: snapshot.status,
      updatedAt: snapshot.updatedAt,
      hasData: data !== undefined,
      isLoading: snapshot.status === "loading" && data === undefined,
      isRefreshing: snapshot.status === "refreshing",
      refresh: () =>
        fetchIntoCache(key, {
          ttlMs,
          keepPreviousData,
          force: true,
          fetcher: () => fetcherRef.current(),
        }),
    }),
    [data, key, keepPreviousData, snapshot.error, snapshot.status, snapshot.updatedAt, ttlMs],
  );
}
