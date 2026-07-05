import { env, isSentryConfigured } from "@/lib/env";

type SentryModule = typeof import("@sentry/nextjs");

let initialized = false;
let initPromise: Promise<void> | null = null;
let sentryModulePromise: Promise<SentryModule> | null = null;

function loadSentryModule() {
  if (!sentryModulePromise) {
    // Avoid bundling the optional Sentry dependency into every route when DSN is unset.
    sentryModulePromise = new Function(
      "return import('@sentry/nextjs')",
    )() as Promise<SentryModule>;
  }

  return sentryModulePromise;
}

export async function initSentry() {
  if (initialized || !isSentryConfigured()) {
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const Sentry = await loadSentryModule();
      Sentry.init({
        dsn: env.sentryDsn,
        tracesSampleRate: 0.1,
      });
      initialized = true;
    })();
  }

  await initPromise;
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (!isSentryConfigured()) {
    console.error(error);
    return;
  }

  void initSentry()
    .then(() => loadSentryModule())
    .then((Sentry) => {
      Sentry.captureException(error, { extra: context });
    })
    .catch(() => {
      console.error(error);
    });
}
