"use client";
import AuthLayout from "../components/layout/AuthLayout";

export default function HowToPlayPage() {
  return (
    <AuthLayout title="How to Play">
      <div className="bg-blue-900 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gold-300 mb-4">
          How to Play
        </h2>
        
        <div className="space-y-8 text-blue-100">
          {/* Game Overview */}
          <p>
            Build your economic empire through strategic card play and resource management. 
            Each turn consists of three phases where you'll play cards, trade resources, and grow your economy.
          </p>

          {/* Victory Conditions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold-300">How to Win</h3>
            <p>Victory can be achieved through any of these conditions:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="text-gold-300">Economic Dominance:</span> Accumulate 1000 gold</li>
              <li><span className="text-gold-300">Industrial Power:</span> Have 10 industry cards in play</li>
              <li><span className="text-gold-300">Technological Supremacy:</span> Reach 100 technology</li>
              <li><span className="text-gold-300">Resource Empire:</span> Have 100 of each resource</li>
            </ul>
          </div>
          
          {/* Turn Structure */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold-300">Turn Phases</h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-gold-300">1. Action Phase ⚡</span>
                <p>Play up to 3 cards from your hand. Each card requires resources to play.</p>
              </div>
              <div>
                <span className="font-semibold text-gold-300">2. Trade Phase 🤝</span>
                <p>Exchange resources with the market to balance your economy.</p>
              </div>
              <div>
                <span className="font-semibold text-gold-300">3. Production Phase 🏭</span>
                <p>Collect resources from your industries and draw 2 new cards.</p>
              </div>
            </div>
          </div>

          {/* Card Types */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold-300">Card Types</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="text-gold-300">Leaders (Max: 1):</span> Powerful characters with unique abilities</li>
              <li><span className="text-gold-300">Industry (Max: 6):</span> Buildings that produce resources each turn</li>
              <li><span className="text-gold-300">Policy (Max: 3):</span> Laws that modify game rules</li>
              <li><span className="text-gold-300">Events (Max: 4):</span> One-time effects that impact the game</li>
            </ul>
          </div>

          {/* Key Rules */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold-300">Key Rules</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Maximum hand size: 7 cards</li>
              <li>3 card plays per turn maximum</li>
              <li>Draw 2 cards at end of turn</li>
              <li>Resources carry over between turns</li>
              <li>Card effects are cumulative</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold-300">Resources</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="text-gold-300">Gold:</span> Basic currency</li>
              <li><span className="text-gold-300">Steel:</span> Industrial material</li>
              <li><span className="text-gold-300">Food:</span> Population support</li>
              <li><span className="text-gold-300">Energy:</span> Powers industry</li>
              <li><span className="text-gold-300">Technology:</span> Advanced development</li>
            </ul>
          </div>

          {/* Strategy Tips */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold-300">Strategy Tips</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Focus on one victory condition but stay flexible</li>
              <li>Balance resource production with card costs</li>
              <li>Choose a leader that supports your strategy</li>
              <li>Build a diverse industry base early</li>
              <li>Use the trade phase to fix resource imbalances</li>
              <li>Save powerful event cards for critical moments</li>
            </ul>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}