import { motion } from 'framer-motion';
import type { World } from '@/types';
import { Lock, Check, Star } from 'lucide-react';

interface WorldNodeProps {
  world: World;
  isUnlocked: boolean;
  isComplete: boolean;
  isSelected: boolean;
  completedMissions: number;
  totalMissions: number;
  onClick: () => void;
}

export function WorldNode({
  world, isUnlocked, isComplete, isSelected,
  completedMissions, totalMissions, onClick,
}: WorldNodeProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`world-node relative flex flex-col items-center gap-2 ${!isUnlocked ? 'locked' : ''}`}
      whileHover={isUnlocked ? { scale: 1.1 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
    >
      {/* Selected Glow */}
      {isSelected && isUnlocked && (
        <motion.div
          className="absolute -inset-4 rounded-3xl"
          style={{ background: `radial-gradient(circle, ${world.glowColor}, transparent 70%)` }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Node Circle */}
      <div
        className={`
          relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center
          text-3xl transition-all duration-300 shadow-medium
          ${isComplete
            ? 'bg-gradient-to-br from-leaf-pale to-leaf/10 border-3 border-leaf'
            : isUnlocked
              ? 'bg-card border-3'
              : 'bg-parchment-warm border-2 border-border'
          }
        `}
        style={isUnlocked && !isComplete ? {
          borderColor: world.color,
          borderWidth: '3px',
          background: `linear-gradient(135deg, ${world.color}12, white)`,
        } : {}}
      >
        {!isUnlocked ? (
          <Lock className="w-6 h-6 text-ink-faint" />
        ) : isComplete ? (
          <div className="relative">
            <span>{world.icon}</span>
            <Check className="absolute -top-1 -right-2 w-5 h-5 text-white bg-leaf rounded-full p-0.5" />
          </div>
        ) : (
          <span>{world.icon}</span>
        )}

        {isSelected && isUnlocked && (
          <motion.div
            className="absolute -inset-1 rounded-2xl border-3"
            style={{ borderColor: world.color }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center min-w-[120px]">
        <div
          className="text-xs font-display font-bold tracking-wide"
          style={{ color: isUnlocked ? world.color : '#9B97A8' }}
        >
          {world.name}
        </div>
        {isUnlocked && (
          <div className="text-[11px] font-display text-ink-muted mt-0.5">
            {completedMissions}/{totalMissions} missions
          </div>
        )}
      </div>

      {/* Stars */}
      {isComplete && (
        <motion.div
          className="flex gap-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          {[1, 2, 3].map(i => (
            <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}
