import type { World } from '@/types';

export const hookLaboratory: World = {
  id: 'world-11',
  name: 'Hook Laboratory',
  subtitle: 'Automation Triggers',
  description: 'Step into the lab of Dr. Hook and write automation scripts that execute automatically when git actions are triggered.',
  icon: '🔬',
  color: '#1abc9c',
  glowColor: 'rgba(26, 188, 156, 0.3)',
  unlockRequirement: 'world-10',
  position: { x: 10, y: 50 },
  missions: [
    {
      id: 'w11-m1',
      worldId: 'world-11',
      title: 'Automated Sentinels',
      description: 'Create a pre-commit hook file to run automated checks.',
      narrative: 'Dr. Hook adjusts his microscope. "In this lab, we automate everything! Creating a script in .git/hooks/pre-commit will run checks automatically before you commit. Go touch the pre-commit file!"',
      type: 'tutorial',
      difficulty: 'expert',
      xpReward: 350,
      gitConcepts: ['git hooks', 'pre-commit'],
      npcs: [{ id: 'dr-hook', name: 'Dr. Hook', role: 'Automation Scientist', avatar: '🔬', color: '#1abc9c', personality: 'Inventive and hyperactive' }],
      dialogue: [
        { id: 'd-w11-1', npcId: 'dr-hook', text: 'Welcome to the lab! Let\'s build a pre-commit sentinel.', type: 'intro', trigger: 'mission_start' },
        { id: 'd-w11-2', npcId: 'dr-hook', text: 'Use the command **touch .git/hooks/pre-commit** to create the hook file.', type: 'hint', trigger: 'mission_start' },
        { id: 'd-w11-3', npcId: 'dr-hook', text: 'Eureka! The sentinel is active. Now any code committed must pass through this script first.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['Type: touch .git/hooks/pre-commit'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w11-m1-o1',
          description: 'Create the pre-commit hook file',
          hint: 'Touch .git/hooks/pre-commit',
          validationType: 'custom',
          validationParams: { type: 'hook_configured' },
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
