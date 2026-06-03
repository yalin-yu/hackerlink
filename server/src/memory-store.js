// In-memory store — lives as long as the server process.
// Cleared on server restart. No persistence between browser sessions.
// Replaces SQLite for twin_dialogues and recommendation_cache tables.

/** @type {Map<string, any[]>} */
const dialoguesStore = new Map(); // key: `${userId}:${eventId}` → dialogues[]

/** @type {Map<string, any[]>} */
const cacheStore = new Map(); // key: `${userId}:${eventId}` → SoulData[]

export function saveDialogues(userId, eventId, dialogues) {
  dialoguesStore.set(`${userId}:${eventId}`, dialogues);
}

export function getDialogues(userId, eventId) {
  return dialoguesStore.get(`${userId}:${eventId}`) || [];
}

export function saveRecommendations(userId, eventId, results) {
  cacheStore.set(`${userId}:${eventId}`, results);
}

export function getRecommendations(userId, eventId) {
  return cacheStore.get(`${userId}:${eventId}`) || [];
}
