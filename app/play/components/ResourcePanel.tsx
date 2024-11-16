import { useState } from 'react';
import { Resource, GameResources, ResourceTransaction } from '../types';

interface ResourcePanelProps {
  resources: GameResources;
  production: GameResources;
  transactions?: ResourceTransaction[];
}

const resourceConfig: Omit<Resource, 'amount' | 'production'>[] = [
  { name: 'Gold', icon: '💰', color: 'bg-amber-500' },
  { name: 'Steel', icon: '⚒️', color: 'bg-gray-500' },
  { name: 'Food', icon: '🌾', color: 'bg-green-500' },
  { name: 'Energy', icon: '⚡', color: 'bg-yellow-500' },
  { name: 'Technology', icon: '🔬', color: 'bg-purple-500' },
];

export default function ResourcePanel({ resources, production, transactions = [] }: ResourcePanelProps) {
  const [showHistory, setShowHistory] = useState(false);

  const resourceList = resourceConfig.map(resource => ({
    ...resource,
    amount: resources[resource.name.toLowerCase() as keyof GameResources],
    production: production[resource.name.toLowerCase() as keyof GameResources],
  }));

  return (
    <div className="bg-blue-800/50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gold-300">Resources</h2>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-200 hover:text-white"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>
      
      <div className="space-y-3">
        {resourceList.map((resource) => (
          <div 
            key={resource.name}
            className="flex items-center bg-blue-900/50 rounded-lg p-3 transition-all hover:bg-blue-900/70"
          >
            <div className={`${resource.color} p-2 rounded-lg mr-3`}>
              <span className="text-xl">{resource.icon}</span>
            </div>
            
            <div className="flex-1">
              <div className="text-sm text-blue-200">{resource.name}</div>
              <div className="text-xl font-bold text-white">{resource.amount}</div>
            </div>

            <div className={`text-sm ${resource.production >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {resource.production > 0 && '+'}
              {resource.production}/turn
            </div>
          </div>
        ))}
      </div>

      {showHistory && transactions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
          <h3 className="text-sm text-blue-300 mb-2">Recent Transactions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="text-sm flex justify-between">
                <span className="text-blue-200">
                  {tx.type === 'production' ? '🔄' : 
                   tx.type === 'trade' ? '🤝' : 
                   tx.type === 'cost' ? '💸' : '✨'} {tx.resourceType}
                </span>
                <span className={tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {tx.amount > 0 && '+'}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
