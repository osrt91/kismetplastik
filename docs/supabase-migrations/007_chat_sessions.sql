-- Chat Sessions table for storing AI chatbot conversation history
-- Migration 007: Chat Sessions

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  locale TEXT DEFAULT 'tr',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_chat_sessions_session ON chat_sessions(session_id);

-- RLS policy: No direct public access (server-side only via service role key)
CREATE POLICY "chat_sessions_no_public_access"
  ON chat_sessions
  FOR ALL
  USING (false);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_sessions_updated_at();
