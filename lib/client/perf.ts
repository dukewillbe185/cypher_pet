"use client";

const enabled = process.env.NODE_ENV !== "production";

export function markPerformance(name: string) {
  if (typeof performance === "undefined") {
    return;
  }

  performance.mark(name);
}

export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof performance === "undefined") {
    return;
  }

  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, "measure");
    const entry = entries.at(-1);

    if (enabled && entry) {
      console.info(`[perf] ${name}: ${entry.duration.toFixed(1)}ms`);
    }
  } catch {
    // ignore missing marks
  }
}
