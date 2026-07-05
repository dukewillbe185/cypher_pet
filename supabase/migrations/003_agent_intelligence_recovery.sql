CREATE TABLE IF NOT EXISTS garden_ledger_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  participants JSONB NOT NULL DEFAULT '[]'::jsonb,
  zone_id TEXT NOT NULL,
  object_id UUID,
  salience INT NOT NULL DEFAULT 48,
  body TEXT NOT NULL,
  semantic_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS garden_semantic_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type TEXT NOT NULL,
  subject_id UUID NOT NULL,
  predicate TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id UUID,
  object_label TEXT NOT NULL,
  weight INT NOT NULL DEFAULT 42,
  evidence_event_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_semantic_memory_digests (
  pet_id UUID PRIMARY KEY REFERENCES pets(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'derived',
  summary TEXT NOT NULL,
  long_term_preferences JSONB NOT NULL DEFAULT '[]'::jsonb,
  long_term_aversions JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_judgments JSONB NOT NULL DEFAULT '[]'::jsonb,
  place_meanings JSONB NOT NULL DEFAULT '[]'::jsonb,
  object_meanings JSONB NOT NULL DEFAULT '[]'::jsonb,
  owner_interaction_pattern TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  priority INT NOT NULL DEFAULT 50,
  target_pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  target_zone_id TEXT,
  target_object_id UUID,
  status TEXT NOT NULL DEFAULT 'active',
  progress INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pair_relationship_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_a_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  pet_b_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  trust INT NOT NULL DEFAULT 42,
  play_compatibility INT NOT NULL DEFAULT 50,
  intimidation INT NOT NULL DEFAULT 18,
  curiosity INT NOT NULL DEFAULT 48,
  resentment INT NOT NULL DEFAULT 12,
  attachment_pattern TEXT NOT NULL DEFAULT 'forming pattern',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL DEFAULT 'derived',
  turn_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_chat_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  source TEXT NOT NULL,
  finish_reason TEXT NOT NULL,
  elapsed_ms INT NOT NULL DEFAULT 0,
  token_count INT NOT NULL DEFAULT 0,
  truncated BOOLEAN NOT NULL DEFAULT FALSE,
  repaired BOOLEAN NOT NULL DEFAULT FALSE,
  fallback_reason TEXT,
  prompt_digest TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_garden_ledger_zone_created ON garden_ledger_events(zone_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_garden_semantic_subject ON garden_semantic_facts(subject_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_pet_goals_pet_status ON pet_goals(pet_id, status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_pair_relationship_models_pair ON pair_relationship_models(pet_a_id, pet_b_id);
CREATE INDEX IF NOT EXISTS idx_conversation_summaries_pet_user ON conversation_summaries(pet_id, user_id);
CREATE INDEX IF NOT EXISTS idx_pet_chat_traces_pet_created ON pet_chat_traces(pet_id, created_at DESC);

ALTER TABLE garden_ledger_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_semantic_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_semantic_memory_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pair_relationship_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_chat_traces ENABLE ROW LEVEL SECURITY;

