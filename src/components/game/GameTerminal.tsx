import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';

interface GameTerminalProps {
  onCommand: (input: string) => string;
}

interface HistoryEntry {
  type: 'input' | 'output';
  content: string;
}

export function GameTerminal({ onCommand }: GameTerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: '╔═══════════════════════════════════════╗' },
    { type: 'output', content: '║   GitQuest Terminal v1.0              ║' },
    { type: 'output', content: '║   Type git commands to play           ║' },
    { type: 'output', content: '╚═══════════════════════════════════════╝' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on click
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Handle command submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const input = currentInput.trim();

    // Add input to history
    setHistory(prev => [...prev, { type: 'input', content: input }]);
    setCommandHistory(prev => [input, ...prev]);
    setHistoryIndex(-1);

    // Execute command
    const output = onCommand(input);
    if (output) {
      setHistory(prev => [...prev, { type: 'output', content: output }]);
    }

    // Add blank line for readability
    setHistory(prev => [...prev, { type: 'output', content: '' }]);
    setCurrentInput('');
  }, [currentInput, onCommand]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  }, [historyIndex, commandHistory]);

  return (
    <motion.div
      className="h-full flex flex-col glass-panel overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={focusInput}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-abyss/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-neon-pink/60" />
          <div className="w-3 h-3 rounded-full bg-neon-yellow/60" />
          <div className="w-3 h-3 rounded-full bg-neon-green/60" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <TerminalIcon className="w-3.5 h-3.5 text-text-dim" />
          <span className="text-xs font-mono text-text-dim">gitquest — bash</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed scanlines">
        {history.map((entry, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {entry.type === 'input' ? (
              <div className="flex items-start gap-2">
                <span className="text-neon-green flex-shrink-0">
                  <span className="text-neon-purple">gitquest</span>
                  <span className="text-text-dim">:</span>
                  <span className="text-neon-cyan">~</span>
                  <span className="text-text-primary">$</span>
                </span>
                <span className="text-text-primary">{entry.content}</span>
              </div>
            ) : (
              <div
                className="text-text-secondary ml-0"
                dangerouslySetInnerHTML={{
                  __html: entry.content
                    .replace(/\x1b\[32m/g, '<span style="color: #39ff14">')
                    .replace(/\x1b\[31m/g, '<span style="color: #ff2d7b">')
                    .replace(/\x1b\[33m/g, '<span style="color: #ffd700">')
                    .replace(/\x1b\[0m/g, '</span>')
                }}
              />
            )}
          </div>
        ))}

        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-start gap-2">
          <span className="text-neon-green flex-shrink-0">
            <span className="text-neon-purple">gitquest</span>
            <span className="text-text-dim">:</span>
            <span className="text-neon-cyan">~</span>
            <span className="text-text-primary">$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-text-primary outline-none caret-neon-cyan font-mono text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
