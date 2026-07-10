import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { WORLDS } from '@/data/worlds';
import { GitEngine } from '@/engine/gitEngine';
import { GameTerminal } from '../game/GameTerminal';
import { DialoguePanel } from '../game/DialoguePanel';
import { ObjectivesPanel } from '../game/ObjectivesPanel';
import { GitGraphPanel } from '../game/GitGraphPanel';
import { MissionBriefing } from '../game/MissionBriefing';
import { ArrowLeft, Lightbulb, GitBranch } from 'lucide-react';
import type { Mission, MissionObjective } from '@/types';

export function MissionView() {
  const {
    activeMissionId, player, showMissionBriefing, closeMissionBriefing,
    completeMission, setView, addNotification, currentHintIndex, showHint,
  } = useGameStore();

  // Find current mission
  const mission = useMemo(() => {
    for (const world of WORLDS) {
      const m = world.missions.find(m => m.id === activeMissionId);
      if (m) return m;
    }
    return null;
  }, [activeMissionId]);

  const world = useMemo(
    () => WORLDS.find(w => w.missions.some(m => m.id === activeMissionId)),
    [activeMissionId]
  );

  // Objective tracking
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set());
  const [missionComplete, setMissionComplete] = useState(false);

  // Git engine
  const gitEngineRef = useRef<GitEngine | null>(null);
  if (!gitEngineRef.current) {
    gitEngineRef.current = new GitEngine();
  }
  const gitEngine = gitEngineRef.current;

  // Handle command execution
  const handleCommand = useCallback((input: string): string => {
    if (!mission || !gitEngine) return '';

    const result = gitEngine.execute(input);

    // Validate objectives after each command
    const newCompleted = new Set(completedObjectives);
    let changed = false;

    for (const objective of mission.objectives) {
      if (!newCompleted.has(objective.id)) {
        const valid = gitEngine.validate(
          objective.validationType,
          objective.validationParams
        );
        if (valid) {
          newCompleted.add(objective.id);
          changed = true;

          addNotification({
            type: 'xp-gain',
            title: 'Objective Complete!',
            description: objective.description,
            icon: '✅',
          });
        }
      }
    }

    if (changed) {
      setCompletedObjectives(newCompleted);

      // Check if all objectives complete
      if (mission.objectives.every(o => newCompleted.has(o.id)) && !missionComplete) {
        setMissionComplete(true);
        setTimeout(() => {
          completeMission(mission.id);
        }, 1500);
      }
    }

    return result.output;
  }, [mission, gitEngine, completedObjectives, missionComplete, completeMission, addNotification]);

  if (!mission || !world) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-text-dim">No active mission</p>
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
          <MissionBriefing
            mission={mission}
            world={world}
            onStart={closeMissionBriefing}
          />
        )}
      </AnimatePresence>

      {/* Mission Complete Overlay */}
      <AnimatePresence>
        {missionComplete && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
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
              <h2 className="font-display text-3xl font-bold text-neon-cyan text-glow-cyan mb-2">
                MISSION COMPLETE!
              </h2>
              <p className="text-text-secondary font-mono">
                +{mission.xpReward} XP
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-abyss border-b border-border">
        <motion.button
          onClick={() => setView('world-map')}
          className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-text-dim hover:text-text-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">{world.icon}</span>
            <h3 className="font-display text-sm font-semibold" style={{ color: world.color }}>
              {mission.title}
            </h3>
            {mission.type === 'boss' && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon-pink/10 text-neon-pink border border-neon-pink/20">
                BOSS
              </span>
            )}
          </div>
          <p className="text-xs text-text-dim">{world.name}</p>
        </div>

        {/* Hint Button */}
        {mission.hints.length > 0 && (
          <motion.button
            onClick={showHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20 text-xs font-mono"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </motion.button>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
          <GitBranch className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-xs font-mono text-neon-green">
            {gitEngine.getState().currentBranch || 'main'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Terminal + Git Graph */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* NPC Dialogue */}
          <DialoguePanel mission={mission} />

          {/* Hints */}
          <AnimatePresence>
            {currentHintIndex > 0 && mission.hints.length > 0 && (
              <motion.div
                className="mx-4 mb-2 p-3 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-neon-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-neon-yellow mb-1">Hint</p>
                    <p className="text-xs text-text-secondary font-mono">
                      {mission.hints[Math.min(currentHintIndex - 1, mission.hints.length - 1)]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal */}
          <div className="flex-1 px-4 pb-4">
            <GameTerminal onCommand={handleCommand} />
          </div>
        </div>

        {/* Right Side - Objectives + Git Graph */}
        <div className="w-[300px] border-l border-border bg-abyss flex flex-col">
          <ObjectivesPanel
            objectives={mission.objectives}
            completedObjectives={completedObjectives}
          />
          <div className="flex-1 border-t border-border">
            <GitGraphPanel engine={gitEngine} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
