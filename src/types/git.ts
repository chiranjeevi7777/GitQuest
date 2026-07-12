export interface GitCommitNode {
  hash: string;
  message: string;
  branch: string;
  parent: string | null;
  timestamp: number;
  x: number;
  y: number;
}

export interface GitBranch {
  name: string;
  color: string;
  commits: GitCommitNode[];
}

export interface TerminalCommand {
  input: string;
  output: string;
  success: boolean;
  timestamp: number;
}
