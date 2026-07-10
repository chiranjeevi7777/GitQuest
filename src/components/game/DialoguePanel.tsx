import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mission } from '@/types';
import { NPCS } from '@/data/npcs';
import { ChevronRight, MessageCircle } from 'lucide-react';

interface DialoguePanelProps {
  mission: Mission;
}

export function DialoguePanel({ mission }: DialoguePanelProps) {
  const introDialogue = mission.dialogue.filter(d => d.trigger === 'mission_start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentLine = introDialogue[currentIndex];
  const npc = currentLine ? NPCS[currentLine.npcId] : null;

  // Typing effect
  useEffect(() => {
    if (!currentLine) return;
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const text = currentLine.text;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [currentIndex, currentLine]);

  const handleAdvance = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(currentLine?.text || '');
      setIsTyping(false);
      return;
    }
    if (currentIndex < introDialogue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCollapsed(true);
    }
  };

  if (isCollapsed || !currentLine || !npc) {
    return (
      <motion.button
        className="mx-4 mt-4 mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-dim hover:text-text-secondary"
        onClick={() => {
          setIsCollapsed(false);
          setCurrentIndex(0);
        }}
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
        className="dialogue-bubble glass-panel-bright p-4 cursor-pointer"
        onClick={handleAdvance}
      >
        <div className="flex items-start gap-3">
          {/* NPC Avatar */}
          <div
            className="npc-avatar"
            style={{
              background: `linear-gradient(135deg, ${npc.color}20, ${npc.color}05)`,
              border: `1px solid ${npc.color}40`,
            }}
          >
            {npc.avatar}
          </div>

          {/* Dialogue */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-display font-semibold"
                style={{ color: npc.color }}
              >
                {npc.name}
              </span>
              <span className="text-[10px] font-mono text-text-dim">
                {npc.role}
              </span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">
              {displayedText.split('**').map((part, i) =>
                i % 2 === 1 ? (
                  <code
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan font-mono text-xs border border-neon-cyan/20"
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

          {/* Advance indicator */}
          {!isTyping && (
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-text-dim flex-shrink-0 mt-2"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 justify-center mt-3">
          {introDialogue.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-neon-cyan w-4'
                  : i < currentIndex
                    ? 'bg-text-dim'
                    : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
