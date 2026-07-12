import { motion } from 'framer-motion';
import type { Mission, World } from '@/types';
import { NPCS } from '@/data/npcs';
import { Play, Swords, BookOpen, Crown, Sparkles } from 'lucide-react';

interface MissionBriefingProps { mission: Mission; world: World; onStart: () => void; }
const TYPE_LABELS = { tutorial: 'Tutorial', challenge: 'Challenge', boss: 'Boss Fight' };
const TYPE_ICONS = { tutorial: BookOpen, challenge: Swords, boss: Crown };

export function MissionBriefing({ mission, world, onStart }: MissionBriefingProps) {
  const TypeIcon = TYPE_ICONS[mission.type];
  const npc = mission.npcs[0];
  const npcData = npc ? NPCS[npc.id] : null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="adventure-card-elevated max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="p-6 pb-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${world.color}12, transparent)` }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"><span className="text-8xl">{world.icon}</span></div>
          <div className="flex items-center gap-2 mb-2">
            <TypeIcon className="w-4 h-4" style={{ color: world.color }} />
            <span className="text-[11px] font-display font-bold uppercase tracking-wider" style={{ color: world.color }}>
              {TYPE_LABELS[mission.type]}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-1">{mission.title}</h2>
          <p className="text-sm text-ink-muted font-display">{world.name}</p>
        </div>

        <div className="p-6 pt-2 space-y-4">
          <p className="text-sm text-ink-secondary leading-relaxed italic">"{mission.narrative}"</p>

          {npcData && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-parchment-warm border-2 border-border">
              <div className="npc-avatar" style={{
                background: `linear-gradient(135deg, ${npcData.color}20, ${npcData.color}05)`,
                border: `2px solid ${npcData.color}40`,
              }}>{npcData.avatar}</div>
              <div>
                <div className="text-sm font-display font-bold" style={{ color: npcData.color }}>{npcData.name}</div>
                <div className="text-[11px] font-display text-ink-muted">{npcData.role}</div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-display font-bold text-ink mb-2 tracking-wide">OBJECTIVES</h4>
            <div className="space-y-1.5">
              {mission.objectives.map((obj, i) => (
                <div key={obj.id} className="flex items-center gap-2 text-xs text-ink-secondary">
                  <span className="w-5 h-5 rounded-full bg-sky-pale border-2 border-sky/20 flex items-center justify-center text-[10px] font-display font-bold text-sky">
                    {i + 1}
                  </span>
                  {obj.description}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-display font-bold text-gold">+{mission.xpReward} XP</span>
            </div>
            <div className="flex gap-1">
              {mission.gitConcepts.map(concept => (
                <span key={concept} className="text-[11px] font-display font-semibold px-2 py-0.5 rounded-lg bg-magic-pale text-magic border border-magic/20">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 pt-2">
          <motion.button
            onClick={onStart}
            className="w-full py-3.5 rounded-2xl font-display font-bold tracking-wide text-sm
              bg-gradient-to-r from-sky to-magic text-white
              hover:shadow-large transition-shadow duration-300"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> BEGIN MISSION
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
