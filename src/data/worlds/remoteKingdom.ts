import type { World } from '@/types';

export const remoteKingdom: World = {
  id: 'world-4',
  name: 'Remote Kingdom',
  subtitle: 'Connect the Realms',
  description: 'Distant realms must share their archives. Learn to push, pull, fetch, and synchronize across the network.',
  icon: '🏰',
  color: '#b347d9',
  glowColor: 'rgba(179, 71, 217, 0.3)',
  unlockRequirement: 'world-3',
  position: { x: 72, y: 50 },
  missions: [
    {
      id: 'w4-m1',
      worldId: 'world-4',
      title: 'The Bridge Between Realms',
      description: 'Connect your local repository to a remote origin.',
      narrative: 'Ambassador Remote extends a diplomatic handshake. "Local work is powerful, but true collaboration requires connecting to the Remote Kingdom — GitHub."',
      type: 'tutorial',
      difficulty: 'intermediate',
      xpReward: 200,
      gitConcepts: ['git remote', 'origin'],
      npcs: [{ id: 'ambassador-remote', name: 'Ambassador Remote', role: 'Diplomatic Envoy', avatar: '🌐', color: '#b347d9', personality: '' }],
      dialogue: [
        { id: 'd22', npcId: 'ambassador-remote', text: 'Greetings! To share your archive with the world, you must establish a connection to a remote repository.', type: 'intro', trigger: 'mission_start' },
        { id: 'd23', npcId: 'ambassador-remote', text: 'Use **git remote add origin <url>** to create the bridge. The name "origin" is convention — it\'s the primary remote repository.', type: 'hint', trigger: 'mission_start' },
        { id: 'd24', npcId: 'ambassador-remote', text: 'The bridge is established! Now your local archive can communicate with the Remote Kingdom.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['git remote add origin https://github.com/user/repo.git', 'Verify with: git remote -v'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w4-m1-o1',
          description: 'Add a remote called "origin"',
          hint: 'Use git remote add',
          validationType: 'remote_added',
          validationParams: { remoteName: 'origin' },
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
