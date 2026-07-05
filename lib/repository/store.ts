import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool, type PoolClient } from "pg";

import { env } from "@/lib/env";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore } from "@/lib/types";

const runtimeStorePath = path.join(process.cwd(), "storage", "mock-db.runtime.json");
const STORE_SCHEMA_VERSION = 7;
const POSTGRES_STORE_ROW_ID = 1;
let mutationQueue = Promise.resolve();

declare global {
  // Reuse the pool across hot reloads in dev.
  var __cypherPgPool: Pool | undefined;
}

type RuntimeStoreRow = {
  schema_version: number;
  payload: string;
};

function isPostgresStoreEnabled() {
  return Boolean(env.databaseUrl);
}

export function getPostgresPool() {
  if (!env.databaseUrl) {
    return null;
  }

  if (!globalThis.__cypherPgPool) {
    globalThis.__cypherPgPool = new Pool({
      connectionString: env.databaseUrl,
      max: 8,
    });
  }

  return globalThis.__cypherPgPool;
}

async function persistStoreToFile(store: AppStore) {
  await mkdir(path.dirname(runtimeStorePath), { recursive: true });
  const tempPath = `${runtimeStorePath}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  await writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
  await rename(tempPath, runtimeStorePath);
}

async function ensureRuntimeStore() {
  try {
    await access(runtimeStorePath);
  } catch {
    await persistStoreToFile(seedStore);
  }
}

function isGardenStoreShape(store: unknown): store is Omit<AppStore, "schemaVersion" | "gardenEncounterThreads"> & {
  schemaVersion?: number;
  gardenEncounterThreads?: unknown;
} {
  if (!store || typeof store !== "object") {
    return false;
  }

  const record = store as Partial<AppStore>;

  return (
    Array.isArray(record.profiles) &&
    Array.isArray(record.pets) &&
    Array.isArray(record.sourcePhotos) &&
    Array.isArray(record.petGenerations) &&
    Array.isArray(record.gardenZones) &&
    Array.isArray(record.petStates) &&
    Array.isArray(record.petEvents) &&
    Array.isArray(record.worldObjects) &&
    Array.isArray(record.petRelationships) &&
    Array.isArray(record.petMemories) &&
    Array.isArray(record.petAutonomyProfiles) &&
    Array.isArray(record.petMemoryDigests) &&
    Array.isArray(record.petSemanticMemoryDigests) &&
    Array.isArray(record.gardenLedgerEvents) &&
    Array.isArray(record.gardenSemanticFacts) &&
    Array.isArray(record.petGoals) &&
    Array.isArray(record.pairRelationshipModels) &&
    Array.isArray(record.conversationSummaries) &&
    Array.isArray(record.petChatTraces) &&
    Array.isArray(record.ownerActions) &&
    Array.isArray(record.chatSessions) &&
    Array.isArray(record.notifications) &&
    Array.isArray(record.reports)
  );
}

function normalizeStore(store: unknown): AppStore | null {
  if (!isGardenStoreShape(store)) {
    return null;
  }

  const record = store as Partial<AppStore>;

  return {
    ...store,
    schemaVersion: STORE_SCHEMA_VERSION,
    gardenEncounterThreads: Array.isArray(store.gardenEncounterThreads)
      ? store.gardenEncounterThreads as AppStore["gardenEncounterThreads"]
      : [],
    gardenPresences: Array.isArray(record.gardenPresences) ? record.gardenPresences : [],
  } as AppStore;
}

function parseStorePayload(payload: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(payload) as unknown;
  } catch {
    return null;
  }

  return normalizeStore(parsed);
}

async function readStoreFromFile() {
  await ensureRuntimeStore();
  const payload = await readFile(runtimeStorePath, "utf8");
  const parsed = parseStorePayload(payload);

  if (parsed) {
    return parsed;
  }

  await persistStoreToFile(seedStore);
  return structuredClone(seedStore);
}

async function ensurePostgresStoreTable(client: Pool | PoolClient) {
  await client.query(`
    create table if not exists public.app_runtime_store (
      id integer primary key check (id = ${POSTGRES_STORE_ROW_ID}),
      schema_version integer not null,
      payload jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);
}

async function writeStoreToPostgres(client: Pool | PoolClient, store: AppStore) {
  await client.query(
    `
      insert into public.app_runtime_store (id, schema_version, payload, updated_at)
      values ($1, $2, $3::jsonb, now())
      on conflict (id)
      do update
        set schema_version = excluded.schema_version,
            payload = excluded.payload,
            updated_at = excluded.updated_at
    `,
    [POSTGRES_STORE_ROW_ID, store.schemaVersion, JSON.stringify(store)],
  );
}

async function readPostgresStoreRow(client: Pool | PoolClient, options?: { forUpdate?: boolean }) {
  const suffix = options?.forUpdate ? " for update" : "";
  return client.query<RuntimeStoreRow>(
    `select schema_version, payload::text as payload from public.app_runtime_store where id = $1${suffix}`,
    [POSTGRES_STORE_ROW_ID],
  );
}

async function repairPostgresStore(client: Pool | PoolClient, store: AppStore) {
  await writeStoreToPostgres(client, store);
  return structuredClone(store);
}

async function ensureSeededPostgresStore(client: Pool | PoolClient) {
  await ensurePostgresStoreTable(client);

  const existing = await readPostgresStoreRow(client);
  if (existing.rowCount && existing.rows[0]) {
    const parsed = parseStorePayload(existing.rows[0].payload);
    if (parsed) {
      return parsed;
    }

    return repairPostgresStore(client, seedStore);
  }

  const initialStore = await readStoreFromFile();
  await writeStoreToPostgres(client, initialStore);
  return structuredClone(initialStore);
}

async function readStoreFromPostgres() {
  const pool = getPostgresPool();

  if (!pool) {
    throw new Error("postgres-store-not-configured");
  }

  return ensureSeededPostgresStore(pool);
}

export async function readStore() {
  if (isPostgresStoreEnabled()) {
    return readStoreFromPostgres();
  }

  return readStoreFromFile();
}

export async function queryStore<T>(reader: (store: AppStore) => T | Promise<T>) {
  const store = await readStore();
  return reader(store);
}

async function mutatePostgresStore<T>(mutator: (store: AppStore) => T | Promise<T>) {
  const pool = getPostgresPool();

  if (!pool) {
    throw new Error("postgres-store-not-configured");
  }

  const client = await pool.connect();

  try {
    await client.query("begin");
    await ensurePostgresStoreTable(client);

    let resultRow = await readPostgresStoreRow(client, { forUpdate: true });
    if (!resultRow.rowCount) {
      const initialStore = await readStoreFromFile();
      await writeStoreToPostgres(client, initialStore);
      resultRow = await readPostgresStoreRow(client, { forUpdate: true });
    }

    const currentRow = resultRow.rows[0];
    const parsed = currentRow ? parseStorePayload(currentRow.payload) : null;
    const store = parsed ? structuredClone(parsed) : structuredClone(seedStore);

    if (!parsed) {
      await writeStoreToPostgres(client, store);
    }

    const result = await mutator(store);
    await writeStoreToPostgres(client, store);
    await client.query("commit");
    return result;
  } catch (error) {
    try {
      await client.query("rollback");
    } catch {
      // ignore rollback errors
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function mutateStore<T>(
  mutator: (store: AppStore) => T | Promise<T>,
) {
  const runMutation = async () => {
    if (isPostgresStoreEnabled()) {
      return mutatePostgresStore(mutator);
    }

    const store = await readStoreFromFile();
    const result = await mutator(store);
    await persistStoreToFile(store);
    return result;
  };

  const nextMutation = mutationQueue.then(runMutation, runMutation);
  mutationQueue = nextMutation.then(
    () => undefined,
    () => undefined,
  );

  return nextMutation;
}
