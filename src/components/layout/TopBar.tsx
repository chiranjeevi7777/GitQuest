import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Flame, Sparkles } from 'lucide-react';
import { getXPProgress } from '@/data/constants';

import { usePlayerStore } from '@/stores/playerStore';

export function TopBar() {
  const { player } = usePlayerStore();
  const { activeMissionId } = useGameStore();

  const xp = player?.xp ?? 0;
  const level = player?.level ?? 1;
  const username = player?.username ?? 'Developer';
  const title = player?.title ?? 'Apprentice';
  const streak = player?.streak ?? 0;

  const { nextLevelXP, progress } = getXPProgress(xp, level);

  return (
    <header className="h-16 bg-card border-b-2 border-border flex items-center px-5 gap-4 relative z-10 shadow-soft">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-display text-lg font-bold tracking-wide text-ink">
          🗺️ GitQuest
        </h1>
        {activeMissionId && (
          <span className="text-xs font-display font-semibold text-sky px-2.5 py-1 rounded-full bg-sky-pale border border-sky/20">
            ⚔️ MISSION ACTIVE
          </span>
        )}
      </div>

      <div className="flex-1" />

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ember-pale border-2 border-ember/20"
          whileHover={{ scale: 1.05 }}
        >
          <Flame className="w-4 h-4 text-ember" />
          <span className="text-xs font-display font-bold text-ember">
            {streak} day{streak !== 1 ? 's' : ''}
          </span>
        </motion.div>
      )}

      {/* XP Bar */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between mb-0.5">
            <span className="text-[11px] font-display font-semibold text-ink-muted">
              LVL {level}
            </span>
            <span className="text-[11px] font-display font-semibold text-sky">
              {xp} / {nextLevelXP} XP
            </span>
          </div>
          <div className="h-2.5 bg-parchment-warm rounded-full overflow-hidden border-2 border-border">
            <motion.div
              className="h-full xp-bar-fill rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div className="flex items-center gap-2.5 pl-4 border-l-2 border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky to-magic flex items-center justify-center text-sm shadow-soft">
          ⚔️
        </div>
        <div>
          <div className="text-sm font-display font-bold text-ink">{username}</div>
          <div className="text-[11px] font-display font-semibold text-magic">{title}</div>
        </div>
      </div>
    </header>
  );
}
