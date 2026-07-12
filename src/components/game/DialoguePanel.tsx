import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Mission } from '@/types';
import { NPCS } from '@/data/npcs';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { useDialogue, useKeyboardShortcuts } from '@/hooks';

interface DialoguePanelProps {
  mission: Mission;
}

export function DialoguePanel({ mission }: DialoguePanelProps) {
  const introDialogue = useMemo(() => {
    return mission.dialogue.filter((d) => d.trigger === 'mission_start');
  }, [mission.dialogue]);

  const {
    currentIndex,
    currentLine,
    displayedText,
    isTyping,
    isCollapsed,
    setIsCollapsed,
    advance,
    reset,
  } = useDialogue(introDialogue);

  const npc = currentLine ? NPCS[currentLine.npcId] : null;

  // Add global shortcut: Space or Enter key advances dialogue
  useKeyboardShortcuts(
    {
      space: (e) => {
        e.preventDefault();
        advance();
      },
      enter: (e) => {
        e.preventDefault();
        advance();
      },
    },
    [advance]
  );

  if (isCollapsed || !currentLine || !npc) {
    return (
      <motion.button
        className="mx-4 mt-4 mb-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-card border-2 border-border text-xs font-display font-semibold text-ink-muted hover:text-ink-secondary hover:border-sky/30 transition-colors"
        onClick={reset}
        whileHover={{ scale: 1.02 }}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Show dialogue
      </motion.button>
    );
  }

  return (
    <motion.div
      className="mx-4 mt-4 mb-2"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div
        className="dialogue-bubble adventure-card-elevated p-4 cursor-pointer"
        onClick={advance}
      >
        <div className="flex items-start gap-3">
          <div
            className="npc-avatar"
            style={{
              background: `linear-gradient(135deg, ${npc.color}20, ${npc.color}08)`,
              border: `2px solid ${npc.color}50`,
            }}
          >
            {npc.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-display font-bold" style={{ color: npc.color }}>
                {npc.name}
              </span>
              <span className="text-[11px] font-display text-ink-muted">{npc.role}</span>
            </div>
            <p className="text-sm text-ink leading-relaxed">
              {displayedText.split('**').map((part, i) =>
                i % 2 === 1 ? (
                  <code
                    key={i}
                    className="px-1.5 py-0.5 rounded-lg bg-sky-pale text-sky font-mono text-xs border border-sky/20"
                  >
                    {part}
                  </code>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
              {isTyping && <span className="typing-cursor" />}
            </p>
          </div>
          {!isTyping && (
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-ink-muted flex-shrink-0 mt-2"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>
        <div className="flex gap-1.5 justify-center mt-3">
          {introDialogue.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-sky w-5'
                  : i < currentIndex
                  ? 'bg-ink-faint w-1.5'
                  : 'bg-border w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
