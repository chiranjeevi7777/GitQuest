import { motion } from 'framer-motion';
import type { MissionObjective } from '@/types';
import { CheckCircle, Circle, Target } from 'lucide-react';

interface ObjectivesPanelProps {
  objectives: MissionObjective[];
  completedObjectives: Set<string>;
}

export function ObjectivesPanel({ objectives, completedObjectives }: ObjectivesPanelProps) {
  const totalDone = objectives.filter(o => completedObjectives.has(o.id)).length;
  const progress = (totalDone / objectives.length) * 100;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-neon-cyan" />
        <h4 className="font-display text-xs font-semibold tracking-wider text-text-primary">
          OBJECTIVES
        </h4>
        <span className="ml-auto text-[10px] font-mono text-text-dim">
          {totalDone}/{objectives.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-deep rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      {/* Objectives List */}
      <div className="space-y-2">
        {objectives.map((objective, index) => {
          const isComplete = completedObjectives.has(objective.id);
          return (
            <motion.div
              key={objective.id}
              className={`
                flex items-start gap-2.5 p-2.5 rounded-lg
                transition-all duration-300
                ${isComplete
                  ? 'bg-neon-green/5 border border-neon-green/20'
                  : 'bg-surface/50 border border-border'
                }
              `}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                </motion.div>
              ) : (
                <Circle className="w-4 h-4 text-text-dim flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-xs font-medium ${isComplete ? 'text-neon-green line-through' : 'text-text-primary'}`}>
                  {objective.description}
                </p>
                {!isComplete && (
                  <p className="text-[10px] text-text-dim mt-0.5 font-mono">
                    {objective.hint}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
