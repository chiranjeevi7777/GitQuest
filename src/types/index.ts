/* ═══════════════════════════════════════════════
   GitQuest Type Definitions
   ═══════════════════════════════════════════════ */

// ─── Player ───
export interface Player {
  id: string;
  username: string;
  xp: number;
  level: number;
  title: string;
  streak: number;
  completedMissions: string[];
  unlockedWorlds: string[];
  achievements: string[];
  inventory: InventoryItem[];
  currentWorld: string | null;
  currentMission: string | null;
  settings: PlayerSettings;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  terminalFontSize: number;
  showHints: boolean;
}

// ─── World ───
export interface World {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
  missions: Mission[];
  unlockRequirement: string | null;
  position: { x: number; y: number };
}

// ─── Mission ───
export interface Mission {
  id: string;
  worldId: string;
  title: string;
  description: string;
  narrative: string;
  type: 'tutorial' | 'challenge' | 'boss';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpReward: number;
  objectives: MissionObjective[];
  npcs: NPC[];
  dialogue: DialogueLine[];
  hints: string[];
  unlockRequirement: string | null;
  setupCommands?: string[];
  gitConcepts: string[];
}

export type MissionStatus = 'locked' | 'available' | 'active' | 'completed';

// ─── Mission Objective ───
export interface MissionObjective {
  id: string;
  description: string;
  hint: string;
  validationType: 'branch_exists' | 'file_staged' | 'commit_exists' | 'branch_merged' |
                   'file_exists' | 'repo_initialized' | 'remote_added' | 'custom';
  validationParams: Record<string, string>;
  completed: boolean;
  order: number;
}

// ─── NPC ───
export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  personality: string;
}

// ─── Dialogue ───
export interface DialogueLine {
  id: string;
  npcId: string;
  text: string;
  type: 'intro' | 'hint' | 'success' | 'failure' | 'lore';
  trigger: 'mission_start' | 'objective_complete' | 'mission_complete' | 'on_hint' | 'on_error';
  objectiveId?: string;
}

// ─── Achievement ───
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string;
  xpBonus: number;
}

// ─── Inventory ───
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'artifact' | 'scroll' | 'tool' | 'key';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  obtainedFrom: string;
}

// ─── Git Graph ───
export interface GitCommitNode {
  hash: string;
  message: string;
  branch: string;
  parent: string | null;
  timestamp: number;
  x: number;
  y: number;
}

export interface GitBranch {
  name: string;
  color: string;
  commits: GitCommitNode[];
}

// ─── Terminal ───
export interface TerminalCommand {
  input: string;
  output: string;
  success: boolean;
  timestamp: number;
}

// ─── Game State ───
export type GameView = 'world-map' | 'mission' | 'inventory' | 'achievements' | 'skill-tree' | 'settings';

export interface GameNotification {
  id: string;
  type: 'achievement' | 'level-up' | 'mission-complete' | 'xp-gain' | 'item-obtained';
  title: string;
  description: string;
  icon?: string;
  timestamp: number;
}
