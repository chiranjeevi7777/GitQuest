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
      className={`
        world-node relative flex flex-col items-center gap-2
        ${!isUnlocked ? 'locked' : ''}
      `}
      whileHover={isUnlocked ? { scale: 1.08 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
    >
      {/* Glow Ring */}
      {isSelected && isUnlocked && (
        <motion.div
          className="absolute -inset-3 rounded-2xl"
          style={{
            background: `radial-gradient(circle, ${world.glowColor}, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Node Circle */}
      <div
        className={`
          relative w-16 h-16 rounded-2xl flex items-center justify-center
          text-2xl transition-all duration-300
          ${isComplete
            ? 'bg-gradient-to-br from-neon-green/20 to-neon-green/5 border-2 border-neon-green'
            : isUnlocked
              ? `bg-gradient-to-br border-2`
              : 'bg-deep border border-border'
          }
        `}
        style={isUnlocked && !isComplete ? {
          borderColor: world.color,
          background: `linear-gradient(135deg, ${world.color}15, ${world.color}05)`,
        } : {}}
      >
        {!isUnlocked ? (
          <Lock className="w-5 h-5 text-text-dim" />
        ) : isComplete ? (
          <div className="relative">
            <span>{world.icon}</span>
            <Check className="absolute -top-1 -right-1 w-4 h-4 text-neon-green bg-void rounded-full" />
          </div>
        ) : (
          <span>{world.icon}</span>
        )}

        {/* Selected Ring */}
        {isSelected && isUnlocked && (
          <motion.div
            className="absolute -inset-1 rounded-2xl border-2"
            style={{ borderColor: world.color }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center min-w-[120px]">
        <div
          className="text-xs font-display font-semibold tracking-wide"
          style={{ color: isUnlocked ? world.color : '#555577' }}
        >
          {world.name}
        </div>
        {isUnlocked && (
          <div className="text-[10px] font-mono text-text-dim mt-0.5">
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
            <Star key={i} className="w-3 h-3 text-neon-yellow fill-neon-yellow" />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}
