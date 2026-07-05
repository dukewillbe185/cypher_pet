create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key,
  email text not null unique,
  handle text not null unique,
  display_name text not null,
  bio text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  species text not null check (species in ('cat', 'dog')),
  breed text,
  bio text,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  active_generation_id uuid,
  is_frozen boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.source_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  size_bytes integer not null,
  original_filename text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pet_generations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  source_photo_id uuid not null references public.source_photos (id) on delete cascade,
  provider_job_id text not null unique,
  status text not null check (status in ('queued', 'processing', 'succeeded', 'failed')),
  prompt_seed text not null,
  world_sprite_path text,
  appearance_seed text not null,
  palette_name text not null,
  error text,
  attempts integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pets
  add constraint pets_active_generation_id_fkey
  foreign key (active_generation_id) references public.pet_generations (id)
  on delete set null;

create table if not exists public.garden_zones (
  id text primary key check (id in ('orchard', 'pond', 'grove', 'dog-run')),
  name text not null,
  description text not null,
  accent text not null,
  species_bias text not null check (species_bias in ('cat', 'dog', 'all'))
);

create table if not exists public.pet_states (
  pet_id uuid primary key references public.pets (id) on delete cascade,
  zone_id text not null references public.garden_zones (id) on delete restrict,
  tile_x integer not null,
  tile_y integer not null,
  facing text not null check (facing in ('up', 'down', 'left', 'right')),
  mood text not null check (mood in ('happy', 'curious', 'playful', 'sleepy', 'lonely', 'grumpy', 'dirty')),
  activity text not null check (activity in ('idle', 'wander', 'sleep', 'eat', 'climb_tree', 'hide', 'poop', 'chase', 'scuffle', 'seek_owner', 'play')),
  energy integer not null default 50,
  hunger integer not null default 50,
  hygiene integer not null default 50,
  bladder integer not null default 50,
  social integer not null default 50,
  stress integer not null default 50,
  action_ends_at timestamptz not null default now(),
  last_simulated_at timestamptz not null default now()
);

create table if not exists public.pet_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  zone_id text not null references public.garden_zones (id) on delete restrict,
  type text not null check (type in ('mood_change', 'pooped', 'climbed_tree', 'scuffle', 'chased', 'slept', 'owner_action')),
  body text not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.world_objects (
  id uuid primary key default gen_random_uuid(),
  zone_id text not null references public.garden_zones (id) on delete restrict,
  type text not null check (type in ('tree', 'bush', 'pond_edge', 'toy', 'poop', 'rest_spot', 'doghouse', 'pet_bed', 'butterfly', 'stone')),
  tile_x integer not null,
  tile_y integer not null,
  pet_id uuid references public.pets (id) on delete set null,
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create table if not exists public.pet_relationships (
  id uuid primary key default gen_random_uuid(),
  pet_a_id uuid not null references public.pets (id) on delete cascade,
  pet_b_id uuid not null references public.pets (id) on delete cascade,
  affinity integer not null default 0,
  rivalry integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (pet_a_id, pet_b_id)
);

create table if not exists public.owner_actions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  action text not null check (action in ('feed', 'pet', 'throw_toy', 'clean_poop')),
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('mood_change', 'important_event', 'system')),
  pet_id uuid references public.pets (id) on delete set null,
  event_id uuid references public.pet_events (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('pet', 'pet_event')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  resolution_action text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.source_photos enable row level security;
alter table public.pet_generations enable row level security;
alter table public.garden_zones enable row level security;
alter table public.pet_states enable row level security;
alter table public.pet_events enable row level security;
alter table public.world_objects enable row level security;
alter table public.pet_relationships enable row level security;
alter table public.owner_actions enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

create policy "profiles_select_visible"
on public.profiles
for select
using (true);

create policy "pets_select_public_or_own"
on public.pets
for select
using (visibility = 'public' or owner_id = auth.uid());

create policy "pets_insert_own"
on public.pets
for insert
with check (owner_id = auth.uid());

create policy "pets_update_own"
on public.pets
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "source_photos_own_only"
on public.source_photos
for all
using (
  exists (
    select 1 from public.pets
    where public.pets.id = source_photos.pet_id
      and public.pets.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.pets
    where public.pets.id = source_photos.pet_id
      and public.pets.owner_id = auth.uid()
  )
);

create policy "pet_generations_select_public_or_own"
on public.pet_generations
for select
using (
  exists (
    select 1 from public.pets
    where public.pets.id = pet_generations.pet_id
      and (public.pets.visibility = 'public' or public.pets.owner_id = auth.uid())
  )
);

create policy "pet_generations_insert_own"
on public.pet_generations
for insert
with check (
  exists (
    select 1 from public.pets
    where public.pets.id = pet_generations.pet_id
      and public.pets.owner_id = auth.uid()
  )
);

create policy "garden_zones_select_all"
on public.garden_zones
for select
using (true);

create policy "pet_states_select_visible"
on public.pet_states
for select
using (
  exists (
    select 1 from public.pets
    where public.pets.id = pet_states.pet_id
      and public.pets.is_frozen = false
      and (public.pets.visibility = 'public' or public.pets.owner_id = auth.uid())
  )
);

create policy "pet_states_update_own"
on public.pet_states
for update
using (
  exists (
    select 1 from public.pets
    where public.pets.id = pet_states.pet_id
      and public.pets.owner_id = auth.uid()
  )
);

create policy "pet_events_select_visible"
on public.pet_events
for select
using (
  hidden = false
  and exists (
    select 1 from public.pets
    where public.pets.id = pet_events.pet_id
      and public.pets.is_frozen = false
      and (public.pets.visibility = 'public' or public.pets.owner_id = auth.uid())
  )
);

create policy "world_objects_select_all_visible_zones"
on public.world_objects
for select
using (removed_at is null);

create policy "owner_actions_select_own"
on public.owner_actions
for select
using (owner_id = auth.uid());

create policy "owner_actions_insert_own"
on public.owner_actions
for insert
with check (owner_id = auth.uid());

create policy "notifications_select_own"
on public.notifications
for select
using (user_id = auth.uid());

create policy "reports_insert_authenticated"
on public.reports
for insert
with check (reporter_user_id = auth.uid());

create policy "reports_select_own"
on public.reports
for select
using (reporter_user_id = auth.uid());

insert into public.garden_zones (id, name, description, accent, species_bias)
values
  ('orchard', '果树区', '树高，猫多，适合突然消失在枝叶里。', '#62EFFF', 'cat'),
  ('pond', '水池区', '相对平静，适合发呆和恢复体力。', '#9AE6B4', 'all'),
  ('grove', '灌木区', '藏得住秘密，也藏得住便便。', '#FDE68A', 'all'),
  ('dog-run', '追逐区', '开阔、热闹、经常突然起跑。', '#FB7185', 'dog')
on conflict (id) do nothing;

comment on table public.garden_zones is 'Cypher Garden public world zones';
comment on table public.pet_states is 'Live simulated state for each pet in the garden';
comment on table public.pet_events is 'Owner-facing pet journal and world events';
