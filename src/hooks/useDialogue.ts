import { useState, useEffect, useCallback } from 'react';
import type { DialogueLine } from '@/types';

export function useDialogue(dialogueLines: DialogueLine[], onComplete?: () => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentLine = dialogueLines[currentIndex] || null;

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

  const advance = useCallback(() => {
    if (!currentLine) return;
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }
    if (currentIndex < dialogueLines.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCollapsed(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, dialogueLines.length, isTyping, currentLine, onComplete]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsCollapsed(false);
  }, []);

  return {
    currentIndex,
    currentLine,
    displayedText,
    isTyping,
    isCollapsed,
    setIsCollapsed,
    advance,
    reset,
  };
}
