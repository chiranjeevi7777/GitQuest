import { useEffect } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
  [key: string]: KeyHandler;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig, deps: any[] = []) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Ignore shortcuts if the user is typing in an input, textarea, or the interactive command terminal
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.classList.contains('xterm-helper-textarea') // if terminal uses xterm helper
      ) {
        return;
      }

      let keyCombo = '';
      if (e.ctrlKey) keyCombo += 'ctrl+';
      if (e.altKey) keyCombo += 'alt+';
      if (e.shiftKey) keyCombo += 'shift+';
      keyCombo += e.key.toLowerCase();

      const handler = shortcuts[keyCombo] || shortcuts[e.key.toLowerCase()] || shortcuts[e.key];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, deps);
}
