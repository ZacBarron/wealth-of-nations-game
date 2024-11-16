"use client";
import { useUser } from "@account-kit/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GameBoard from "./components/GameBoard";
import ResourcePanel from "./components/ResourcePanel";
import PlayerHand from "./components/PlayerHand";
import { GameResources, PlayedCards, GamePhase, Card, ResourceTransaction } from "./types";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import { TEST_CARDS } from './utils/testCards';
import DeckPile from "./components/DeckPile";
import PlayArea from "./components/PlayArea";
import ResourceList from "./components/ResourceList";
import GameHeader from './components/GameHeader';

// Initial states
const initialResources: GameResources = {
  gold: 100,
  steel: 50,
  food: 50,
  energy: 50,
  technology: 25,
};

const initialProduction: GameResources = {
  gold: 10,
  steel: 5,
  food: 5,
  energy: 5,
  technology: 2,
};

const initialPlayedCards: PlayedCards = {
  leader: [],
  industry: [],
  policy: [],
  event: [],
};

export default function Page() {
  const user = useUser();
  const router = useRouter();
  const [resources, setResources] = useState<GameResources>(initialResources);
  const [production, setProduction] = useState<GameResources>(initialProduction);
  const [playedCards, setPlayedCards] = useState<PlayedCards>(initialPlayedCards);
  const [gamePhase, setGamePhase] = useState<GamePhase>('action');
  const [transactions, setTransactions] = useState<ResourceTransaction[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deck, setDeck] = useState<Card[]>([...TEST_CARDS]);
  const [hand, setHand] = useState<Card[]>([]);
  const [cardsPlayedThisTurn, setCardsPlayedThisTurn] = useState<number>(0);
  const maxCardsPerTurn = 3;
  const maxHandSize = 7;
  const initialDrawCount = 5;
  const cardsPerTurn = 2;
  const [lastPlayedCard, setLastPlayedCard] = useState<{card: Card, index: number} | null>(null);

  // Add function to shuffle deck
  const shuffleDeck = (deck: Card[]) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  // Add function to draw cards
  const drawCards = (count: number) => {
    if (deck.length === 0) {
      toast.error('No cards left in deck! 😱');
      return;
    }

    const availableSlots = maxHandSize - hand.length;
    if (availableSlots <= 0) {
      toast.error('Hand is full! Cannot draw more cards 🚫');
      return;
    }

    const cardsToDraw = Math.min(count, availableSlots);
    const newCards = deck.slice(0, cardsToDraw);
    const remainingDeck = deck.slice(cardsToDraw);
    
    setHand(prev => [...prev, ...newCards]);
    setDeck(remainingDeck);
    
    if (cardsToDraw < count) {
      toast.error(`Could only draw ${cardsToDraw} cards - hand is full! 🃏`);
    } else {
      toast.success(`Drew ${cardsToDraw} cards! 🎴`);
    }

    if (remainingDeck.length <= 5) {
      toast.error(`Only ${remainingDeck.length} cards left in deck! 😰`);
    }
  };

  // Handle production phase
  const handleProduction = async () => {
    setIsProcessing(true);
    try {
      const newResources = { ...resources };
      const newTransactions: ResourceTransaction[] = [];

      for (const [resource, amount] of Object.entries(production)) {
        const resourceKey = resource as keyof GameResources;
        newResources[resourceKey] += amount;
        
        newTransactions.push({
          resourceType: resource,
          amount: amount,
          timestamp: Date.now(),
          type: 'production'
        });

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setResources(newResources);
      setTransactions(prev => [...newTransactions, ...prev].slice(0, 10));
      toast.success('Production phase completed!', { icon: '🔄' });
    } catch (error) {
      toast.error('Error during production phase');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle playing a card
  const handlePlayCard = async (card: Card) => {
    // First check if we're in the action phase
    if (gamePhase !== 'action') {
      toast.error(`Cards can only be played during the action phase! Current phase: ${gamePhase.toUpperCase()}`);
      return;
    }

    if (cardsPlayedThisTurn >= maxCardsPerTurn) {
      toast.error(`Can only play ${maxCardsPerTurn} cards per turn`);
      return;
    }

    setIsProcessing(true);
    try {
      // Check if player can afford the card
      const canAfford = Object.entries(card.cost).every(
        ([resource, cost]) => resources[resource as keyof GameResources] >= (cost || 0)
      );

      if (!canAfford) {
        toast.error('Not enough resources to play this card');
        return;
      }

      // Deduct costs
      const newResources = { ...resources };
      Object.entries(card.cost).forEach(([resource, cost]) => {
        newResources[resource as keyof GameResources] -= (cost || 0);
      });
      setResources(newResources);

      // Add card to played cards area
      setPlayedCards(prev => ({
        ...prev,
        [card.type]: [...prev[card.type], card]
      }));

      // Remove card from hand
      setHand(prev => prev.filter(c => c.id !== card.id));

      // Update cards played counter
      setCardsPlayedThisTurn(prev => prev + 1);

      // Store last played card for undo
      const cardIndex = hand.findIndex(c => c.id === card.id);
      setLastPlayedCard({ card, index: cardIndex });

      toast.success(`Played ${card.name}!`);

    } catch (error) {
      toast.error('Failed to play card');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle phase changes
  const handlePhaseChange = (newPhase: GamePhase) => {
    if (newPhase === 'production') {
      handleProduction();
      setCurrentTurn(prev => prev + 1);
    }
    
    setGamePhase(newPhase);
    toast.success(`Entering ${newPhase} phase`, {
      icon: newPhase === 'production' ? '🔄' :
            newPhase === 'action' ? '⚡' : '🎴'
    });
  };

  // Initialize game with cards
  useEffect(() => {
    // Reset all card-related state first
    setHand([]);
    setCardsPlayedThisTurn(0);
    setLastPlayedCard(null);
    
    // Initialize and shuffle deck
    const shuffledDeck = shuffleDeck([...TEST_CARDS]);
    setDeck(shuffledDeck);
    
    // Draw initial cards after a brief delay
    setTimeout(() => {
      const initialCards = shuffledDeck.slice(0, initialDrawCount);
      const remainingDeck = shuffledDeck.slice(initialDrawCount);
      
      setHand(initialCards);
      setDeck(remainingDeck);
      
      toast.success(`Game started! Drew ${initialDrawCount} cards 🎴`);
    }, 500);
  }, []); // Only run once on component mount

  // Update handleTurnEnd function
  const handleTurnEnd = () => {
    setIsProcessing(true);
    
    try {
      switch (gamePhase) {
        case 'action':
          setGamePhase('trade');
          toast.success('Entering Trade Phase 🤝');
          break;
        
        case 'trade':
          setGamePhase('production');
          toast.success('Entering Production Phase 🏭');
          break;
        
        case 'production':
          // Handle production phase
          const newResources = { ...resources };
          Object.keys(production).forEach(resource => {
            newResources[resource as keyof GameResources] += 
              production[resource as keyof GameResources];
          });
          setResources(newResources);
          
          // Draw cards and reset for next turn
          drawCards(cardsPerTurn);
          setCurrentTurn(prev => prev + 1);
          setCardsPlayedThisTurn(0);
          setGamePhase('action');
          toast.success('Starting new turn! ⚡');
          break;
      }
    } catch (error) {
      toast.error('Error ending phase');
      console.error('Phase end error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add undo function
  const handleUndo = () => {
    if (!lastPlayedCard) {
      toast.error('Nothing to undo');
      return;
    }

    // Revert the card play
    const newHand = [...hand];
    newHand.splice(lastPlayedCard.index, 0, lastPlayedCard.card);
    setHand(newHand);
    
    // Revert the cards played counter
    setCardsPlayedThisTurn(prev => prev - 1);
    
    // Clear the last played card
    setLastPlayedCard(null);
    
    toast.success('Undid last play');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-900">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to Play</h1>
          <p className="mb-4">You need to connect your wallet to access the game.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleExitGame = () => {
    const confirmExit = window.confirm("Are you sure you want to exit the game? Any unsaved progress will be lost.");
    if (confirmExit) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white p-6">
      <GameHeader 
        currentTurn={currentTurn}
        gamePhase={gamePhase}
      />

      {/* Main Game Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Resources */}
        <div className="col-span-2">
          <div className="bg-blue-800/50 rounded-xl p-4">
            <h2 className="text-xl font-bold text-amber-400 mb-4">Resources</h2>
            <ResourceList resources={resources} production={production} />
          </div>
          
          {/* Deck Pile moved below resources */}
          <div className="mt-4">
            <DeckPile cardsRemaining={deck.length} />
          </div>
        </div>

        {/* Center Column - Play Area */}
        <div className="col-span-7">
          {/* Played Cards Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Leaders & Industry */}
            <div className="space-y-4">
              <PlayArea 
                title="Leaders" 
                icon="👑"
                cards={playedCards.leader}
                maxCards={1}
              />
              <PlayArea 
                title="Industry" 
                icon="🏭"
                cards={playedCards.industry}
                maxCards={6}
              />
            </div>
            {/* Policy & Events */}
            <div className="space-y-4">
              <PlayArea 
                title="Policies" 
                icon="📜"
                cards={playedCards.policy}
                maxCards={3}
              />
              <PlayArea 
                title="Events" 
                icon="🌟"
                cards={playedCards.event}
                maxCards={4}
              />
            </div>
          </div>

          {/* Phase Action Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleTurnEnd}
              disabled={isProcessing}
              className={`
                px-6 py-3 
                ${isProcessing ? 'bg-gray-600' : 'bg-amber-600 hover:bg-amber-700'} 
                rounded-lg transition-colors
                disabled:cursor-not-allowed
              `}
            >
              {isProcessing ? 'Processing...' : `End ${gamePhase} Phase →`}
            </button>
          </div>
        </div>

        {/* Right Column - Hand */}
        <div className="col-span-3">
          <PlayerHand 
            cards={hand}
            resources={resources}
            playedCards={playedCards}
            onPlayCard={handlePlayCard}
            onError={(error) => toast.error(error.message)}
            deckSize={deck.length}
            maxHandSize={maxHandSize}
            cardsPlayedThisTurn={cardsPlayedThisTurn}
            maxCardsPerTurn={maxCardsPerTurn}
            canPlayCards={gamePhase === 'action'}
          />
          
          {/* Undo Button */}
          {lastPlayedCard && (
            <div className="mt-4 flex justify-end">
              <motion.button
                onClick={handleUndo}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Undo Last Play ↩
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
