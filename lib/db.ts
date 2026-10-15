import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Local Fallback Storage for immediate development & testing
const LOCAL_DB_PATH = path.join(process.cwd(), 'data', '.app_database.json');

interface LocalDB {
  users: Array<{ id: string; username: string; password_hash: string; created_at: string }>;
  conversations: Array<{ id: string; user_id: string; title: string; model_used: string; created_at: string; updated_at: string }>;
  messages: Array<{ id: string; conversation_id: string; user_id: string; role: string; content: string; created_at: string }>;
  feedbacks?: Array<any>;
}

function getLocalDB(): LocalDB {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initial: LocalDB = { users: [], conversations: [], messages: [] };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
  } catch {
    return { users: [], conversations: [], messages: [] };
  }
}

function saveLocalDB(data: LocalDB): void {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ==============================================================================
// Database Operations (Supabase with Local Resilient Fallback)
// ==============================================================================

export async function createUser(username: string, passwordHash: string) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('app_users')
      .insert({ username, password_hash: passwordHash })
      .select('id, username, created_at')
      .single();

    if (error) throw error;
    return data;
  }

  // Local fallback
  const db = getLocalDB();
  const existing = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    throw new Error('Username already exists');
  }

  const newUser = {
    id: crypto.randomUUID(),
    username,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveLocalDB(db);

  return { id: newUser.id, username: newUser.username, created_at: newUser.created_at };
}

export async function getUserByUsername(username: string) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('app_users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  const db = getLocalDB();
  return db.users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function getUserById(id: string) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('app_users')
      .select('id, username, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  const db = getLocalDB();
  const u = db.users.find((user) => user.id === id);
  if (!u) return null;
  return { id: u.id, username: u.username, created_at: u.created_at };
}

export async function createConversation(userId: string, title: string, modelUsed: string) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        model_used: modelUsed,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  const db = getLocalDB();
  const newConv = {
    id: crypto.randomUUID(),
    user_id: userId,
    title,
    model_used: modelUsed,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.conversations.unshift(newConv);
  saveLocalDB(db);
  return newConv;
}

export async function getConversations(userId: string) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  const db = getLocalDB();
  return db.conversations
    .filter((c) => c.user_id === userId)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function getConversationById(userId: string, conversationId: string) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  const db = getLocalDB();
  return db.conversations.find((c) => c.id === conversationId && c.user_id === userId) || null;
}

export async function deleteConversation(userId: string, conversationId: string) {
  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  const db = getLocalDB();
  db.conversations = db.conversations.filter((c) => !(c.id === conversationId && c.user_id === userId));
  db.messages = db.messages.filter((m) => m.conversation_id !== conversationId);
  saveLocalDB(db);
  return true;
}

export async function saveMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  modelUsed?: string
) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role,
        content,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Update conversation timestamp
    await supabaseClient
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .eq('user_id', userId);

    return data;
  }

  const db = getLocalDB();
  const newMsg = {
    id: crypto.randomUUID(),
    conversation_id: conversationId,
    user_id: userId,
    role,
    content,
    model_used: modelUsed,
    created_at: new Date().toISOString(),
  };

  db.messages.push(newMsg);

  // Update conversation updated_at
  const conv = db.conversations.find((c) => c.id === conversationId && c.user_id === userId);
  if (conv) {
    conv.updated_at = new Date().toISOString();
  }

  saveLocalDB(db);
  return newMsg;
}

export async function getMessages(userId: string, conversationId: string) {
  // Ensure conversation belongs to user first
  const conv = await getConversationById(userId, conversationId);
  if (!conv) {
    throw new Error('Unauthorized or conversation not found');
  }

  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  const db = getLocalDB();
  return db.messages
    .filter((m) => m.conversation_id === conversationId && m.user_id === userId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export interface FeedbackReport {
  id?: string;
  user_id?: string | null;
  username?: string | null;
  category: 'bug' | 'suggestion' | 'content';
  message: string;
  error_details?: string | null;
  page_url?: string | null;
  contact_info?: string | null;
  created_at?: string;
}

export async function saveFeedbackReport(report: FeedbackReport) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('feedback_reports')
        .insert({
          user_id: report.user_id || null,
          username: report.username || null,
          category: report.category,
          message: report.message,
          error_details: report.error_details || null,
          page_url: report.page_url || null,
          contact_info: report.contact_info || null,
        })
        .select('*')
        .single();

      if (error) {
        console.warn('Supabase feedback insert warning:', error.message);
      }
      return data || report;
    } catch (e) {
      console.warn('Supabase feedback insert exception:', e);
      return report;
    }
  }

  const db = getLocalDB();
  if (!db.feedbacks) (db as any).feedbacks = [];
  const entry = {
    id: crypto.randomUUID(),
    ...report,
    created_at: new Date().toISOString(),
  };
  (db as any).feedbacks.push(entry);
  saveLocalDB(db);
  return entry;
}
