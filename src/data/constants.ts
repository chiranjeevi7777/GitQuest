/* ═══════════════════════════════════════════════
   GitQuest — Shared Constants
   ═══════════════════════════════════════════════ */

export const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000];

export const TITLES = [
  'Apprentice', 'Initiate', 'Scribe', 'Developer',
  'Architect', 'Engineer', 'Senior Engineer', 'Tech Lead',
  'Principal', 'Staff Engineer', 'Git Master', 'Legend',
];

export function getLevelFromXP(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i + 1;
  }
  return 1;
}

export function getTitleFromLevel(level: number): string {
  return TITLES[Math.min(level - 1, TITLES.length - 1)];
}

export function getXPProgress(xp: number, level: number) {
  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0;
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { currentLevelXP, nextLevelXP, progress: Math.min(progress, 100) };
}
