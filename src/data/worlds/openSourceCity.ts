import type { World } from '@/types';

export const openSourceCity: World = {
  id: 'world-5',
  name: 'Open Source City',
  subtitle: 'The Power of Community',
  description: 'A bustling metropolis where developers collaborate on shared projects. Fork, contribute, and build together.',
  icon: '🌆',
  color: '#ff6b35',
  glowColor: 'rgba(255, 107, 53, 0.3)',
  unlockRequirement: 'world-4',
  position: { x: 85, y: 30 },
  missions: [
    {
      id: 'w5-m1',
      worldId: 'world-5',
      title: 'The Art of Forking',
      description: 'Fork a project and make your own copy.',
      narrative: 'Mayor Collab opens the city gates. "In Open Source City, anyone can contribute to any project. The first step? Fork it — create your own copy to work on."',
      type: 'tutorial',
      difficulty: 'intermediate',
      xpReward: 200,
      gitConcepts: ['fork', 'clone'],
      npcs: [{ id: 'mayor-collab', name: 'Mayor Collab', role: 'Open Source Mayor', avatar: '🏛️', color: '#ff6b35', personality: '' }],
      dialogue: [
        { id: 'd25', npcId: 'mayor-collab', text: 'Welcome to Open Source City! Here, knowledge flows freely. Forking a repository creates your own copy where you can experiment.', type: 'intro', trigger: 'mission_start' },
        { id: 'd26', npcId: 'mayor-collab', text: 'On GitHub, click the **Fork** button. Then **git clone** your fork to work locally. When ready, submit a **Pull Request** to contribute back!', type: 'hint', trigger: 'mission_start' },
        { id: 'd27', npcId: 'mayor-collab', text: 'You\'ve mastered the art of open source collaboration! Fork → Clone → Branch → Commit → Push → Pull Request. This is the workflow that powers the world\'s software.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['Fork on GitHub, then: git clone <your-fork-url>', 'Create a branch for your changes', 'Push and open a Pull Request'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w5-m1-o1',
          description: 'Clone a forked repository',
          hint: 'Use git clone',
          validationType: 'repo_initialized',
          validationParams: {},
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
