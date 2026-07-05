import type { GardenZoneId } from "@/lib/types";

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCsv<T extends string>(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) as T[];
}

function normalizeUrl(value: string | undefined, fallback: string) {
  const candidate = value?.trim() || fallback;
  return candidate.replace(/\/+$/, "");
}

const defaultLlmBaseUrl = normalizeUrl(process.env.LLM_BASE_URL, "http://127.0.0.1:8888/v1");
const gardenTickIntervalMs = parseNumber(process.env.GARDEN_TICK_INTERVAL_MS, 15000);

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  posthogKey: process.env.POSTHOG_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost:
    process.env.POSTHOG_HOST ??
    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
    "https://us.i.posthog.com",
  sentryDsn: process.env.SENTRY_DSN,
  imageProvider: process.env.IMAGE_PROVIDER ?? "mock",
  imageProviderWebhookSecret:
    process.env.IMAGE_PROVIDER_WEBHOOK_SECRET ?? "cypher-local-secret",
  llmProvider: process.env.LLM_PROVIDER ?? "qwen",
  llmBaseUrl: defaultLlmBaseUrl,
  llmApiKey: process.env.LLM_API_KEY ?? "",
  llmModelChat:
    process.env.LLM_MODEL_CHAT ?? "Qwen3.5-35B-A3B-4bit",
  llmModelNarration:
    process.env.LLM_MODEL_NARRATION ?? "Qwen3.5-35B-A3B-4bit",
  llmModelSocial:
    process.env.LLM_MODEL_SOCIAL ?? "Qwen3.5-35B-A3B-4bit",
  llmModelAction:
    process.env.LLM_MODEL_ACTION ?? "Qwen3.5-35B-A3B-4bit",
  llmBridgePython: process.env.LLM_BRIDGE_PYTHON ?? "python3",
  llmBridgeScript: process.env.LLM_BRIDGE_SCRIPT ?? "",
  llmBridgeModelPath: process.env.LLM_BRIDGE_MODEL_PATH ?? "",
  llmTimeoutMs: parseNumber(process.env.LLM_TIMEOUT_MS, 25000),
  llmRateLimitPerPet: parseNumber(process.env.LLM_RATE_LIMIT_PER_PET, 3),
  llmRateLimitPerUser: parseNumber(process.env.LLM_RATE_LIMIT_PER_USER, 10),
  llmGlobalTokenBudgetPerMinute: parseNumber(process.env.LLM_GLOBAL_TOKEN_BUDGET_PER_MINUTE, 24000),
  llmInteractiveRateLimitPerPet: parseNumber(process.env.LLM_INTERACTIVE_RATE_LIMIT_PER_PET, 18),
  llmInteractiveRateLimitPerUser: parseNumber(process.env.LLM_INTERACTIVE_RATE_LIMIT_PER_USER, 30),
  llmInteractiveTokenBudgetPerMinute: parseNumber(process.env.LLM_INTERACTIVE_TOKEN_BUDGET_PER_MINUTE, 72000),
  llmAutonomyEnabled: parseBoolean(process.env.LLM_AUTONOMY_ENABLED, true),
  llmAutonomyPublicOnly: parseBoolean(process.env.LLM_AUTONOMY_PUBLIC_ONLY, false),
  llmAutonomyZones: parseCsv<GardenZoneId>(process.env.LLM_AUTONOMY_ZONES),
  gardenBackgroundTickEnabled: parseBoolean(process.env.GARDEN_BACKGROUND_TICK_ENABLED, false),
  gardenTickSecret: process.env.GARDEN_TICK_SECRET ?? "cypher-local-tick",
  gardenTickIntervalMs,
  gardenTickMaterialize: parseBoolean(process.env.GARDEN_TICK_MATERIALIZE, false),
  gardenTickMaterializeMinIntervalMs: parseNumber(
    process.env.GARDEN_TICK_MATERIALIZE_MIN_INTERVAL_MS,
    60000,
  ),
  demoAdminEmail:
    process.env.CYPHER_DEMO_ADMIN_EMAIL ?? "admin@cypher.pet",
};

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function isPosthogConfigured() {
  return Boolean(env.posthogKey);
}

export function isSentryConfigured() {
  return Boolean(env.sentryDsn);
}
