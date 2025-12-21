/**
 * Tests for /api/characters/[characterId]/advancement/edge endpoint
 *
 * Tests Edge advancement including authentication, validation,
 * karma spending, and advancement record creation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../edge/route';
import { NextRequest } from 'next/server';
import * as sessionModule from '@/lib/auth/session';
import * as userStorageModule from '@/lib/storage/users';
import * as characterStorageModule from '@/lib/storage/characters';
import * as rulesModule from '@/lib/rules/merge';
import * as advancementModule from '@/lib/rules/advancement/edge';

import type { Character, MergedRuleset, AdvancementRecord } from '@/lib/types';
import { createMockCharacter } from '@/__tests__/mocks/storage';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';

// Mock dependencies
vi.mock('@/lib/auth/session');
vi.mock('@/lib/storage/users');
vi.mock('@/lib/storage/characters');
vi.mock('@/lib/rules/merge');
vi.mock('@/lib/rules/advancement/edge');

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

describe('POST /api/characters/[characterId]/advancement/edge', () => {
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
      specialAttributes: {
        edge: 2,
        essence: 6,
      },
    });

    mockRuleset = createMockMergedRuleset();

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue({
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'hash',
      role: ['user'],
      createdAt: new Date().toISOString(),
      lastLogin: null,
      characters: [],
    });
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
  });

  it('should successfully advance Edge', async () => {
    const mockAdvancementRecord: AdvancementRecord = {
      id: 'advancement-1',
      type: 'edge',
      targetId: 'edge',
      targetName: 'Edge',
      previousValue: 2,
      newValue: 3,
      karmaCost: 15,
      karmaSpentAt: new Date().toISOString(),
      trainingRequired: false,
      trainingStatus: 'completed',
      gmApproved: false,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      karmaCurrent: 35,
      specialAttributes: {
        ...mockCharacter.specialAttributes,
        edge: 3,
      },
      advancementHistory: [mockAdvancementRecord],
    };

    vi.mocked(advancementModule.advanceEdge).mockReturnValue({
      advancementRecord: mockAdvancementRecord,
      updatedCharacter,
    });

    vi.mocked(characterStorageModule.addAdvancementRecord).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.character.specialAttributes?.edge).toBe(3);
    expect(data.advancementRecord).toEqual(mockAdvancementRecord);
    expect(data.cost).toBe(15);

    expect(advancementModule.advanceEdge).toHaveBeenCalledWith(
      mockCharacter,
      3,
      mockRuleset,
      expect.objectContaining({
        campaignSessionId: undefined,
        gmApproved: undefined,
        notes: undefined,
      })
    );
    expect(characterStorageModule.addAdvancementRecord).toHaveBeenCalled();
    expect(characterStorageModule.updateCharacter).toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 if user is not found', async () => {
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('User not found');
  });

  it('should return 404 if character is not found', async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Character not found');
  });

  it('should return 400 if character is draft', async () => {
    const draftCharacter = {
      ...mockCharacter,
      status: 'draft' as const,
    };
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(draftCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Cannot advance Edge during character creation');
  });

  it('should return 400 if newRating is missing', async () => {
    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {});

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('newRating');
  });

  it('should return 400 if newRating is invalid', async () => {
    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 0,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('newRating');
  });

  it('should return 500 if ruleset loading fails', async () => {
    vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
      success: false,
      error: 'Failed to load ruleset',
    });

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to load ruleset');
  });

  it('should return 400 if advancement validation fails', async () => {
    vi.mocked(advancementModule.advanceEdge).mockImplementation(() => {
      throw new Error('Cannot advance Edge: Not enough karma');
    });

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 10, // Too high, will fail validation
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Cannot advance Edge');
  });

  it('should handle options (campaignSessionId, gmApproved, notes)', async () => {
    const mockAdvancementRecord: AdvancementRecord = {
      id: 'advancement-1',
      type: 'edge',
      targetId: 'edge',
      targetName: 'Edge',
      previousValue: 2,
      newValue: 3,
      karmaCost: 15,
      karmaSpentAt: new Date().toISOString(),
      trainingRequired: false,
      trainingStatus: 'completed',
      gmApproved: true,
      campaignSessionId: 'session-123',
      notes: 'GM approved',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      karmaCurrent: 35,
      specialAttributes: {
        ...mockCharacter.specialAttributes,
        edge: 3,
      },
      advancementHistory: [mockAdvancementRecord],
    };

    vi.mocked(advancementModule.advanceEdge).mockReturnValue({
      advancementRecord: mockAdvancementRecord,
      updatedCharacter,
    });

    vi.mocked(characterStorageModule.addAdvancementRecord).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/advancement/edge`, {
      newRating: 3,
      campaignSessionId: 'session-123',
      gmApproved: true,
      notes: 'GM approved',
    });

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(200);
    expect(advancementModule.advanceEdge).toHaveBeenCalledWith(
      mockCharacter,
      3,
      mockRuleset,
      expect.objectContaining({
        campaignSessionId: 'session-123',
        gmApproved: true,
        notes: 'GM approved',
      })
    );
  });
});

