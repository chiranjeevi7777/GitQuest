import type { NPC } from '@/types';

export const NPCS: Record<string, NPC> = {
  'elder-init': {
    id: 'elder-init',
    name: 'Elder Init',
    role: 'Village Elder',
    avatar: '🧙',
    color: '#00f0ff',
    personality: 'Wise, patient, speaks in metaphors about preservation and memory.',
  },
  'captain-branch': {
    id: 'captain-branch',
    name: 'Captain Branch',
    role: 'Forest Ranger',
    avatar: '🌿',
    color: '#39ff14',
    personality: 'Adventurous, loves exploring alternate paths.',
  },
  'forge-master': {
    id: 'forge-master',
    name: 'Forge Master Merge',
    role: 'Mountain Smith',
    avatar: '⚒️',
    color: '#ffd700',
    personality: 'Gruff, practical, hates unresolved conflicts.',
  },
  'ambassador-remote': {
    id: 'ambassador-remote',
    name: 'Ambassador Remote',
    role: 'Diplomatic Envoy',
    avatar: '🌐',
    color: '#b347d9',
    personality: 'Diplomatic, connected, loves synchronizing.',
  },
  'mayor-collab': {
    id: 'mayor-collab',
    name: 'Mayor Collab',
    role: 'Open Source Mayor',
    avatar: '🏛️',
    color: '#ff6b35',
    personality: 'Community-oriented, passionate about open source.',
  },
  'sensei-rebase': {
    id: 'sensei-rebase',
    name: 'Sensei Rebase',
    role: 'Grand Master',
    avatar: '👁️',
    color: '#ff2d7b',
    personality: 'Mysterious, speaks in riddles, knows all of Git.',
  },
};
