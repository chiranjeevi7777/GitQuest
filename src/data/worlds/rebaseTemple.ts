import type { World } from '@/types';

export const rebaseTemple: World = {
  id: 'world-8',
  name: 'Rebase Temple',
  subtitle: 'Linear Timelines',
  description: 'Learn the ancient art of rebasing to make project history look clean, linear, and chronological.',
  icon: '🦊',
  color: '#2ecc71',
  glowColor: 'rgba(46, 204, 113, 0.3)',
  unlockRequirement: 'world-7',
  position: { x: 60, y: 90 },
  missions: [
    {
      id: 'w8-m1',
      worldId: 'world-8',
      title: 'The Flow of History',
      description: 'Replay your branch changes onto main for a linear timeline.',
      narrative: 'Sensei Rebase smiles peacefully. "Young seeker, a merge commit is like a knot in a rope. Rebasing unties the knot by replaying your commits on top of the target branch. Try it now."',
      type: 'tutorial',
      difficulty: 'advanced',
      xpReward: 300,
      gitConcepts: ['git rebase'],
      npcs: [{ id: 'sensei-rebase', name: 'Sensei Rebase', role: 'Grand Master', avatar: '👁️', color: '#ff2d7b', personality: 'Mysterious, speaks in riddles' }],
      dialogue: [
        { id: 'd-w8-1', npcId: 'sensei-rebase', text: 'Welcome to the Rebase Temple. Let us forge a straight timeline.', type: 'intro', trigger: 'mission_start' },
        { id: 'd-w8-2', npcId: 'sensei-rebase', text: 'Use **git rebase main** to rewrite your current branch timeline so it starts from main\'s latest checkpoint.', type: 'hint', trigger: 'mission_start' },
        { id: 'd-w8-3', npcId: 'sensei-rebase', text: 'Beautiful! History is now a single straight arrow. Master this, and your git log will read like a storybook.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['Type: git rebase main'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w8-m1-o1',
          description: 'Perform a git rebase onto main',
          hint: 'Use git rebase main',
          validationType: 'custom',
          validationParams: { type: 'rebase_completed' },
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
