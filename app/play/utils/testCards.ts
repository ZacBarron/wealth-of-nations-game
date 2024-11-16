import { Card, CardEffect, CardTag, GameResources, CardRarity } from '../types';

const createCard = (
  id: string,
  name: string,
  type: 'leader' | 'industry' | 'policy' | 'event',
  cost: Partial<GameResources>,
  description: string,
  rarity: CardRarity,
  tags: CardTag[],
  effects: CardEffect[] = []
): Card => ({
  id,
  name,
  type,
  cost,
  description,
  image: undefined,
  rarity,
  tags,
  effects
});

// TODO: Change card from test cards to actual cards in the form of NFTs
export const TEST_CARDS: Card[] = [
  // LEADER CARDS (4)
  createCard(
    'L1',
    'Industrial Pioneer',
    'leader',
    { gold: 5, technology: 2 },
    'Increases steel production by 2 per turn.',
    'rare',
    ['industrial', 'economic'],
    [{
      type: 'boost_production',
      target: { resourceType: 'steel' },
      value: 2
    }]
  ),

  createCard(
    'L2',
    'Trade Magnate',
    'leader',
    { gold: 6, technology: 1 },
    'All trade costs reduced by 1.',
    'rare',
    ['economic', 'political'],
    [{
      type: 'reduce_cost',
      target: { cardType: 'industry' },
      value: 1
    }]
  ),

  createCard(
    'L3',
    'Tech Visionary',
    'leader',
    { gold: 8, energy: 2 },
    'Gain 1 extra technology per turn.',
    'legendary',
    ['scientific', 'industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'technology' },
      value: 1
    }]
  ),

  createCard(
    'L4',
    'Resource Baron',
    'leader',
    { gold: 7, steel: 3 },
    'All resource production +1.',
    'legendary',
    ['industrial', 'economic'],
    [
      {
        type: 'boost_production',
        target: { resourceType: 'gold' },
        value: 1
      },
      {
        type: 'boost_production',
        target: { resourceType: 'steel' },
        value: 1
      },
      {
        type: 'boost_production',
        target: { resourceType: 'food' },
        value: 1
      },
      {
        type: 'boost_production',
        target: { resourceType: 'energy' },
        value: 1
      }
    ]
  ),

  // INDUSTRY CARDS (20)
  createCard(
    'I1',
    'Steel Mill',
    'industry',
    { gold: 3, energy: 1 },
    'Produces 2 steel per turn.',
    'common',
    ['industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'steel' },
      value: 2
    }]
  ),

  createCard(
    'I2',
    'Power Plant',
    'industry',
    { gold: 4, steel: 2 },
    'Produces 2 energy per turn.',
    'common',
    ['industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'energy' },
      value: 2
    }]
  ),

  createCard(
    'I3',
    'Farm Complex',
    'industry',
    { gold: 3, energy: 1 },
    'Produces 2 food per turn.',
    'common',
    ['industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'food' },
      value: 2
    }]
  ),

  createCard(
    'I4',
    'Research Lab',
    'industry',
    { gold: 5, energy: 2 },
    'Produces 1 technology per turn.',
    'uncommon',
    ['scientific', 'industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'technology' },
      value: 1
    }]
  ),

  createCard(
    'I5',
    'Gold Mine',
    'industry',
    { gold: 4, steel: 2 },
    'Produces 3 gold per turn.',
    'common',
    ['industrial', 'economic'],
    [{
      type: 'boost_production',
      target: { resourceType: 'gold' },
      value: 3
    }]
  ),

  createCard(
    'I6',
    'Advanced Factory',
    'industry',
    { gold: 6, energy: 2, technology: 1 },
    'Produces 3 steel per turn.',
    'uncommon',
    ['industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'steel' },
      value: 3
    }]
  ),

  createCard(
    'I7',
    'Solar Farm',
    'industry',
    { gold: 5, technology: 1 },
    'Produces 3 energy per turn.',
    'uncommon',
    ['industrial', 'scientific'],
    [{
      type: 'boost_production',
      target: { resourceType: 'energy' },
      value: 3
    }]
  ),

  createCard(
    'I8',
    'Hydroponics Bay',
    'industry',
    { gold: 5, technology: 1, energy: 1 },
    'Produces 3 food per turn.',
    'uncommon',
    ['industrial', 'scientific'],
    [{
      type: 'boost_production',
      target: { resourceType: 'food' },
      value: 3
    }]
  ),

  createCard(
    'I9',
    'Tech Hub',
    'industry',
    { gold: 7, energy: 2, technology: 1 },
    'Produces 2 technology per turn.',
    'rare',
    ['scientific', 'industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'technology' },
      value: 2
    }]
  ),

  createCard(
    'I10',
    'Automated Mine',
    'industry',
    { gold: 6, technology: 2 },
    'Produces 4 gold per turn.',
    'uncommon',
    ['industrial', 'economic'],
    [{
      type: 'boost_production',
      target: { resourceType: 'gold' },
      value: 4
    }]
  ),

  createCard(
    'I11',
    'Fusion Reactor',
    'industry',
    { gold: 8, technology: 3, steel: 2 },
    'Produces 5 energy per turn.',
    'rare',
    ['industrial', 'scientific'],
    [{
      type: 'boost_production',
      target: { resourceType: 'energy' },
      value: 5
    }]
  ),

  createCard(
    'I12',
    'Vertical Farm',
    'industry',
    { gold: 7, technology: 2, energy: 1 },
    'Produces 4 food per turn.',
    'rare',
    ['industrial', 'scientific'],
    [{
      type: 'boost_production',
      target: { resourceType: 'food' },
      value: 4
    }]
  ),

  createCard(
    'I13',
    'Quantum Lab',
    'industry',
    { gold: 10, energy: 3, technology: 2 },
    'Produces 3 technology per turn.',
    'legendary',
    ['scientific', 'industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'technology' },
      value: 3
    }]
  ),

  createCard(
    'I14',
    'Recycling Plant',
    'industry',
    { gold: 4, energy: 1 },
    'Produces 1 of each resource per turn.',
    'uncommon',
    ['industrial', 'economic'],
    [
      {
        type: 'boost_production',
        target: { resourceType: 'gold' },
        value: 1
      },
      {
        type: 'boost_production',
        target: { resourceType: 'steel' },
        value: 1
      },
      {
        type: 'boost_production',
        target: { resourceType: 'food' },
        value: 1
      },
      {
        type: 'boost_production',
        target: { resourceType: 'energy' },
        value: 1
      }
    ]
  ),

  createCard(
    'I15',
    'Trade Port',
    'industry',
    { gold: 5, steel: 2 },
    'Produces 3 gold and 1 food per turn.',
    'uncommon',
    ['industrial', 'economic'],
    [
      {
        type: 'boost_production',
        target: { resourceType: 'gold' },
        value: 3
      },
      {
        type: 'boost_production',
        target: { resourceType: 'food' },
        value: 1
      }
    ]
  ),

  createCard(
    'I16',
    'Military Factory',
    'industry',
    { gold: 6, steel: 3, energy: 1 },
    'Produces 4 steel per turn.',
    'rare',
    ['industrial'],
    [{
      type: 'boost_production',
      target: { resourceType: 'steel' },
      value: 4
    }]
  ),

  createCard(
    'I17',
    'Space Station',
    'industry',
    { gold: 12, steel: 4, technology: 3 },
    'Produces 2 of each resource per turn.',
    'legendary',
    ['scientific', 'industrial'],
    [
      {
        type: 'boost_production',
        target: { resourceType: 'gold' },
        value: 2
      },
      {
        type: 'boost_production',
        target: { resourceType: 'steel' },
        value: 2
      },
      {
        type: 'boost_production',
        target: { resourceType: 'food' },
        value: 2
      },
      {
        type: 'boost_production',
        target: { resourceType: 'energy' },
        value: 2
      },
      {
        type: 'boost_production',
        target: { resourceType: 'technology' },
        value: 2
      }
    ]
  ),

  createCard(
    'I18',
    'Nanotech Facility',
    'industry',
    { gold: 8, technology: 2, energy: 2 },
    'Produces 2 technology and 2 steel per turn.',
    'rare',
    ['scientific', 'industrial'],
    [
      {
        type: 'boost_production',
        target: { resourceType: 'technology' },
        value: 2
      },
      {
        type: 'boost_production',
        target: { resourceType: 'steel' },
        value: 2
      }
    ]
  ),

  createCard(
    'I19',
    'Agricultural Complex',
    'industry',
    { gold: 5, energy: 2 },
    'Produces 3 food and 1 gold per turn.',
    'uncommon',
    ['industrial', 'economic'],
    [
      {
        type: 'boost_production',
        target: { resourceType: 'food' },
        value: 3
      },
      {
        type: 'boost_production',
        target: { resourceType: 'gold' },
        value: 1
      }
    ]
  ),

  createCard(
    'I20',
    'Resource Converter',
    'industry',
    { gold: 7, technology: 2 },
    'Convert 1 resource into 2 of another each turn.',
    'rare',
    ['industrial', 'economic'],
    [{
      type: 'card_interaction',
      target: { cardType: 'industry' },
      value: 2
    }]
  ),

  // POLICY CARDS (10)
  createCard(
    'P1',
    'Free Trade Agreement',
    'policy',
    { gold: 3, technology: 1 },
    'Reduce all trade costs by 1.',
    'uncommon',
    ['economic', 'political'],
    [{
      type: 'reduce_cost',
      target: { cardType: 'industry' },
      value: 1
    }]
  ),

  createCard(
    'P2',
    'Research Grant',
    'policy',
    { gold: 4 },
    'Technology production +1 for all buildings.',
    'uncommon',
    ['scientific', 'political'],
    [{
      type: 'boost_production',
      target: { resourceType: 'technology' },
      value: 1,
      condition: { requiresType: 'industry' }
    }]
  ),

  createCard(
    'P3',
    'Industrial Revolution',
    'policy',
    { gold: 5, technology: 2 },
    'All industry cards cost 1 less gold.',
    'rare',
    ['industrial', 'political'],
    [{
      type: 'reduce_cost',
      target: { cardType: 'industry' },
      value: 1
    }]
  ),

  createCard(
    'P4',
    'Resource Stockpile',
    'policy',
    { gold: 3 },
    'Store 50% more resources.',
    'common',
    ['economic', 'political'],
    [{
      type: 'multiply_resource',
      target: { resourceType: 'gold' },
      value: 1.5
    }]
  ),

  createCard(
    'P5',
    'Technological Edge',
    'policy',
    { gold: 6, technology: 2 },
    'All technology production doubled.',
    'rare',
    ['scientific', 'political'],
    [{
      type: 'multiply_resource',
      target: { resourceType: 'technology' },
      value: 2
    }]
  ),

  createCard(
    'P6',
    'Economic Stimulus',
    'policy',
    { gold: 4 },
    'Gold production +1 for all buildings.',
    'uncommon',
    ['economic', 'political'],
    [{
      type: 'boost_production',
      target: { resourceType: 'gold' },
      value: 1,
      condition: { requiresType: 'industry' }
    }]
  ),

  createCard(
    'P7',
    'Military Contract',
    'policy',
    { gold: 5, steel: 2 },
    'Steel production +2 for military buildings.',
    'uncommon',
    ['industrial', 'political'],
    [{
      type: 'boost_production',
      target: { resourceType: 'steel' },
      value: 2,
      condition: { requiresTag: 'military' }
    }]
  ),

  createCard(
    'P10',
    'Trade Federation',
    'policy',
    { gold: 8, technology: 2 },
    'Can trade resources at 1:1 ratio.',
    'legendary',
    ['economic', 'political'],
    [{
      type: 'card_interaction',
      target: { cardType: 'industry' },
      value: 1
    }]
  ),

  // EVENT CARDS (6)
  createCard(
    'E1',
    'Market Boom',
    'event',
    { gold: 3 },
    'Gain 10 gold immediately.',
    'common',
    ['economic'],
    [{
      type: 'boost_production',
      target: { resourceType: 'gold' },
      value: 10
    }]
  ),

  createCard(
    'E2',
    'Resource Discovery',
    'event',
    { gold: 4 },
    'Gain 5 of any basic resource.',
    'uncommon',
    ['industrial'],
    [{
      type: 'card_interaction',
      target: { cardType: 'industry' },
      value: 5
    }]
  ),

  createCard(
    'E3',
    'Technological Breakthrough',
    'event',
    { gold: 5, technology: 1 },
    'Gain 3 technology immediately.',
    'rare',
    ['scientific'],
    [{
      type: 'boost_production',
      target: { resourceType: 'technology' },
      value: 3
    }]
  ),

  createCard(
    'E4',
    'Trade Summit',
    'event',
    { gold: 3 },
    'All trades this turn are free.',
    'uncommon',
    ['economic', 'political'],
    [{
      type: 'reduce_cost',
      target: { cardType: 'industry' },
      value: 999
    }]
  ),

  createCard(
    'E5',
    'Golden Age',
    'event',
    { gold: 8, technology: 2 },
    'Double all production this turn.',
    'legendary',
    ['industrial', 'economic'],
    [{
      type: 'multiply_resource',
      target: { cardType: 'industry' },
      value: 2
    }]
  ),

  createCard(
    'E6',
    'Emergency Powers',
    'event',
    { gold: 5 },
    'Play an additional card this turn.',
    'rare',
    ['political'],
    [{
      type: 'card_interaction',
      target: { cardType: 'industry' },
      value: 1
    }]
  )
];
