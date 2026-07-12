import { create } from 'zustand';
import type { GameView, GameNotification } from '@/types';
import { WORLDS } from '@/data/worlds';
import { usePlayerStore } from './playerStore';
import { useGitStore } from './gitStore';

const WORLD_REWARDS: Record<string, { id: string; name: string; description: string; icon: string; type: 'artifact' | 'scroll' | 'tool' | 'key'; rarity: 'common' | 'rare' | 'epic' | 'legendary' }> = {
  'world-1': { id: 'card-world-1', name: 'Village Archive Scroll', description: 'Records the fundamental init commands of the Repository Village.', icon: '📜', type: 'scroll', rarity: 'common' },
  'world-2': { id: 'card-world-2', name: 'Forest Branch Timber', description: 'A magical twig from the Branch Forest, vibrating with parallel timeline energy.', icon: '🌿', type: 'tool', rarity: 'common' },
  'world-3': { id: 'card-world-3', name: 'Merge Mountain Aegis', description: 'A legendary shield representing the perfect integration of divergent code paths.', icon: '🛡️', type: 'artifact', rarity: 'rare' },
  'world-4': { id: 'card-world-4', name: 'Remote Key of the Kingdom', description: 'Unlocks gateways to distant code realms across the Git networks.', icon: '🔑', type: 'key', rarity: 'rare' },
  'world-5': { id: 'card-world-5', name: 'Open Source Compass', description: 'Guides developers through the sprawling streets of the Open Source City.', icon: '🧭', type: 'tool', rarity: 'epic' },
  'world-6': { id: 'card-world-6', name: 'Git Master Sigil', description: 'Proof of mastering the ancient, complex commands of the Git Temple.', icon: '⛩️', type: 'artifact', rarity: 'legendary' },
  'world-7': { id: 'card-world-7', name: 'Mole Stasher Pocket', description: 'A secret pocket used by Mole Stashers to hide half-finished scripts.', icon: '🦔', type: 'artifact', rarity: 'rare' },
  'world-8': { id: 'card-world-8', name: 'Sensei Rebase Scroll', description: 'Contains secret mantras to straighten the curves of code history.', icon: '🦊', type: 'scroll', rarity: 'epic' },
  'world-9': { id: 'card-world-9', name: 'Farmer Cherry Pincer', description: 'A precise tool to grab only the finest, ripest commits from any branch.', icon: '🍒', type: 'tool', rarity: 'rare' },
  'world-10': { id: 'card-world-10', name: 'Professor Reflog Chronometer', description: 'A mechanical device to trace the ghost footsteps of deleted commits.', icon: '🦉', type: 'artifact', rarity: 'epic' },
  'world-11': { id: 'card-world-11', name: 'Pre-Commit Automation Flask', description: 'A glowing test tube filled with pre-commit automation logic.', icon: '🧪', type: 'tool', rarity: 'epic' },
  'world-12': { id: 'card-world-12', name: 'Open Source Academy Diploma', description: 'Awarded to those who survived all 12 trials and became GitQuest Champions.', icon: '🎓', type: 'key', rarity: 'legendary' },
};

/* ═══════════════════════════════════════════════
   GitQuest Game Store — Transient UI & Orchestration
   ═══════════════════════════════════════════════ */

interface GameState {
  // View State
  currentView: GameView;
  selectedWorldId: string | null;
  activeMissionId: string | null;
  showMissionBriefing: boolean;

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
  addNotification: (notification: Omit<GameNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  advanceDialogue: () => void;
  resetDialogue: () => void;
  showHint: () => void;
  resetGame: () => void;
  closeMissionBriefing: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentView: 'world-map',
  selectedWorldId: null,
  activeMissionId: null,
  showMissionBriefing: false,
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

    // Reset game engine state for the new mission
    useGitStore.getState().resetGitState();

    // Set player's current mission
    const playerStore = usePlayerStore.getState();
    usePlayerStore.setState({
      player: {
        ...playerStore.player,
        currentMission: missionId,
        currentWorld: world!.id,
      },
    });

    set({
      activeMissionId: missionId,
      currentView: 'mission',
      showMissionBriefing: true,
      showDialogue: true,
      activeDialogueIndex: 0,
      currentHintIndex: 0,
      hintsUsed: false,
      missionStartTime: Date.now(),
    });
  },

  completeMission: (missionId) => {
    const state = get();
    const world = WORLDS.find(w => w.missions.some(m => m.id === missionId));
    const mission = world?.missions.find(m => m.id === missionId);
    if (!mission) return;

    const playerStore = usePlayerStore.getState();
    const player = playerStore.player;

    const completedMissions = player.completedMissions || [];

    const newCompleted = completedMissions.includes(missionId)
      ? completedMissions
      : [...completedMissions, missionId];

    // Check if world is complete
    const worldComplete = world!.missions.every(m => newCompleted.includes(m.id));

    // Find next world
    const worldIndex = WORLDS.findIndex(w => w.id === world!.id);
    const nextWorld = WORLDS[worldIndex + 1];

    // Call state updater on playerStore
    const { leveledUp, newLevel, newTitle } = playerStore.completeMissionState(
      missionId,
      mission.xpReward,
      worldComplete,
      nextWorld?.id
    );

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
        description: `New title: ${newTitle}`,
        icon: '🎉',
      });
    }

    // ─── Card / Item Collection Drop ───
    const reward = WORLD_REWARDS[world!.id];
    if (reward) {
      const alreadyHas = (player.inventory || []).some(item => item.id === reward.id);
      if (!alreadyHas) {
        playerStore.addToInventory({
          ...reward,
          obtainedFrom: mission.title,
        });
        state.addNotification({
          type: 'achievement',
          title: 'New Card Collected!',
          description: `${reward.icon} ${reward.name} (${reward.rarity})`,
          icon: '🎁',
        });
      }
    }

    // ─── Achievement Triggers ───
    const unlockAchievement = (id: string) => {
      if (!player.achievements.includes(id)) {
        playerStore.unlockAchievement(id);
        state.addNotification({
          type: 'achievement',
          title: 'Achievement Unlocked!',
          description: id,
          icon: '🏆',
        });
      }
    };

    // First init
    if (missionId === 'w1-m1') unlockAchievement('first-init');
    // First commit
    if (mission.gitConcepts.some(c => c.includes('commit'))) {
      unlockAchievement('first-commit');
    }
    // Branch creator
    if (mission.gitConcepts.some(c => c.includes('branch'))) {
      unlockAchievement('branch-creator');
    }
    // Merge master
    if (mission.gitConcepts.some(c => c.includes('merge'))) {
      unlockAchievement('merge-master');
    }
    // Command achievements
    if (mission.gitConcepts.some(c => c.includes('stash'))) {
      unlockAchievement('stash-master');
    }
    if (mission.gitConcepts.some(c => c.includes('rebase'))) {
      unlockAchievement('rebase-master');
    }
    if (mission.gitConcepts.some(c => c.includes('cherry-pick'))) {
      unlockAchievement('cherry-picker');
    }
    if (mission.gitConcepts.some(c => c.includes('reflog'))) {
      unlockAchievement('reflog-master');
    }
    if (mission.gitConcepts.some(c => c.includes('reset'))) {
      unlockAchievement('reset-master');
    }
    if (mission.gitConcepts.some(c => c.includes('revert'))) {
      unlockAchievement('revert-master');
    }
    if (mission.gitConcepts.some(c => c.includes('bisect'))) {
      unlockAchievement('bisect-master');
    }
    if (mission.gitConcepts.some(c => c.includes('hook'))) {
      unlockAchievement('hook-master');
    }

    // World complete achievements
    if (worldComplete) {
      unlockAchievement(`${world!.id}-complete`);
    }

    // No hints used
    if (!state.hintsUsed) {
      unlockAchievement('no-hints');
    }
    // Speed runner (under 60s)
    if (state.missionStartTime && (Date.now() - state.missionStartTime) < 60000) {
      unlockAchievement('speed-runner');
    }

    // Level based achievements
    const level = usePlayerStore.getState().player.level;
    if (level >= 7) unlockAchievement('lucky-7');
    if (level >= 20) unlockAchievement('max-level');

    // Git wizard (all worlds completed)
    const updatedPlayer = usePlayerStore.getState().player;
    const completed = updatedPlayer.completedMissions || [];
    if (WORLDS.every(w => w.missions.every(m => completed.includes(m.id)))) {
      unlockAchievement('git-wizard');
    }

    set({
      activeMissionId: null,
    });
  },

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

  closeMissionBriefing: () => set({
    showMissionBriefing: false,
  }),

  resetGame: () => {
    usePlayerStore.getState().resetPlayer();
    useGitStore.getState().resetGitState();
    set({
      currentView: 'world-map',
      selectedWorldId: null,
      activeMissionId: null,
      showMissionBriefing: false,
      notifications: [],
      activeDialogueIndex: 0,
      showDialogue: false,
      currentHintIndex: 0,
      hintsUsed: false,
      missionStartTime: null,
    });
  },
}));
