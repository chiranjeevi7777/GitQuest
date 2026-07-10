import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Map, Swords, Trophy, Settings, GitBranch } from 'lucide-react';
import type { GameView } from '@/types';

const NAV_ITEMS: { id: GameView; icon: typeof Map; label: string }[] = [
  { id: 'world-map', icon: Map, label: 'World Map' },
  { id: 'achievements', icon: Trophy, label: 'Achievements' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { currentView, setView, player } = useGameStore();

  return (
    <aside className="w-[72px] bg-abyss border-r border-border flex flex-col items-center py-4 gap-2 relative z-10">
      {/* Logo */}
      <motion.div
        className="mb-4 cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setView('world-map')}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan">
          <GitBranch className="w-6 h-6 text-void" strokeWidth={2.5} />
        </div>
      </motion.div>

      <div className="w-8 h-px bg-border mb-2" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                relative w-11 h-11 rounded-xl flex items-center justify-center
                transition-colors duration-200 group
                ${isActive
                  ? 'bg-elevated text-neon-cyan'
                  : 'text-text-dim hover:text-text-secondary hover:bg-surface'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-neon-cyan rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <span className="
                absolute left-full ml-3 px-2 py-1 rounded-md
                bg-elevated text-text-primary text-xs font-mono
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity whitespace-nowrap z-50
                border border-border
              ">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Player Level Badge */}
      <div className="mt-auto">
        <motion.div
          className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          title={`Level ${player.level} — ${player.title}`}
        >
          <span className="text-sm font-display font-bold text-neon-cyan">
            {player.level}
          </span>
        </motion.div>
      </div>
    </aside>
  );
}
