/**
 * Tests for /api/characters/[characterId]/training endpoints
 *
 * Tests GET (list training) and POST (manage training) endpoints
 * including authentication, validation, and training management operations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/characters/[characterId]/training/[trainingId]/route';
import { GET as GET_TRAINING } from '@/app/api/characters/[characterId]/training/route';
import { NextRequest } from 'next/server';
import * as sessionModule from '@/lib/auth/session';
import * as userStorageModule from '@/lib/storage/users';
import * as characterStorageModule from '@/lib/storage/characters';
import * as advancementModule from '@/lib/rules/advancement';
import * as completionModule from '@/lib/rules/advancement/completion';

import type { Character, TrainingPeriod, AdvancementRecord } from '@/lib/types';
import { createMockCharacter, createMockUser } from '@/__tests__/mocks/storage';

// Mock dependencies
vi.mock('@/lib/auth/session');
vi.mock('@/lib/storage/users');
vi.mock('@/lib/storage/characters');
vi.mock('@/lib/rules/advancement');
vi.mock('@/lib/rules/advancement/completion');

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = 'GET'): NextRequest {
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

describe('GET /api/characters/[characterId]/training', () => {
  const userId = 'test-user-id';
  const characterId = 'test-character-id';
  let mockCharacter: Character;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: 'active',
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(createMockUser({
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
    }));
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
  });

  it('should return active and completed training', async () => {
    const activeTraining: TrainingPeriod[] = [
      {
        id: 'training-1',
        advancementRecordId: 'advancement-1',
        type: 'attribute',
        targetId: 'body',
        targetName: 'Body',
        requiredTime: 28,
        timeSpent: 7,
        startDate: new Date().toISOString(),
        status: 'in-progress',
        createdAt: new Date().toISOString(),
      },
    ];

    const completedTraining = [
      {
        advancementRecord: {
          id: 'advancement-2',
          type: 'skill' as const,
          targetId: 'firearms',
          targetName: 'Firearms',
          previousValue: 2,
          newValue: 3,
          karmaCost: 6,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: 'completed' as const,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          gmApproved: false,
        },
      },
    ];

    vi.mocked(completionModule.getActiveTraining).mockReturnValue(activeTraining);
    vi.mocked(completionModule.getCompletedTraining).mockReturnValue(completedTraining);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training`,
      undefined,
      'GET'
    );

    const response = await GET_TRAINING(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.activeTraining).toEqual(activeTraining);
    expect(data.completedTraining).toEqual(completedTraining);
  });

  it('should return 401 when not authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training`,
      undefined,
      'GET'
    );

    const response = await GET_TRAINING(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 when character not found', async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training`,
      undefined,
      'GET'
    );

    const response = await GET_TRAINING(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Character not found');
  });
});

describe('POST /api/characters/[characterId]/training/[trainingId]', () => {
  const userId = 'test-user-id';
  const characterId = 'test-character-id';
  const trainingId = 'training-1';
  let mockCharacter: Character;
  let mockTrainingPeriod: TrainingPeriod;
  let mockAdvancementRecord: AdvancementRecord;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAdvancementRecord = {
      id: 'advancement-1',
      type: 'attribute',
      targetId: 'body',
      targetName: 'Body',
      previousValue: 3,
      newValue: 4,
      karmaCost: 20,
      karmaSpentAt: new Date().toISOString(),
      trainingRequired: true,
      trainingStatus: 'pending',
      trainingPeriodId: trainingId,
      createdAt: new Date().toISOString(),
      gmApproved: false,
    };

    mockTrainingPeriod = {
      id: trainingId,
      advancementRecordId: mockAdvancementRecord.id,
      type: 'attribute',
      targetId: 'body',
      targetName: 'Body',
      requiredTime: 28,
      timeSpent: 0,
      startDate: new Date().toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: 'active',
      attributes: { body: 3 },
      advancementHistory: [mockAdvancementRecord],
      activeTraining: [mockTrainingPeriod],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(createMockUser({
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
    }));
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
  });

  it('should complete training successfully', async () => {
    const completedTrainingPeriod: TrainingPeriod = {
      ...mockTrainingPeriod,
      status: 'completed',
      actualCompletionDate: new Date().toISOString(),
    };

    const completedAdvancementRecord: AdvancementRecord = {
      ...mockAdvancementRecord,
      trainingStatus: 'completed',
      completedAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      attributes: { body: 4 },
      advancementHistory: [completedAdvancementRecord],
      activeTraining: [],
    };

    vi.mocked(advancementModule.completeTraining).mockReturnValue({
      updatedCharacter,
      completedTrainingPeriod,
      completedAdvancementRecord,
    });

    vi.mocked(characterStorageModule.updateAdvancementRecord).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.removeTrainingPeriod).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      { action: 'complete' },
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.character).toBeDefined();
    expect(data.completedTrainingPeriod).toBeDefined();
    expect(data.completedAdvancementRecord).toBeDefined();
    expect(data.character.attributes.body).toBe(4); // Attribute updated
  });

  it('should interrupt training successfully', async () => {
    const interruptedTrainingPeriod: TrainingPeriod = {
      ...mockTrainingPeriod,
      status: 'interrupted',
      interruptionDate: new Date().toISOString(),
      interruptionReason: 'Emergency',
    };

    const updatedAdvancementRecord: AdvancementRecord = {
      ...mockAdvancementRecord,
      trainingStatus: 'interrupted',
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      advancementHistory: [updatedAdvancementRecord],
      activeTraining: [interruptedTrainingPeriod],
    };

    vi.mocked(advancementModule.interruptTraining).mockReturnValue({
      updatedCharacter,
      interruptedTrainingPeriod,
      updatedAdvancementRecord,
    });

    vi.mocked(characterStorageModule.updateTrainingPeriod).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.updateAdvancementRecord).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      { action: 'interrupt', reason: 'Emergency' },
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.interruptedTrainingPeriod).toBeDefined();
    expect(data.interruptedTrainingPeriod.status).toBe('interrupted');
  });

  it('should resume training successfully', async () => {
    const interruptedTrainingPeriod: TrainingPeriod = {
      ...mockTrainingPeriod,
      status: 'interrupted',
      interruptionDate: new Date().toISOString(),
    };

    const resumedTrainingPeriod: TrainingPeriod = {
      ...interruptedTrainingPeriod,
      status: 'in-progress',
    };

    const updatedAdvancementRecord: AdvancementRecord = {
      ...mockAdvancementRecord,
      trainingStatus: 'in-progress',
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      advancementHistory: [updatedAdvancementRecord],
      activeTraining: [resumedTrainingPeriod],
    };

    vi.mocked(advancementModule.resumeTraining).mockReturnValue({
      updatedCharacter,
      resumedTrainingPeriod,
      updatedAdvancementRecord,
    });

    vi.mocked(characterStorageModule.updateTrainingPeriod).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.updateAdvancementRecord).mockResolvedValue(updatedCharacter);
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      { action: 'resume' },
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.resumedTrainingPeriod).toBeDefined();
    expect(data.resumedTrainingPeriod.status).toBe('in-progress');
  });

  it('should return 401 when not authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      { action: 'complete' },
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when action is missing', async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      {},
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing or invalid action');
  });

  it('should return 400 when action is invalid', async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      { action: 'invalid-action' },
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid action');
  });

  it('should return 400 when training operation fails', async () => {
    vi.mocked(advancementModule.completeTraining).mockImplementation(() => {
      throw new Error('Training period not found');
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/training/${trainingId}`,
      { action: 'complete' },
      'POST'
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, trainingId }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Training period not found');
  });
});

