/**
 * Tests for ruleset merging engine
 * 
 * Tests all merge strategies, edge cases, and the produceMergedRuleset function.
 */

import { describe, it, expect } from 'vitest';
import { mergeRules, produceMergedRuleset, getModule, hasModule, getModuleTypes } from '../merge';
import type { MergeStrategy } from '@/lib/types';
import type { LoadedRuleset } from '../loader';

describe('mergeRules', () => {
  describe('replace strategy', () => {
    it('should completely replace base with override', () => {
      const base = { a: 1, b: 2, c: 3 };
      const override = { a: 10, d: 4 };
      const result = mergeRules(base, override, 'replace');
      
      expect(result).toEqual({ a: 10, d: 4 });
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('c');
    });

    it('should replace nested objects completely', () => {
      const base = { nested: { a: 1, b: 2 }, other: 'value' };
      const override = { nested: { c: 3 } };
      const result = mergeRules(base, override, 'replace');
      
      // Replace strategy only includes keys from override
      expect(result).toEqual({ nested: { c: 3 } });
      expect(result.nested).not.toHaveProperty('a');
      expect(result.nested).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('other');
    });

    it('should replace arrays completely', () => {
      const base = { items: [1, 2, 3] };
      const override = { items: [4, 5] };
      const result = mergeRules(base, override, 'replace');
      
      expect(result).toEqual({ items: [4, 5] });
    });
  });

  describe('merge strategy', () => {
    it('should deep merge nested objects', () => {
      const base = { 
        nested: { a: 1, b: 2, deep: { x: 10 } },
        other: 'preserved'
      };
      const override = { 
        nested: { b: 20, c: 3, deep: { y: 20 } }
      };
      const result = mergeRules(base, override, 'merge');
      
      expect(result).toEqual({
        nested: { a: 1, b: 20, c: 3, deep: { x: 10, y: 20 } },
        other: 'preserved'
      });
    });

    it('should merge arrays by ID when items have IDs', () => {
      const base = {
        items: [
          { id: '1', value: 'a', extra: 'base' },
          { id: '2', value: 'b' }
        ]
      };
      const override = {
        items: [
          { id: '1', value: 'A' }, // Should merge with existing
          { id: '3', value: 'c' }  // Should append
        ]
      };
      const result = mergeRules(base, override, 'merge');
      
      expect(result.items).toHaveLength(3);
      expect((result.items as Array<{ id: string; value: string; extra?: string }>).find((i) => i.id === '1')).toEqual({ 
        id: '1', 
        value: 'A', 
        extra: 'base' // Preserved from base
      });
      expect((result.items as Array<{ id: string; value: string }>).find((i) => i.id === '2')).toEqual({ 
        id: '2', 
        value: 'b' 
      });
      expect((result.items as Array<{ id: string; value: string }>).find((i) => i.id === '3')).toEqual({ 
        id: '3', 
        value: 'c' 
      });
    });

    it('should append arrays without IDs', () => {
      const base = { items: [1, 2, 3] };
      const override = { items: [4, 5] };
      const result = mergeRules(base, override, 'merge');
      
      expect(result.items).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle null values as explicit removal', () => {
      const base = { a: 1, b: 2, nested: { x: 10 } };
      const override = { b: null, nested: { x: null } };
      const result = mergeRules(base, override, 'merge');
      
      expect(result).toEqual({ a: 1, b: null, nested: { x: null } });
    });

    it('should override scalar values', () => {
      const base = { a: 1, b: 'old', c: true };
      const override = { a: 2, b: 'new', c: false };
      const result = mergeRules(base, override, 'merge');
      
      expect(result).toEqual({ a: 2, b: 'new', c: false });
    });

    it('should handle empty objects', () => {
      const base = {};
      const override = { a: 1 };
      const result = mergeRules(base, override, 'merge');
      
      expect(result).toEqual({ a: 1 });
    });

    it('should handle empty arrays', () => {
      const base = { items: [1, 2] };
      const override = { items: [] };
      const result = mergeRules(base, override, 'merge');
      
      // Empty array in override appends to base (no items to append, so base remains)
      expect(result.items).toEqual([1, 2]);
    });
  });

  describe('append strategy', () => {
    it('should add new keys without overwriting existing scalars', () => {
      const base = { a: 1, b: 2 };
      const override = { b: 20, c: 3 };
      const result = mergeRules(base, override, 'append');
      
      expect(result.a).toBe(1); // Preserved
      expect(result.b).toBe(2); // Preserved (not overwritten)
      expect(result.c).toBe(3); // Added
    });

    it('should append to arrays', () => {
      const base = { items: [1, 2] };
      const override = { items: [3, 4] };
      const result = mergeRules(base, override, 'append');
      
      expect(result.items).toEqual([1, 2, 3, 4]);
    });

    it('should merge arrays by ID when appending', () => {
      const base = {
        items: [
          { id: '1', value: 'a' },
          { id: '2', value: 'b' }
        ]
      };
      const override = {
        items: [
          { id: '1', value: 'A', newProp: 'added' },
          { id: '3', value: 'c' }
        ]
      };
      const result = mergeRules(base, override, 'append');
      
      expect(result.items).toHaveLength(3);
      expect((result.items as Array<{ id: string; value: string; newProp?: string }>).find((i) => i.id === '1')).toEqual({
        id: '1',
        value: 'A',
        newProp: 'added'
      });
      expect((result.items as Array<{ id: string; value: string }>).find((i) => i.id === '3')).toEqual({
        id: '3',
        value: 'c'
      });
    });

    it('should recursively append nested objects', () => {
      const base = { nested: { a: 1 } };
      const override = { nested: { b: 2 } };
      const result = mergeRules(base, override, 'append');
      
      expect(result.nested).toEqual({ a: 1, b: 2 });
    });

    it('should avoid duplicate primitives in arrays', () => {
      const base = { tags: ['a', 'b'] };
      const override = { tags: ['b', 'c'] };
      const result = mergeRules(base, override, 'append');
      
      expect(result.tags).toEqual(['a', 'b', 'c']); // 'b' not duplicated
    });
  });

  describe('remove strategy', () => {
    it('should remove keys when removeSpec is true', () => {
      const base = { a: 1, b: 2, c: 3 };
      const override = { a: true, b: true };
      const result = mergeRules(base, override, 'remove');
      
      expect(result).toEqual({ c: 3 });
      expect(result).not.toHaveProperty('a');
      expect(result).not.toHaveProperty('b');
    });

    it('should remove array items by ID', () => {
      const base = {
        items: [
          { id: '1', value: 'a' },
          { id: '2', value: 'b' },
          { id: '3', value: 'c' }
        ]
      };
      const override = {
        items: [{ id: '2' }, '3'] // Can specify as object with id or string
      };
      const result = mergeRules(base, override, 'remove');
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({ id: '1', value: 'a' });
    });

    it('should remove array items by string ID', () => {
      const base = {
        items: [
          { id: '1', value: 'a' },
          { id: '2', value: 'b' }
        ]
      };
      const override = {
        items: ['1', '2']
      };
      const result = mergeRules(base, override, 'remove');
      
      expect(result.items).toEqual([]);
    });

    it('should recursively remove nested keys', () => {
      const base = {
        nested: { a: 1, b: 2, c: 3 },
        other: 'preserved'
      };
      const override = {
        nested: { a: true, b: true }
      };
      const result = mergeRules(base, override, 'remove');
      
      expect(result).toEqual({
        nested: { c: 3 },
        other: 'preserved'
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined values in override', () => {
      const base = { a: 1, b: 2 };
      const override = { a: undefined, c: 3 };
      const result = mergeRules(base, override, 'merge');
      
      expect(result.a).toBe(1); // Undefined values are ignored
      expect(result.b).toBe(2);
      expect(result.c).toBe(3);
    });

    it('should handle deeply nested structures', () => {
      const base = {
        level1: {
          level2: {
            level3: {
              value: 'deep'
            }
          }
        }
      };
      const override = {
        level1: {
          level2: {
            level3: {
              newValue: 'added'
            }
          }
        }
      };
      const result = mergeRules(base, override, 'merge');
      
      expect(result.level1.level2.level3).toEqual({
        value: 'deep',
        newValue: 'added'
      });
    });

    it('should handle mixed array types', () => {
      const base = {
        mixed: [
          { id: '1', value: 'a' },
          'primitive',
          42
        ]
      };
      const override = {
        mixed: [
          { id: '1', value: 'A' },
          'new-primitive'
        ]
      };
      const result = mergeRules(base, override, 'merge');
      
      // Arrays with mixed types (not all items have IDs) will append, not merge by ID
      // isArrayWithIds requires ALL items to have IDs
      expect(result.mixed.length).toBeGreaterThan(2);
      // The item with id '1' from base should remain, and override items appended
      // Since arrays don't all have IDs, items are appended, so both may exist
      // Since arrays don't all have IDs, items are appended, so both may exist
      expect(result.mixed).toContain('primitive');
      expect(result.mixed).toContain(42);
      expect(result.mixed).toContain('new-primitive');
    });

    it('should preserve object references are not shared (immutability)', () => {
      const base = { nested: { a: 1 } };
      const override = { nested: { b: 2 } };
      const result = mergeRules(base, override, 'merge');
      
      // Result should be a new object, not reference to base
      expect(result).not.toBe(base);
      expect(result.nested).not.toBe(base.nested);
      
      // Modifying result should not affect base
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result.nested as any).c = 3;
      expect(base.nested).not.toHaveProperty('c');
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown merge strategy', () => {
      const base = { a: 1 };
      const override = { b: 2 };
      
      expect(() => {
        mergeRules(base, override, 'unknown-strategy' as MergeStrategy);
      }).toThrow('Unknown merge strategy');
    });
  });
});

describe('produceMergedRuleset', () => {
  it('should produce merged ruleset from single book', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: {
            modules: {
              metatypes: {
                payload: {
                  human: { id: 'human', name: 'Human' },
                  elf: { id: 'elf', name: 'Elf' },
                },
              },
              skills: {
                payload: {
                  firearms: { id: 'firearms', name: 'Firearms' },
                },
              },
            },
          },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    expect(result.ruleset).toBeDefined();
    expect(result.ruleset?.editionId).toBe('sr5');
    expect(result.ruleset?.editionCode).toBe('sr5');
    expect(result.ruleset?.bookIds).toEqual(['core-rulebook']);
    expect(result.ruleset?.snapshotId).toBeDefined();
    expect(result.ruleset?.createdAt).toBeDefined();
    
    // Check modules
    expect(result.ruleset?.modules.metatypes).toBeDefined();
    expect(result.ruleset?.modules.skills).toBeDefined();
  });

  it('should merge multiple books in load order', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook', 'sourcebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: {
            modules: {
              metatypes: {
                payload: {
                  human: { id: 'human', name: 'Human' },
                },
              },
            },
          },
        },
        {
          id: 'sourcebook',
          title: 'Sourcebook',
          isCore: false,
          loadOrder: 2,
          payload: {
            modules: {
              metatypes: {
                payload: {
                  elf: { id: 'elf', name: 'Elf' },
                },
              },
            },
          },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    expect(result.ruleset).toBeDefined();
    
    // Both metatypes should be present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metatypes = result.ruleset?.modules.metatypes as any;
    expect(metatypes.human).toBeDefined();
    expect(metatypes.elf).toBeDefined();
  });

  it('should apply merge strategies from book modules', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook', 'sourcebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: {
            modules: {
              skills: {
                payload: {
                  firearms: { id: 'firearms', name: 'Firearms', rating: 1 },
                },
              },
            },
          },
        },
        {
          id: 'sourcebook',
          title: 'Sourcebook',
          isCore: false,
          loadOrder: 2,
          payload: {
            modules: {
              skills: {
                mergeStrategy: 'merge',
                payload: {
                  firearms: { id: 'firearms', rating: 2 }, // Should merge
                  athletics: { id: 'athletics', name: 'Athletics' }, // Should add
                },
              },
            },
          },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skills = result.ruleset?.modules.skills as any;
    
    // Firearms should be merged (name preserved, rating updated)
    expect(skills.firearms.name).toBe('Firearms');
    expect(skills.firearms.rating).toBe(2);
    
    // Athletics should be added
    expect(skills.athletics).toBeDefined();
    expect(skills.athletics.name).toBe('Athletics');
  });

  it('should handle books with replace strategy', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook', 'sourcebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: {
            modules: {
              skills: {
                payload: {
                  firearms: { id: 'firearms', name: 'Firearms' },
                  athletics: { id: 'athletics', name: 'Athletics' },
                },
              },
            },
          },
        },
        {
          id: 'sourcebook',
          title: 'Sourcebook',
          isCore: false,
          loadOrder: 2,
          payload: {
            modules: {
              skills: {
                mergeStrategy: 'replace',
                payload: {
                  magic: { id: 'magic', name: 'Magic' },
                },
              },
            },
          },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skills = result.ruleset?.modules.skills as any;
    
    // Replace strategy should completely replace
    expect(skills.firearms).toBeUndefined();
    expect(skills.athletics).toBeUndefined();
    expect(skills.magic).toBeDefined();
  });

  it('should sort books by load order', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['book1', 'book2', 'book3'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'book3',
          title: 'Book 3',
          isCore: false,
          loadOrder: 3,
          payload: { modules: {} },
        },
        {
          id: 'book1',
          title: 'Book 1',
          isCore: true,
          loadOrder: 1,
          payload: { modules: {} },
        },
        {
          id: 'book2',
          title: 'Book 2',
          isCore: false,
          loadOrder: 2,
          payload: { modules: {} },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    expect(result.ruleset?.bookIds).toEqual(['book1', 'book2', 'book3']);
  });

  it('should handle empty books gracefully', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: { modules: {} },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    expect(result.ruleset).toBeDefined();
    expect(Object.keys(result.ruleset?.modules || {})).toHaveLength(0);
  });

  it('should make merged ruleset immutable', () => {
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: {
            modules: {
              metatypes: {
                payload: {
                  human: { id: 'human', name: 'Human' },
                },
              },
            },
          },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(true);
    expect(result.ruleset).toBeDefined();
    
    // Should be frozen
    expect(Object.isFrozen(result.ruleset)).toBe(true);
    expect(Object.isFrozen(result.ruleset?.modules)).toBe(true);
    
    // Attempting to modify should throw in strict mode
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result.ruleset as any).newProperty = 'test';
    }).toThrow(); // Object.freeze() throws when trying to add properties
  });

  it('should handle errors gracefully', () => {
    // Create a ruleset that will cause an error (invalid module structure)
    const loadedRuleset: LoadedRuleset = {
      edition: {
        id: 'sr5',
        name: 'Shadowrun 5th Edition',
        shortCode: 'sr5',
        releaseYear: 2013,
        bookIds: ['core-rulebook'],
        creationMethodIds: ['priority'],
        createdAt: new Date().toISOString(),
      },
      books: [
        {
          id: 'core-rulebook',
          title: 'Core Rulebook',
          isCore: true,
          loadOrder: 1,
          payload: {
            modules: {
              metatypes: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                mergeStrategy: 'invalid-strategy' as any,
                payload: {},
              },
            },
          },
        },
      ],
      creationMethods: [],
    };

    const result = produceMergedRuleset(loadedRuleset);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('convenience functions', () => {
  const mockRuleset = {
    snapshotId: 'test-snapshot',
    editionId: 'sr5',
    editionCode: 'sr5',
    bookIds: ['core-rulebook'],
    modules: {
      metatypes: { human: { id: 'human' } },
      skills: { firearms: { id: 'firearms' } },
    },
    createdAt: new Date().toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  describe('getModule', () => {
    it('should retrieve module by type', () => {
      const metatypes = getModule(mockRuleset, 'metatypes');
      expect(metatypes).toEqual({ human: { id: 'human' } });
    });

    it('should return undefined for non-existent module', () => {
      const result = getModule(mockRuleset, 'qualities');
      expect(result).toBeUndefined();
    });
  });

  describe('hasModule', () => {
    it('should return true for existing module', () => {
      expect(hasModule(mockRuleset, 'metatypes')).toBe(true);
      expect(hasModule(mockRuleset, 'skills')).toBe(true);
    });

    it('should return false for non-existent module', () => {
      expect(hasModule(mockRuleset, 'qualities')).toBe(false);
    });
  });

  describe('getModuleTypes', () => {
    it('should return all module types in ruleset', () => {
      const types = getModuleTypes(mockRuleset);
      expect(types).toContain('metatypes');
      expect(types).toContain('skills');
      expect(types.length).toBe(2);
    });
  });
});

