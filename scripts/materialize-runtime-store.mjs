import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import pg from "pg";

const { Pool } = pg;
const runtimeStorePath = path.join(process.cwd(), "storage", "mock-db.runtime.json");
const runtimeStoreRowId = 1;
const scriptEntryHref = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;
const isDirectRun = scriptEntryHref === import.meta.url;

if (isDirectRun && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // `.env.local` is optional when env vars are provided explicitly.
  }
}

const projectionDropSql = `
drop table if exists public.runtime_projection_meta;
drop table if exists public.runtime_profiles;
drop table if exists public.runtime_pets;
drop table if exists public.runtime_source_photos;
drop table if exists public.runtime_pet_generations;
drop table if exists public.runtime_garden_zones;
drop table if exists public.runtime_pet_states;
drop table if exists public.runtime_pet_events;
drop table if exists public.runtime_world_objects;
drop table if exists public.runtime_pet_relationships;
drop table if exists public.runtime_pet_memories;
drop table if exists public.runtime_pet_autonomy_profiles;
drop table if exists public.runtime_pet_memory_digests;
drop table if exists public.runtime_pet_semantic_memory_digests;
drop table if exists public.runtime_garden_ledger_events;
drop table if exists public.runtime_garden_semantic_facts;
drop table if exists public.runtime_pet_goals;
drop table if exists public.runtime_pair_relationship_models;
drop table if exists public.runtime_conversation_summaries;
drop table if exists public.runtime_pet_chat_traces;
drop table if exists public.runtime_owner_actions;
drop table if exists public.runtime_chat_sessions;
drop table if exists public.runtime_chat_messages;
drop table if exists public.runtime_notifications;
drop table if exists public.runtime_reports;
`;

const projectionSchemaSql = `
create table if not exists public.runtime_projection_meta (
  id integer primary key check (id = 1),
  source_store text not null,
  source_updated_at timestamptz,
  projected_at timestamptz not null default now()
);

create table if not exists public.runtime_profiles (
  id text primary key,
  email text not null,
  handle text not null,
  display_name text not null,
  bio text not null default '',
  role text not null,
  created_at timestamptz not null
);

create table if not exists public.runtime_pets (
  id text primary key,
  owner_id text not null,
  name text not null,
  species text not null,
  breed text,
  bio text,
  visibility text not null,
  active_generation_id text,
  is_frozen boolean not null default false,
  created_at timestamptz not null
);

create table if not exists public.runtime_source_photos (
  id text primary key,
  pet_id text not null,
  storage_path text not null,
  mime_type text not null,
  size_bytes integer not null,
  original_filename text not null,
  created_at timestamptz not null
);

create table if not exists public.runtime_pet_generations (
  id text primary key,
  pet_id text not null,
  source_photo_id text not null,
  provider_job_id text not null,
  status text not null,
  prompt_seed text not null,
  world_sprite_path text,
  appearance_seed text not null,
  palette_name text not null,
  error text,
  attempts integer not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_garden_zones (
  id text primary key,
  name text not null,
  description text not null,
  accent text not null,
  species_bias text not null
);

create table if not exists public.runtime_pet_states (
  pet_id text primary key,
  zone_id text not null,
  tile_x integer not null,
  tile_y integer not null,
  facing text not null,
  mood text not null,
  activity text not null,
  energy numeric not null,
  hunger numeric not null,
  hygiene numeric not null,
  bladder numeric not null,
  social numeric not null,
  stress numeric not null,
  action_ends_at timestamptz not null,
  last_simulated_at timestamptz not null,
  current_bubble jsonb,
  last_autonomy_decision jsonb,
  active_goals jsonb,
  conversation_summary text,
  last_chat_trace jsonb,
  last_known_zone_preference text
);

create table if not exists public.runtime_pet_events (
  id text primary key,
  pet_id text not null,
  zone_id text not null,
  type text not null,
  body text not null,
  hidden boolean not null default false,
  created_at timestamptz not null,
  related_pet_id text,
  emotion text,
  social_lines jsonb,
  narration_source text
);

create table if not exists public.runtime_world_objects (
  id text primary key,
  zone_id text not null,
  type text not null,
  tile_x integer not null,
  tile_y integer not null,
  pet_id text,
  created_at timestamptz not null,
  removed_at timestamptz
);

create table if not exists public.runtime_pet_relationships (
  id text primary key,
  pet_a_id text not null,
  pet_b_id text not null,
  affinity integer not null,
  rivalry integer not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pet_memories (
  id text primary key,
  pet_id text not null,
  kind text not null,
  body text not null,
  zone_id text,
  related_pet_id text,
  weight integer not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pet_autonomy_profiles (
  id text primary key,
  pet_id text not null,
  source text not null,
  core_identity text not null,
  identity_narrative text not null,
  motivations jsonb not null,
  comfort_sources jsonb not null,
  stress_signals jsonb not null,
  social_strategy text not null,
  attachment_style text not null,
  conflict_style text not null,
  favorite_activities jsonb not null,
  avoided_activities jsonb not null,
  daily_rhythm text not null,
  owner_bond_style text not null,
  revision integer not null,
  confidence numeric not null,
  refresh_reason text not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pet_memory_digests (
  pet_id text primary key,
  source text not null,
  summary text not null,
  social_summary text not null,
  active_drives jsonb not null,
  notable_memories jsonb not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pet_semantic_memory_digests (
  pet_id text primary key,
  source text not null,
  summary text not null,
  long_term_preferences jsonb not null,
  long_term_aversions jsonb not null,
  social_judgments jsonb not null,
  place_meanings jsonb not null,
  object_meanings jsonb not null,
  owner_interaction_pattern text not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_garden_ledger_events (
  id text primary key,
  type text not null,
  participants jsonb not null,
  zone_id text not null,
  object_id text,
  salience integer not null,
  body text not null,
  semantic_tags jsonb not null,
  created_at timestamptz not null
);

create table if not exists public.runtime_garden_semantic_facts (
  id text primary key,
  subject_type text not null,
  subject_id text not null,
  predicate text not null,
  object_type text not null,
  object_id text,
  object_label text not null,
  weight integer not null,
  evidence_event_ids jsonb not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pet_goals (
  id text primary key,
  pet_id text not null,
  goal_type text not null,
  priority integer not null,
  target_pet_id text,
  target_zone_id text,
  target_object_id text,
  status text not null,
  progress integer not null,
  expires_at timestamptz,
  reason text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pair_relationship_models (
  id text primary key,
  pet_a_id text not null,
  pet_b_id text not null,
  trust integer not null,
  play_compatibility integer not null,
  intimidation integer not null,
  curiosity integer not null,
  resentment integer not null,
  attachment_pattern text not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_conversation_summaries (
  id text primary key,
  pet_id text not null,
  user_id text not null,
  summary text not null,
  highlights jsonb not null,
  source text not null,
  turn_count integer not null,
  updated_at timestamptz not null
);

create table if not exists public.runtime_pet_chat_traces (
  id text primary key,
  pet_id text not null,
  user_id text not null,
  session_id text,
  provider text not null,
  source text not null,
  finish_reason text not null,
  elapsed_ms integer not null,
  token_count integer not null,
  truncated boolean not null,
  repaired boolean not null,
  fallback_reason text,
  prompt_digest text not null,
  created_at timestamptz not null
);

create table if not exists public.runtime_owner_actions (
  id text primary key,
  owner_id text not null,
  pet_id text not null,
  action text not null,
  summary text not null,
  created_at timestamptz not null
);

create table if not exists public.runtime_chat_sessions (
  id text primary key,
  pet_id text not null,
  user_id text not null,
  started_at timestamptz not null,
  last_message_at timestamptz not null,
  summary_id text,
  message_count integer not null,
  messages jsonb not null
);

create table if not exists public.runtime_chat_messages (
  id text primary key,
  session_id text not null,
  pet_id text not null,
  user_id text not null,
  participant_type text not null,
  participant_id text not null,
  content text not null,
  mood text,
  source text,
  created_at timestamptz not null
);

create table if not exists public.runtime_notifications (
  id text primary key,
  user_id text not null,
  kind text not null,
  pet_id text,
  event_id text,
  body text not null,
  created_at timestamptz not null,
  read_at timestamptz
);

create table if not exists public.runtime_reports (
  id text primary key,
  reporter_user_id text not null,
  target_type text not null,
  target_id text not null,
  reason text not null,
  status text not null,
  resolution_action text,
  created_at timestamptz not null,
  resolved_at timestamptz
);

create index if not exists idx_runtime_pets_owner_id on public.runtime_pets(owner_id);
create index if not exists idx_runtime_pet_states_zone_id on public.runtime_pet_states(zone_id);
create index if not exists idx_runtime_pet_events_zone_created on public.runtime_pet_events(zone_id, created_at desc);
create index if not exists idx_runtime_notifications_user_created on public.runtime_notifications(user_id, created_at desc);
create index if not exists idx_runtime_chat_messages_session_created on public.runtime_chat_messages(session_id, created_at);
`;

const truncateSql = `
truncate table
  public.runtime_projection_meta,
  public.runtime_profiles,
  public.runtime_pets,
  public.runtime_source_photos,
  public.runtime_pet_generations,
  public.runtime_garden_zones,
  public.runtime_pet_states,
  public.runtime_pet_events,
  public.runtime_world_objects,
  public.runtime_pet_relationships,
  public.runtime_pet_memories,
  public.runtime_pet_autonomy_profiles,
  public.runtime_pet_memory_digests,
  public.runtime_pet_semantic_memory_digests,
  public.runtime_garden_ledger_events,
  public.runtime_garden_semantic_facts,
  public.runtime_pet_goals,
  public.runtime_pair_relationship_models,
  public.runtime_conversation_summaries,
  public.runtime_pet_chat_traces,
  public.runtime_owner_actions,
  public.runtime_chat_sessions,
  public.runtime_chat_messages,
  public.runtime_notifications,
  public.runtime_reports
`;

const insertSql = [
  `
  with store as (
    select payload, updated_at
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_profiles (id, email, handle, display_name, bio, role, created_at)
  select rec.id, rec.email, rec.handle, rec."displayName", coalesce(rec.bio, ''), rec.role, nullif(rec."createdAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'profiles', '[]'::jsonb))
    as rec(id text, email text, handle text, "displayName" text, bio text, role text, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pets (id, owner_id, name, species, breed, bio, visibility, active_generation_id, is_frozen, created_at)
  select rec.id, rec."ownerId", rec.name, rec.species, rec.breed, rec.bio, rec.visibility, rec."activeGenerationId", coalesce(rec."isFrozen", false), nullif(rec."createdAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'pets', '[]'::jsonb))
    as rec(id text, "ownerId" text, name text, species text, breed text, bio text, visibility text, "activeGenerationId" text, "isFrozen" boolean, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_source_photos (id, pet_id, storage_path, mime_type, size_bytes, original_filename, created_at)
  select rec.id, rec."petId", rec."storagePath", rec."mimeType", rec."sizeBytes", rec."originalFilename", nullif(rec."createdAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'sourcePhotos', '[]'::jsonb))
    as rec(id text, "petId" text, "storagePath" text, "mimeType" text, "sizeBytes" integer, "originalFilename" text, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_generations (id, pet_id, source_photo_id, provider_job_id, status, prompt_seed, world_sprite_path, appearance_seed, palette_name, error, attempts, created_at, updated_at)
  select rec.id, rec."petId", rec."sourcePhotoId", rec."providerJobId", rec.status, rec."promptSeed", rec."worldSpritePath", rec."appearanceSeed", rec."paletteName", rec.error, rec.attempts, nullif(rec."createdAt", '')::timestamptz, nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petGenerations', '[]'::jsonb))
    as rec(id text, "petId" text, "sourcePhotoId" text, "providerJobId" text, status text, "promptSeed" text, "worldSpritePath" text, "appearanceSeed" text, "paletteName" text, error text, attempts integer, "createdAt" text, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_garden_zones (id, name, description, accent, species_bias)
  select rec.id, rec.name, rec.description, rec.accent, rec."speciesBias"
  from store, jsonb_to_recordset(coalesce(store.payload->'gardenZones', '[]'::jsonb))
    as rec(id text, name text, description text, accent text, "speciesBias" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_states (
    pet_id, zone_id, tile_x, tile_y, facing, mood, activity, energy, hunger, hygiene, bladder, social, stress,
    action_ends_at, last_simulated_at, current_bubble, last_autonomy_decision, active_goals, conversation_summary, last_chat_trace, last_known_zone_preference
  )
  select
    rec."petId", rec."zoneId", rec."tileX", rec."tileY", rec.facing, rec.mood, rec.activity, rec.energy, rec.hunger, rec.hygiene, rec.bladder, rec.social, rec.stress,
    nullif(rec."actionEndsAt", '')::timestamptz,
    nullif(rec."lastSimulatedAt", '')::timestamptz,
    rec."currentBubble",
    rec."lastAutonomyDecision",
    rec."activeGoals",
    rec."conversationSummary",
    rec."lastChatTrace",
    rec."lastKnownZonePreference"
  from store, jsonb_to_recordset(coalesce(store.payload->'petStates', '[]'::jsonb))
    as rec(
      "petId" text, "zoneId" text, "tileX" integer, "tileY" integer, facing text, mood text, activity text,
      energy numeric, hunger numeric, hygiene numeric, bladder numeric, social numeric, stress numeric,
      "actionEndsAt" text, "lastSimulatedAt" text, "currentBubble" jsonb, "lastAutonomyDecision" jsonb,
      "activeGoals" jsonb, "conversationSummary" text, "lastChatTrace" jsonb, "lastKnownZonePreference" text
    )
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_events (
    id, pet_id, zone_id, type, body, hidden, created_at, related_pet_id, emotion, social_lines, narration_source
  )
  select
    rec.id, rec."petId", rec."zoneId", rec.type, rec.body, coalesce(rec.hidden, false), nullif(rec."createdAt", '')::timestamptz,
    rec."relatedPetId", rec.emotion, rec."socialLines", rec."narrationSource"
  from store, jsonb_to_recordset(coalesce(store.payload->'petEvents', '[]'::jsonb))
    as rec(id text, "petId" text, "zoneId" text, type text, body text, hidden boolean, "createdAt" text, "relatedPetId" text, emotion text, "socialLines" jsonb, "narrationSource" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_world_objects (id, zone_id, type, tile_x, tile_y, pet_id, created_at, removed_at)
  select rec.id, rec."zoneId", rec.type, rec."tileX", rec."tileY", rec."petId", nullif(rec."createdAt", '')::timestamptz, nullif(rec."removedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'worldObjects', '[]'::jsonb))
    as rec(id text, "zoneId" text, type text, "tileX" integer, "tileY" integer, "petId" text, "createdAt" text, "removedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_relationships (id, pet_a_id, pet_b_id, affinity, rivalry, updated_at)
  select rec.id, rec."petAId", rec."petBId", rec.affinity, rec.rivalry, nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petRelationships', '[]'::jsonb))
    as rec(id text, "petAId" text, "petBId" text, affinity integer, rivalry integer, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_memories (id, pet_id, kind, body, zone_id, related_pet_id, weight, created_at, updated_at)
  select rec.id, rec."petId", rec.kind, rec.body, rec."zoneId", rec."relatedPetId", rec.weight, nullif(rec."createdAt", '')::timestamptz, nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petMemories', '[]'::jsonb))
    as rec(id text, "petId" text, kind text, body text, "zoneId" text, "relatedPetId" text, weight integer, "createdAt" text, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_autonomy_profiles (
    id, pet_id, source, core_identity, identity_narrative, motivations, comfort_sources, stress_signals, social_strategy, attachment_style,
    conflict_style, favorite_activities, avoided_activities, daily_rhythm, owner_bond_style, revision, confidence, refresh_reason, updated_at
  )
  select
    rec.id, rec."petId", rec.source, rec."coreIdentity", rec."identityNarrative", coalesce(rec.motivations, '[]'::jsonb), coalesce(rec."comfortSources", '[]'::jsonb),
    coalesce(rec."stressSignals", '[]'::jsonb), rec."socialStrategy", rec."attachmentStyle", rec."conflictStyle", coalesce(rec."favoriteActivities", '[]'::jsonb),
    coalesce(rec."avoidedActivities", '[]'::jsonb), rec."dailyRhythm", rec."ownerBondStyle", rec.revision, rec.confidence, rec."refreshReason", nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petAutonomyProfiles', '[]'::jsonb))
    as rec(
      id text, "petId" text, source text, "coreIdentity" text, "identityNarrative" text, motivations jsonb, "comfortSources" jsonb,
      "stressSignals" jsonb, "socialStrategy" text, "attachmentStyle" text, "conflictStyle" text, "favoriteActivities" jsonb,
      "avoidedActivities" jsonb, "dailyRhythm" text, "ownerBondStyle" text, revision integer, confidence numeric, "refreshReason" text, "updatedAt" text
    )
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_memory_digests (pet_id, source, summary, social_summary, active_drives, notable_memories, updated_at)
  select rec."petId", rec.source, rec.summary, rec."socialSummary", coalesce(rec."activeDrives", '[]'::jsonb), coalesce(rec."notableMemories", '[]'::jsonb), nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petMemoryDigests', '[]'::jsonb))
    as rec("petId" text, source text, summary text, "socialSummary" text, "activeDrives" jsonb, "notableMemories" jsonb, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_semantic_memory_digests (
    pet_id, source, summary, long_term_preferences, long_term_aversions, social_judgments, place_meanings, object_meanings, owner_interaction_pattern, updated_at
  )
  select
    rec."petId", rec.source, rec.summary, coalesce(rec."longTermPreferences", '[]'::jsonb), coalesce(rec."longTermAversions", '[]'::jsonb),
    coalesce(rec."socialJudgments", '[]'::jsonb), coalesce(rec."placeMeanings", '[]'::jsonb), coalesce(rec."objectMeanings", '[]'::jsonb),
    rec."ownerInteractionPattern", nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petSemanticMemoryDigests', '[]'::jsonb))
    as rec("petId" text, source text, summary text, "longTermPreferences" jsonb, "longTermAversions" jsonb, "socialJudgments" jsonb, "placeMeanings" jsonb, "objectMeanings" jsonb, "ownerInteractionPattern" text, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_garden_ledger_events (id, type, participants, zone_id, object_id, salience, body, semantic_tags, created_at)
  select rec.id, rec.type, coalesce(rec.participants, '[]'::jsonb), rec."zoneId", rec."objectId", rec.salience, rec.body, coalesce(rec."semanticTags", '[]'::jsonb), nullif(rec."createdAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'gardenLedgerEvents', '[]'::jsonb))
    as rec(id text, type text, participants jsonb, "zoneId" text, "objectId" text, salience integer, body text, "semanticTags" jsonb, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_garden_semantic_facts (
    id, subject_type, subject_id, predicate, object_type, object_id, object_label, weight, evidence_event_ids, updated_at
  )
  select
    rec.id, rec."subjectType", rec."subjectId", rec.predicate, rec."objectType", rec."objectId", rec."objectLabel", rec.weight, coalesce(rec."evidenceEventIds", '[]'::jsonb), nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'gardenSemanticFacts', '[]'::jsonb))
    as rec(id text, "subjectType" text, "subjectId" text, predicate text, "objectType" text, "objectId" text, "objectLabel" text, weight integer, "evidenceEventIds" jsonb, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_goals (
    id, pet_id, goal_type, priority, target_pet_id, target_zone_id, target_object_id, status, progress, expires_at, reason, created_at, updated_at
  )
  select
    rec.id, rec."petId", rec."goalType", rec.priority, rec."targetPetId", rec."targetZoneId", rec."targetObjectId", rec.status, rec.progress,
    nullif(rec."expiresAt", '')::timestamptz, rec.reason, nullif(rec."createdAt", '')::timestamptz, nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petGoals', '[]'::jsonb))
    as rec(id text, "petId" text, "goalType" text, priority integer, "targetPetId" text, "targetZoneId" text, "targetObjectId" text, status text, progress integer, "expiresAt" text, reason text, "createdAt" text, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pair_relationship_models (
    id, pet_a_id, pet_b_id, trust, play_compatibility, intimidation, curiosity, resentment, attachment_pattern, updated_at
  )
  select
    rec.id, rec."petAId", rec."petBId", rec.trust, rec."playCompatibility", rec.intimidation, rec.curiosity, rec.resentment, rec."attachmentPattern", nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'pairRelationshipModels', '[]'::jsonb))
    as rec(id text, "petAId" text, "petBId" text, trust integer, "playCompatibility" integer, intimidation integer, curiosity integer, resentment integer, "attachmentPattern" text, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_conversation_summaries (id, pet_id, user_id, summary, highlights, source, turn_count, updated_at)
  select rec.id, rec."petId", rec."userId", rec.summary, coalesce(rec.highlights, '[]'::jsonb), rec.source, rec."turnCount", nullif(rec."updatedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'conversationSummaries', '[]'::jsonb))
    as rec(id text, "petId" text, "userId" text, summary text, highlights jsonb, source text, "turnCount" integer, "updatedAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_pet_chat_traces (
    id, pet_id, user_id, session_id, provider, source, finish_reason, elapsed_ms, token_count, truncated, repaired, fallback_reason, prompt_digest, created_at
  )
  select
    rec.id, rec."petId", rec."userId", rec."sessionId", rec.provider, rec.source, rec."finishReason", rec."elapsedMs", rec."tokenCount",
    rec.truncated, rec.repaired, rec."fallbackReason", rec."promptDigest", nullif(rec."createdAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'petChatTraces', '[]'::jsonb))
    as rec(id text, "petId" text, "userId" text, "sessionId" text, provider text, source text, "finishReason" text, "elapsedMs" integer, "tokenCount" integer, truncated boolean, repaired boolean, "fallbackReason" text, "promptDigest" text, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_owner_actions (id, owner_id, pet_id, action, summary, created_at)
  select rec.id, rec."ownerId", rec."petId", rec.action, rec.summary, nullif(rec."createdAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'ownerActions', '[]'::jsonb))
    as rec(id text, "ownerId" text, "petId" text, action text, summary text, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_chat_sessions (id, pet_id, user_id, started_at, last_message_at, summary_id, message_count, messages)
  select
    rec.id, rec."petId", rec."userId", nullif(rec."startedAt", '')::timestamptz, nullif(rec."lastMessageAt", '')::timestamptz, rec."summaryId",
    jsonb_array_length(coalesce(rec.messages, '[]'::jsonb)), coalesce(rec.messages, '[]'::jsonb)
  from store, jsonb_to_recordset(coalesce(store.payload->'chatSessions', '[]'::jsonb))
    as rec(id text, "petId" text, "userId" text, messages jsonb, "startedAt" text, "lastMessageAt" text, "summaryId" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  ),
  sessions as (
    select
      rec.id as session_id,
      rec."petId" as pet_id,
      rec."userId" as user_id,
      coalesce(rec.messages, '[]'::jsonb) as messages
    from store, jsonb_to_recordset(coalesce(store.payload->'chatSessions', '[]'::jsonb))
      as rec(id text, "petId" text, "userId" text, messages jsonb, "startedAt" text, "lastMessageAt" text, "summaryId" text)
  )
  insert into public.runtime_chat_messages (
    id, session_id, pet_id, user_id, participant_type, participant_id, content, mood, source, created_at
  )
  select
    msg.id, sessions.session_id, sessions.pet_id, sessions.user_id, msg."participantType", msg."participantId", msg.content, msg.mood, msg.source, nullif(msg."createdAt", '')::timestamptz
  from sessions, jsonb_to_recordset(sessions.messages)
    as msg(id text, "participantType" text, "participantId" text, content text, mood text, source text, "createdAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_notifications (id, user_id, kind, pet_id, event_id, body, created_at, read_at)
  select rec.id, rec."userId", rec.kind, rec."petId", rec."eventId", rec.body, nullif(rec."createdAt", '')::timestamptz, nullif(rec."readAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'notifications', '[]'::jsonb))
    as rec(id text, "userId" text, kind text, "petId" text, "eventId" text, body text, "createdAt" text, "readAt" text)
  `,
  `
  with store as (
    select payload
    from public.app_runtime_store
    where id = ${runtimeStoreRowId}
  )
  insert into public.runtime_reports (id, reporter_user_id, target_type, target_id, reason, status, resolution_action, created_at, resolved_at)
  select rec.id, rec."reporterUserId", rec."targetType", rec."targetId", rec.reason, rec.status, rec."resolutionAction", nullif(rec."createdAt", '')::timestamptz, nullif(rec."resolvedAt", '')::timestamptz
  from store, jsonb_to_recordset(coalesce(store.payload->'reports', '[]'::jsonb))
    as rec(id text, "reporterUserId" text, "targetType" text, "targetId" text, reason text, status text, "resolutionAction" text, "createdAt" text, "resolvedAt" text)
  `,
  `
  insert into public.runtime_projection_meta (id, source_store, source_updated_at, projected_at)
  select 1, 'app_runtime_store', updated_at, now()
  from public.app_runtime_store
  where id = ${runtimeStoreRowId}
  `,
];

const countQueries = [
  ["runtime_profiles", "select count(*)::int as count from public.runtime_profiles"],
  ["runtime_pets", "select count(*)::int as count from public.runtime_pets"],
  ["runtime_pet_states", "select count(*)::int as count from public.runtime_pet_states"],
  ["runtime_pet_events", "select count(*)::int as count from public.runtime_pet_events"],
  ["runtime_notifications", "select count(*)::int as count from public.runtime_notifications"],
  ["runtime_chat_messages", "select count(*)::int as count from public.runtime_chat_messages"],
];

function timestamp() {
  return new Date().toISOString();
}

function serializeProjectionStatus(status) {
  return {
    sourceUpdatedAt: status.sourceUpdatedAt?.toISOString() ?? null,
    projectedAt: status.projectedAt?.toISOString() ?? null,
    projectedSourceUpdatedAt: status.projectedSourceUpdatedAt?.toISOString() ?? null,
  };
}

async function readProjectionStatus(client) {
  const sourceResult = await client.query(
    `
      select updated_at
      from public.app_runtime_store
      where id = $1
    `,
    [runtimeStoreRowId],
  );

  const metaTableResult = await client.query(
    "select to_regclass('public.runtime_projection_meta') as relation_name",
  );
  const hasProjectionMeta = Boolean(metaTableResult.rows[0]?.relation_name);

  if (!hasProjectionMeta) {
    return {
      sourceUpdatedAt: sourceResult.rows[0]?.updated_at ?? null,
      projectedAt: null,
      projectedSourceUpdatedAt: null,
    };
  }

  const metaResult = await client.query(
    `
      select source_updated_at, projected_at
      from public.runtime_projection_meta
      where id = 1
    `,
  );

  return {
    sourceUpdatedAt: sourceResult.rows[0]?.updated_at ?? null,
    projectedAt: metaResult.rows[0]?.projected_at ?? null,
    projectedSourceUpdatedAt: metaResult.rows[0]?.source_updated_at ?? null,
  };
}

export async function ensureRuntimeStoreRow(client) {
  await client.query(`
    create table if not exists public.app_runtime_store (
      id integer primary key check (id = ${runtimeStoreRowId}),
      schema_version integer not null,
      payload jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);

  const existing = await client.query(
    "select id from public.app_runtime_store where id = $1",
    [runtimeStoreRowId],
  );

  if (existing.rowCount) {
    return;
  }

  const raw = await readFile(runtimeStorePath, "utf8");
  const payload = JSON.parse(raw);

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
    [runtimeStoreRowId, payload.schemaVersion ?? 0, JSON.stringify(payload)],
  );
}

export async function materializeRuntimeStoreProjection(client, options = {}) {
  const { resetSchema = false } = options;

  await ensureRuntimeStoreRow(client);

  if (resetSchema) {
    await client.query(projectionDropSql);
  }

  await client.query(projectionSchemaSql);
  await client.query(truncateSql);

  for (const sql of insertSql) {
    await client.query(sql);
  }

  const counts = {};
  for (const [label, sql] of countQueries) {
    const result = await client.query(sql);
    counts[label] = result.rows[0]?.count ?? 0;
  }

  const status = await readProjectionStatus(client);
  return {
    skipped: false,
    resetSchema,
    counts,
    ...serializeProjectionStatus(status),
  };
}

export async function refreshRuntimeStoreProjection(options = {}) {
  const {
    client: providedClient,
    pool,
    force = false,
    resetSchema = false,
    minIntervalMs = 0,
  } = options;

  if (!providedClient && !pool) {
    throw new Error("projection-client-required");
  }

  const client = providedClient ?? (await pool.connect());
  const shouldReleaseClient = !providedClient;

  try {
    await client.query("begin");
    await ensureRuntimeStoreRow(client);
    await client.query(projectionSchemaSql);

    const status = await readProjectionStatus(client);
    const projectedAtMs = status.projectedAt?.getTime() ?? null;

    if (!force && minIntervalMs > 0 && projectedAtMs !== null) {
      const elapsedMs = Date.now() - projectedAtMs;
      if (elapsedMs < minIntervalMs) {
        await client.query("rollback");
        return {
          skipped: true,
          reason: "min-interval",
          minIntervalMs,
          ...serializeProjectionStatus(status),
        };
      }
    }

    if (
      !force &&
      status.sourceUpdatedAt &&
      status.projectedSourceUpdatedAt &&
      status.projectedSourceUpdatedAt.getTime() >= status.sourceUpdatedAt.getTime()
    ) {
      await client.query("rollback");
      return {
        skipped: true,
        reason: "up-to-date",
        ...serializeProjectionStatus(status),
      };
    }

    const result = await materializeRuntimeStoreProjection(client, { resetSchema });
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
    if (shouldReleaseClient) {
      client.release();
    }
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({
    connectionString,
    max: 4,
  });

  console.log(`[db:materialize] ${timestamp()} connecting`);

  try {
    const result = await refreshRuntimeStoreProjection({
      pool,
      force: true,
      resetSchema: true,
    });
    console.log(`[db:materialize] ${timestamp()} materialized runtime store into projection tables`);
    console.table(result.counts ?? {});
  } finally {
    await pool.end();
  }
}

if (isDirectRun) {
  main().catch((error) => {
    const message = error instanceof Error ? error.stack ?? error.message : String(error);
    console.error(`[db:materialize] ${timestamp()} failed\n${message}`);
    process.exitCode = 1;
  });
}
