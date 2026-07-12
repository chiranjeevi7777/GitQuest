import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Trophy, Lock } from 'lucide-react';

const RARITY_STYLES = {
  common: { border: 'border-ink-faint/30', bg: 'bg-parchment-warm', text: 'text-ink-secondary', badge: 'bg-parchment-warm' },
  rare: { border: 'border-sky/30', bg: 'bg-sky-pale', text: 'text-sky', badge: 'bg-sky-pale' },
  epic: { border: 'border-magic/30', bg: 'bg-magic-pale', text: 'text-magic', badge: 'bg-magic-pale' },
  legendary: { border: 'border-gold/30', bg: 'bg-gold-pale', text: 'text-gold', badge: 'bg-gold-pale' },
};
const RARITY_LABELS = { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' };

import { usePlayerStore } from '@/stores/playerStore';

export function AchievementsView() {
  const { player } = usePlayerStore();
  const achievements = player.achievements || [];
  const unlocked = ACHIEVEMENTS.filter(a => achievements.includes(a.id));

  const locked = ACHIEVEMENTS.filter(a => !achievements.includes(a.id));

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 relative z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-7 h-7 text-gold" />
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Achievements</h2>
            <p className="text-sm text-ink-muted font-display">
              {unlocked.length} / {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="adventure-card p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-display font-semibold text-ink-muted">Overall Progress</span>
            <span className="text-xs font-display font-bold text-sky">
              {Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-parchment-warm rounded-full overflow-hidden border-2 border-border">
            <motion.div
              className="h-full bg-gradient-to-r from-sky to-magic rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display text-xs font-bold tracking-wider text-leaf mb-3 uppercase">
              ✨ Unlocked
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unlocked.map((achievement, i) => {
                const rarity = RARITY_STYLES[achievement.rarity];
                return (
                  <motion.div
                    key={achievement.id}
                    className={`adventure-card p-4 ${rarity.border}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="text-sm font-display font-bold text-ink">{achievement.name}</h4>
                        <p className="text-xs text-ink-muted mt-0.5">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-display font-bold uppercase px-2 py-0.5 rounded-lg ${rarity.text} ${rarity.badge}`}>
                            {RARITY_LABELS[achievement.rarity]}
                          </span>
                          <span className="text-[10px] font-display font-bold text-gold">
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
          <h3 className="font-display text-xs font-bold tracking-wider text-ink-muted mb-3 uppercase">
            🔒 Locked
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locked.map((achievement, i) => {
              const rarity = RARITY_STYLES[achievement.rarity];
              return (
                <motion.div
                  key={achievement.id}
                  className="adventure-card p-4 opacity-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.5 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-parchment-warm border-2 border-border flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-ink-faint" />
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-ink-muted">{achievement.name}</h4>
                      <p className="text-xs text-ink-faint mt-0.5">{achievement.condition}</p>
                      <span className={`text-[10px] font-display font-bold uppercase ${rarity.text} mt-2 inline-block`}>
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
