import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GitEngine } from '@/engine/gitEngine';
import { GitBranch, GitCommit } from 'lucide-react';

interface GitGraphPanelProps {
  engine: GitEngine;
}

const BRANCH_COLORS = ['#4A90D9', '#5CB85C', '#7C5CBF', '#FF7043', '#F5A623', '#E85D75'];

export function GitGraphPanel({ engine }: GitGraphPanelProps) {
  const [state, setState] = useState(engine.getState());

  // Use onStateChange callback instead of polling
  useEffect(() => {
    const update = () => setState(engine.getState());
    engine.onStateChange = update;
    // Also poll as fallback since onStateChange may not exist yet
    const timer = setInterval(update, 1000);
    return () => { clearInterval(timer); engine.onStateChange = undefined; };
  }, [engine]);

  const { commits, branches, currentBranch } = state;

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-4 h-4 text-magic" />
        <h4 className="font-display text-xs font-bold tracking-wide text-ink">
          GIT GRAPH
        </h4>
      </div>

      {/* Branches */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {branches.map((branch, i) => (
          <span key={branch} className={`
            text-[11px] font-mono px-2.5 py-1 rounded-full border-2
            ${branch === currentBranch
              ? 'border-leaf/40 bg-leaf-pale text-leaf font-semibold'
              : 'border-border bg-parchment-warm text-ink-muted'
            }
          `}>
            {branch === currentBranch && '● '}{branch}
          </span>
        ))}
      </div>

      {/* Commit Graph */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {commits.length === 0 ? (
          <div className="text-center py-8">
            <GitCommit className="w-8 h-8 text-ink-faint mx-auto mb-2" />
            <p className="text-xs text-ink-muted font-display font-semibold">No commits yet</p>
            <p className="text-[11px] text-ink-faint mt-1">
              Use git commit to create history
            </p>
          </div>
        ) : (
          commits.slice().reverse().map((commit, index) => {
            const branchIndex = branches.indexOf(commit.branch);
            const color = BRANCH_COLORS[branchIndex % BRANCH_COLORS.length];
            const isMerge = commit.message.includes('Merge');
            return (
              <motion.div
                key={commit.hash}
                className="flex items-start gap-3 py-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col items-center w-4 flex-shrink-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${isMerge ? '' : ''}`}
                    style={{
                      borderColor: color,
                      backgroundColor: isMerge ? 'transparent' : color,
                    }}
                  />
                  {index < commits.length - 1 && (
                    <div className="w-0.5 h-6" style={{ backgroundColor: color, opacity: 0.25 }} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold" style={{ color }}>{commit.hash}</span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg"
                      style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      {commit.branch}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary truncate mt-0.5">{commit.message}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
