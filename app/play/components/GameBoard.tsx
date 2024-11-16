import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: string;
  name: string;
  type: 'leader' | 'industry' | 'policy' | 'event';
  description: string;
  image?: string;
}

interface PlayedCards {
  leader: Card[];
  industry: Card[];
  policy: Card[];
  event: Card[];
}

interface GameBoardProps {
  playedCards: PlayedCards;
  currentPhase: 'production' | 'trade' | 'action';
  onPhaseChange: (phase: 'production' | 'trade' | 'action') => void;
}

const phaseConfig = {
  production: {
    icon: '🔄',
    description: 'Collect resources from your industries',
    nextPhase: 'trade' as const
  },
  trade: {
    icon: '🤝',
    description: 'Trade resources with other players',
    nextPhase: 'action' as const
  },
  action: {
    icon: '⚡',
    description: 'Play cards and take actions',
    nextPhase: 'production' as const
  }
};

export default function GameBoard({ playedCards, currentPhase, onPhaseChange }: GameBoardProps) {
  const [selectedZone, setSelectedZone] = useState<keyof PlayedCards | null>(null);
  const [showZoneDetails, setShowZoneDetails] = useState(false);

  const handleEndPhase = () => {
    onPhaseChange(phaseConfig[currentPhase].nextPhase);
  };

  const renderCards = (zoneType: keyof PlayedCards) => {
    const cards = playedCards[zoneType];
    return (
      <div className="flex flex-wrap gap-2">
        {cards.length === 0 ? (
          <div className="w-24 h-32 bg-blue-950/50 rounded-lg border border-blue-700/30 flex items-center justify-center">
            <span className="text-blue-400 text-sm">Empty</span>
          </div>
        ) : (
          <AnimatePresence>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, zIndex: 1 }}
                className="w-24 h-32 bg-blue-900 rounded-lg border border-blue-600 p-2 relative cursor-pointer"
              >
                {card.image ? (
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-2xl mb-2">
                      {zoneType === 'leader' ? '👑' :
                       zoneType === 'industry' ? '🏭' :
                       zoneType === 'policy' ? '📜' : '🌍'}
                    </span>
                    <span className="text-xs text-center text-blue-200">{card.name}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div className="bg-blue-900/30 rounded-2xl p-6">
      {/* Phase Indicator */}
      <div className="mb-6 text-center">
        <div className="inline-block bg-blue-800/50 rounded-full px-6 py-3">
          <span className="text-2xl mr-2">{phaseConfig[currentPhase].icon}</span>
          <span className="text-gold-300 font-semibold">
            {currentPhase.toUpperCase()} PHASE
          </span>
          <p className="text-blue-200 text-sm mt-1">
            {phaseConfig[currentPhase].description}
          </p>
        </div>
      </div>

      {/* Game Zones Grid */}
      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(playedCards) as Array<keyof PlayedCards>).map((zoneType) => (
          <div
            key={zoneType}
            className={`
              relative p-4 rounded-xl transition-all duration-300 min-h-[200px]
              ${selectedZone === zoneType ? 'bg-blue-800/50' : 'bg-blue-900/50'}
              hover:bg-blue-800/50 cursor-pointer
            `}
            onClick={() => setSelectedZone(zoneType)}
          >
            {/* Zone Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {zoneType === 'leader' ? '👑' :
                   zoneType === 'industry' ? '🏭' :
                   zoneType === 'policy' ? '📜' : '🌍'}
                </span>
                <h3 className="text-lg font-bold text-gold-300">
                  {zoneType.charAt(0).toUpperCase() + zoneType.slice(1)}s
                </h3>
              </div>
              <span className="text-blue-200 text-sm">
                {playedCards[zoneType].length} / 
                {zoneType === 'leader' ? '1' : 
                 zoneType === 'industry' ? '6' : 
                 zoneType === 'policy' ? '3' : '4'}
              </span>
            </div>

            {/* Cards Display */}
            {renderCards(zoneType)}

            {/* Zone Details Button */}
            {selectedZone === zoneType && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowZoneDetails(true);
                }}
                className="absolute bottom-4 right-4 bg-blue-700/50 hover:bg-blue-700 
                         text-sm text-white px-3 py-1 rounded-lg transition-colors"
              >
                View Details
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="mt-6 flex justify-center space-x-4">
        <button 
          onClick={handleEndPhase}
          className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
        >
          <span className="mr-2">End {currentPhase} Phase</span>
          <span>→</span>
        </button>
      </div>

      {/* Zone Details Modal (placeholder) */}
      {showZoneDetails && selectedZone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-blue-900 p-6 rounded-xl max-w-lg w-full">
            <h2 className="text-xl font-bold text-gold-300 mb-4">
              {selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Details
            </h2>
            {/* Add zone-specific details here */}
            <button 
              onClick={() => setShowZoneDetails(false)}
              className="mt-4 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
