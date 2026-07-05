if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // `.env.local` is optional; explicit shell env should still work.
  }
}

const tickSecret = process.env.GARDEN_TICK_SECRET ?? "cypher-local-tick";
const intervalMs = Number(process.env.GARDEN_TICK_INTERVAL_MS ?? "15000");
const baseUrl = (
  process.env.GARDEN_TICK_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://127.0.0.1:3000"
).replace(/\/+$/, "");
const tickUrl = `${baseUrl}/api/admin/garden/tick`;
const materialize = process.env.GARDEN_TICK_MATERIALIZE ?? "false";

let running = true;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timestamp() {
  return new Date().toISOString();
}

async function tickOnce() {
  const response = await fetch(tickUrl, {
    method: "POST",
    headers: {
      "x-garden-tick-secret": tickSecret,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? payload.error
        : `tick-failed:${response.status}`;
    throw new Error(String(message));
  }

  return payload;
}

async function run() {
  console.log(
    `[garden-worker] ${timestamp()} starting, interval=${intervalMs}ms, target=${tickUrl}, materialize=${materialize}`,
  );

  while (running) {
    const startedAt = Date.now();

    try {
      const result = await tickOnce();
      console.log(`[garden-worker] ${timestamp()} tick ok`, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[garden-worker] ${timestamp()} tick failed: ${message}`);
    }

    const elapsedMs = Date.now() - startedAt;
    const waitMs = Math.max(1000, intervalMs - elapsedMs);
    await sleep(waitMs);
  }

  console.log(`[garden-worker] ${timestamp()} stopped`);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    running = false;
  });
}

run().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(`[garden-worker] ${timestamp()} fatal: ${message}`);
  process.exitCode = 1;
});
