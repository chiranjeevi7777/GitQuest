import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { WORLDS } from '@/data/worlds';
import { WorldNode } from '../game/WorldNode';
import { MissionList } from '../game/MissionList';
import { Lock } from 'lucide-react';

export function WorldMapView() {
  const { player, selectedWorldId, selectWorld } = useGameStore();
  const selectedWorld = WORLDS.find(w => w.id === selectedWorldId);

  return (
    <motion.div
      className="h-full flex relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* World Map */}
      <div className="flex-1 relative overflow-hidden p-6">
        {/* Title */}
        <motion.div
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-2xl font-bold tracking-wider text-text-primary">
            WORLD MAP
          </h2>
          <p className="text-sm text-text-dim mt-1 font-mono">
            Select a world to begin your quest
          </p>
        </motion.div>

        {/* World Nodes */}
        <div className="relative w-full h-[calc(100%-100px)]">
          {/* Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {WORLDS.slice(0, -1).map((world, i) => {
              const next = WORLDS[i + 1];
              const isActive = player.unlockedWorlds.includes(world.id) && player.unlockedWorlds.includes(next.id);
              return (
                <line
                  key={`conn-${i}`}
                  x1={`${world.position.x}%`}
                  y1={`${world.position.y}%`}
                  x2={`${next.position.x}%`}
                  y2={`${next.position.y}%`}
                  stroke={isActive ? world.color : '#2a2a4a'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray="8 4"
                  className={isActive ? 'world-connector' : 'world-connector inactive'}
                  opacity={isActive ? 0.6 : 0.2}
                />
              );
            })}
          </svg>

          {/* World Nodes */}
          {WORLDS.map((world, index) => {
            const isUnlocked = player.unlockedWorlds.includes(world.id);
            const completedMissions = world.missions.filter(m =>
              player.completedMissions.includes(m.id)
            ).length;
            const totalMissions = world.missions.length;
            const isComplete = completedMissions === totalMissions;
            const isSelected = selectedWorldId === world.id;

            return (
              <motion.div
                key={world.id}
                className="absolute"
                style={{
                  left: `${world.position.x}%`,
                  top: `${world.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
              >
                <WorldNode
                  world={world}
                  isUnlocked={isUnlocked}
                  isComplete={isComplete}
                  isSelected={isSelected}
                  completedMissions={completedMissions}
                  totalMissions={totalMissions}
                  onClick={() => isUnlocked && selectWorld(world.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mission Sidebar */}
      <motion.div
        className="w-[380px] bg-abyss border-l border-border overflow-y-auto"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {selectedWorld ? (
          <MissionList world={selectedWorld} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
              Select a World
            </h3>
            <p className="text-sm text-text-dim">
              Click on a world node to see its missions and begin your adventure.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 w-full">
              <div className="glass-panel p-3 text-center">
                <div className="text-xl font-display font-bold text-neon-cyan">
                  {player.completedMissions.length}
                </div>
                <div className="text-[10px] font-mono text-text-dim mt-1">
                  MISSIONS DONE
                </div>
              </div>
              <div className="glass-panel p-3 text-center">
                <div className="text-xl font-display font-bold text-neon-green">
                  {player.unlockedWorlds.length}
                </div>
                <div className="text-[10px] font-mono text-text-dim mt-1">
                  WORLDS UNLOCKED
                </div>
              </div>
              <div className="glass-panel p-3 text-center">
                <div className="text-xl font-display font-bold text-neon-purple">
                  {player.achievements.length}
                </div>
                <div className="text-[10px] font-mono text-text-dim mt-1">
                  ACHIEVEMENTS
                </div>
              </div>
              <div className="glass-panel p-3 text-center">
                <div className="text-xl font-display font-bold text-neon-yellow">
                  {player.xp}
                </div>
                <div className="text-[10px] font-mono text-text-dim mt-1">
                  TOTAL XP
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
