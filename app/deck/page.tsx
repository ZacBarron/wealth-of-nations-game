"use client";
import AuthLayout from "../components/layout/AuthLayout";
import { TEST_CARDS } from "../play/utils/testCards";
import { Card } from "../play/types";

export default function DeckPage() {
  // Group cards by type
  const cardsByType = TEST_CARDS.reduce((acc, card) => {
    if (!acc[card.type]) {
      acc[card.type] = [];
    }
    acc[card.type].push(card);
    return acc;
  }, {} as Record<string, Card[]>);

  return (
    <AuthLayout title="My Deck">
      <div className="bg-blue-900 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold-300">
            My Deck
          </h2>
          <div className="text-blue-200">
            <span className="font-bold">{TEST_CARDS.length}</span> Cards Total
          </div>
        </div>

        <div className="space-y-8">
          {/* Leaders */}
          <div>
            <h3 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
              👑 Leaders <span className="text-sm text-blue-300">(Max: 1)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cardsByType['leader']?.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <h3 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
              🏭 Industry <span className="text-sm text-blue-300">(Max: 6)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cardsByType['industry']?.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
              📜 Policy <span className="text-sm text-blue-300">(Max: 3)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cardsByType['policy']?.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
              🌟 Events <span className="text-sm text-blue-300">(Max: 4)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cardsByType['event']?.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

// Card component
function CardItem({ card }: { card: Card }) {
  return (
    <div className="bg-blue-700/40 backdrop-blur-sm rounded-xl p-4">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-xl font-bold text-gold-300">{card.name}</h4>
        
        {/* Cost Display - Updated with green background */}
        <div className="flex gap-1.5">
          {Object.entries(card.cost).map(([resource, amount]) => (
            amount > 0 && (
              <span key={resource} className="text-sm bg-emerald-700/60 px-2 py-0.5 rounded text-blue-100">
                {resource}: {amount}
              </span>
            )
          ))}
        </div>
      </div>
      
      {/* Card Description */}
      <p className="text-blue-100 text-sm mb-3">{card.description}</p>
      
      {/* Card Footer */}
      <div className="flex justify-between items-center text-xs mt-auto">
        {/* Card Type */}
        <span className={`
          px-2 py-1 rounded
          ${card.type === 'industry' && 'bg-blue-600/50 text-blue-200'}
          ${card.type === 'policy' && 'bg-purple-700/50 text-purple-200'}
          ${card.type === 'event' && 'bg-violet-700/50 text-violet-200'}
        `}>
          {card.type.toUpperCase()}
        </span>

        {/* Rarity */}
        <span className={`
          px-2 py-1 rounded
          ${card.rarity === 'common' && 'bg-blue-600/50 text-blue-200'}
          ${card.rarity === 'uncommon' && 'bg-teal-700/50 text-teal-200'}
          ${card.rarity === 'rare' && 'bg-indigo-700/50 text-indigo-200'}
          ${card.rarity === 'legendary' && 'bg-amber-700/50 text-amber-200'}
        `}>
          {card.rarity.toUpperCase()}
        </span>

        <span className="text-blue-300">ID: {card.id}</span>
      </div>
    </div>
  );
}
