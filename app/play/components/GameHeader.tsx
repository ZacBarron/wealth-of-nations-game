import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { GamePhase } from '../types';

interface GameHeaderProps {
  currentTurn: number;
  gamePhase: GamePhase;
}

export default function GameHeader({ currentTurn, gamePhase }: GameHeaderProps) {
  return (
    <div className="bg-blue-800/50 px-6 py-3 rounded-xl mb-6 flex justify-between items-center">
      {/* Left side - Logo */}
      <div className="flex items-center gap-3">
        <GlobeAltIcon className="w-8 h-8 text-amber-400" />
        <div className="flex flex-col">
          <span className="font-bold text-amber-300">Wealth of Nations</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-blue-200">Turn</span>
            <span className="bg-blue-900/50 px-3 py-1 rounded-lg text-amber-400 font-bold">
              {currentTurn}
            </span>
          </div>
        </div>
      </div>

      {/* Center - Phase Status */}
      <motion.div 
        className="flex flex-col items-center"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -10 }}
        key={gamePhase}
      >
        <div className="text-amber-400 font-bold text-xl flex items-center gap-2">
          {gamePhase === 'action' && '⚡'}
          {gamePhase === 'trade' && '🤝'}
          {gamePhase === 'production' && '🏭'}
          {gamePhase.toUpperCase()} PHASE
        </div>
        <div className="text-sm text-blue-200">
          {gamePhase === 'action' && 'Play cards from your hand'}
          {gamePhase === 'trade' && 'Trade resources with the market'}
          {gamePhase === 'production' && 'Collect resources from your industries'}
        </div>
      </motion.div>

      {/* Right side - Exit Button */}
      <Link 
        href="/"
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center gap-2 group"
      >
        <span>Exit Game</span>
        <span className="text-lg group-hover:rotate-90 transition-transform duration-200">⨉</span>
      </Link>
    </div>
  );
}
