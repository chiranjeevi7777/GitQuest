import type { World } from '@/types';

export const openSourceAcademy: World = {
  id: 'world-12',
  name: 'Open Source Academy',
  subtitle: 'Grand Finale',
  description: 'Welcome to the Academy Graduation! dean Open will test your knowledge across the entire curriculum to crown you a Git Master.',
  icon: '📚',
  color: '#9b59b6',
  glowColor: 'rgba(155, 89, 182, 0.3)',
  unlockRequirement: 'world-11',
  position: { x: 25, y: 15 },
  missions: [
    {
      id: 'w12-m1',
      worldId: 'world-12',
      title: 'The Grand Graduation',
      description: 'Initialize a repo, make a commit, and create your graduation branch.',
      narrative: 'Dean Open adjusts his doctoral cap. "You have traveled far across the Git realms, young developer. Initialize one last archive, add a file, and branch out to start your career!"',
      type: 'boss',
      difficulty: 'expert',
      xpReward: 500,
      gitConcepts: ['git init', 'git commit', 'git branch'],
      npcs: [{ id: 'dean-open', name: 'Dean Open', role: 'Academic Dean', avatar: '📚', color: '#9b59b6', personality: 'Inspiring and proud' }],
      dialogue: [
        { id: 'd-w12-1', npcId: 'dean-open', text: 'Welcome to the graduation exam! Show me you can execute the full git lifecycle.', type: 'intro', trigger: 'mission_start' },
        { id: 'd-w12-2', npcId: 'dean-open', text: 'Run **git init** and then create a branch called **graduation**.', type: 'hint', trigger: 'mission_start' },
        { id: 'd-w12-3', npcId: 'dean-open', text: 'Congratulations! You have passed the final challenge and graduated as an official Git Quest Master! Go forth and collaborate!', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['First: git init', 'Then: git branch graduation'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w12-m1-o1',
          description: 'Initialize the graduation repository',
          hint: 'Use git init',
          validationType: 'repo_initialized',
          validationParams: {},
          completed: false,
          order: 1,
        },
        {
          id: 'w12-m1-o2',
          description: 'Create branch graduation',
          hint: 'Use git branch graduation',
          validationType: 'branch_exists',
          validationParams: { branchName: 'graduation' },
          completed: false,
          order: 2,
        },
      ],
    },
  ],
};
