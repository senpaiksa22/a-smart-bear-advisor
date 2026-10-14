-- ==============================================================================
-- A Smart Bear Advisor — Supabase Database Schema
-- High-Security, Multi-User AI Knowledge Base
-- ==============================================================================

-- 1. Create app_users table
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on username for high-speed login lookups
CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users (username);

-- 2. Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'محادثة استشارية جديدة',
    model_used TEXT NOT NULL DEFAULT 'gemini-3.8-flash',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on user_id for strict user isolation
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations (user_id);

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes on conversation_id and user_id for message history and security isolation
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages (user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Notice: Because all operations in this app are executed server-side via Next.js
-- using the Supabase Service Role Key (Zero Client Exposure), the service role
-- bypasses RLS while strictly enforcing user_id matching in internal server queries.
