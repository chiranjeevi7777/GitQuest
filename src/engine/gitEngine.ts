/* ═══════════════════════════════════════════════
   GitQuest — Client-Side Git Engine
   Simulates real Git behavior for the game.
   Phase 2 will replace this with actual Git CLI
   execution via the FastAPI backend.
   ═══════════════════════════════════════════════ */

interface FileEntry {
  name: string;
  content: string;
  staged: boolean;
}

interface CommitEntry {
  hash: string;
  message: string;
  branch: string;
  files: string[];
  timestamp: number;
}

interface StashEntry {
  id: number;
  message: string;
  files: FileEntry[];
}

interface RepoState {
  initialized: boolean;
  files: FileEntry[];
  commits: CommitEntry[];
  branches: string[];
  currentBranch: string;
  remotes: Record<string, string>;
  stash: StashEntry[];
  head: string | null;
  statusChecked: boolean;
  rebaseUsed?: boolean;
  cherryPickUsed?: boolean;
  reflogUsed?: boolean;
  resetUsed?: boolean;
  revertUsed?: boolean;
  bisectUsed?: boolean;
  hooksConfigured?: boolean;
}

function generateHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

export class GitEngine {
  private state: RepoState;
  public onStateChange?: (state: RepoState) => void;

  constructor(onStateChange?: (state: RepoState) => void) {
    this.state = {
      initialized: false,
      files: [],
      commits: [],
      branches: [],
      currentBranch: 'main',
      remotes: {},
      stash: [],
      head: null,
      statusChecked: false,
      rebaseUsed: false,
      cherryPickUsed: false,
      reflogUsed: false,
      resetUsed: false,
      revertUsed: false,
      bisectUsed: false,
      hooksConfigured: false,
    };
    this.onStateChange = onStateChange;
  }

  private notify() {
    this.onStateChange?.(this.getState());
  }

  getState(): RepoState {
    return { ...this.state };
  }

  execute(input: string): { output: string; success: boolean } {
    const trimmed = input.trim();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const subcmd = parts[1];

    if (cmd !== 'git' && cmd !== 'echo' && cmd !== 'touch' && cmd !== 'cat' && cmd !== 'ls') {
      return { output: `bash: ${cmd}: command not found`, success: false };
    }

    // Non-git commands
    if (cmd === 'echo') {
      return this.handleEcho(trimmed);
    }
    if (cmd === 'touch') {
      return this.handleTouch(parts.slice(1));
    }
    if (cmd === 'cat') {
      return this.handleCat(parts[1]);
    }
    if (cmd === 'ls') {
      return this.handleLs();
    }

    // Git commands
    if (!this.state.initialized && subcmd !== 'init' && subcmd !== 'clone') {
      return { output: 'fatal: not a git repository (or any of the parent directories): .git', success: false };
    }

    switch (subcmd) {
      case 'init':
        return this.gitInit();
      case 'status':
        return this.gitStatus();
      case 'add':
        return this.gitAdd(parts.slice(2));
      case 'commit':
        return this.gitCommit(parts.slice(2));
      case 'branch':
        return this.gitBranch(parts.slice(2));
      case 'checkout':
        return this.gitCheckout(parts.slice(2));
      case 'switch':
        return this.gitSwitch(parts.slice(2));
      case 'merge':
        return this.gitMerge(parts.slice(2));
      case 'log':
        return this.gitLog();
      case 'remote':
        return this.gitRemote(parts.slice(2));
      case 'stash':
        return this.gitStash(parts.slice(2));
      case 'diff':
        return this.gitDiff();
      case 'clone':
        return this.gitClone(parts.slice(2));
      case 'push':
        return this.gitPush();
      case 'pull':
        return this.gitPull();
      case 'fetch':
        return this.gitFetch();
      case 'rebase':
        return this.gitRebase(parts.slice(2));
      case 'cherry-pick':
        return this.gitCherryPick(parts.slice(2));
      case 'reflog':
        return this.gitReflog();
      case 'reset':
        return this.gitReset(parts.slice(2));
      case 'revert':
        return this.gitRevert(parts.slice(2));
      case 'bisect':
        return this.gitBisect(parts.slice(2));
      default:
        return { output: `git: '${subcmd}' is not a git command. See 'git --help'.`, success: false };
    }
  }

  // ─── Git Commands ───

  private gitInit(): { output: string; success: boolean } {
    if (this.state.initialized) {
      return { output: 'Reinitialized existing Git repository in /gitquest/.git/', success: true };
    }
    this.state.initialized = true;
    this.state.branches = ['main'];
    this.state.currentBranch = 'main';
    this.notify();
    return {
      output: 'Initialized empty Git repository in /gitquest/.git/',
      success: true,
    };
  }

  private gitStatus(): { output: string; success: boolean } {
    this.state.statusChecked = true;
    const branch = this.state.currentBranch;
    const untracked = this.state.files.filter(f => !f.staged);
    const staged = this.state.files.filter(f => f.staged);

    let output = `On branch ${branch}\n`;

    if (this.state.commits.length === 0) {
      output += '\nNo commits yet\n';
    }

    if (staged.length > 0) {
      output += '\nChanges to be committed:\n';
      output += '  (use "git restore --staged <file>..." to unstage)\n';
      staged.forEach(f => {
        output += `\t\x1b[32mnew file:   ${f.name}\x1b[0m\n`;
      });
    }

    if (untracked.length > 0) {
      output += '\nUntracked files:\n';
      output += '  (use "git add <file>..." to include in what will be committed)\n';
      untracked.forEach(f => {
        output += `\t\x1b[31m${f.name}\x1b[0m\n`;
      });
    }

    if (staged.length === 0 && untracked.length === 0) {
      output += '\nnothing to commit, working tree clean';
    }

    this.notify();
    return { output, success: true };
  }

  private gitAdd(args: string[]): { output: string; success: boolean } {
    if (args.length === 0) {
      return { output: 'Nothing specified, nothing added.', success: false };
    }

    const target = args[0];
    if (target === '.' || target === '-A' || target === '--all') {
      this.state.files = this.state.files.map(f => ({ ...f, staged: true }));
      this.notify();
      return { output: '', success: true };
    }

    const file = this.state.files.find(f => f.name === target);
    if (!file) {
      return { output: `fatal: pathspec '${target}' did not match any files`, success: false };
    }

    file.staged = true;
    this.notify();
    return { output: '', success: true };
  }

  private gitCommit(args: string[]): { output: string; success: boolean } {
    const staged = this.state.files.filter(f => f.staged);
    if (staged.length === 0) {
      return { output: 'nothing to commit, working tree clean', success: false };
    }

    let message = 'No message';
    const mIdx = args.indexOf('-m');
    if (mIdx !== -1 && args[mIdx + 1]) {
      message = args.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '');
    }

    const hash = generateHash();
    const commit: CommitEntry = {
      hash,
      message,
      branch: this.state.currentBranch,
      files: staged.map(f => f.name),
      timestamp: Date.now(),
    };

    this.state.commits.push(commit);
    this.state.head = hash;
    // Remove staged files from tracking (they're committed)
    this.state.files = this.state.files.map(f => ({ ...f, staged: false }));

    this.notify();
    return {
      output: `[${this.state.currentBranch} ${hash}] ${message}\n ${staged.length} file(s) changed`,
      success: true,
    };
  }

  private gitBranch(args: string[]): { output: string; success: boolean } {
    if (args.length === 0) {
      const output = this.state.branches
        .map(b => (b === this.state.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`))
        .join('\n');
      return { output, success: true };
    }

    if (args[0] === '-d' || args[0] === '-D') {
      const name = args[1];
      if (!name) return { output: 'fatal: branch name required', success: false };
      if (name === this.state.currentBranch) {
        return { output: `error: Cannot delete branch '${name}' checked out`, success: false };
      }
      this.state.branches = this.state.branches.filter(b => b !== name);
      this.notify();
      return { output: `Deleted branch ${name}`, success: true };
    }

    const name = args[0];
    if (this.state.branches.includes(name)) {
      return { output: `fatal: A branch named '${name}' already exists.`, success: false };
    }

    this.state.branches.push(name);
    this.notify();
    return { output: '', success: true };
  }

  private gitCheckout(args: string[]): { output: string; success: boolean } {
    if (args.length === 0) {
      return { output: 'error: please specify branch or file', success: false };
    }

    if (args[0] === '-b') {
      const name = args[1];
      if (!name) return { output: 'fatal: branch name required', success: false };
      if (this.state.branches.includes(name)) {
        return { output: `fatal: A branch named '${name}' already exists.`, success: false };
      }
      this.state.branches.push(name);
      this.state.currentBranch = name;
      this.notify();
      return { output: `Switched to a new branch '${name}'`, success: true };
    }

    const name = args[0];
    if (!this.state.branches.includes(name)) {
      return { output: `error: pathspec '${name}' did not match any file(s) known to git`, success: false };
    }

    this.state.currentBranch = name;
    this.notify();
    return { output: `Switched to branch '${name}'`, success: true };
  }

  private gitSwitch(args: string[]): { output: string; success: boolean } {
    if (args[0] === '-c') {
      return this.gitCheckout(['-b', args[1]]);
    }
    return this.gitCheckout(args);
  }

  private gitMerge(args: string[]): { output: string; success: boolean } {
    if (args.length === 0) {
      return { output: 'fatal: No branch to merge', success: false };
    }

    const branchToMerge = args[0];
    if (!this.state.branches.includes(branchToMerge)) {
      return { output: `merge: ${branchToMerge} - not something we can merge`, success: false };
    }

    const branchCommits = this.state.commits.filter(c => c.branch === branchToMerge);
    if (branchCommits.length === 0) {
      return { output: 'Already up to date.', success: true };
    }

    const hash = generateHash();
    this.state.commits.push({
      hash,
      message: `Merge branch '${branchToMerge}' into ${this.state.currentBranch}`,
      branch: this.state.currentBranch,
      files: [],
      timestamp: Date.now(),
    });
    this.state.head = hash;

    this.notify();
    return {
      output: `Merge made by the 'ort' strategy.\n ${branchCommits.length} file(s) changed`,
      success: true,
    };
  }

  private gitLog(): { output: string; success: boolean } {
    if (this.state.commits.length === 0) {
      return { output: 'fatal: your current branch does not have any commits yet', success: false };
    }

    const output = this.state.commits
      .slice()
      .reverse()
      .slice(0, 10)
      .map(c => {
        const date = new Date(c.timestamp).toLocaleString();
        return `\x1b[33mcommit ${c.hash}\x1b[0m\nAuthor: GitQuest Player\nDate:   ${date}\n\n    ${c.message}\n`;
      })
      .join('\n');

    return { output, success: true };
  }

  private gitRemote(args: string[]): { output: string; success: boolean } {
    if (args.length === 0 || args[0] === '-v') {
      const remotes = Object.entries(this.state.remotes);
      if (remotes.length === 0) return { output: '', success: true };
      const output = remotes
        .map(([name, url]) => `${name}\t${url} (fetch)\n${name}\t${url} (push)`)
        .join('\n');
      return { output, success: true };
    }

    if (args[0] === 'add') {
      const name = args[1];
      const url = args[2];
      if (!name || !url) {
        return { output: 'usage: git remote add <name> <url>', success: false };
      }
      this.state.remotes[name] = url;
      this.notify();
      return { output: '', success: true };
    }

    return { output: `error: Unknown subcommand: ${args[0]}`, success: false };
  }

  private gitStash(args: string[]): { output: string; success: boolean } {
    if (args.length === 0 || args[0] === 'push') {
      const modified = this.state.files.filter(f => !f.staged);
      if (modified.length === 0) {
        return { output: 'No local changes to save', success: false };
      }
      this.state.stash.push({
        id: this.state.stash.length,
        message: `WIP on ${this.state.currentBranch}`,
        files: [...modified],
      });
      this.state.files = this.state.files.filter(f => f.staged);
      this.notify();
      return { output: `Saved working directory and index state WIP on ${this.state.currentBranch}`, success: true };
    }

    if (args[0] === 'pop') {
      if (this.state.stash.length === 0) {
        return { output: 'No stash entries found.', success: false };
      }
      const entry = this.state.stash.pop()!;
      this.state.files.push(...entry.files);
      this.notify();
      return { output: `On branch ${this.state.currentBranch}\nChanges restored from stash`, success: true };
    }

    if (args[0] === 'list') {
      if (this.state.stash.length === 0) return { output: '', success: true };
      const output = this.state.stash
        .map((s, i) => `stash@{${i}}: ${s.message}`)
        .join('\n');
      return { output, success: true };
    }

    return { output: 'Unknown stash command', success: false };
  }

  private gitDiff(): { output: string; success: boolean } {
    return { output: 'No changes detected', success: true };
  }

  private gitClone(args: string[]): { output: string; success: boolean } {
    if (args.length === 0) {
      return { output: 'fatal: You must specify a repository to clone.', success: false };
    }
    this.state.initialized = true;
    this.state.branches = ['main'];
    this.state.currentBranch = 'main';
    this.state.remotes['origin'] = args[0];
    this.notify();
    return { output: `Cloning into 'repo'...\nDone.`, success: true };
  }

  private gitPush(): { output: string; success: boolean } {
    if (Object.keys(this.state.remotes).length === 0) {
      return { output: 'fatal: No configured push destination.', success: false };
    }
    return { output: `Everything up-to-date\nBranch '${this.state.currentBranch}' pushed to origin`, success: true };
  }

  private gitPull(): { output: string; success: boolean } {
    if (Object.keys(this.state.remotes).length === 0) {
      return { output: 'fatal: No remote configured.', success: false };
    }
    return { output: 'Already up to date.', success: true };
  }

  private gitFetch(): { output: string; success: boolean } {
    if (Object.keys(this.state.remotes).length === 0) {
      return { output: 'fatal: No remote configured.', success: false };
    }
    return { output: 'Fetching origin...', success: true };
  }

  // ─── Shell Commands ───

  private handleEcho(input: string): { output: string; success: boolean } {
    // Handle: echo "content" > filename
    const redirectMatch = input.match(/echo\s+["']?(.+?)["']?\s*>\s*(\S+)/);
    if (redirectMatch) {
      const content = redirectMatch[1];
      const filename = redirectMatch[2];
      const existing = this.state.files.find(f => f.name === filename);
      if (existing) {
        existing.content = content;
      } else {
        this.state.files.push({ name: filename, content, staged: false });
      }
      this.notify();
      return { output: '', success: true };
    }

    // Handle: echo "content" >> filename (append)
    const appendMatch = input.match(/echo\s+["']?(.+?)["']?\s*>>\s*(\S+)/);
    if (appendMatch) {
      const content = appendMatch[1];
      const filename = appendMatch[2];
      const existing = this.state.files.find(f => f.name === filename);
      if (existing) {
        existing.content += '\n' + content;
      } else {
        this.state.files.push({ name: filename, content, staged: false });
      }
      this.notify();
      return { output: '', success: true };
    }

    // Just echo
    const echoContent = input.replace(/^echo\s+/, '').replace(/^["']|["']$/g, '');
    return { output: echoContent, success: true };
  }

  private handleTouch(files: string[]): { output: string; success: boolean } {
    files.forEach(f => {
      if (!this.state.files.find(ef => ef.name === f)) {
        this.state.files.push({ name: f, content: '', staged: false });
      }
    });
    this.notify();
    return { output: '', success: true };
  }

  private handleCat(filename: string): { output: string; success: boolean } {
    if (!filename) return { output: 'cat: missing file operand', success: false };
    const file = this.state.files.find(f => f.name === filename);
    if (!file) return { output: `cat: ${filename}: No such file or directory`, success: false };
    return { output: file.content || '(empty)', success: true };
  }

  private handleLs(): { output: string; success: boolean } {
    if (this.state.files.length === 0) return { output: '', success: true };
    return { output: this.state.files.map(f => f.name).join('  '), success: true };
  }

  private gitRebase(args: string[]): { output: string; success: boolean } {
    if (!this.state.initialized) return { output: 'fatal: not a git repository', success: false };
    if (args.length === 0) return { output: 'fatal: specify branch to rebase onto', success: false };
    const branchName = args[0];
    this.state.rebaseUsed = true;
    this.notify();
    return {
      output: `First, rewinding head to replay your work on top of it...\nApplying: changes on ${this.state.currentBranch}\nSuccessfully rebased and updated refs/heads/${this.state.currentBranch} onto ${branchName}.`,
      success: true
    };
  }

  private gitCherryPick(args: string[]): { output: string; success: boolean } {
    if (!this.state.initialized) return { output: 'fatal: not a git repository', success: false };
    if (args.length === 0) return { output: 'fatal: specify commit to cherry-pick', success: false };
    const commitHash = args[0];
    this.state.cherryPickUsed = true;
    this.notify();
    return {
      output: `[${this.state.currentBranch} ${generateHash()}] Cherry-picked commit ${commitHash}\n 1 file changed, 1 insertion(+)`,
      success: true
    };
  }

  private gitReflog(): { output: string; success: boolean } {
    if (!this.state.initialized) return { output: 'fatal: not a git repository', success: false };
    this.state.reflogUsed = true;
    this.notify();
    const hash1 = generateHash();
    const hash2 = generateHash();
    return {
      output: `${hash1} HEAD@{0}: commit: resolve conflict in temple scroll\n${hash2} HEAD@{1}: checkout: moving from main to dev-quest\n${generateHash()} HEAD@{2}: commit: save initial draft`,
      success: true
    };
  }

  private gitReset(args: string[]): { output: string; success: boolean } {
    if (!this.state.initialized) return { output: 'fatal: not a git repository', success: false };
    this.state.resetUsed = true;
    this.notify();
    const target = args[0] || 'HEAD~1';
    return {
      output: `HEAD is now at ${generateHash()} Reset to ${target}`,
      success: true
    };
  }

  private gitRevert(args: string[]): { output: string; success: boolean } {
    if (!this.state.initialized) return { output: 'fatal: not a git repository', success: false };
    if (args.length === 0) return { output: 'fatal: specify commit to revert', success: false };
    this.state.revertUsed = true;
    this.notify();
    return {
      output: `[${this.state.currentBranch} ${generateHash()}] Revert "Commit ${args[0]}"\n 1 file changed, 1 deletion(-)`,
      success: true
    };
  }

  private gitBisect(args: string[]): { output: string; success: boolean } {
    if (!this.state.initialized) return { output: 'fatal: not a git repository', success: false };
    this.state.bisectUsed = true;
    this.notify();
    if (args.length === 0) {
      return {
        output: 'git bisect: start, bad, good, reset, visualize, or replay',
        success: true
      };
    }
    if (args[0] === 'start') {
      return {
        output: 'Bisecting: 6 revisions left to test after this (roughly 3 steps)\n[commit-hash] Fix a bug in engine',
        success: true
      };
    }
    if (args[0] === 'good') {
      return {
        output: 'Bisecting: 3 revisions left to test after this (roughly 2 steps)\n[commit-hash] Update files',
        success: true
      };
    }
    if (args[0] === 'bad') {
      return {
        output: '[commit-hash] is the first bad commit\nAuthor: Buggy Coder <buggy@coder.com>',
        success: true
      };
    }
    return {
      output: `git bisect: ${args[0]} handled.`,
      success: true
    };
  }

  // ─── Validation ───

  validate(type: string, params: Record<string, string>): boolean {
    switch (type) {
      case 'repo_initialized':
        return this.state.initialized;
      case 'file_exists':
        return this.state.files.some(f => f.name === params.filename);
      case 'file_staged':
        return this.state.files.some(f => f.name === params.filename && f.staged);
      case 'commit_exists':
        return this.state.commits.length >= parseInt(params.minCommits || '1');
      case 'branch_exists':
        return this.state.branches.includes(params.branchName);
      case 'branch_merged':
        return this.state.commits.some(c =>
          c.message.includes(`Merge branch '${params.branchName}'`)
        );
      case 'remote_added':
        return params.remoteName in this.state.remotes;
      case 'rebase_completed':
        return !!this.state.rebaseUsed;
      case 'cherry_picked':
        return !!this.state.cherryPickUsed;
      case 'reflog_checked':
        return !!this.state.reflogUsed;
      case 'reset_done':
        return !!this.state.resetUsed;
      case 'reverted':
        return !!this.state.revertUsed;
      case 'bisect_complete':
        return !!this.state.bisectUsed;
      case 'hook_configured':
        return this.state.files.some(f => f.name.includes('hooks/pre-commit') || f.name.includes('pre-commit'));
      case 'custom':
        if (params.type === 'status_checked') return this.state.statusChecked;
        if (params.type === 'stash_used') return this.state.stash.length > 0 || this.state.commits.some(c => c.message.includes('stash'));
        if (params.type === 'rebase_completed') return !!this.state.rebaseUsed;
        if (params.type === 'cherry_picked') return !!this.state.cherryPickUsed;
        if (params.type === 'reflog_checked') return !!this.state.reflogUsed;
        if (params.type === 'reset_done') return !!this.state.resetUsed;
        if (params.type === 'reverted') return !!this.state.revertUsed;
        if (params.type === 'bisect_complete') return !!this.state.bisectUsed;
        if (params.type === 'hook_configured') return this.state.files.some(f => f.name.includes('hooks/pre-commit') || f.name.includes('pre-commit'));
        return false;
      default:
        return false;
    }
  }
}
