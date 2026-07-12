import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { GameTerminal } from '../game/GameTerminal';
import { DialoguePanel } from '../game/DialoguePanel';
import { ObjectivesPanel } from '../game/ObjectivesPanel';
import { GitGraphPanel } from '../game/GitGraphPanel';
import { MissionBriefing } from '../game/MissionBriefing';
import { ArrowLeft, Lightbulb, GitBranch, Map } from 'lucide-react';
import { useMission, useKeyboardShortcuts } from '@/hooks';
import { Button } from '../ui';

export function MissionView() {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const {
    showMissionBriefing,
    closeMissionBriefing,
    currentHintIndex,
    showHint,
  } = useGameStore();

  const {
    mission,
    world,
    gitEngine,
    completedObjectives,
    missionComplete,
    executeCommand,
    finishMission,
  } = useMission(missionId);

  // Keyboard shortcut: Escape goes back to map, H toggles hint
  useKeyboardShortcuts(
    {
      escape: (e) => {
        e.preventDefault();
        if (missionComplete) {
          finishMission();
        } else {
          navigate('/');
        }
      },
      h: (e) => {
        e.preventDefault();
        if (mission && mission.hints.length > 0) {
          showHint();
        }
      },
    },
    [mission, missionComplete, finishMission, showHint, navigate]
  );

  if (!mission || !world) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-ink-muted font-display">No active mission</p>
      </div>
    );
  }

  return (
    <motion.div
      className="h-full flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Mission Briefing Overlay */}
      <AnimatePresence>
        {showMissionBriefing && (
          <MissionBriefing mission={mission} world={world} onStart={closeMissionBriefing} />
        )}
      </AnimatePresence>

      {/* Mission Complete Overlay */}
      <AnimatePresence>
        {missionComplete && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center bg-slate-900 border-2 border-slate-950 rounded-2xl p-10 max-w-sm shadow-[6px_6px_0px_0px_#0f172a]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                🎉
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-sky mb-2">
                MISSION COMPLETE!
              </h2>
              <p className="text-ink-secondary font-display font-semibold mb-6">
                +{mission.xpReward} XP
              </p>
              <Button
                variant="cartoon"
                onClick={finishMission}
                leftIcon={<Map className="w-4 h-4" />}
                className="mx-auto"
              >
                Return to World Map
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b-2 border-border shadow-soft">
        <Button
          variant="secondary"
          size="sm"
          className="w-9 h-9 !p-0 rounded-xl flex items-center justify-center border border-slate-700"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">{world.icon}</span>
            <h3 className="font-display text-sm font-bold" style={{ color: world.color }}>
              {mission.title}
            </h3>
            {mission.type === 'boss' && (
              <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-lg bg-coral-pale text-coral border border-coral/20">
                BOSS
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted font-display">{world.name}</p>
        </div>

        {/* Hint Button */}
        {mission.hints.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={showHint}
            leftIcon={<Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
            className="text-xs font-display font-bold border border-slate-700"
          >
            Hint
          </Button>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-leaf-pale border-2 border-leaf/20">
          <GitBranch className="w-3.5 h-3.5 text-leaf" />
          <span className="text-xs font-mono font-semibold text-leaf">
            {gitEngine.getState().currentBranch || 'main'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Terminal + Dialogue */}
        <div className="flex-1 flex flex-col min-w-0">
          <DialoguePanel mission={mission} />

          {/* Hints */}
          <AnimatePresence>
            {currentHintIndex > 0 && mission.hints.length > 0 && (
              <motion.div
                className="mx-4 mb-2 p-3 rounded-xl bg-gold-pale border-2 border-gold/20"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-display font-bold text-gold mb-1">Hint</p>
                    <p className="text-xs text-ink-secondary">
                      {mission.hints[Math.min(currentHintIndex - 1, mission.hints.length - 1)]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 px-4 pb-4">
            <GameTerminal onCommand={executeCommand} />
          </div>
        </div>

        {/* Right Side - Objectives + Git Graph */}
        <div className="w-[300px] border-l-2 border-border bg-card flex flex-col shadow-soft">
          <ObjectivesPanel objectives={mission.objectives} completedObjectives={completedObjectives} />
          <div className="flex-1 border-t-2 border-border">
            <GitGraphPanel engine={gitEngine} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
