import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Trophy, Lock } from 'lucide-react';

const RARITY_COLORS = {
  common: { border: 'border-text-dim/30', bg: 'bg-surface', text: 'text-text-secondary' },
  rare: { border: 'border-neon-cyan/30', bg: 'bg-neon-cyan/5', text: 'text-neon-cyan' },
  epic: { border: 'border-neon-purple/30', bg: 'bg-neon-purple/5', text: 'text-neon-purple' },
  legendary: { border: 'border-neon-yellow/30', bg: 'bg-neon-yellow/5', text: 'text-neon-yellow' },
};

const RARITY_LABELS = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

export function AchievementsView() {
  const { player } = useGameStore();

  const unlocked = ACHIEVEMENTS.filter(a => player.achievements.includes(a.id));
  const locked = ACHIEVEMENTS.filter(a => !player.achievements.includes(a.id));

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-neon-yellow" />
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wider text-text-primary">
              ACHIEVEMENTS
            </h2>
            <p className="text-sm text-text-dim font-mono">
              {unlocked.length} / {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="glass-panel p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-mono text-text-dim">Overall Progress</span>
            <span className="text-xs font-mono text-neon-cyan">
              {Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-deep rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display text-xs font-semibold tracking-wider text-neon-green mb-3">
              UNLOCKED
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unlocked.map((achievement, i) => {
                const rarity = RARITY_COLORS[achievement.rarity];
                return (
                  <motion.div
                    key={achievement.id}
                    className={`glass-panel p-4 ${rarity.border}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary">{achievement.name}</h4>
                        <p className="text-xs text-text-dim mt-0.5">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[9px] font-mono uppercase ${rarity.text}`}>
                            {RARITY_LABELS[achievement.rarity]}
                          </span>
                          <span className="text-[9px] font-mono text-neon-cyan">
                            +{achievement.xpBonus} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked */}
        <div>
          <h3 className="font-display text-xs font-semibold tracking-wider text-text-dim mb-3">
            LOCKED
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locked.map((achievement, i) => {
              const rarity = RARITY_COLORS[achievement.rarity];
              return (
                <motion.div
                  key={achievement.id}
                  className="glass-panel p-4 opacity-40"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.4 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-deep flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-text-dim" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-dim">{achievement.name}</h4>
                      <p className="text-xs text-text-dim mt-0.5">{achievement.condition}</p>
                      <span className={`text-[9px] font-mono uppercase ${rarity.text} mt-2 inline-block`}>
                        {RARITY_LABELS[achievement.rarity]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
