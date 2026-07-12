import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useGitStore } from '@/stores/gitStore';
import { Settings as SettingsIcon, Volume2, VolumeX, Sparkles, RotateCcw, Monitor, Type } from 'lucide-react';
import { Toggle, Button, Card, CardBody } from '../ui';

export function SettingsView() {
  const { player, updateSetting, resetPlayer } = usePlayerStore();
  const { resetGitState } = useGitStore();
  
  const resetGame = () => {
    resetPlayer();
    resetGitState();
    // Reset transient game UI state
    useGameStore.setState({
      selectedWorldId: null,
      activeMissionId: null,
      showMissionBriefing: false,
      activeDialogueIndex: 0,
      showDialogue: false,
      currentHintIndex: 0,
      hintsUsed: false,
      missionStartTime: null,
    });
  };
  
  const settings = player.settings || {
    soundEnabled: true,
    animationsEnabled: true,
    terminalFontSize: 14,
    showHints: true,
  };

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-7 h-7 text-ink-secondary" />
          <h2 className="font-display text-2xl font-bold text-ink">Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Sound */}
          <Card variant="cartoon">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-sky" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-ink-muted" />
                  )}
                  <div>
                    <h4 className="text-sm font-display font-bold text-slate-900">Sound Effects</h4>
                    <p className="text-xs text-slate-600">Toggle audio feedback</p>
                  </div>
                </div>
                <Toggle
                  checked={settings.soundEnabled}
                  onChange={(checked) => updateSetting('soundEnabled', checked)}
                />
              </div>
            </CardBody>
          </Card>

          {/* Animations */}
          <Card variant="cartoon">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-magic" />
                  <div>
                    <h4 className="text-sm font-display font-bold text-slate-900">Animations</h4>
                    <p className="text-xs text-slate-600">Toggle motion and effects</p>
                  </div>
                </div>
                <Toggle
                  checked={settings.animationsEnabled}
                  onChange={(checked) => updateSetting('animationsEnabled', checked)}
                />
              </div>
            </CardBody>
          </Card>

          {/* Terminal Font Size */}
          <Card variant="cartoon">
            <CardBody className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Type className="w-5 h-5 text-leaf" />
                <div>
                  <h4 className="text-sm font-display font-bold text-slate-900">Terminal Font Size</h4>
                  <p className="text-xs text-slate-600">Currently: {settings.terminalFontSize}px</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-display font-semibold text-slate-600">12</span>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={settings.terminalFontSize}
                  onChange={(e) => updateSetting('terminalFontSize', Number(e.target.value))}
                  className="flex-1 accent-sky h-2 cursor-pointer border border-slate-900 rounded-lg"
                  aria-label="Terminal font size"
                />
                <span className="text-xs font-display font-semibold text-slate-600">20</span>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <Card variant="cartoon">
            <CardBody className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="w-5 h-5 text-gold" />
                <h4 className="text-sm font-display font-bold text-slate-900">Player Stats</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: player.level, label: 'LEVEL', color: 'text-indigo-600' },
                  { value: player.xp, label: 'TOTAL XP', color: 'text-emerald-600' },
                  { value: (player.completedMissions || []).length, label: 'MISSIONS', color: 'text-purple-600' },
                  { value: player.streak, label: 'STREAK', color: 'text-rose-600' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-amber-100/50 rounded-xl p-3 text-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                  >
                    <div className={`font-display text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] font-display font-bold text-slate-700 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Reset */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                usePlayerStore.setState((state) => ({
                  player: {
                    ...state.player,
                    unlockedWorlds: [
                      'world-1', 'world-2', 'world-3', 'world-4', 'world-5', 'world-6',
                      'world-7', 'world-8', 'world-9', 'world-10', 'world-11', 'world-12'
                    ]
                  }
                }));
                alert('All worlds unlocked for preview!');
              }}
              leftIcon={<Sparkles className="w-4 h-4 animate-pulse" />}
              className="py-3.5 bg-gradient-to-r from-sky via-magic to-gold text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]"
            >
              UNLOCK ALL WORLDS (DEV PREVIEW)
            </Button>

            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                if (confirm('Are you sure? This will erase all progress.')) {
                  resetGame();
                }
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="py-3.5"
            >
              RESET ALL PROGRESS
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
