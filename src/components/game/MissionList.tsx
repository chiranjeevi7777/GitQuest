import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import type { World, Mission } from '@/types';
import { Play, Check, Lock, Swords, BookOpen, Crown } from 'lucide-react';

interface MissionListProps {
  world: World;
}

const DIFFICULTY_COLORS = {
  beginner: 'text-neon-green',
  intermediate: 'text-neon-yellow',
  advanced: 'text-neon-orange',
  expert: 'text-neon-pink',
};

const TYPE_ICONS = {
  tutorial: BookOpen,
  challenge: Swords,
  boss: Crown,
};

export function MissionList({ world }: MissionListProps) {
  const { player, startMission } = useGameStore();

  function getMissionStatus(mission: Mission): 'completed' | 'available' | 'locked' {
    if (player.completedMissions.includes(mission.id)) return 'completed';
    if (!mission.unlockRequirement) return 'available';
    if (player.completedMissions.includes(mission.unlockRequirement)) return 'available';
    return 'locked';
  }

  return (
    <div className="p-4">
      {/* World Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{world.icon}</span>
          <div>
            <h3
              className="font-display text-lg font-bold tracking-wide"
              style={{ color: world.color }}
            >
              {world.name}
            </h3>
            <p className="text-xs text-text-dim font-mono">{world.subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mt-3">
          {world.description}
        </p>
      </div>

      <div className="w-full h-px bg-border mb-4" />

      {/* Missions */}
      <div className="space-y-3">
        {world.missions.map((mission, index) => {
          const status = getMissionStatus(mission);
          const TypeIcon = TYPE_ICONS[mission.type];

          return (
            <motion.div
              key={mission.id}
              className={`
                mission-card glass-panel p-4 cursor-pointer
                transition-all duration-200
                ${status === 'locked' ? 'opacity-40 cursor-not-allowed' : ''}
                ${status === 'completed' ? 'border-neon-green/30' : ''}
              `}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: status === 'locked' ? 0.4 : 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={status !== 'locked' ? { scale: 1.02, x: 4 } : {}}
              onClick={() => status === 'available' && startMission(mission.id)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${status === 'completed'
                      ? 'bg-neon-green/10 text-neon-green'
                      : status === 'locked'
                        ? 'bg-deep text-text-dim'
                        : 'bg-surface text-text-primary'
                    }
                  `}
                  style={status === 'available' ? { color: world.color } : {}}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : status === 'locked' ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <TypeIcon className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                      {mission.title}
                    </h4>
                    {mission.type === 'boss' && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon-pink/10 text-neon-pink border border-neon-pink/20">
                        BOSS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-dim line-clamp-2">
                    {mission.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-mono uppercase ${DIFFICULTY_COLORS[mission.difficulty]}`}>
                      {mission.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-neon-cyan">
                      +{mission.xpReward} XP
                    </span>
                    <div className="flex gap-1 ml-auto">
                      {mission.gitConcepts.map(concept => (
                        <span
                          key={concept}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-dim"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                {status === 'available' && (
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-neon-cyan/10 text-neon-cyan flex-shrink-0"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 240, 255, 0.2)' }}
                  >
                    <Play className="w-4 h-4" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
