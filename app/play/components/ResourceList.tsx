import { GameResources } from '../types';

interface ResourceListProps {
  resources: GameResources;
  production: GameResources;
}

export default function ResourceList({ resources, production }: ResourceListProps) {
  const resourceItems = [
    { key: 'gold', icon: '💰', label: 'Gold', color: 'text-yellow-400' },
    { key: 'steel', icon: '⚔️', label: 'Steel', color: 'text-gray-300' },
    { key: 'food', icon: '🌾', label: 'Food', color: 'text-green-400' },
    { key: 'energy', icon: '⚡', label: 'Energy', color: 'text-yellow-300' },
    { key: 'technology', icon: '🔬', label: 'Technology', color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-3">
      {resourceItems.map(({ key, icon, label, color }) => (
        <div key={key} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span className={color}>{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {resources[key as keyof GameResources]}
            </span>
            <span className="text-sm text-green-400">
              +{production[key as keyof GameResources]}/turn
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}