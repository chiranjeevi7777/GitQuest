import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { X, Trophy, Zap, CheckCircle, ArrowUp, Package } from 'lucide-react';
import { useEffect } from 'react';

const NOTIFICATION_ICONS = {
  'achievement': Trophy,
  'level-up': ArrowUp,
  'mission-complete': CheckCircle,
  'xp-gain': Zap,
  'item-obtained': Package,
};

const NOTIFICATION_COLORS = {
  'achievement': 'border-neon-yellow/40 bg-neon-yellow/5',
  'level-up': 'border-neon-cyan/40 bg-neon-cyan/5',
  'mission-complete': 'border-neon-green/40 bg-neon-green/5',
  'xp-gain': 'border-neon-purple/40 bg-neon-purple/5',
  'item-obtained': 'border-neon-orange/40 bg-neon-orange/5',
};

const ICON_COLORS = {
  'achievement': 'text-neon-yellow',
  'level-up': 'text-neon-cyan',
  'mission-complete': 'text-neon-green',
  'xp-gain': 'text-neon-purple',
  'item-obtained': 'text-neon-orange',
};

export function NotificationStack() {
  const { notifications, dismissNotification } = useGameStore();

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      const oldest = notifications[0];
      if (oldest) dismissNotification(oldest.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-[320px]">
      <AnimatePresence>
        {notifications.slice(0, 5).map(notif => {
          const Icon = NOTIFICATION_ICONS[notif.type];
          return (
            <motion.div
              key={notif.id}
              className={`
                achievement-toast glass-panel-bright p-3 border
                ${NOTIFICATION_COLORS[notif.type]}
              `}
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              layout
            >
              <div className="flex items-start gap-3">
                <div className={`${ICON_COLORS[notif.type]} flex-shrink-0 mt-0.5`}>
                  {notif.icon ? (
                    <span className="text-lg">{notif.icon}</span>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-display font-semibold text-text-primary">
                    {notif.title}
                  </h4>
                  <p className="text-[10px] text-text-dim font-mono mt-0.5">
                    {notif.description}
                  </p>
                </div>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="text-text-dim hover:text-text-primary transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
