import { motion, AnimatePresence } from "framer-motion";

interface DeckPileProps {
  cardsRemaining: number;
}

export default function DeckPile({ cardsRemaining }: DeckPileProps) {
  return (
    <div className="relative w-32 h-44">
      {/* Base card */}
      <div className="absolute inset-0 bg-blue-900 rounded-lg border-2 border-blue-400/30 shadow-lg">
        {/* Visual card stack effect */}
        {Array.from({ length: Math.min(5, cardsRemaining) }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 bg-blue-800 rounded-lg border border-blue-400/30"
            style={{
              transform: `translateY(${-i * 1}px) translateX(${-i * 1}px)`,
            }}
          />
        ))}
        
        {/* Card count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-amber-400">
            {cardsRemaining}
          </span>
        </div>
      </div>
      
      {/* Draw animation indicator */}
      <AnimatePresence>
        {cardsRemaining > 0 && (
          <motion.div
            className="absolute top-0 right-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-green-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            ↑
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}