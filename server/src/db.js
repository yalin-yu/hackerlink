import { DatabaseSync } from 'node:sqlite';

// Use /tmp to avoid filesystem sandbox issues with WAL journaling
const DB_PATH = '/tmp/hackerlink-dev.db';

/** @type {DatabaseSync} */
let db;

export function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    createTables();
  }
  return db;
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      nickname   TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS event_users (
      id       TEXT PRIMARY KEY,
      user_id  TEXT NOT NULL REFERENCES users(id),
      event_id TEXT NOT NULL REFERENCES events(id),
      UNIQUE(user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id           TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL UNIQUE REFERENCES users(id),
      role         TEXT NOT NULL DEFAULT '',   -- builder | backer | organizer
      sub_role     TEXT NOT NULL DEFAULT '',   -- code | product | business | investor | consulting | content | corporate | organizer
      q1           TEXT NOT NULL DEFAULT '',   -- Question1Screen 回答
      q4           TEXT NOT NULL DEFAULT '',   -- Question4Screen 回答
      domain       TEXT NOT NULL DEFAULT '',   -- DeepSeek 推理的领域
      reasoning    TEXT NOT NULL DEFAULT '',   -- DeepSeek 推理依据
      created_at   TEXT DEFAULT (datetime('now')),
      updated_at   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS twin_configs (
      id             TEXT PRIMARY KEY,
      user_id        TEXT NOT NULL UNIQUE REFERENCES users(id),
      event_id       TEXT NOT NULL REFERENCES events(id),
      selected_cards TEXT NOT NULL DEFAULT '[]',  -- JSON: [1, 6]
      custom_input   TEXT DEFAULT '',
      intent_json    TEXT,                         -- DeepSeek 生成的 6 维意图权重
      status         TEXT DEFAULT 'idle',          -- idle | searching | done
      created_at     TEXT DEFAULT (datetime('now')),
      updated_at     TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS matches (
      id          TEXT PRIMARY KEY,
      sender_id   TEXT NOT NULL REFERENCES users(id),
      receiver_id TEXT NOT NULL REFERENCES users(id),
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(sender_id, receiver_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id         TEXT PRIMARY KEY,
      match_id   TEXT NOT NULL REFERENCES matches(id),
      sender_id  TEXT NOT NULL REFERENCES users(id),
      content    TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id         TEXT PRIMARY KEY,
      inviter_id TEXT NOT NULL REFERENCES users(id),
      invitee_id TEXT NOT NULL REFERENCES users(id),
      status     TEXT DEFAULT 'pending',  -- pending | accepted | declined
      feedback   TEXT,                    -- JSON
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Twin 分身之间的对话记录
    CREATE TABLE IF NOT EXISTS twin_dialogues (
      id         TEXT PRIMARY KEY,
      event_id   TEXT NOT NULL REFERENCES events(id),
      user_a_id  TEXT NOT NULL REFERENCES users(id),
      user_b_id  TEXT NOT NULL REFERENCES users(id),
      turns_json TEXT NOT NULL DEFAULT '[]',  -- JSON: [{speaker, content, turn}]
      analysis_json TEXT,                      -- ChatAnalyzer 结果 JSON
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- 推荐结果缓存
    CREATE TABLE IF NOT EXISTS recommendation_cache (
      id           TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL REFERENCES users(id),
      event_id     TEXT NOT NULL REFERENCES events(id),
      results_json TEXT NOT NULL DEFAULT '[]',  -- JSON: SoulData[]
      created_at   TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, event_id)
    );
  `);
}
