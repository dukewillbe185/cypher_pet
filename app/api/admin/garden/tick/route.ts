import { env } from "@/lib/env";
import { runGardenTick } from "@/lib/repository";
import { getPostgresPool } from "@/lib/repository/store";
import { jsonError, jsonOk } from "@/lib/utils";
import { refreshRuntimeStoreProjection } from "@/scripts/materialize-runtime-store.mjs";

export async function POST(request: Request) {
  const tickSecret = request.headers.get("x-garden-tick-secret");

  if (!tickSecret || tickSecret !== env.gardenTickSecret) {
    return jsonError("invalid-tick-secret", 401);
  }

  try {
    const result = await runGardenTick({ llmMode: "off" });

    if (!env.gardenTickMaterialize) {
      return jsonOk(result);
    }

    if (!env.databaseUrl) {
      return jsonOk({
        ...result,
        projection: {
          skipped: true,
          reason: "postgres-store-disabled",
        },
      });
    }

    const pool = getPostgresPool();
    if (!pool) {
      return jsonOk({
        ...result,
        projection: {
          skipped: true,
          reason: "postgres-pool-unavailable",
        },
      });
    }

    try {
      const projection = await refreshRuntimeStoreProjection({
        pool,
        minIntervalMs: env.gardenTickMaterializeMinIntervalMs,
      });
      return jsonOk({
        ...result,
        projection,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "projection-refresh-failed";
      console.error("[garden-tick] projection refresh failed", error);

      return jsonOk({
        ...result,
        projection: {
          skipped: true,
          reason: "error",
          error: message,
        },
      });
    }
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "garden-tick-failed", 500);
  }
}
