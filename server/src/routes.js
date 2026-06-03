// API route handlers — all business logic
import { GET, POST, PUT } from './router.js';
import { getDb } from './db.js';
import { extractDomain, generateMemorySlices, LIVE_MODE as LLM_LIVE } from './deepseek.js';
import { runTwinSearch, buildAvatarPrompt } from './twin-engine.js';
import { getDialogues, getRecommendations } from './memory-store.js';

// ═══════════════════════════════════════════════
// Health
// ═══════════════════════════════════════════════

GET('/api/health', async () => ({
  status: 200,
  body: { ok: true, timestamp: new Date().toISOString() },
}));

// LLM status
GET('/api/llm-status', async () => ({
  status: 200,
  body: { deepseek: LLM_LIVE ? 'connected' : 'keyword-fallback', apiKeySet: !!process.env.DEEPSEEK_API_KEY },
}));

// ═══════════════════════════════════════════════
// Users
// ═══════════════════════════════════════════════

POST('/api/users', async (_req, _params, body) => {
  const { randomUUID } = await import('node:crypto');
  const db = getDb();
  const id = randomUUID();
  const nickname = body.nickname || '';
  db.prepare('INSERT INTO users (id, nickname) VALUES (?, ?)').run(id, nickname);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return { status: 201, body: { user } };
});

GET('/api/users', async () => {
  const db = getDb();
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  return { status: 200, body: { users } };
});

GET('/api/users/:id', async (_req, params) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(params.id);
  if (!user) return { status: 404, body: { error: 'user not found' } };
  return { status: 200, body: { user } };
});

// ═══════════════════════════════════════════════
// Events
// ═══════════════════════════════════════════════

GET('/api/events', async () => {
  const db = getDb();
  const events = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
  return { status: 200, body: { events } };
});

GET('/api/events/:id', async (_req, params) => {
  const db = getDb();
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(params.id);
  if (!event) return { status: 404, body: { error: 'event not found' } };

  const participants = db.prepare(
    'SELECT u.* FROM users u JOIN event_users eu ON u.id = eu.user_id WHERE eu.event_id = ?'
  ).all(params.id);

  return { status: 200, body: { event, participants } };
});

// ═══════════════════════════════════════════════
// Profiles
// ═══════════════════════════════════════════════

POST('/api/profiles', async (_req, _params, body) => {
  const { randomUUID } = await import('node:crypto');
  const db = getDb();

  const { userId, role, subRole, q1, q4 } = body;
  if (!userId || !role || !subRole) {
    return { status: 400, body: { error: 'userId, role, subRole are required' } };
  }

  // Auto-create user if not exists (frontend generates UUID without calling POST /api/users)
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    db.prepare('INSERT INTO users (id, nickname) VALUES (?, ?)').run(userId, 'User-' + userId.slice(0, 6));
  }

  // Extract domain via DeepSeek (or mock keyword fallback)
  let domain = '';
  let reasoning = '';
  try {
    const result = await extractDomain({ q1: q1 || '', q4: q4 || '' });
    domain = result.domain;
    reasoning = result.reasoning;
  } catch (err) {
    console.error('[profile] domain extraction failed:', err.message);
    domain = 'AI';
    reasoning = `fallback: ${err.message.slice(0, 60)}`;
  }

  // Upsert: delete existing profile for this user if present
  db.prepare('DELETE FROM profiles WHERE user_id = ?').run(userId);

  const id = randomUUID();
  db.prepare(
    'INSERT INTO profiles (id, user_id, role, sub_role, q1, q4, domain, reasoning) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, role, subRole, q1 || '', q4 || '', domain, reasoning);

  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id);
  return {
    status: 201,
    body: {
      profile,
      meta: { llmMode: LLM_LIVE ? 'deepseek' : 'keyword', domain, reasoning },
    },
  };
});

GET('/api/profiles/:userId', async (_req, params) => {
  const db = getDb();
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(params.userId);
  if (!profile) return { status: 404, body: { error: 'profile not found', onboardingComplete: false } };
  return { status: 200, body: { profile, onboardingComplete: true } };
});

// ═══════════════════════════════════════════════
// Twin Memory (TwinReadyScreen)
// ═══════════════════════════════════════════════

POST('/api/twin-memory', async (_req, _params, body) => {
  const { q1, q4 } = body;
  if (!q1) {
    return { status: 400, body: { error: 'q1 is required' } };
  }

  try {
    const result = await generateMemorySlices({ q1, q4: q4 || '' });
    return { status: 200, body: { slices: result.slices, mode: result.mode } };
  } catch (err) {
    console.error('[twin-memory] generation failed:', err.message);
    return { status: 500, body: { error: err.message } };
  }
});

// ═══════════════════════════════════════════════
// Twin Search (分身出发 → 对话 → 推荐)
// ═══════════════════════════════════════════════

POST('/api/twin-search/start', async (_req, _params, body) => {
  const { userId, eventId } = body;
  if (!userId || !eventId) {
    return { status: 400, body: { error: 'userId and eventId required' } };
  }

  // Run synchronously — the request waits until all conversations complete
  // No polling needed. Frontend just shows animation during the HTTP wait.
  try {
    await runTwinSearch(userId, eventId);
  } catch (err) {
    console.error('[twin-search] failed:', err.message);
    return { status: 500, body: { error: err.message } };
  }

  // Return cached results from memory store
  const results = getRecommendations(userId, eventId);
  return {
    status: 200,
    body: { status: 'done', results },
  };
});

GET('/api/twin-search/status/:userId/:eventId', async (_req, params) => {
  const db = getDb();
  const config = db.prepare(
    'SELECT status, updated_at FROM twin_configs WHERE user_id = ? AND event_id = ?'
  ).get(params.userId, params.eventId);

  if (!config) return { status: 404, body: { status: 'idle' } };

  // Count completed dialogues from memory store
  const dialogues = getDialogues(params.userId, params.eventId);
  const count = { count: dialogues.length };

  const total = db.prepare(
    'SELECT COUNT(*) as count FROM event_users WHERE event_id = ? AND user_id != ?'
  ).get(params.eventId, params.userId);

  return {
    status: 200,
    body: {
      status: config.status,
      progress: { completed: count.count, total: total.count },
    },
  };
});

GET('/api/twin-search/results/:userId/:eventId', async (_req, params) => {
  const results = getRecommendations(params.userId, params.eventId);
  if (!results || results.length === 0) return { status: 404, body: { error: 'no results yet', results: [] } };
  return { status: 200, body: { results } };
});

// Get ALL dialogues for a user in an event (for the Chats tab)
GET('/api/twin-dialogues/:userId/:eventId', async (_req, params) => {
  const recs = getRecommendations(params.userId, params.eventId);
  const stored = getDialogues(params.userId, params.eventId);

  const results = stored.map(d => {
    const match = recs.find((r) => r.userId === d.userBId);
    return {
      soul: match || {
        id: d.userBId,
        userId: d.userBId,
        codename: '@unknown',
        quote: '',
        score: 0,
        vibeDescription: '',
        vibeTags: [],
        connectionReasons: { common: '', complementary: '', uncertain: '' },
        ahaMoment: { story: '', context: '' },
      },
      turns: d.turns || [],
    };
  });

  return { status: 200, body: { dialogues: results } };
});

// Get single dialogue
GET('/api/twin-dialogue/:userId/:otherId/:eventId', async (_req, params) => {
  const stored = getDialogues(params.userId, params.eventId);
  const dialogue = stored.find(d =>
    (d.userAId === params.userId && d.userBId === params.otherId) ||
    (d.userAId === params.otherId && d.userBId === params.userId)
  );

  if (!dialogue) return { status: 404, body: { error: 'no dialogue found' } };

  return {
    status: 200,
    body: { dialogue: { turns: dialogue.turns || [], analysis: dialogue.analysis || null } },
  };
});

// ═══════════════════════════════════════════════
// Twin Config (ExploreModal)
// ═══════════════════════════════════════════════

POST('/api/twin-config', async (_req, _params, body) => {
  const { randomUUID } = await import('node:crypto');
  const db = getDb();

  const { userId, eventId, selectedCards, customInput } = body;
  if (!userId || !eventId) {
    return { status: 400, body: { error: 'userId and eventId are required' } };
  }

  // Auto-create user + event_user if not exists
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    db.prepare('INSERT INTO users (id, nickname) VALUES (?, ?)').run(userId, 'User-' + userId.slice(0, 6));
  }
  try {
    db.prepare('INSERT INTO event_users (id, user_id, event_id) VALUES (?, ?, ?)').run(randomUUID(), userId, eventId);
  } catch { /* already joined */ }

  // Upsert twin_config: delete old then insert
  db.prepare('DELETE FROM twin_configs WHERE user_id = ? AND event_id = ?').run(userId, eventId);
  const id = randomUUID();
  db.prepare(`
    INSERT INTO twin_configs (id, user_id, event_id, selected_cards, custom_input, status)
    VALUES (?, ?, ?, ?, ?, 'searching')
  `).run(id, userId, eventId, JSON.stringify(selectedCards || []), customInput || '');

  const config = db.prepare('SELECT * FROM twin_configs WHERE id = ?').get(id);
  return { status: 201, body: { config } };
});

GET('/api/twin-config/:userId/:eventId', async (_req, params) => {
  const db = getDb();
  const config = db.prepare(
    'SELECT * FROM twin_configs WHERE user_id = ? AND event_id = ?'
  ).get(params.userId, params.eventId);
  if (!config) return { status: 404, body: { error: 'config not found' } };
  return { status: 200, body: { config } };
});

// ═══════════════════════════════════════════════
// Matches
// ═══════════════════════════════════════════════

POST('/api/matches', async (_req, _params, body) => {
  const { randomUUID } = await import('node:crypto');
  const db = getDb();

  const { senderId, receiverId } = body;
  if (!senderId || !receiverId) {
    return { status: 400, body: { error: 'senderId and receiverId required' } };
  }

  const id = randomUUID();
  db.prepare('INSERT INTO matches (id, sender_id, receiver_id) VALUES (?, ?, ?)')
    .run(id, senderId, receiverId);

  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
  return { status: 201, body: { match } };
});

// ═══════════════════════════════════════════════
// Messages
// ═══════════════════════════════════════════════

GET('/api/messages/:matchId', async (_req, params) => {
  const db = getDb();
  const messages = db.prepare(
    'SELECT * FROM messages WHERE match_id = ? ORDER BY created_at ASC'
  ).all(params.matchId);
  return { status: 200, body: { messages } };
});

POST('/api/messages', async (_req, _params, body) => {
  const { randomUUID } = await import('node:crypto');
  const db = getDb();

  const { matchId, senderId, content } = body;
  if (!matchId || !senderId || !content) {
    return { status: 400, body: { error: 'matchId, senderId, content required' } };
  }

  const id = randomUUID();
  db.prepare('INSERT INTO messages (id, match_id, sender_id, content) VALUES (?, ?, ?, ?)')
    .run(id, matchId, senderId, content);

  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  return { status: 201, body: { message: msg } };
});

// ═══════════════════════════════════════════════
// Meetings
// ═══════════════════════════════════════════════

POST('/api/meetings', async (_req, _params, body) => {
  const { randomUUID } = await import('node:crypto');
  const db = getDb();

  const { inviterId, inviteeId } = body;
  if (!inviterId || !inviteeId) {
    return { status: 400, body: { error: 'inviterId and inviteeId required' } };
  }

  const id = randomUUID();
  db.prepare('INSERT INTO meetings (id, inviter_id, invitee_id) VALUES (?, ?, ?)')
    .run(id, inviterId, inviteeId);

  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(id);
  return { status: 201, body: { meeting } };
});

PUT('/api/meetings/:id', async (_req, params, body) => {
  const db = getDb();

  const { status, feedback } = body;
  if (status) {
    db.prepare('UPDATE meetings SET status = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(status, params.id);
  }
  if (feedback !== undefined) {
    db.prepare('UPDATE meetings SET feedback = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(JSON.stringify(feedback), params.id);
  }

  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(params.id);
  return { status: 200, body: { meeting } };
});
