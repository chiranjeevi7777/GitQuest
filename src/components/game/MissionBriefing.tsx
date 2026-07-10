import { motion } from 'framer-motion';
import type { Mission, World } from '@/types';
import { NPCS } from '@/data/npcs';
import { Play, Swords, BookOpen, Crown, Zap } from 'lucide-react';

interface MissionBriefingProps {
  mission: Mission;
  world: World;
  onStart: () => void;
}

const TYPE_LABELS = { tutorial: 'Tutorial', challenge: 'Challenge', boss: 'Boss Fight' };
const TYPE_ICONS = { tutorial: BookOpen, challenge: Swords, boss: Crown };

export function MissionBriefing({ mission, world, onStart }: MissionBriefingProps) {
  const TypeIcon = TYPE_ICONS[mission.type];
  const npc = mission.npcs[0];
  const npcData = npc ? NPCS[npc.id] : null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-panel-bright max-w-lg w-full mx-4 overflow-hidden"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div
          className="p-6 pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${world.color}15, transparent)`,
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <span className="text-8xl">{world.icon}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <TypeIcon className="w-4 h-4" style={{ color: world.color }} />
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: world.color }}
            >
              {TYPE_LABELS[mission.type]}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
            {mission.title}
          </h2>
          <p className="text-sm text-text-dim">{world.name}</p>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-4">
          {/* Narrative */}
          <p className="text-sm text-text-secondary leading-relaxed italic">
            "{mission.narrative}"
          </p>

          {/* NPC */}
          {npcData && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
              <div
                className="npc-avatar"
                style={{
                  background: `linear-gradient(135deg, ${npcData.color}20, ${npcData.color}05)`,
                  border: `1px solid ${npcData.color}40`,
                }}
              >
                {npcData.avatar}
              </div>
              <div>
                <div className="text-xs font-display font-semibold" style={{ color: npcData.color }}>
                  {npcData.name}
                </div>
                <div className="text-[10px] font-mono text-text-dim">{npcData.role}</div>
              </div>
            </div>
          )}

          {/* Objectives Preview */}
          <div>
            <h4 className="text-xs font-display font-semibold text-text-primary mb-2 tracking-wider">
              OBJECTIVES
            </h4>
            <div className="space-y-1.5">
              {mission.objectives.map((obj, i) => (
                <div key={obj.id} className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-surface border border-border flex items-center justify-center text-[9px] font-mono text-text-dim">
                    {i + 1}
                  </span>
                  {obj.description}
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-mono font-semibold text-neon-cyan">
                +{mission.xpReward} XP
              </span>
            </div>
            <div className="flex gap-1">
              {mission.gitConcepts.map(concept => (
                <span
                  key={concept}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="p-6 pt-2">
          <motion.button
            onClick={onStart}
            className="w-full py-3 rounded-xl font-display font-semibold tracking-wider text-sm
              bg-gradient-to-r from-neon-cyan to-neon-purple text-void
              hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]
              transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              BEGIN MISSION
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
