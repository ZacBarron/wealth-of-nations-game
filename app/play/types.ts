export interface Resource {
  name: string;
  amount: number;
  icon: string;
  color: string;
  production: number;
}

export interface ResourceTransaction {
  resourceType: string;
  amount: number;
  timestamp: number;
  type: 'production' | 'cost' | 'trade' | 'effect';
}

export interface GameResources {
  gold: number;
  steel: number;
  food: number;
  energy: number;
  technology: number;
}

export interface ResourceProduction {
  gold: number;
  steel: number;
  food: number;
  energy: number;
  technology: number;
}

export type ResourceType = 'gold' | 'steel' | 'food' | 'energy' | 'technology';
export type CardType = 'leader' | 'industry' | 'policy' | 'event';

export type CardEffect = {
  type: 'boost_production' | 'reduce_cost' | 'multiply_resource' | 'card_interaction';
  target: {
    resourceType?: ResourceType;
    cardType?: CardType;
    cardTag?: CardTag;
  };
  value: number;
  condition?: CardCondition;
}

export type CardTag = 
  | 'industrial'
  | 'economic'
  | 'scientific'
  | 'political'
  | 'military';

export type CardCondition = {
  requiresTag?: CardTag;
  requiresType?: CardType;
  minimumCards?: number;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  tags: CardTag[];
  cost: Partial<GameResources>;
  description: string;
  image: string | undefined;
  rarity: CardRarity;
  effects: CardEffect[];
}

export interface PlayedCards {
  leader: Card[];
  industry: Card[];
  policy: Card[];
  event: Card[];
}

export type GamePhase = 'action' | 'trade' | 'production';

export interface ZoneLimit {
  leader: 1;
  industry: 6;
  policy: 3;
  event: 4;
}

export interface GameError {
  type: 'resource' | 'capacity' | 'invalid_move';
  message: string;
}

export const ZONE_LIMITS: ZoneLimit = {
  leader: 1,
  industry: 6,
  policy: 3,
  event: 4
} as const;

export const PHASE_CONFIG = {
  production: {
    icon: '🔄',
    description: 'Collect resources from your industries',
    nextPhase: 'trade' as GamePhase
  },
  trade: {
    icon: '🤝',
    description: 'Trade resources with other players',
    nextPhase: 'action' as GamePhase
  },
  action: {
    icon: '⚡',
    description: 'Play cards and take actions',
    nextPhase: 'production' as GamePhase
  }
} as const;

export const DECK_RULES = {
  MIN_DECK_SIZE: 40,
  MAX_DECK_SIZE: 60,
  CARD_LIMITS: {
    leader: 4,     // Max 4 leaders per deck
    industry: 25,  // Max 25 industry cards
    policy: 15,    // Max 15 policy cards
    event: 8       // Max 8 event cards
  }
} as const;

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export function validateCardPlay(
  card: Card,
  resources: GameResources,
  playedCards: PlayedCards
): GameError | null {
  // Check resource costs
  const resourceError = validateResources(card.cost, resources);
  if (resourceError) return resourceError;

  // Check zone capacity
  const capacityError = validateZoneCapacity(card.type, playedCards);
  if (capacityError) return capacityError;

  // Check phase-specific rules
  const phaseError = validatePhaseRules(card);
  if (phaseError) return phaseError;

  return null;
}

function validateResources(
  cost: Partial<GameResources>,
  available: GameResources
): GameError | null {
  for (const [resource, amount] of Object.entries(cost)) {
    if (available[resource as keyof GameResources] < (amount || 0)) {
      return {
        type: 'resource',
        message: `Not enough ${resource}. Need ${amount} but only have ${available[resource as keyof GameResources]}.`
      };
    }
  }
  return null;
}

function validateZoneCapacity(
  cardType: Card['type'],
  playedCards: PlayedCards
): GameError | null {
  const currentCount = playedCards[cardType].length;
  const limit = ZONE_LIMITS[cardType];

  if (currentCount >= limit) {
    return {
      type: 'capacity',
      message: `${cardType} zone is full. Maximum of ${limit} cards allowed.`
    };
  }
  return null;
}

function validatePhaseRules(card: Card): GameError | null {
  // Add phase-specific validation rules here
  return null;
}
