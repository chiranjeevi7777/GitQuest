import { describe, it, expect, beforeEach } from 'vitest';
import { GitEngine } from './gitEngine';

describe('GitEngine unit tests', () => {
  let engine: GitEngine;

  beforeEach(() => {
    engine = new GitEngine();
  });

  it('starts uninitialized', () => {
    const state = engine.getState();
    expect(state.initialized).toBe(false);
    expect(state.files).toHaveLength(0);
    expect(state.commits).toHaveLength(0);
  });

  it('runs git init', () => {
    const result = engine.execute('git init');
    expect(result.success).toBe(true);
    expect(result.output).toContain('Initialized empty Git repository');

    const state = engine.getState();
    expect(state.initialized).toBe(true);
    expect(state.currentBranch).toBe('main');
  });

  it('handles touch, status, and add', () => {
    // Touch works even before git init since it is a standard filesystem command
    let res = engine.execute('touch readme.txt');
    expect(res.success).toBe(true);

    engine.execute('git init');

    res = engine.execute('touch readme.txt');
    expect(res.success).toBe(true);

    const state = engine.getState();
    const file = state.files.find(f => f.name === 'readme.txt');
    expect(file).toBeDefined();
    expect(file?.staged).toBe(false);

    // git status
    res = engine.execute('git status');
    expect(res.success).toBe(true);
    expect(res.output).toContain('Untracked files');

    // git add
    res = engine.execute('git add readme.txt');
    expect(res.success).toBe(true);

    const stagedState = engine.getState();
    const stagedFile = stagedState.files.find(f => f.name === 'readme.txt');
    expect(stagedFile?.staged).toBe(true);
  });

  it('creates commits', () => {
    engine.execute('git init');
    engine.execute('touch readme.txt');
    engine.execute('git add readme.txt');
    
    const result = engine.execute('git commit -m "First commit"');
    expect(result.success).toBe(true);
    expect(result.output).toContain('First commit');

    const state = engine.getState();
    expect(state.commits).toHaveLength(1);
    expect(state.commits[0].message).toBe('First commit');
  });

  it('validates objectives', () => {
    engine.execute('git init');
    expect(engine.validate('repo_initialized', {})).toBe(true);

    engine.execute('touch readme.txt');
    expect(engine.validate('file_exists', { filename: 'readme.txt' })).toBe(true);
    expect(engine.validate('file_exists', { filename: 'unknown.txt' })).toBe(false);

    engine.execute('git add readme.txt');
    expect(engine.validate('file_staged', { filename: 'readme.txt' })).toBe(true);

    engine.execute('git commit -m "Init commit"');
    expect(engine.validate('commit_exists', { minCommits: '1' })).toBe(true);
  });
});
