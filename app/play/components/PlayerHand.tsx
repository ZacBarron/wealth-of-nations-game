"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Card, GameResources, PlayedCards } from "../types";

interface PlayerHandProps {
  cards: Card[];
  resources: GameResources;
  playedCards: PlayedCards;
  onPlayCard: (card: Card) => void;
  onError: (error: Error) => void;
  deckSize: number;
  maxHandSize: number;
  cardsPlayedThisTurn: number;
  maxCardsPerTurn: number;
  canPlayCards: boolean;
}

export default function PlayerHand({ cards, resources, playedCards, onPlayCard, onError, deckSize, maxHandSize, cardsPlayedThisTurn, maxCardsPerTurn, canPlayCards }: PlayerHandProps) {
  const isAtPlayLimit = cardsPlayedThisTurn >= maxCardsPerTurn;

  return (
    <div className={`bg-blue-800/50 rounded-xl p-4 ${isAtPlayLimit ? 'ring-2 ring-red-500/50' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-400">Your Hand</h2>
        <div className="flex gap-4 text-sm">
          <div className="text-blue-200">
            Hand: {cards.length}/{maxHandSize}
          </div>
          <motion.div 
            className={`px-2 py-1 rounded ${isAtPlayLimit ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}
            animate={{
              scale: isAtPlayLimit ? [1, 1.1, 1] : 1,
              transition: { duration: 0.3 }
            }}
          >
            Plays: {cardsPlayedThisTurn}/{maxCardsPerTurn}
          </motion.div>
        </div>
      </div>
      
      {isAtPlayLimit && (
        <motion.div 
          className="mb-4 p-2 bg-red-900/50 text-red-300 rounded-lg text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Maximum plays reached for this turn
        </motion.div>
      )}
      
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {cards.slice(0, maxHandSize).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                  bg-blue-700/50 p-3 rounded-lg cursor-pointer
                  hover:bg-blue-600/50 transition-colors
                  border border-blue-500/30
                `}
                onClick={() => onPlayCard(card)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-amber-400">{card.name}</h3>
                  <div className="flex gap-1 text-sm">
                    {Object.entries(card.cost).map(([resource, amount]) => (
                      <span 
                        key={resource}
                        className={`
                          px-2 py-1 rounded
                          ${resources[resource as keyof GameResources] >= amount 
                            ? 'bg-green-600/30 text-green-300' 
                            : 'bg-red-600/30 text-red-300'}
                        `}
                      >
                        {resource}: {amount}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-blue-200 mt-1">{card.description}</p>
                <div className="text-xs text-blue-300 mt-2 flex justify-between items-center">
                  <span className={`
                    px-2 py-1 rounded
                    ${card.type === 'leader' ? 'bg-purple-600/30' :
                      card.type === 'industry' ? 'bg-blue-600/30' :
                      card.type === 'policy' ? 'bg-green-600/30' :
                      'bg-red-600/30'}
                  `}>
                    {card.type}
                  </span>
                  <span className={`
                    px-2 py-1 rounded
                    ${card.rarity === 'common' ? 'bg-gray-600/30' :
                      card.rarity === 'uncommon' ? 'bg-green-600/30' :
                      card.rarity === 'rare' ? 'bg-blue-600/30' :
                      'bg-purple-600/30'}
                  `}>
                    {card.rarity}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-700/50">
        <div className="flex justify-between items-center text-sm text-blue-200">
          <span>Deck:</span>
          <span>{deckSize} cards remaining</span>
        </div>
      </div>
    </div>
  );
}
