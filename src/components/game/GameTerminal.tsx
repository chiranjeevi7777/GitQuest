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

/** Safely convert ANSI color codes to JSX (no dangerouslySetInnerHTML) */
function AnsiText({ text }: { text: string }) {
  const parts: { text: string; color?: string }[] = [];
  const colorMap: Record<string, string> = {
    '\x1b[32m': '#5CB85C', '\x1b[31m': '#E85D75',
    '\x1b[33m': '#F5A623', '\x1b[0m': '',
  };
  let current = text;
  let activeColor: string | undefined;

  while (current.length > 0) {
    const match = current.match(/\x1b\[\d+m/);
    if (!match || match.index === undefined) {
      parts.push({ text: current, color: activeColor });
      break;
    }
    if (match.index > 0) {
      parts.push({ text: current.slice(0, match.index), color: activeColor });
    }
    activeColor = colorMap[match[0]] || undefined;
    if (activeColor === '') activeColor = undefined;
    current = current.slice(match.index + match[0].length);
  }

  return (
    <>
      {parts.map((p, i) =>
        p.color
          ? <span key={i} style={{ color: p.color }}>{p.text}</span>
          : <span key={i}>{p.text}</span>
      )}
    </>
  );
}

export function GameTerminal({ onCommand }: GameTerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: '┌───────────────────────────────────────┐' },
    { type: 'output', content: '│   ✨ GitQuest Terminal v1.0            │' },
    { type: 'output', content: '│   Type git commands to play!          │' },
    { type: 'output', content: '└───────────────────────────────────────┘' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusInput = useCallback(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;
    const input = currentInput.trim();
    setHistory(prev => [...prev, { type: 'input', content: input }]);
    setCommandHistory(prev => [input, ...prev]);
    setHistoryIndex(-1);
    const output = onCommand(input);
    if (output) setHistory(prev => [...prev, { type: 'output', content: output }]);
    setHistory(prev => [...prev, { type: 'output', content: '' }]);
    setCurrentInput('');
  }, [currentInput, onCommand]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const i = historyIndex + 1;
        setHistoryIndex(i);
        setCurrentInput(commandHistory[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const i = historyIndex - 1;
        setHistoryIndex(i);
        setCurrentInput(commandHistory[i]);
      } else { setHistoryIndex(-1); setCurrentInput(''); }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  }, [historyIndex, commandHistory]);

  return (
    <motion.div
      className="h-full flex flex-col terminal-scroll overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={focusInput}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-coral/70" />
          <div className="w-3 h-3 rounded-full bg-gold/70" />
          <div className="w-3 h-3 rounded-full bg-leaf/70" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <TerminalIcon className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs font-mono text-white/40">gitquest — magic scroll</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed">
        {history.map((entry, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {entry.type === 'input' ? (
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0">
                  <span className="text-magic-light">quest</span>
                  <span className="text-white/30">:</span>
                  <span className="text-sky-light">~</span>
                  <span className="text-white/60">$</span>
                </span>
                <span className="text-white/90">{entry.content}</span>
              </div>
            ) : (
              <div className="text-white/60">
                <AnsiText text={entry.content} />
              </div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-start gap-2">
          <span className="flex-shrink-0">
            <span className="text-magic-light">quest</span>
            <span className="text-white/30">:</span>
            <span className="text-sky-light">~</span>
            <span className="text-white/60">$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white/90 outline-none caret-sky font-mono text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Git command input"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
