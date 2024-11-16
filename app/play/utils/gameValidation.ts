import { Card, GameResources, PlayedCards, ZONE_LIMITS, GameError } from '../types';

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