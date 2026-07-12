import type { World } from '@/types';

export const mergeMountains: World = {
  id: 'world-3',
  name: 'Merge Mountains',
  subtitle: 'Resolve the Conflicts',
  description: 'Two kingdoms edited the same ancient scrolls. Navigate treacherous conflicts and learn the art of resolution.',
  icon: '⛰️',
  color: '#ffd700',
  glowColor: 'rgba(255, 215, 0, 0.3)',
  unlockRequirement: 'world-2',
  position: { x: 55, y: 20 },
  missions: [
    {
      id: 'w3-m1',
      worldId: 'world-3',
      title: 'The Conflicting Scrolls',
      description: 'Two branches edited the same file. Resolve the conflict.',
      narrative: 'Forge Master Merge hammers his anvil. "When two timelines change the same thing, Git can\'t decide which version to keep. YOU must resolve the conflict."',
      type: 'boss',
      difficulty: 'intermediate',
      xpReward: 300,
      gitConcepts: ['merge conflicts', 'conflict resolution'],
      npcs: [{ id: 'forge-master', name: 'Forge Master Merge', role: 'Mountain Smith', avatar: '⚒️', color: '#ffd700', personality: '' }],
      dialogue: [
        { id: 'd19', npcId: 'forge-master', text: 'AH! A conflict! Two branches dared to change the same lines. Git has marked the contested sections with <<<<<<< and >>>>>>>.', type: 'intro', trigger: 'mission_start' },
        { id: 'd20', npcId: 'forge-master', text: 'Open the conflicted file. Remove the conflict markers. Keep what makes sense. Then **add** and **commit** to seal the resolution.', type: 'hint', trigger: 'mission_start' },
        { id: 'd21', npcId: 'forge-master', text: 'WELL FORGED! The conflict has been resolved. Remember: conflicts aren\'t errors — they\'re opportunities to make deliberate choices about your code.', type: 'success', trigger: 'mission_complete' },
      ],
      hints: ['Look for <<<<<<< HEAD markers in the file', 'Edit the file to keep the version you want', 'Remove all conflict markers', 'Then: git add . && git commit -m "Resolve conflict"'],
      unlockRequirement: null,
      objectives: [
        {
          id: 'w3-m1-o1',
          description: 'Resolve the merge conflict and commit',
          hint: 'Edit the file, remove markers, add and commit',
          validationType: 'commit_exists',
          validationParams: { minCommits: '1' },
          completed: false,
          order: 1,
        },
      ],
    },
  ],
};
