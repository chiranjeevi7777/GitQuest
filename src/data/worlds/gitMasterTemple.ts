import type { World } from '@/types';

export const gitMasterTemple: World = {
  id: 'world-6',
  name: 'Git Master Temple',
  subtitle: 'Advanced Mastery',
  description: 'The final challenge. Master rebase, stash, reflog, bisect, and cherry-pick to become a true Git Master.',
  icon: '🏯',
  color: '#ff2d7b',
  glowColor: 'rgba(255, 45, 123, 0.3)',
  unlockRequirement: 'world-5',
  position: { x: 50, y: 65 },
  missions: [
    {
      id: 'w6-m1',
      worldId: 'world-6',
      title: 'The Art of Stashing',
      description: 'Hide unfinished work and retrieve it later.',
      narrative: 'Sensei Rebase meditates in the temple garden. "Sometimes you must set aside what you\'re working on. Git stash lets you hide changes and return to a clean state."',
      type: 'challenge',
      difficulty: 'advanced',
      xpReward: 300,
      gitConcepts: ['git stash'],
      npcs: [{ id: 'sensei-rebase', name: 'Sensei Rebase', role: 'Grand Master', avatar: '👁️', color: '#ff2d7b', personality: '' }],
      dialogue: [
        { id: 'd28', npcId: 'sensei-rebase', text: 'Welcome to the Temple, young one. Here, we master the advanced arts. Let us begin with **stash** — the ability to hide your unfinished inventions.', type: 'intro', trigger: 'mission_start' },
        { id: 'd29', npcId: 'sensei-rebase', text: 'Make some changes. Then use **git stash** to hide them. The working directory becomes clean. Use **git stash pop** to bring them back.', type: 'hint', trigger: 'mission_start' },
        { id: 'd30', npcId: 'sensei-rebase', text: 'You understand stash! Like a secret compartment, it holds your work safely while you attend to other matters. True mastery is knowing when to use it.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['Make changes to a file', 'git stash — hides changes', 'git stash list — see stashed items', 'git stash pop — restore changes'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w6-m1-o1',
          description: 'Stash your changes and restore them',
          hint: 'Use git stash and git stash pop',
          validationType: 'custom',
          validationParams: { type: 'stash_used' },
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
