/**
 * Tests for /api/characters/[characterId]/advancement/skills endpoint
 *
 * Tests skill advancement including authentication, validation,
 * karma spending, and advancement record creation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../skills/route';
import { NextRequest } from 'next/server';
import * as sessionModule from '@/lib/auth/session';
import * as userStorageModule from '@/lib/storage/users';
import * as characterStorageModule from '@/lib/storage/characters';
import * as rulesModule from '@/lib/rules/merge';
import * as advancementModule from '@/lib/rules/advancement/skills';

import type { Character, MergedRuleset } from '@/lib/types';
import { createMockCharacter, createMockUser } from '@/__tests__/mocks/storage';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';

// Mock dependencies
vi.mock('@/lib/auth/session');
vi.mock('@/lib/storage/users');
vi.mock('@/lib/storage/characters');
vi.mock('@/lib/rules/merge');
vi.mock('@/lib/rules/advancement/skills');

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = 'POST'): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  });

  // Mock json() method if body is provided
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

describe('POST /api/characters/[characterId]/advancement/skills', () => {
  const userId = 'test-user-id';
  const characterId = 'test-character-id';
  let mockCharacter: Character;
  let mockRuleset: MergedRuleset;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: 'active',
      karmaCurrent: 50,
      skills: {
        firearms: 3,
        pistols: 2,
      },
    });

    mockRuleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        skills: {
          firearms: {
            id: 'firearms',
            name: 'Firearms',
            linkedAttribute: 'agility',
            group: 'combat',
            canDefault: true,
          },
        },
      },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(createMockUser({
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
    }));
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
  });

  it('should successfully advance a skill', async () => {
    const requestBody = {
      skillId: 'firearms',
      newRating: 4,
    };

    const mockAdvancementResult = {
      advancementRecord: {
        id: 'advancement-1',
        type: 'skill' as const,
        targetId: 'firearms',
        targetName: 'Firearms',
        previousValue: 3,
        newValue: 4,
        karmaCost: 8,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        gmApproved: false,
      },
      trainingPeriod: {
        id: 'training-1',
        advancementRecordId: 'advancement-1',
        type: 'skill' as const,
        targetId: 'firearms',
        targetName: 'Firearms',
        requiredTime: 4,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        expectedCompletionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      },
      updatedCharacter: {
        ...mockCharacter,
        karmaCurrent: 42,
        advancementHistory: [],
        activeTraining: [],
      },
    };

    vi.mocked(advancementModule.advanceSkill).mockReturnValue(mockAdvancementResult);
    vi.mocked(characterStorageModule.addAdvancementRecord).mockResolvedValue({
      ...mockCharacter,
      karmaCurrent: 42,
      advancementHistory: [mockAdvancementResult.advancementRecord],
      activeTraining: [mockAdvancementResult.trainingPeriod],
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      requestBody,
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.character).toBeDefined();
    expect(data.advancementRecord).toBeDefined();
    expect(data.trainingPeriod).toBeDefined();
    expect(data.cost).toBe(8);

    expect(advancementModule.advanceSkill).toHaveBeenCalledWith(
      mockCharacter,
      'firearms',
      4,
      mockRuleset,
      expect.any(Object)
    );
  });

  it('should return 401 when not authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      { skillId: 'firearms', newRating: 4 },
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 when character not found', async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      { skillId: 'firearms', newRating: 4 },
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Character not found');
  });

  it('should return 400 when character is draft', async () => {
    const draftCharacter = createMockCharacter({
      ...mockCharacter,
      status: 'draft',
    });
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(draftCharacter);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      { skillId: 'firearms', newRating: 4 },
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Cannot advance skills during character creation');
  });

  it('should return 400 when skillId is missing', async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      { newRating: 4 },
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing or invalid skillId');
  });

  it('should return 400 when newRating is invalid', async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      { skillId: 'firearms', newRating: 0 },
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing or invalid newRating');
  });

  it('should return 400 when advancement validation fails', async () => {
    vi.mocked(advancementModule.advanceSkill).mockImplementation(() => {
      throw new Error('Cannot advance skill: Not enough karma');
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      { skillId: 'firearms', newRating: 4 },
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Cannot advance skill');
  });

  it('should support optional advancement options', async () => {
    const requestBody = {
      skillId: 'firearms',
      newRating: 4,
      downtimePeriodId: 'downtime-123',
      instructorBonus: true,
      notes: 'Training at shooting range',
    };

    const mockAdvancementResult = {
      advancementRecord: {
        id: 'advancement-1',
        type: 'skill' as const,
        targetId: 'firearms',
        targetName: 'Firearms',
        previousValue: 3,
        newValue: 4,
        karmaCost: 8,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: 'pending' as const,
        downtimePeriodId: 'downtime-123',
        createdAt: new Date().toISOString(),
        gmApproved: false,
        notes: 'Training at shooting range',
      },
      trainingPeriod: {
        id: 'training-1',
        advancementRecordId: 'advancement-1',
        type: 'skill' as const,
        targetId: 'firearms',
        targetName: 'Firearms',
        requiredTime: 3,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: 'pending' as const,
        downtimePeriodId: 'downtime-123',
        instructorBonus: true,
        createdAt: new Date().toISOString(),
      },
      updatedCharacter: {
        ...mockCharacter,
        karmaCurrent: 42,
        advancementHistory: [],
        activeTraining: [],
      },
    };

    vi.mocked(advancementModule.advanceSkill).mockReturnValue(mockAdvancementResult);
    vi.mocked(characterStorageModule.addAdvancementRecord).mockResolvedValue({
      ...mockCharacter,
      karmaCurrent: 42,
      advancementHistory: [mockAdvancementResult.advancementRecord],
      activeTraining: [mockAdvancementResult.trainingPeriod],
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/advancement/skills`,
      requestBody,
      'POST'
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    expect(advancementModule.advanceSkill).toHaveBeenCalledWith(
      mockCharacter,
      'firearms',
      4,
      mockRuleset,
      expect.objectContaining({
        downtimePeriodId: 'downtime-123',
        instructorBonus: true,
        notes: 'Training at shooting range',
      })
    );
  });
});

