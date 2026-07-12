import type { World } from '@/types';

export const cherryPickOrchard: World = {
  id: 'world-9',
  name: 'Cherry Pick Orchard',
  subtitle: 'Selective Commits',
  description: 'In this delicious orchard, Farmer Cherry shows you how to pick exactly the commits you want and discard the rest.',
  icon: '🍒',
  color: '#e74c3c',
  glowColor: 'rgba(231, 76, 60, 0.3)',
  unlockRequirement: 'world-8',
  position: { x: 40, y: 92 },
  missions: [
    {
      id: 'w9-m1',
      worldId: 'world-9',
      title: 'Selective Picking',
      description: 'Bring a single commit from a draft branch to main.',
      narrative: 'Farmer Cherry wipes his brow. "Why take the whole branch when only one fruit is ripe? Cherry-picking lets you copy a single commit by its hash. Let\'s try it!"',
      type: 'tutorial',
      difficulty: 'advanced',
      xpReward: 300,
      gitConcepts: ['git cherry-pick'],
      npcs: [{ id: 'farmer-cherry', name: 'Farmer Cherry', role: 'Orchardist', avatar: '🍒', color: '#e74c3c', personality: 'Selective and careful' }],
      dialogue: [
        { id: 'd-w9-1', npcId: 'farmer-cherry', text: 'Welcome to the Orchard! Grab your basket. We only want a specific commit today.', type: 'intro', trigger: 'mission_start' },
        { id: 'd-w9-2', npcId: 'farmer-cherry', text: 'Use **git cherry-pick 3a5f9c** to bring that specific commit onto your branch.', type: 'hint', trigger: 'mission_start' },
        { id: 'd-w9-3', npcId: 'farmer-cherry', text: 'Perfect selection! You\'ve cherry-picked the commit cleanly without bringing the rest of the branch.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['Type: git cherry-pick 3a5f9c'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w9-m1-o1',
          description: 'Cherry-pick commit 3a5f9c',
          hint: 'Use git cherry-pick 3a5f9c',
          validationType: 'custom',
          validationParams: { type: 'cherry_picked' },
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
