"use client";
import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function AuthLayout({ 
  children,
  title = "Dashboard" 
}: { 
  children: React.ReactNode;
  title?: string;
}) {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();

  if (signerStatus.isInitializing) {
    return <div className="text-blue-100">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 text-center lg:pt-32">
            <div className="mx-auto mb-12">
              <GlobeAltIcon className="w-24 h-24 text-gold-400 mx-auto animate-pulse" />
            </div>

            <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-gold-300 sm:text-7xl">
              Wealth of Nations
              <span className="block text-3xl sm:text-4xl mt-4 text-blue-100">The Trading Card Game</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Build your economic empire through strategic trading, resource management, 
              and powerful leader cards in this revolutionary blockchain-based card game.
            </p>
            
            <div className="mt-10">
              <button
                onClick={openAuthModal}
                className="rounded-xl bg-gold-500 px-8 py-4 text-lg font-semibold text-blue-950 
                          shadow-sm hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 
                          focus-visible:outline-offset-2 focus-visible:outline-gold-500 
                          transition-all duration-300 hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: 'Active Players', value: '10,000+' },
                { label: 'Cards Traded', value: '1M+' },
                { label: 'Total Value Locked', value: '$2.5M' },
                { label: 'Community Members', value: '25,000+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50">
                  <div className="text-2xl font-bold text-gold-300">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-24 bg-blue-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-gold-400">Start Playing Today</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gold-300 sm:text-4xl">
                Everything you need to become a trading mogul
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {[
                  {
                    name: 'Collect & Trade',
                    description: 'Build your collection with unique cards representing resources, industries, and influential leaders.',
                    icon: '🎴'
                  },
                  {
                    name: 'Strategic Gameplay',
                    description: 'Deploy your cards wisely to create powerful economic combinations and outmaneuver your opponents.',
                    icon: '🎯'
                  },
                  {
                    name: 'True Ownership',
                    description: 'Your cards are NFTs, giving you true ownership and the ability to trade in a decentralized marketplace.',
                    icon: '💎'
                  }
                ].map((feature) => (
                  <div key={feature.name} className="flex flex-col bg-blue-900/40 p-8 rounded-2xl border border-blue-800/50">
                    <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gold-300">
                      <span className="text-3xl">{feature.icon}</span>
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gold-300 sm:text-4xl">
                How to Play
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                {
                  title: 'Build Your Economy',
                  description: 'Begin with your starter pack containing basic resource cards and leaders. Each turn, you can play one resource card and one leader card.',
                  icon: '🏭'
                },
                {
                  title: 'Trade Resources',
                  description: 'During your trading phase, you can exchange resources with other players or the market. Each successful trade earns you influence points.',
                  icon: '🤝'
                },
                {
                  title: 'Deploy Leaders',
                  description: 'Play powerful leader cards to gain special abilities and bonuses that can give you an edge over your opponents.',
                  icon: '👑'
                },
                {
                  title: 'Win the Game',
                  description: 'Accumulate wealth and influence through strategic play. The first player to reach 100 influence points wins!',
                  icon: '🏆'
                }
              ].map((item) => (
                <div key={item.title} className="bg-blue-900/40 p-8 rounded-xl border border-blue-800/50">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gold-300">{item.title}</h3>
                      <p className="mt-2 text-blue-100">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="py-24 bg-blue-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gold-300 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="space-y-8">
                {[
                  {
                    q: "What do I need to start playing?",
                    a: "Just sign up with your email and we'll create a wallet for you automatically. Your first starter pack is free!"
                  },
                  {
                    q: "How does the trading system work?",
                    a: "You can trade cards with other players through our secure marketplace. All trades are executed via smart contracts for maximum security."
                  },
                  {
                    q: "Are the cards really NFTs?",
                    a: "Yes! Each card is a unique NFT on the blockchain, giving you true ownership and the ability to trade them freely."
                  },
                  {
                    q: "How often are new cards released?",
                    a: "We release new card sets quarterly, introducing fresh mechanics and strategic possibilities to the game."
                  }
                ].map((faq) => (
                  <div key={faq.q} className="bg-blue-900/40 p-6 rounded-xl border border-blue-800/50">
                    <h3 className="text-lg font-semibold text-gold-300">{faq.q}</h3>
                    <p className="mt-2 text-blue-100">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-blue-900/50 border-t border-blue-800/50">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-blue-100 hover:text-gold-300">
                Discord
              </a>
              <a href="#" className="text-blue-100 hover:text-gold-300">
                Twitter
              </a>
              <a href="#" className="text-blue-100 hover:text-gold-300">
                GitHub
              </a>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-blue-100">
                &copy; 2024 Wealth of Nations. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title={title} />
        <div className="min-h-screen bg-blue-100/90">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
