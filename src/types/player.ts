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

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'artifact' | 'scroll' | 'tool' | 'key';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  obtainedFrom: string;
}
