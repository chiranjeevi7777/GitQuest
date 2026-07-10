import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GitEngine } from '@/engine/gitEngine';
import { GitBranch, GitCommit } from 'lucide-react';

interface GitGraphPanelProps {
  engine: GitEngine;
}

const BRANCH_COLORS = [
  '#00f0ff', '#39ff14', '#b347d9', '#ff6b35',
  '#ffd700', '#ff2d7b',
];

export function GitGraphPanel({ engine }: GitGraphPanelProps) {
  const [state, setState] = useState(engine.getState());

  // Poll for changes
  useEffect(() => {
    const timer = setInterval(() => {
      setState(engine.getState());
    }, 500);
    return () => clearInterval(timer);
  }, [engine]);

  const { commits, branches, currentBranch } = state;

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-4 h-4 text-neon-purple" />
        <h4 className="font-display text-xs font-semibold tracking-wider text-text-primary">
          GIT GRAPH
        </h4>
      </div>

      {/* Branches */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {branches.map((branch, i) => (
          <span
            key={branch}
            className={`
              text-[10px] font-mono px-2 py-0.5 rounded-full border
              ${branch === currentBranch
                ? 'border-neon-green/40 bg-neon-green/10 text-neon-green'
                : 'border-border bg-surface text-text-dim'
              }
            `}
          >
            {branch === currentBranch && '● '}
            {branch}
          </span>
        ))}
      </div>

      {/* Commit Graph */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {commits.length === 0 ? (
          <div className="text-center py-8">
            <GitCommit className="w-8 h-8 text-text-dim mx-auto mb-2 opacity-30" />
            <p className="text-xs text-text-dim font-mono">No commits yet</p>
            <p className="text-[10px] text-text-dim mt-1">
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
                {/* Graph Line + Node */}
                <div className="flex flex-col items-center w-4 flex-shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                      isMerge ? 'bg-transparent' : ''
                    }`}
                    style={{
                      borderColor: color,
                      backgroundColor: isMerge ? 'transparent' : color,
                    }}
                  />
                  {index < commits.length - 1 && (
                    <div
                      className="w-0.5 h-6"
                      style={{ backgroundColor: color, opacity: 0.3 }}
                    />
                  )}
                </div>

                {/* Commit Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono" style={{ color }}>
                      {commit.hash}
                    </span>
                    <span
                      className="text-[9px] font-mono px-1 rounded"
                      style={{
                        color,
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {commit.branch}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {commit.message}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
