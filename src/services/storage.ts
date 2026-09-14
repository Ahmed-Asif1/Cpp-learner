import { UserProgress } from '../types';

const STORAGE_KEY = 'cpp_odyssey_progress_v1';

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 120, // Give starting XP for initial excitement!
  level: 1,
  completedLessons: ['m1-l1'], // First introductory lesson marked or ready
  completedChallenges: [],
  completedExercises: [],
  completedQuests: [],
  totalLabLaunches: 0,
  unlockedBadges: ['welcome_dev'],
  soundEnabled: true,
  streak: 1,
  lastActive: '2026-01-01T00:00:00.000Z',
};

export const loadProgress = (): UserProgress => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (e) {
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
};

export const calculateLevel = (xp: number): { level: number; currentXp: number; nextLevelXp: number; title: string } => {
  // Level curve: 200 XP per level scaling slightly
  const titles = [
    'Junior Systems Trainee',
    'Stack & Scope Analyst',
    'Pointer Specialist',
    'Reference Engineer',
    'Systems Developer',
    'RAII Systems Architect',
    'Memory Safety Engineer',
    'High-Throughput Engineer',
    'Low-Latency Specialist',
    'Principal Systems Architect',
  ];

  let level = 1;
  let threshold = 250;
  let remainingXp = xp;

  while (remainingXp >= threshold && level < titles.length) {
    remainingXp -= threshold;
    level++;
    threshold = Math.round(threshold * 1.35);
  }

  const title = titles[Math.min(level - 1, titles.length - 1)];

  return {
    level,
    currentXp: remainingXp,
    nextLevelXp: threshold,
    title,
  };
};

export async function loadProgressFromDB(username: string): Promise<UserProgress | null> {
  try {
    const res = await fetch(`/api/progress?username=${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.progress) return null;
    // progress may be a JSON string (redis returns string) or already an object
    const data = typeof json.progress === 'string' ? JSON.parse(json.progress) : json.progress;
    return { ...DEFAULT_PROGRESS, ...data } as UserProgress;
  } catch {
    return null;
  }
}

export async function saveProgressToDB(username: string, progress: UserProgress): Promise<void> {
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, progress }),
    });
  } catch {
    // fire-and-forget — silently ignore errors
  }
}

/**
 * Pure conflict resolution merging offline local and remote cloud progress.
 * Adheres to TC3.2 specification: max XP, max Level, and union of arrays.
 */
export const mergeProgress = (local: UserProgress, remote: UserProgress): UserProgress => {
  const mergedXp = Math.max(local.xp || 0, remote.xp || 0);
  const calculated = calculateLevel(mergedXp);

  return {
    ...DEFAULT_PROGRESS,
    ...local,
    ...remote,
    xp: mergedXp,
    level: Math.max(calculated.level, local.level || 1, remote.level || 1),
    completedLessons: Array.from(new Set([...(local.completedLessons || []), ...(remote.completedLessons || [])])),
    completedChallenges: Array.from(new Set([...(local.completedChallenges || []), ...(remote.completedChallenges || [])])),
    completedExercises: Array.from(new Set([...(local.completedExercises || []), ...(remote.completedExercises || [])])),
    completedQuests: Array.from(new Set([...(local.completedQuests || []), ...(remote.completedQuests || [])])),
    totalLabLaunches: Math.max(local.totalLabLaunches || 0, remote.totalLabLaunches || 0),
    unlockedBadges: Array.from(new Set([...(local.unlockedBadges || []), ...(remote.unlockedBadges || [])])),
    soundEnabled: local.soundEnabled ?? remote.soundEnabled ?? true,
    lastActive: new Date().toISOString(),
  };
};


