import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, GameView, GameNotification, MissionObjective, TerminalCommand, GitCommitNode } from '@/types';
import { WORLDS } from '@/data/worlds';

/* ═══════════════════════════════════════════════
   GitQuest Game Store — Zustand
   ═══════════════════════════════════════════════ */

// ─── XP Thresholds per Level ───
const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000];

const TITLES = [
  'Apprentice', 'Initiate', 'Scribe', 'Developer',
  'Architect', 'Engineer', 'Senior Engineer', 'Tech Lead',
  'Principal', 'Staff Engineer', 'Git Master', 'Legend'
];

function getLevelFromXP(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i + 1;
  }
  return 1;
}

function getTitleFromLevel(level: number): string {
  return TITLES[Math.min(level - 1, TITLES.length - 1)];
}

interface GameState {
  // Player
  player: Player;

  // View State
  currentView: GameView;
  selectedWorldId: string | null;
  activeMissionId: string | null;
  showMissionBriefing: boolean;

  // Terminal
  terminalHistory: TerminalCommand[];
  isTerminalReady: boolean;

  // Git Graph
  gitCommits: GitCommitNode[];
  gitBranches: string[];
  currentBranch: string;

  // Notifications
  notifications: GameNotification[];

  // Dialogue
  activeDialogueIndex: number;
  showDialogue: boolean;

  // Hints
  currentHintIndex: number;
  hintsUsed: boolean;

  // Mission Timer
  missionStartTime: number | null;

  // Actions
  setView: (view: GameView) => void;
  selectWorld: (worldId: string) => void;
  startMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  completeObjective: (objectiveId: string) => void;
  addXP: (amount: number) => void;
  addTerminalCommand: (cmd: TerminalCommand) => void;
  clearTerminalHistory: () => void;
  addGitCommit: (commit: GitCommitNode) => void;
  createBranch: (name: string) => void;
  switchBranch: (name: string) => void;
  addNotification: (notification: Omit<GameNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  advanceDialogue: () => void;
  resetDialogue: () => void;
  showHint: () => void;
  unlockWorld: (worldId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  resetGame: () => void;
  closeMissionBriefing: () => void;
  setTerminalReady: (ready: boolean) => void;
}

const initialPlayer: Player = {
  id: 'player-1',
  username: 'Developer',
  xp: 0,
  level: 1,
  title: 'Apprentice',
  streak: 1,
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

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,
      currentView: 'world-map',
      selectedWorldId: null,
      activeMissionId: null,
      showMissionBriefing: false,
      terminalHistory: [],
      isTerminalReady: false,
      gitCommits: [],
      gitBranches: ['main'],
      currentBranch: 'main',
      notifications: [],
      activeDialogueIndex: 0,
      showDialogue: false,
      currentHintIndex: 0,
      hintsUsed: false,
      missionStartTime: null,

      setView: (view) => set({ currentView: view }),

      selectWorld: (worldId) => set({
        selectedWorldId: worldId,
        currentView: 'world-map',
      }),

      startMission: (missionId) => {
        const world = WORLDS.find(w => w.missions.some(m => m.id === missionId));
        const mission = world?.missions.find(m => m.id === missionId);
        if (!mission) return;

        set({
          activeMissionId: missionId,
          currentView: 'mission',
          showMissionBriefing: true,
          showDialogue: true,
          activeDialogueIndex: 0,
          currentHintIndex: 0,
          hintsUsed: false,
          missionStartTime: Date.now(),
          terminalHistory: [],
          gitCommits: [],
          gitBranches: ['main'],
          currentBranch: 'main',
          player: { ...get().player, currentMission: missionId, currentWorld: world!.id },
        });
      },

      completeMission: (missionId) => {
        const state = get();
        const world = WORLDS.find(w => w.missions.some(m => m.id === missionId));
        const mission = world?.missions.find(m => m.id === missionId);
        if (!mission) return;

        const newCompleted = [...state.player.completedMissions, missionId];
        const newXP = state.player.xp + mission.xpReward;
        const newLevel = getLevelFromXP(newXP);
        const leveledUp = newLevel > state.player.level;

        // Check if world is complete
        const worldComplete = world!.missions.every(m => newCompleted.includes(m.id));

        // Auto-unlock next world
        const worldIndex = WORLDS.findIndex(w => w.id === world!.id);
        const nextWorld = WORLDS[worldIndex + 1];
        let newUnlockedWorlds = [...state.player.unlockedWorlds];
        if (worldComplete && nextWorld && !newUnlockedWorlds.includes(nextWorld.id)) {
          newUnlockedWorlds.push(nextWorld.id);
        }

        set({
          player: {
            ...state.player,
            xp: newXP,
            level: newLevel,
            title: getTitleFromLevel(newLevel),
            completedMissions: newCompleted,
            unlockedWorlds: newUnlockedWorlds,
            currentMission: null,
          },
        });

        // Notifications
        state.addNotification({
          type: 'mission-complete',
          title: 'Mission Complete!',
          description: `${mission.title} — +${mission.xpReward} XP`,
          icon: '✅',
        });

        if (leveledUp) {
          state.addNotification({
            type: 'level-up',
            title: `Level Up! → Level ${newLevel}`,
            description: `New title: ${getTitleFromLevel(newLevel)}`,
            icon: '🎉',
          });
        }
      },

      completeObjective: (objectiveId) => {
        set(state => {
          // Find the objective across all missions
          const mission = WORLDS.flatMap(w => w.missions).find(m =>
            m.objectives.some(o => o.id === objectiveId)
          );
          if (!mission) return state;

          // Check if all objectives will be complete
          const allComplete = mission.objectives.every(o =>
            o.id === objectiveId || o.completed
          );

          return state;
        });
      },

      addXP: (amount) => {
        const state = get();
        const newXP = state.player.xp + amount;
        const newLevel = getLevelFromXP(newXP);

        set({
          player: {
            ...state.player,
            xp: newXP,
            level: newLevel,
            title: getTitleFromLevel(newLevel),
          },
        });

        state.addNotification({
          type: 'xp-gain',
          title: `+${amount} XP`,
          description: 'Experience gained!',
          icon: '⚡',
        });
      },

      addTerminalCommand: (cmd) => set(state => ({
        terminalHistory: [...state.terminalHistory, cmd],
      })),

      clearTerminalHistory: () => set({ terminalHistory: [] }),

      addGitCommit: (commit) => set(state => ({
        gitCommits: [...state.gitCommits, commit],
      })),

      createBranch: (name) => set(state => ({
        gitBranches: [...state.gitBranches, name],
      })),

      switchBranch: (name) => set({ currentBranch: name }),

      addNotification: (notification) => set(state => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: Date.now(),
          },
        ],
      })),

      dismissNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),

      advanceDialogue: () => set(state => ({
        activeDialogueIndex: state.activeDialogueIndex + 1,
      })),

      resetDialogue: () => set({
        activeDialogueIndex: 0,
        showDialogue: false,
      }),

      showHint: () => set(state => ({
        currentHintIndex: Math.min(state.currentHintIndex + 1, 10),
        hintsUsed: true,
      })),

      unlockWorld: (worldId) => set(state => ({
        player: {
          ...state.player,
          unlockedWorlds: [...state.player.unlockedWorlds, worldId],
        },
      })),

      unlockAchievement: (achievementId) => {
        const state = get();
        if (state.player.achievements.includes(achievementId)) return;

        set({
          player: {
            ...state.player,
            achievements: [...state.player.achievements, achievementId],
          },
        });

        state.addNotification({
          type: 'achievement',
          title: 'Achievement Unlocked!',
          description: achievementId,
          icon: '🏆',
        });
      },

      closeMissionBriefing: () => set({
        showMissionBriefing: false,
      }),

      setTerminalReady: (ready) => set({ isTerminalReady: ready }),

      resetGame: () => set({
        player: initialPlayer,
        currentView: 'world-map',
        selectedWorldId: null,
        activeMissionId: null,
        terminalHistory: [],
        gitCommits: [],
        gitBranches: ['main'],
        currentBranch: 'main',
        notifications: [],
        activeDialogueIndex: 0,
        showDialogue: false,
        currentHintIndex: 0,
        hintsUsed: false,
        missionStartTime: null,
      }),
    }),
    {
      name: 'gitquest-save',
      partialize: (state) => ({
        player: state.player,
      }),
    }
  )
);
