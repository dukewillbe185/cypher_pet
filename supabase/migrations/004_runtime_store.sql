create table if not exists public.app_runtime_store (
  id integer primary key check (id = 1),
  schema_version integer not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
