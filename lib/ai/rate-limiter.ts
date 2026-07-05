import { env } from "@/lib/env";

const MINUTE_MS = 1000 * 60;
const CACHE_MAX_ENTRIES = 300;

type CounterEntry = {
  windowStartedAt: number;
  count: number;
};

type TokenEntry = {
  windowStartedAt: number;
  used: number;
};

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  touchedAt: number;
};

const counters = new Map<string, CounterEntry>();
const tokenBudget = new Map<string, TokenEntry>();
const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();
let activeInteractiveTasks = 0;

function consumeCounter(key: string, limit: number) {
  const now = Date.now();
  const entry = counters.get(key);

  if (!entry || now - entry.windowStartedAt >= MINUTE_MS) {
    counters.set(key, { windowStartedAt: now, count: 1 });
    return;
  }

  if (entry.count >= limit) {
    throw new Error("llm-rate-limit-exceeded");
  }

  entry.count += 1;
}

function consumeTokenBudget(estimatedTokens: number, key: string, limit: number) {
  const now = Date.now();
  const entry = tokenBudget.get(key);

  if (!entry || now - entry.windowStartedAt >= MINUTE_MS) {
    tokenBudget.set(key, { windowStartedAt: now, used: estimatedTokens });
    return;
  }

  if (entry.used + estimatedTokens > limit) {
    throw new Error("llm-token-budget-exceeded");
  }

  entry.used += estimatedTokens;
}

export type LLMTaskPriority = "ambient" | "interactive";

function getCachedValue<T>(key: string) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  entry.touchedAt = Date.now();
  return entry.value as T;
}

function pruneCache() {
  if (cache.size <= CACHE_MAX_ENTRIES) {
    return;
  }

  const sorted = [...cache.entries()].sort((left, right) => left[1].touchedAt - right[1].touchedAt);
  const deleteCount = cache.size - CACHE_MAX_ENTRIES;

  for (const [key] of sorted.slice(0, deleteCount)) {
    cache.delete(key);
  }
}

function setCachedValue<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
    touchedAt: Date.now(),
  });
  pruneCache();
}

async function runLLMTask<T>(input: {
  cacheKey: string;
  ttlMs: number;
  petId?: string;
  userId?: string;
  estimatedTokens: number;
  priority?: LLMTaskPriority;
  skipCache?: boolean;
  fallbackValue?: T;
  task: () => Promise<T>;
}) {
  const existing = inFlight.get(input.cacheKey);

  if (existing) {
    return existing as Promise<T>;
  }

  const runner = (async () => {
    const priority = input.priority ?? "ambient";
    if (priority === "ambient" && activeInteractiveTasks > 0) {
      if (input.fallbackValue !== undefined) {
        return input.fallbackValue;
      }

      throw new Error("llm-ambient-paused-for-interactive");
    }
    const petLimit =
      priority === "interactive" ? env.llmInteractiveRateLimitPerPet : env.llmRateLimitPerPet;
    const userLimit =
      priority === "interactive" ? env.llmInteractiveRateLimitPerUser : env.llmRateLimitPerUser;
    const tokenLimit =
      priority === "interactive"
        ? env.llmInteractiveTokenBudgetPerMinute
        : env.llmGlobalTokenBudgetPerMinute;

    if (input.petId) {
      consumeCounter(`pet:${priority}:${input.petId}`, petLimit);
    }

    if (input.userId) {
      consumeCounter(`user:${priority}:${input.userId}`, userLimit);
    }

    consumeTokenBudget(input.estimatedTokens, `${priority}-token-budget`, tokenLimit);
    if (priority === "interactive") {
      activeInteractiveTasks += 1;
    }

    try {
      const result = await input.task();
      if (!input.skipCache) {
        setCachedValue(input.cacheKey, result, input.ttlMs);
      }
      return result;
    } finally {
      if (priority === "interactive") {
        activeInteractiveTasks = Math.max(0, activeInteractiveTasks - 1);
      }
    }
  })();

  inFlight.set(input.cacheKey, runner);

  try {
    return await runner;
  } finally {
    if (inFlight.get(input.cacheKey) === runner) {
      inFlight.delete(input.cacheKey);
    }
  }
}

export type LLMExecutionMode = "blocking" | "cache-first" | "off";

export function estimateTokensFromText(...parts: Array<string | undefined>) {
  const length = parts.join(" ").trim().length;
  return Math.max(32, Math.ceil(length / 3.2));
}

export async function executeLLMTask<T>(input: {
  cacheKey: string;
  ttlMs: number;
  petId?: string;
  userId?: string;
  estimatedTokens: number;
  mode?: LLMExecutionMode;
  priority?: LLMTaskPriority;
  skipCache?: boolean;
  fallbackValue?: T;
  task: () => Promise<T>;
}) {
  if (!input.skipCache) {
    const cached = getCachedValue<T>(input.cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  if (input.mode === "off") {
    if (input.fallbackValue !== undefined) {
      return input.fallbackValue;
    }

    throw new Error("llm-disabled");
  }

  if (input.mode === "cache-first" && input.fallbackValue !== undefined) {
    void runLLMTask(input).catch(() => undefined);
    return input.fallbackValue;
  }

  return runLLMTask(input);
}
