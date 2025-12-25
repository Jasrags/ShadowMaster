/**
 * Minimal ruleset data for testing
 * 
 * Provides simplified ruleset data that can be used in tests
 * without loading the full SR5 ruleset.
 */

import type { Edition, Book, MergedRuleset } from '@/lib/types';

/**
 * Minimal edition data for testing
 */
export function createMockEdition(overrides?: Partial<Edition>): Edition {
  return {
    id: 'sr5',
    name: 'Shadowrun 5th Edition',
    shortCode: 'sr5',
    version: '1.0.0',
    description: 'Test edition',
    releaseYear: 2013,
    bookIds: ['core-rulebook'],
    creationMethodIds: ['priority'],
    defaultCreationMethodId: 'priority',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Minimal book data for testing
 */
export function createMockBook(overrides?: Partial<Book>): Book {
  return {
    id: 'core-rulebook',
    editionId: 'sr5',
    title: 'Core Rulebook',
    isCore: true,
    categories: ['core'],
    payloadRef: 'data/editions/sr5/core-rulebook.json',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Minimal merged ruleset for testing
 */
export function createMockMergedRuleset(overrides?: Partial<MergedRuleset>): MergedRuleset {
  const defaultRuleset: MergedRuleset = {
    snapshotId: 'test-snapshot-id',
    editionId: 'sr5',
    editionCode: 'sr5',
    bookIds: ['core-rulebook'],
    modules: {
      metatypes: {
        metatypes: [
          {
            id: 'human',
            name: 'Human',
            attributes: {
              body: { min: 1, max: 6 },
              agility: { min: 1, max: 6 },
              reaction: { min: 1, max: 6 },
              strength: { min: 1, max: 6 },
              willpower: { min: 1, max: 6 },
              logic: { min: 1, max: 6 },
              intuition: { min: 1, max: 6 },
              charisma: { min: 1, max: 6 },
              edge: { min: 2, max: 7 },
              essence: { base: 6 },
            },
            racialTraits: [],
          },
        ],
      } as unknown as Record<string, unknown>,
      skills: {
        activeSkills: [
          {
            id: 'firearms',
            name: 'Firearms',
            linkedAttribute: 'agility',
            category: 'combat',
            canDefault: true,
          },
        ],
        skillGroups: [
          {
            id: 'acting',
            name: 'Acting',
            skills: ['con', 'impersonation', 'performance'],
          },
        ],
      } as unknown as Record<string, unknown>,
      priorities: {
        levels: ['A', 'B', 'C', 'D', 'E'],
        categories: [
          { id: 'metatype', name: 'Metatype' },
          { id: 'attributes', name: 'Attributes' },
          { id: 'skills', name: 'Skills' },
          { id: 'magic', name: 'Magic/Resonance' },
          { id: 'resources', name: 'Resources' },
        ],
        table: {
          A: { metatype: 'human', attributes: 24, skills: 46, magic: 'mundane', resources: 450000 },
          B: { metatype: 'human', attributes: 20, skills: 36, magic: 'mundane', resources: 275000 },
          C: { metatype: 'human', attributes: 16, skills: 28, magic: 'mundane', resources: 140000 },
          D: { metatype: 'human', attributes: 14, skills: 22, magic: 'mundane', resources: 50000 },
          E: { metatype: 'human', attributes: 12, skills: 18, magic: 'mundane', resources: 6000 },
        },
      } as unknown as Record<string, unknown>,
    },
    createdAt: new Date().toISOString(),
  };

  // Merge overrides
  if (overrides) {
    return {
      ...defaultRuleset,
      ...overrides,
      modules: {
        ...defaultRuleset.modules,
        ...overrides.modules,
      },
    };
  }

  return defaultRuleset;
}

