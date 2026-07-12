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

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  personality: string;
}

export interface DialogueLine {
  id: string;
  npcId: string;
  text: string;
  type: 'intro' | 'hint' | 'success' | 'failure' | 'lore';
  trigger: 'mission_start' | 'objective_complete' | 'mission_complete' | 'on_hint' | 'on_error';
  objectiveId?: string;
}
