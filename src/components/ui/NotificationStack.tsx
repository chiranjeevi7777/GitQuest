import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { X, Trophy, Sparkles, CheckCircle, ArrowUp, Package } from 'lucide-react';
import { useEffect } from 'react';

const NOTIFICATION_ICONS = {
  'achievement': Trophy, 'level-up': ArrowUp, 'mission-complete': CheckCircle,
  'xp-gain': Sparkles, 'item-obtained': Package,
};
const NOTIFICATION_STYLES = {
  'achievement': 'border-gold/40 bg-gold-pale',
  'level-up': 'border-sky/40 bg-sky-pale',
  'mission-complete': 'border-leaf/40 bg-leaf-pale',
  'xp-gain': 'border-magic/40 bg-magic-pale',
  'item-obtained': 'border-ember/40 bg-ember-pale',
};
const ICON_COLORS = {
  'achievement': 'text-gold', 'level-up': 'text-sky', 'mission-complete': 'text-leaf',
  'xp-gain': 'text-magic', 'item-obtained': 'text-ember',
};

export function NotificationStack() {
  const { notifications, dismissNotification } = useGameStore();

  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      const oldest = notifications[0];
      if (oldest) dismissNotification(oldest.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-[340px]">
      <AnimatePresence>
        {notifications.slice(0, 5).map(notif => {
          const Icon = NOTIFICATION_ICONS[notif.type];
          return (
            <motion.div
              key={notif.id}
              className={`achievement-toast adventure-card-elevated p-3.5 border-2 ${NOTIFICATION_STYLES[notif.type]}`}
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              layout
            >
              <div className="flex items-start gap-3">
                <div className={`${ICON_COLORS[notif.type]} flex-shrink-0 mt-0.5`}>
                  {notif.icon ? <span className="text-lg">{notif.icon}</span> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-display font-bold text-ink">{notif.title}</h4>
                  <p className="text-[11px] text-ink-muted font-display mt-0.5">{notif.description}</p>
                </div>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="text-ink-faint hover:text-ink-secondary transition-colors flex-shrink-0"
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
