import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Flame, Zap } from 'lucide-react';

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000];

export function TopBar() {
  const { player, activeMissionId } = useGameStore();

  const currentLevelXP = XP_PER_LEVEL[player.level - 1] || 0;
  const nextLevelXP = XP_PER_LEVEL[player.level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  const progress = ((player.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <header className="h-14 bg-abyss border-b border-border flex items-center px-4 gap-4 relative z-10">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-display text-sm font-bold tracking-wider text-neon-cyan text-glow-cyan">
          GITQUEST
        </h1>
        {activeMissionId && (
          <span className="text-xs font-mono text-text-dim px-2 py-0.5 rounded-full bg-surface border border-border">
            MISSION ACTIVE
          </span>
        )}
      </div>

      <div className="flex-1" />

      {/* Streak */}
      <motion.div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border"
        whileHover={{ scale: 1.02 }}
      >
        <Flame className="w-4 h-4 text-neon-orange" />
        <span className="text-xs font-mono font-semibold text-neon-orange">
          {player.streak}
        </span>
      </motion.div>

      {/* XP Bar */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <Zap className="w-4 h-4 text-neon-cyan flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between mb-0.5">
            <span className="text-[10px] font-mono text-text-dim">
              LVL {player.level}
            </span>
            <span className="text-[10px] font-mono text-text-dim">
              {player.xp} / {nextLevelXP} XP
            </span>
          </div>
          <div className="h-2 bg-deep rounded-full overflow-hidden border border-border">
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
      <div className="flex items-center gap-2 pl-3 border-l border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-sm">
          ⚔️
        </div>
        <div>
          <div className="text-xs font-semibold text-text-primary">{player.username}</div>
          <div className="text-[10px] font-mono text-neon-purple">{player.title}</div>
        </div>
      </div>
    </header>
  );
}
