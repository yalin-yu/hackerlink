// [API] Profile endpoints
import { api } from './client';

export interface ProfileData {
  userId: string;
  role: string;
  subRole: string;
  q1: string;
  q4: string;
}

export interface Profile {
  id: string;
  user_id: string;
  role: string;
  sub_role: string;
  q1: string;
  q4: string;
  domain: string;
  reasoning: string;
}

export interface MemorySlice {
  id: number;
  text: string;
}

/**
 * [API] POST /api/profiles
 * Creates or updates a user profile. On the server:
 *   - Receives role, subRole, q1, q4
 *   - Calls DeepSeek to extract domain
 *   - Stores everything in profiles table
 * F12 Network → filter "profiles"
 */
export async function createProfile(data: ProfileData) {
  const res = await api.post<{ profile: Profile; meta: { llmMode: string; domain: string; reasoning: string } }>(
    '/api/profiles',
    data
  );
  return res;
}

/**
 * [API] GET /api/profiles/:userId
 * Checks if user has completed onboarding.
 * F12 Network → filter "profiles"
 */
export async function getProfile(userId: string) {
  const res = await api.get<{ profile?: Profile; onboardingComplete: boolean }>(
    `/api/profiles/${userId}`
  );
  return res;
}

/**
 * [API] POST /api/twin-memory
 * Generates 3 memory slices from Q1+Q4 for the TwinReadyScreen.
 * LLM summarizes: what you're excited about, what you dislike, what you're stuck on.
 * F12 Network → filter "twin-memory"
 */
export async function generateMemory(q1: string, q4: string) {
  const res = await api.post<{ slices: MemorySlice[]; mode: string }>(
    '/api/twin-memory',
    { q1, q4 }
  );
  return res;
}
