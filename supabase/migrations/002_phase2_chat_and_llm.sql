CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  participant_type TEXT NOT NULL CHECK (participant_type IN ('user', 'pet')),
  participant_id UUID NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pet_states ADD COLUMN IF NOT EXISTS current_bubble_text TEXT;
ALTER TABLE pet_states ADD COLUMN IF NOT EXISTS current_bubble_kind TEXT;
ALTER TABLE pet_states ADD COLUMN IF NOT EXISTS current_bubble_expires_at TIMESTAMPTZ;

ALTER TABLE pet_events ADD COLUMN IF NOT EXISTS related_pet_id UUID REFERENCES pets(id) ON DELETE SET NULL;
ALTER TABLE pet_events ADD COLUMN IF NOT EXISTS emotion TEXT;

ALTER TABLE pet_events DROP CONSTRAINT IF EXISTS pet_events_type_check;
ALTER TABLE pet_events ADD CONSTRAINT pet_events_type_check
  CHECK (type IN (
    'mood_change','pooped','climbed_tree','scuffle','chased',
    'slept','owner_action','watched_fish','dug','groomed','bonded',
    'social_chat','inner_voice'
  ));

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "用户可以看自己的聊天" ON chat_sessions;
CREATE POLICY "用户可以看自己的聊天" ON chat_sessions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "用户可以和公开宠物聊天" ON chat_sessions;
CREATE POLICY "用户可以和公开宠物聊天" ON chat_sessions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM pets WHERE id = pet_id AND visibility = 'public')
    OR EXISTS (SELECT 1 FROM pets WHERE id = pet_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "可以读自己会话的消息" ON chat_messages;
CREATE POLICY "可以读自己会话的消息" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM chat_sessions
      WHERE id = session_id
        AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "可以写自己会话的消息" ON chat_messages;
CREATE POLICY "可以写自己会话的消息" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM chat_sessions
      WHERE id = session_id
        AND user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_chat_sessions_pet ON chat_sessions(pet_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);
