import { motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { usePlayerStore } from '@/stores/playerStore';
import { Map, Trophy, Settings, GitBranch, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Map, label: 'World Map', emoji: '🗺️' },
  { path: '/achievements', icon: Trophy, label: 'Achievements', emoji: '🏆' },
  { path: '/cards', icon: Sparkles, label: 'Cards', emoji: '✨' },
  { path: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' },
];

export function Sidebar() {
  const { player } = usePlayerStore();

  return (
    <aside className="w-[76px] bg-card border-r-2 border-border flex flex-col items-center py-4 gap-2 relative z-10 shadow-soft">
      {/* Logo */}
      <motion.div
        className="mb-3"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky to-magic flex items-center justify-center shadow-medium block">
          <GitBranch className="w-6 h-6 text-white m-auto" strokeWidth={2.5} />
        </Link>
      </motion.div>

      <div className="w-10 h-0.5 bg-border rounded-full mb-1" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-200 group border-2
                ${isActive
                  ? 'bg-sky-pale text-sky border-sky/30 shadow-soft'
                  : 'text-ink-muted hover:text-ink-secondary hover:bg-parchment-warm border-transparent'
                }
              `}
              title={item.label}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-[4px] h-6 bg-sky rounded-r-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />

                  {/* Tooltip */}
                  <span className="
                    absolute left-full ml-3 px-3 py-1.5 rounded-xl
                    bg-ink text-white text-xs font-display font-semibold
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity whitespace-nowrap z-50
                    shadow-medium
                  ">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Player Level Badge */}
      <div className="mt-auto">
        <motion.div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-pale to-gold/10 border-2 border-gold/30 flex items-center justify-center shadow-soft"
          whileHover={{ scale: 1.08 }}
          title={`Level ${player.level} — ${player.title}`}
        >
          <span className="text-base font-display font-bold text-gold">
            {player.level}
          </span>
        </motion.div>
      </div>
    </aside>
  );
}
