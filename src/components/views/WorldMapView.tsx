import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { WORLDS } from '@/data/worlds';
import { WorldNode } from '../game/WorldNode';
import { MissionList } from '../game/MissionList';

import { usePlayerStore } from '@/stores/playerStore';

export function WorldMapView() {
  const { player } = usePlayerStore();
  const unlockedWorlds = player.unlockedWorlds || ['world-1'];
  const completedMissionsArray = player.completedMissions || [];
  const achievements = player.achievements || [];
  const { selectedWorldId, selectWorld } = useGameStore();
  const selectedWorld = WORLDS.find(w => w.id === selectedWorldId);


  return (
    <motion.div
      className="h-full flex relative"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* World Map */}
      <div className="flex-1 relative overflow-hidden p-6">
        <motion.div className="mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="font-display text-2xl font-bold text-ink">🗺️ World Map</h2>
          <p className="text-sm text-ink-muted mt-1 font-display">Select a world to begin your quest</p>
        </motion.div>
  
        <div className="relative w-full h-[calc(100%-100px)]">
          {/* Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <filter id="neon-laser-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {WORLDS.slice(0, -1).map((world, i) => {
              const next = WORLDS[i + 1];
              const isActive = unlockedWorlds.includes(world.id) && unlockedWorlds.includes(next.id);
              return (
                <g key={`conn-${i}`}>
                  {/* Animated Outer Glow Line */}
                  {isActive && (
                    <line
                      x1={`${world.position.x}%`} y1={`${world.position.y}%`}
                      x2={`${next.position.x}%`} y2={`${next.position.y}%`}
                      stroke={world.color}
                      strokeWidth={8}
                      strokeDasharray="8 6"
                      className="world-connector"
                      opacity={0.35}
                      filter="url(#neon-laser-glow)"
                    />
                  )}
                  {/* High-Contrast Core Line */}
                  <line
                    x1={`${world.position.x}%`} y1={`${world.position.y}%`}
                    x2={`${next.position.x}%`} y2={`${next.position.y}%`}
                    stroke={isActive ? world.color : '#C4C0CE'}
                    strokeWidth={isActive ? 3.5 : 2}
                    strokeDasharray="8 6"
                    className={isActive ? 'world-connector' : 'world-connector inactive'}
                    opacity={isActive ? 0.95 : 0.3}
                  />
                </g>
              );
            })}
          </svg>
  
          {WORLDS.map((world, index) => {
            const isUnlocked = unlockedWorlds.includes(world.id);
            const completedCount = world.missions.filter(m => completedMissionsArray.includes(m.id)).length;
            const totalMissions = world.missions.length;
            const isComplete = completedCount === totalMissions;
            const isSelected = selectedWorldId === world.id;
            return (
              <motion.div key={world.id} className="absolute"
                style={{ left: `${world.position.x}%`, top: `${world.position.y}%`, transform: 'translate(-50%, -50%)', zIndex: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
              >
                <WorldNode world={world} isUnlocked={isUnlocked} isComplete={isComplete} isSelected={isSelected}
                  completedMissions={completedCount} totalMissions={totalMissions}
                  onClick={() => isUnlocked && selectWorld(world.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
  
      {/* Mission Sidebar */}
      <motion.div
        className="w-[380px] bg-card border-l-2 border-border overflow-y-auto shadow-soft"
        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {selectedWorld ? (
          <MissionList world={selectedWorld} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="text-5xl mb-4">🧭</div>
            <h3 className="font-display text-lg font-bold text-ink mb-2">Select a World</h3>
            <p className="text-sm text-ink-muted font-display">
              Click on a world node to see its missions and begin your adventure.
            </p>
  
            <div className="mt-8 grid grid-cols-2 gap-3 w-full">
              {[
                { value: completedMissionsArray.length, label: 'MISSIONS DONE', color: 'text-sky' },
                { value: unlockedWorlds.length, label: 'WORLDS UNLOCKED', color: 'text-leaf' },
                { value: achievements.length, label: 'ACHIEVEMENTS', color: 'text-magic' },
                { value: player.xp, label: 'TOTAL XP', color: 'text-gold' },
              ].map(stat => (
                <div key={stat.label} className="adventure-card p-3 text-center">
                  <div className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-display font-semibold text-ink-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
