// [API] Twin search endpoints
import { api } from './client';

/**
 * [API] POST /api/twin-search/start
 * Triggers async avatar conversations. Returns immediately, runs in background.
 * F12 Network → filter "twin-search"
 */
export async function startTwinSearch(userId: string, eventId: string) {
  const res = await api.post<{ status: string }>('/api/twin-search/start', { userId, eventId });
  return res;
}

/**
 * [API] GET /api/twin-search/status/:userId/:eventId
 * Polls progress of running twin search.
 * F12 Network → filter "twin-search"
 */
export async function getTwinSearchStatus(userId: string, eventId: string) {
  const res = await api.get<{
    status: string;   // idle | searching | done
    progress: { completed: number; total: number };
  }>(`/api/twin-search/status/${userId}/${eventId}`);
  return res;
}

/**
 * [API] GET /api/twin-search/results/:userId/:eventId
 * Returns sorted Soul Slice grid data after search completes.
 * F12 Network → filter "twin-search"
 */
export async function getTwinSearchResults(userId: string, eventId: string) {
  const res = await api.get<{
    results: SoulData[];
  }>(`/api/twin-search/results/${userId}/${eventId}`);
  return res;
}

export interface SoulData {
  id: string;
  userId: string;
  codename: string;
  quote: string;
  score: number;
  convScore: number;
  structScore: number;
  vibeDescription: string;
  vibeTags: string[];
  connectionReasons: {
    common: string;
    complementary: string;
    uncertain: string;
  };
  ahaMoment: {
    story: string;
    context: string;
  };
}
