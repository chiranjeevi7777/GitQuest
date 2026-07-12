import type { InventoryItem } from './player';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string;
  xpBonus: number;
}

export type GameView = 'world-map' | 'mission' | 'inventory' | 'achievements' | 'skill-tree' | 'settings';

export interface GameNotification {
  id: string;
  type: 'achievement' | 'level-up' | 'mission-complete' | 'xp-gain' | 'item-obtained';
  title: string;
  description: string;
  icon?: string;
  timestamp: number;
}
