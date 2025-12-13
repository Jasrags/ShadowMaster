/**
 * Tests for /api/rulesets/[editionCode] endpoint
 * 
 * Tests ruleset loading including edition validation, book filtering,
 * and extracted data formatting.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';
import * as mergeModule from '@/lib/rules/merge';
import * as loaderModule from '@/lib/rules/loader';

// Mock dependencies
vi.mock('@/lib/rules/merge');
vi.mock('@/lib/rules/loader');

describe('GET /api/rulesets/[editionCode]', () => {
  const mockMergedRuleset = {
    snapshotId: 'test-snapshot-id',
    editionId: 'sr5',
    editionCode: 'sr5',
    bookIds: ['core-rulebook'],
    modules: {
      metatypes: {
        human: { id: 'human', name: 'Human' },
      },
      skills: {
        firearms: { id: 'firearms', name: 'Firearms' },
      },
    },
    createdAt: new Date().toISOString(),
  };

  const mockLoadedRuleset = {
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
        loadOrder: 0,
        payload: {
          meta: { title: 'Core Rulebook', category: 'core' },
          modules: {
            metatypes: {
              payload: { human: { id: 'human', name: 'Human' } },
            },
          },
        },
      },
    ],
    creationMethods: [
      {
        id: 'priority',
        name: 'Priority',
        editionId: 'sr5',
      },
    ],
  };

  const mockExtractedData = {
    metatypes: [{ id: 'human', name: 'Human' }],
    skills: { firearms: { id: 'firearms', name: 'Firearms' } },
    qualities: { positive: [], negative: [] },
    priorityTable: {
      levels: ['A', 'B', 'C', 'D', 'E'],
      categories: [{ id: 'metatype', name: 'Metatype' }],
      table: { A: { metatype: 'human', attributes: 24 } },
    },
    magicPaths: [],
    lifestyles: [],
    lifestyleModifiers: {},
    gear: null,
    spells: null,
    complexForms: [],
    spriteTypes: [],
    spritePowers: [],
    cyberware: null,
    bioware: null,
    augmentationRules: {},
    contactTemplates: [],
    adeptPowers: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return merged ruleset for valid edition', async () => {
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockLoadedRuleset,
    });
    vi.mocked(loaderModule.extractMetatypes).mockReturnValue(mockExtractedData.metatypes);
    vi.mocked(loaderModule.extractSkills).mockReturnValue(mockExtractedData.skills);
    vi.mocked(loaderModule.extractQualities).mockReturnValue(mockExtractedData.qualities);
    vi.mocked(loaderModule.extractPriorityTable).mockReturnValue(mockExtractedData.priorityTable);
    vi.mocked(loaderModule.extractMagicPaths).mockReturnValue(mockExtractedData.magicPaths);
    vi.mocked(loaderModule.extractLifestyles).mockReturnValue(mockExtractedData.lifestyles);
    vi.mocked(loaderModule.extractLifestyleModifiers).mockReturnValue(
      mockExtractedData.lifestyleModifiers
    );
    vi.mocked(loaderModule.extractGear).mockReturnValue(mockExtractedData.gear);
    vi.mocked(loaderModule.extractSpells).mockReturnValue(mockExtractedData.spells);
    vi.mocked(loaderModule.extractComplexForms).mockReturnValue(mockExtractedData.complexForms);
    vi.mocked(loaderModule.extractSpriteTypes).mockReturnValue(mockExtractedData.spriteTypes);
    vi.mocked(loaderModule.extractSpritePowers).mockReturnValue(mockExtractedData.spritePowers);
    vi.mocked(loaderModule.extractCyberware).mockReturnValue(mockExtractedData.cyberware);
    vi.mocked(loaderModule.extractBioware).mockReturnValue(mockExtractedData.bioware);
    vi.mocked(loaderModule.extractAugmentationRules).mockReturnValue(
      mockExtractedData.augmentationRules
    );
    vi.mocked(loaderModule.extractContactTemplates).mockReturnValue(
      mockExtractedData.contactTemplates
    );
    vi.mocked(loaderModule.extractAdeptPowers).mockReturnValue(mockExtractedData.adeptPowers);

    const request = new NextRequest('http://localhost:3000/api/rulesets/sr5');
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'sr5' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.ruleset).toBeDefined();
    expect(data.ruleset.snapshotId).toBe(mockMergedRuleset.snapshotId);
    expect(data.ruleset.editionCode).toBe('sr5');
    expect(data.creationMethods).toBeDefined();
    expect(data.creationMethods).toHaveLength(1);
    expect(data.extractedData).toBeDefined();
    expect(data.extractedData.metatypes).toBeDefined();
    expect(data.extractedData.skills).toBeDefined();

    expect(mergeModule.loadAndMergeRuleset).toHaveBeenCalledWith('sr5', undefined);
    expect(loaderModule.loadRuleset).toHaveBeenCalledWith({
      editionCode: 'sr5',
      bookIds: undefined,
    });
  });

  it('should filter books when bookIds query param provided', async () => {
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockLoadedRuleset,
    });
    // Mock all extract functions
    vi.mocked(loaderModule.extractMetatypes).mockReturnValue([]);
    vi.mocked(loaderModule.extractSkills).mockReturnValue({});
    vi.mocked(loaderModule.extractQualities).mockReturnValue({ positive: [], negative: [] });
    vi.mocked(loaderModule.extractPriorityTable).mockReturnValue(null);
    vi.mocked(loaderModule.extractMagicPaths).mockReturnValue([]);
    vi.mocked(loaderModule.extractLifestyles).mockReturnValue([]);
    vi.mocked(loaderModule.extractLifestyleModifiers).mockReturnValue({});
    vi.mocked(loaderModule.extractGear).mockReturnValue(null);
    vi.mocked(loaderModule.extractSpells).mockReturnValue(null);
    vi.mocked(loaderModule.extractComplexForms).mockReturnValue([]);
    vi.mocked(loaderModule.extractSpriteTypes).mockReturnValue([]);
    vi.mocked(loaderModule.extractSpritePowers).mockReturnValue([]);
    vi.mocked(loaderModule.extractCyberware).mockReturnValue(null);
    vi.mocked(loaderModule.extractBioware).mockReturnValue(null);
    vi.mocked(loaderModule.extractAugmentationRules).mockReturnValue({});
    vi.mocked(loaderModule.extractContactTemplates).mockReturnValue([]);
    vi.mocked(loaderModule.extractAdeptPowers).mockReturnValue([]);

    const request = new NextRequest(
      'http://localhost:3000/api/rulesets/sr5?bookIds=core-rulebook,sourcebook'
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'sr5' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mergeModule.loadAndMergeRuleset).toHaveBeenCalledWith('sr5', [
      'core-rulebook',
      'sourcebook',
    ]);
    expect(loaderModule.loadRuleset).toHaveBeenCalledWith({
      editionCode: 'sr5',
      bookIds: ['core-rulebook', 'sourcebook'],
    });
  });

  it('should return 500 when ruleset loading fails', async () => {
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: false,
      error: 'Edition not found',
    });

    const request = new NextRequest('http://localhost:3000/api/rulesets/invalid');
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'invalid' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Edition not found');
  });

  it('should return 500 when merge fails', async () => {
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: false,
      error: 'Merge error',
    });

    const request = new NextRequest('http://localhost:3000/api/rulesets/sr5');
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'sr5' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Merge error');
  });

  it('should return 500 when ruleset is null after merge', async () => {
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: undefined,
    });

    const request = new NextRequest('http://localhost:3000/api/rulesets/sr5');
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'sr5' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to load ruleset');
  });

  it('should handle empty bookIds query param', async () => {
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockLoadedRuleset,
    });
    // Mock all extract functions
    vi.mocked(loaderModule.extractMetatypes).mockReturnValue([]);
    vi.mocked(loaderModule.extractSkills).mockReturnValue({});
    vi.mocked(loaderModule.extractQualities).mockReturnValue({ positive: [], negative: [] });
    vi.mocked(loaderModule.extractPriorityTable).mockReturnValue(null);
    vi.mocked(loaderModule.extractMagicPaths).mockReturnValue([]);
    vi.mocked(loaderModule.extractLifestyles).mockReturnValue([]);
    vi.mocked(loaderModule.extractLifestyleModifiers).mockReturnValue({});
    vi.mocked(loaderModule.extractGear).mockReturnValue(null);
    vi.mocked(loaderModule.extractSpells).mockReturnValue(null);
    vi.mocked(loaderModule.extractComplexForms).mockReturnValue([]);
    vi.mocked(loaderModule.extractSpriteTypes).mockReturnValue([]);
    vi.mocked(loaderModule.extractSpritePowers).mockReturnValue([]);
    vi.mocked(loaderModule.extractCyberware).mockReturnValue(null);
    vi.mocked(loaderModule.extractBioware).mockReturnValue(null);
    vi.mocked(loaderModule.extractAugmentationRules).mockReturnValue({});
    vi.mocked(loaderModule.extractContactTemplates).mockReturnValue([]);
    vi.mocked(loaderModule.extractAdeptPowers).mockReturnValue([]);

    const request = new NextRequest('http://localhost:3000/api/rulesets/sr5?bookIds=');
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'sr5' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Empty string split by comma and filtered returns empty array, not undefined
    expect(mergeModule.loadAndMergeRuleset).toHaveBeenCalledWith('sr5', []);
  });

  it('should return 500 when an error occurs', async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(mergeModule.loadAndMergeRuleset).mockRejectedValue(
      new Error('Unexpected error')
    );

    const request = new NextRequest('http://localhost:3000/api/rulesets/sr5');
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: 'sr5' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to load ruleset');
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
