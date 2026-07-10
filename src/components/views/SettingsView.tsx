import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Settings, Volume2, VolumeX, Sparkles, RotateCcw, Monitor, Type } from 'lucide-react';

export function SettingsView() {
  const { player, resetGame } = useGameStore();
  const settings = player.settings;

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-text-secondary" />
          <h2 className="font-display text-2xl font-bold tracking-wider text-text-primary">
            SETTINGS
          </h2>
        </div>

        <div className="space-y-4">
          {/* Sound */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-neon-cyan" />
                ) : (
                  <VolumeX className="w-5 h-5 text-text-dim" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Sound Effects</h4>
                  <p className="text-xs text-text-dim">Toggle audio feedback</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors ${settings.soundEnabled ? 'bg-neon-cyan' : 'bg-surface'} cursor-pointer border border-border`}>
                <div className={`w-4 h-4 rounded-full bg-text-primary transition-transform mt-0.5 ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </div>

          {/* Animations */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-neon-purple" />
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Animations</h4>
                  <p className="text-xs text-text-dim">Toggle motion and effects</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors ${settings.animationsEnabled ? 'bg-neon-purple' : 'bg-surface'} cursor-pointer border border-border`}>
                <div className={`w-4 h-4 rounded-full bg-text-primary transition-transform mt-0.5 ${settings.animationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </div>

          {/* Terminal Font Size */}
          <div className="glass-panel p-4">
            <div className="flex items-center gap-3 mb-3">
              <Type className="w-5 h-5 text-neon-green" />
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Terminal Font Size</h4>
                <p className="text-xs text-text-dim">Adjust terminal readability</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-dim">12px</span>
              <input
                type="range"
                min="12"
                max="20"
                value={settings.terminalFontSize}
                readOnly
                className="flex-1 accent-neon-cyan"
              />
              <span className="text-xs font-mono text-text-dim">20px</span>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-panel p-4">
            <div className="flex items-center gap-3 mb-3">
              <Monitor className="w-5 h-5 text-neon-yellow" />
              <h4 className="text-sm font-semibold text-text-primary">Player Stats</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="font-display text-xl font-bold text-neon-cyan">{player.level}</div>
                <div className="text-[10px] font-mono text-text-dim mt-1">LEVEL</div>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="font-display text-xl font-bold text-neon-green">{player.xp}</div>
                <div className="text-[10px] font-mono text-text-dim mt-1">TOTAL XP</div>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="font-display text-xl font-bold text-neon-purple">{player.completedMissions.length}</div>
                <div className="text-[10px] font-mono text-text-dim mt-1">MISSIONS</div>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="font-display text-xl font-bold text-neon-orange">{player.streak}</div>
                <div className="text-[10px] font-mono text-text-dim mt-1">STREAK</div>
              </div>
            </div>
          </div>

          {/* Reset */}
          <motion.button
            onClick={() => {
              if (confirm('Are you sure? This will erase all progress.')) {
                resetGame();
              }
            }}
            className="w-full py-3 rounded-xl glass-panel border border-neon-pink/20 text-neon-pink font-display text-sm font-semibold tracking-wider hover:bg-neon-pink/5 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              RESET ALL PROGRESS
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
