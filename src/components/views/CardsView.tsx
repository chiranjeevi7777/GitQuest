import { motion } from 'framer-motion';
import { usePlayerStore } from '@/stores/playerStore';
import { Sparkles, HelpCircle } from 'lucide-react';

const ALL_CARDS: Array<{ id: string; name: string; description: string; icon: string; rarity: 'common' | 'rare' | 'epic' | 'legendary'; source: string }> = [
  { id: 'card-world-1', name: 'Village Archive Scroll', description: 'Records the fundamental init commands of the Repository Village.', icon: '📜', rarity: 'common', source: 'Repository Village' },
  { id: 'card-world-2', name: 'Forest Branch Timber', description: 'A magical twig from the Branch Forest, vibrating with parallel timeline energy.', icon: '🌿', rarity: 'common', source: 'Branch Forest' },
  { id: 'card-world-3', name: 'Merge Mountain Aegis', description: 'A legendary shield representing the perfect integration of divergent code paths.', icon: '🛡️', rarity: 'rare', source: 'Merge Mountains' },
  { id: 'card-world-4', name: 'Remote Key of the Kingdom', description: 'Unlocks gateways to distant code realms across the Git networks.', icon: '🔑', rarity: 'rare', source: 'Remote Kingdom' },
  { id: 'card-world-5', name: 'Open Source Compass', description: 'Guides developers through the sprawling streets of the Open Source City.', icon: '🧭', rarity: 'epic', source: 'Open Source City' },
  { id: 'card-world-6', name: 'Git Master Sigil', description: 'Proof of mastering the ancient, complex commands of the Git Temple.', icon: '⛩️', rarity: 'legendary', source: 'Git Master Temple' },
  { id: 'card-world-7', name: 'Mole Stasher Pocket', description: 'A secret pocket used by Mole Stashers to hide half-finished scripts.', icon: '🦔', rarity: 'rare', source: 'Stash Caverns' },
  { id: 'card-world-8', name: 'Sensei Rebase Scroll', description: 'Contains secret mantras to straighten the curves of code history.', icon: '🦊', rarity: 'epic', source: 'Rebase Temple' },
  { id: 'card-world-9', name: 'Farmer Cherry Pincer', description: 'A precise tool to grab only the finest, ripest commits from any branch.', icon: '🍒', rarity: 'rare', source: 'Cherry Pick Orchard' },
  { id: 'card-world-10', name: 'Professor Reflog Chronometer', description: 'A mechanical device to trace the ghost footsteps of deleted commits.', icon: '🦉', rarity: 'epic', source: 'History Cave' },
  { id: 'card-world-11', name: 'Pre-Commit Automation Flask', description: 'A glowing test tube filled with pre-commit automation logic.', icon: '🧪', rarity: 'epic', source: 'Hook Laboratory' },
  { id: 'card-world-12', name: 'Open Source Academy Diploma', description: 'Awarded to those who survived all 12 trials and became GitQuest Champions.', icon: '🎓', rarity: 'legendary', source: 'Open Source Academy' },
];

const RARITY_STYLES = {
  common: { border: 'border-ink-faint/30', bg: 'bg-parchment-warm', text: 'text-ink-secondary', badge: 'bg-parchment-warm', glow: 'shadow-soft' },
  rare: { border: 'border-sky/30', bg: 'bg-sky-pale', text: 'text-sky', badge: 'bg-sky-pale', glow: 'shadow-sky/10' },
  epic: { border: 'border-magic/40', bg: 'bg-magic-pale', text: 'text-magic', badge: 'bg-magic-pale', glow: 'shadow-magic/20' },
  legendary: { border: 'border-gold/50', bg: 'bg-gold-pale', text: 'text-gold', badge: 'bg-gold-pale', glow: 'shadow-gold/30' },
};

const RARITY_LABELS = { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' };

export function CardsView() {
  const { player } = usePlayerStore();
  const collectedCards = player.inventory || [];

  return (
    <motion.div
      className="h-full overflow-y-auto p-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-7 h-7 text-gold animate-pulse" />
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Quest Cards Collection</h2>
            <p className="text-sm text-ink-muted font-display">
              Collect cards by mastering challenges in each world. ({collectedCards.length} / {ALL_CARDS.length} Collected)
            </p>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ALL_CARDS.map((card, i) => {
            const isUnlocked = collectedCards.some(c => c.id === card.id);
            const style = RARITY_STYLES[card.rarity];

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 100 }}
                whileHover={isUnlocked ? { scale: 1.05, y: -4, rotate: 1 } : {}}
                className={`
                  relative rounded-2xl border-2 p-4 flex flex-col h-64 overflow-hidden
                  transition-all duration-300 shadow-soft
                  ${isUnlocked 
                    ? `bg-card ${style.border} ${style.glow}` 
                    : 'bg-parchment-warm/60 border-border/40 opacity-75'
                  }
                `}
              >
                {/* Holographic style light reflection for unlocked legendary/epic cards */}
                {isUnlocked && (card.rarity === 'legendary' || card.rarity === 'epic') && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay animate-pulse" />
                )}

                {isUnlocked ? (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-display font-bold uppercase px-2 py-0.5 rounded-lg border ${style.text} ${style.border} ${style.badge}`}>
                        {RARITY_LABELS[card.rarity]}
                      </span>
                      <span className="text-xs text-ink-muted font-display font-semibold">
                        #{i + 1}
                      </span>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-parchment border-2 border-border flex items-center justify-center text-4xl mx-auto my-3 shadow-soft">
                      {card.icon}
                    </div>

                    <h4 className="text-center font-display font-bold text-sm text-ink truncate w-full">
                      {card.name}
                    </h4>

                    <p className="text-center text-[11px] text-ink-muted line-clamp-3 mt-1.5 flex-1 px-1">
                      {card.description}
                    </p>

                    <div className="text-[10px] text-center font-display text-ink-faint border-t border-border/50 pt-2 mt-2">
                      From: <span className="font-semibold text-ink-secondary">{card.source}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <HelpCircle className="w-10 h-10 text-ink-faint mb-2" />
                    <h4 className="font-display font-semibold text-sm text-ink-faint">
                      Locked Card
                    </h4>
                    <p className="text-[11px] text-ink-faint mt-2 px-2">
                      Complete the missions in <span className="font-semibold">{card.source}</span> to unlock.
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
