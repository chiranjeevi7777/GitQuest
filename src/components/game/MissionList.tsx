import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import type { World, Mission } from '@/types';
import { Play, Check, Lock, Swords, BookOpen, Crown } from 'lucide-react';

interface MissionListProps { world: World; }

const DIFFICULTY_COLORS = {
  beginner: 'text-leaf bg-leaf-pale',
  intermediate: 'text-gold bg-gold-pale',
  advanced: 'text-ember bg-ember-pale',
  expert: 'text-coral bg-coral-pale',
};
const TYPE_ICONS = { tutorial: BookOpen, challenge: Swords, boss: Crown };

import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '@/stores/playerStore';

export function MissionList({ world }: MissionListProps) {
  const { player } = usePlayerStore();
  const navigate = useNavigate();



  const completedMissions = player.completedMissions || [];

  function getMissionStatus(mission: Mission): 'completed' | 'available' | 'locked' {
    if (completedMissions.includes(mission.id)) return 'completed';
    if (!mission.unlockRequirement) return 'available';
    if (completedMissions.includes(mission.unlockRequirement)) return 'available';
    return 'locked';
  }

  return (
    <div className="p-5">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{world.icon}</span>
          <div>
            <h3 className="font-display text-lg font-bold" style={{ color: world.color }}>{world.name}</h3>
            <p className="text-xs text-ink-muted font-display">{world.subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed mt-3">{world.description}</p>
      </div>

      <div className="w-full h-0.5 bg-border rounded-full mb-4" />

      <div className="space-y-3">
        {world.missions.map((mission, index) => {
          const status = getMissionStatus(mission);
          const TypeIcon = TYPE_ICONS[mission.type];
          return (
            <motion.div
              key={mission.id}
              className={`
                mission-card adventure-card p-4 cursor-pointer
                ${status === 'locked' ? 'opacity-40 cursor-not-allowed' : ''}
                ${status === 'completed' ? 'border-leaf/40' : ''}
              `}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: status === 'locked' ? 0.4 : 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={status !== 'locked' ? { scale: 1.02, x: 4 } : {}}
              onClick={() => status === 'available' && navigate(`/mission/${mission.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2
                  ${status === 'completed' ? 'bg-leaf-pale border-leaf/30 text-leaf'
                    : status === 'locked' ? 'bg-parchment-warm border-border text-ink-faint'
                    : 'bg-sky-pale border-sky/30 text-sky'
                  }
                `}>
                  {status === 'completed' ? <Check className="w-5 h-5" />
                    : status === 'locked' ? <Lock className="w-4 h-4" />
                    : <TypeIcon className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-display font-bold text-ink truncate">{mission.title}</h4>
                    {mission.type === 'boss' && (
                      <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-lg bg-coral-pale text-coral border border-coral/20">BOSS</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2">{mission.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[11px] font-display font-bold uppercase px-2 py-0.5 rounded-lg ${DIFFICULTY_COLORS[mission.difficulty]}`}>
                      {mission.difficulty}
                    </span>
                    <span className="text-[11px] font-display font-bold text-gold">+{mission.xpReward} XP</span>
                    <div className="flex gap-1 ml-auto">
                      {mission.gitConcepts.map(c => (
                        <span key={c} className="text-[10px] font-display font-semibold px-1.5 py-0.5 rounded-lg bg-parchment-warm border border-border text-ink-muted">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {status === 'available' && (
                  <motion.div
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-pale text-sky flex-shrink-0 border-2 border-sky/20"
                    whileHover={{ scale: 1.15 }}
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
