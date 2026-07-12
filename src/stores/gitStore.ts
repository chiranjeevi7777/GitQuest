import { create } from 'zustand';
import type { TerminalCommand, GitCommitNode } from '@/types';

interface GitState {
  terminalHistory: TerminalCommand[];
  isTerminalReady: boolean;
  gitCommits: GitCommitNode[];
  gitBranches: string[];
  currentBranch: string;

  addTerminalCommand: (cmd: TerminalCommand) => void;
  clearTerminalHistory: () => void;
  addGitCommit: (commit: GitCommitNode) => void;
  createBranch: (name: string) => void;
  switchBranch: (name: string) => void;
  setTerminalReady: (ready: boolean) => void;
  resetGitState: () => void;
}

export const useGitStore = create<GitState>((set) => ({
  terminalHistory: [],
  isTerminalReady: false,
  gitCommits: [],
  gitBranches: ['main'],
  currentBranch: 'main',

  addTerminalCommand: (cmd) => set((state) => ({
    terminalHistory: [...state.terminalHistory, cmd],
  })),

  clearTerminalHistory: () => set({ terminalHistory: [] }),

  addGitCommit: (commit) => set((state) => ({
    gitCommits: [...state.gitCommits, commit],
  })),

  createBranch: (name) => set((state) => ({
    gitBranches: [...state.gitBranches, name],
  })),

  switchBranch: (name) => set({ currentBranch: name }),

  setTerminalReady: (ready) => set({ isTerminalReady: ready }),

  resetGitState: () => set({
    terminalHistory: [],
    isTerminalReady: false,
    gitCommits: [],
    gitBranches: ['main'],
    currentBranch: 'main',
  }),
}));
