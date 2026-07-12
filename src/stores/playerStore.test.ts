import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage for Zustand persist middleware in Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: () => null,
  };
})();

(globalThis as any).window = {
  localStorage: localStorageMock,
} as any;
(globalThis as any).localStorage = localStorageMock;

import { vi } from 'vitest';
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

import { usePlayerStore } from './playerStore';

describe('PlayerStore unit tests', () => {
  beforeEach(() => {
    usePlayerStore.getState().resetPlayer();
  });

  it('starts with initial values', () => {
    const { player } = usePlayerStore.getState();
    expect(player.username).toBe('Developer');
    expect(player.xp).toBe(0);
    expect(player.level).toBe(1);
    expect(player.title).toBe('Apprentice');
    expect(player.unlockedWorlds).toContain('world-1');
  });

  it('adds XP and levels up appropriately', () => {
    const store = usePlayerStore.getState();
    
    // Level 1: XP 0 - 99. Adding 50 XP shouldn't level up.
    store.addXP(50);
    expect(usePlayerStore.getState().player.xp).toBe(50);
    expect(usePlayerStore.getState().player.level).toBe(1);

    // Adding 50 more should cross the 100 XP threshold for Level 2
    store.addXP(50);
    expect(usePlayerStore.getState().player.xp).toBe(100);
    expect(usePlayerStore.getState().player.level).toBe(2);
    expect(usePlayerStore.getState().player.title).toBe('Initiate');
  });

  it('unlocks worlds and achievements', () => {
    const store = usePlayerStore.getState();

    store.unlockWorld('world-2');
    expect(usePlayerStore.getState().player.unlockedWorlds).toContain('world-2');

    store.unlockAchievement('first_commit');
    expect(usePlayerStore.getState().player.achievements).toContain('first_commit');
  });

  it('updates player settings', () => {
    const store = usePlayerStore.getState();

    store.updateSetting('soundEnabled', false);
    expect(usePlayerStore.getState().player.settings.soundEnabled).toBe(false);

    store.updateSetting('terminalFontSize', 18);
    expect(usePlayerStore.getState().player.settings.terminalFontSize).toBe(18);
  });

  it('completes missions and grants rewards', () => {
    const store = usePlayerStore.getState();

    // 150 XP should level up from 1 to 2 (since 150 >= 100)
    const result = store.completeMissionState('w1-m1', 150, true, 'world-2');
    
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
    expect(result.worldComplete).toBe(true);

    const updatedPlayer = usePlayerStore.getState().player;
    expect(updatedPlayer.completedMissions).toContain('w1-m1');
    expect(updatedPlayer.unlockedWorlds).toContain('world-2');
  });
});
