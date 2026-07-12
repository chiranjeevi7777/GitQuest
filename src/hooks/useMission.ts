import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import { WORLDS } from '@/data/worlds';
import { GitEngine } from '@/engine/gitEngine';
import type { Mission, World } from '@/types';

export function useMission(missionId: string | undefined) {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const {
    completeMission,
    addNotification,
    startMission,
  } = useGameStore();

  // Find mission and world
  const mission = useMemo(() => {
    if (!missionId) return null;
    for (const w of WORLDS) {
      const m = w.missions.find(m => m.id === missionId);
      if (m) return m;
    }
    return null;
  }, [missionId]);

  const world = useMemo(() => {
    if (!missionId) return null;
    return WORLDS.find(w => w.missions.some(m => m.id === missionId)) || null;
  }, [missionId]);

  // Redirect if locked
  useEffect(() => {
    if (missionId && mission) {
      const completedMissions = player.completedMissions || [];
      const isUnlocked = !mission.unlockRequirement || completedMissions.includes(mission.unlockRequirement);
      if (!isUnlocked) {
        navigate('/', { replace: true });
        return;
      }
      startMission(missionId);
    } else if (missionId && !mission) {
      navigate('/', { replace: true });
    }
  }, [missionId, mission, player.completedMissions, startMission, navigate]);

  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set());
  const [missionComplete, setMissionComplete] = useState(false);

  // Maintain references to gitEngine
  const gitEngineRef = useRef<GitEngine | null>(null);
  if (!gitEngineRef.current) {
    gitEngineRef.current = new GitEngine();
  }
  const gitEngine = gitEngineRef.current;

  // Execute terminal command and validate objectives
  const executeCommand = useCallback((input: string): string => {
    if (!mission || !gitEngine) return '';
    const result = gitEngine.execute(input);
    const newCompleted = new Set(completedObjectives);
    let changed = false;

    for (const objective of mission.objectives) {
      if (!newCompleted.has(objective.id)) {
        const valid = gitEngine.validate(objective.validationType, objective.validationParams);
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
      if (mission.objectives.every(o => newCompleted.has(o.id)) && !missionComplete) {
        setMissionComplete(true);
      }
    }

    return result.output;
  }, [mission, gitEngine, completedObjectives, missionComplete, addNotification]);

  const finishMission = useCallback(() => {
    if (mission && missionComplete) {
      completeMission(mission.id);
    }
    navigate('/');
  }, [mission, missionComplete, completeMission, navigate]);

  return {
    mission,
    world,
    gitEngine,
    completedObjectives,
    missionComplete,
    executeCommand,
    finishMission,
  };
}
