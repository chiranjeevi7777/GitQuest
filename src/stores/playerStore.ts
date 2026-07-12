import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, PlayerSettings, InventoryItem } from '@/types';
import { getLevelFromXP, getTitleFromLevel } from '@/data/constants';

interface PlayerState {
  player: Player;
  addXP: (amount: number) => void;
  unlockWorld: (worldId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateSetting: (key: keyof PlayerSettings, value: any) => void;
  completeMissionState: (
    missionId: string,
    xpReward: number,
    worldComplete: boolean,
    nextWorldId?: string
  ) => { leveledUp: boolean; newLevel: number; newTitle: string; worldComplete: boolean };
  addToInventory: (item: InventoryItem) => void;
  resetPlayer: () => void;
}

const initialPlayer: Player = {
  id: 'player-1',
  username: 'Developer',
  xp: 0,
  level: 1,
  title: 'Apprentice',
  streak: 0,
  completedMissions: [],
  unlockedWorlds: ['world-1'],
  achievements: [],
  inventory: [],
  currentWorld: null,
  currentMission: null,
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    terminalFontSize: 14,
    showHints: true,
  },
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,

      addXP: (amount) => {
        const current = get().player;
        const newXP = current.xp + amount;
        const newLevel = getLevelFromXP(newXP);
        const leveledUp = newLevel > current.level;

        set({
          player: {
            ...current,
            xp: newXP,
            level: newLevel,
            title: getTitleFromLevel(newLevel),
          },
        });
      },

      unlockWorld: (worldId) => {
        const current = get().player;
        if (current.unlockedWorlds.includes(worldId)) return;
        set({
          player: {
            ...current,
            unlockedWorlds: [...current.unlockedWorlds, worldId],
          },
        });
      },

      unlockAchievement: (achievementId) => {
        const current = get().player;
        if (current.achievements.includes(achievementId)) return;
        set({
          player: {
            ...current,
            achievements: [...current.achievements, achievementId],
          },
        });
      },

      updateSetting: (key, value) => {
        const current = get().player;
        set({
          player: {
            ...current,
            settings: {
              ...current.settings,
              [key]: value,
            },
          },
        });
      },

      completeMissionState: (missionId, xpReward, worldComplete, nextWorldId) => {
        const current = get().player;
        const newCompleted = current.completedMissions.includes(missionId)
          ? current.completedMissions
          : [...current.completedMissions, missionId];
        
        const newXP = current.xp + xpReward;
        const newLevel = getLevelFromXP(newXP);
        const leveledUp = newLevel > current.level;

        let newUnlockedWorlds = [...current.unlockedWorlds];
        if (worldComplete && nextWorldId && !newUnlockedWorlds.includes(nextWorldId)) {
          newUnlockedWorlds.push(nextWorldId);
        }

        set({
          player: {
            ...current,
            xp: newXP,
            level: newLevel,
            title: getTitleFromLevel(newLevel),
            completedMissions: newCompleted,
            unlockedWorlds: newUnlockedWorlds,
            currentMission: null,
          },
        });

        return {
          leveledUp,
          newLevel,
          newTitle: getTitleFromLevel(newLevel),
          worldComplete,
        };
      },

      addToInventory: (item) => {
        const current = get().player;
        const inventory = current.inventory || [];
        if (inventory.some((i: InventoryItem) => i.id === item.id)) return;
        set({
          player: {
            ...current,
            inventory: [...inventory, item],
          },
        });
      },

      resetPlayer: () => set({ player: initialPlayer }),
    }),
    {
      name: 'gitquest-save-player',
      merge: (persistedState: any, currentState: any) => {
        if (!persistedState) return currentState;
        const player = {
          ...currentState.player,
          ...(persistedState.player || {}),
          completedMissions: persistedState.player?.completedMissions || [],
          unlockedWorlds: persistedState.player?.unlockedWorlds || ['world-1'],
          achievements: persistedState.player?.achievements || [],
          inventory: persistedState.player?.inventory || [],
          settings: {
            ...currentState.player.settings,
            ...(persistedState.player?.settings || {}),
          },
        };
        return {
          ...currentState,
          ...persistedState,
          player,
        };
      },
    }
  )
);
