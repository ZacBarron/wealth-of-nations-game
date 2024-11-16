import { Card } from '../types';
import { motion } from 'framer-motion';

interface PlayAreaProps {
  title: string;
  icon: string;
  cards: Card[];
  maxCards: number;
}

export default function PlayArea({ title, icon, cards, maxCards }: PlayAreaProps) {
  return (
    <div className="bg-blue-800/30 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-lg font-semibold text-amber-400">{title}</h3>
        </div>
        <div className="text-sm text-blue-300">
          {cards.length}/{maxCards}
        </div>
      </div>

      <div className="min-h-[120px] bg-blue-900/30 rounded-lg p-2">
        {cards.length === 0 ? (
          <div className="h-full flex items-center justify-center text-blue-500/50">
            Empty
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-800/50 rounded p-2 text-sm"
              >
                {card.name}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}