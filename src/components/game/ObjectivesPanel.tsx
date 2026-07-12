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
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-sky" />
        <h4 className="font-display text-xs font-bold tracking-wide text-ink">OBJECTIVES</h4>
        <span className="ml-auto text-[11px] font-display font-semibold text-ink-muted">
          {totalDone}/{objectives.length}
        </span>
      </div>

      <div className="h-2 bg-parchment-warm rounded-full mb-4 overflow-hidden border-2 border-border">
        <motion.div
          className="h-full bg-gradient-to-r from-sky to-magic rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      <div className="space-y-2">
        {objectives.map((objective, index) => {
          const isComplete = completedObjectives.has(objective.id);
          return (
            <motion.div
              key={objective.id}
              className={`
                flex items-start gap-2.5 p-3 rounded-xl transition-all duration-300
                ${isComplete
                  ? 'bg-leaf-pale border-2 border-leaf/25'
                  : 'bg-card border-2 border-border'
                }
              `}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {isComplete ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                  <CheckCircle className="w-4 h-4 text-leaf flex-shrink-0 mt-0.5" />
                </motion.div>
              ) : (
                <Circle className="w-4 h-4 text-ink-faint flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-xs font-display font-semibold ${isComplete ? 'text-leaf line-through' : 'text-ink'}`}>
                  {objective.description}
                </p>
                {!isComplete && (
                  <p className="text-[11px] text-ink-muted mt-0.5">{objective.hint}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
