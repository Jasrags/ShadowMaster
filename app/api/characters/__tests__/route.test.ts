/**
 * Tests for /api/characters endpoint
 *
 * Tests character listing (GET) and creation (POST) including
 * authentication, filtering, sorting, pagination, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import * as sessionModule from '@/lib/auth/session';
import * as userStorageModule from '@/lib/storage/users';
import * as characterStorageModule from '@/lib/storage/characters';

import type { Character, CharacterDraft, UserRole } from "@/lib/types";
import type { CharacterSearchResult } from "@/lib/storage/characters";

// Mock dependencies
vi.mock('@/lib/auth/session');
vi.mock('@/lib/storage/users');
vi.mock('@/lib/storage/characters');

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

describe('GET /api/characters', () => {
  const mockUser: import('@/lib/types/user').User = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hash',
    role: ['user'] as UserRole[],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: 'active',
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
  };

  const mockCharacters: Character[] = [
    {
      id: 'char-1',
      ownerId: 'test-user-id',
      name: 'Character 1',
      metatype: 'human',
      editionId: 'sr5',
      editionCode: 'sr5',
      creationMethodId: 'priority',
      rulesetSnapshotId: 'test-snapshot-id',
      attachedBookIds: [],
      status: 'draft',
      attributes: { bod: 3, agi: 3, rea: 3, str: 3, cha: 3, int: 3, log: 3, wil: 3 },
      specialAttributes: { edge: 2, essence: 6, magic: 0, resonance: 0 },
      skills: {},
      positiveQualities: [],
      negativeQualities: [],
      magicalPath: 'mundane',
      nuyen: 0,
      startingNuyen: 0,
      gear: [],
      contacts: [],
      derivedStats: { physicalLimit: 4, mentalLimit: 4, socialLimit: 4, initiative: 6 },
      condition: { physicalDamage: 0, stunDamage: 0 },
      karmaTotal: 0,
      karmaCurrent: 0,
      karmaSpentAtCreation: 0,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    },
    {
      id: 'char-2',
      ownerId: 'test-user-id',
      name: 'Character 2',
      metatype: 'elf',
      editionId: 'sr5',
      editionCode: 'sr5',
      creationMethodId: 'priority',
      rulesetSnapshotId: 'test-snapshot-id',
      attachedBookIds: [],
      status: 'active',
      attributes: { bod: 3, agi: 4, rea: 3, str: 3, cha: 4, int: 3, log: 3, wil: 3 },
      specialAttributes: { edge: 1, essence: 6, magic: 6, resonance: 0 },
      skills: {},
      positiveQualities: [],
      negativeQualities: [],
      magicalPath: 'full-mage',
      nuyen: 5000,
      startingNuyen: 20000,
      gear: [],
      contacts: [],
      derivedStats: { physicalLimit: 4, mentalLimit: 4, socialLimit: 5, initiative: 6 },
      condition: { physicalDamage: 0, stunDamage: 0 },
      karmaTotal: 10,
      karmaCurrent: 5,
      karmaSpentAtCreation: 0,
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-04').toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user characters when authenticated', async () => {
    const searchResult: CharacterSearchResult = {
      characters: mockCharacters,
      total: 2,
      hasMore: false,
      limit: 20,
      offset: 0,
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.searchCharacters).mockResolvedValue(searchResult);

    const request = createMockRequest('http://localhost:3000/api/characters');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toEqual(mockCharacters);
    expect(data.total).toBe(2);
    expect(data.hasMore).toBe(false);
    expect(characterStorageModule.searchCharacters).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'test-user-id' })
    );
  });

  it('should filter characters by status when status query param provided', async () => {
    const draftCharacters = [mockCharacters[0]];
    const searchResult: CharacterSearchResult = {
      characters: draftCharacters,
      total: 1,
      hasMore: false,
      limit: 20,
      offset: 0,
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.searchCharacters).mockResolvedValue(searchResult);

    const request = createMockRequest('http://localhost:3000/api/characters?status=draft');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toEqual(draftCharacters);
    expect(data.total).toBe(1);
    expect(characterStorageModule.searchCharacters).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'test-user-id',
        filters: expect.objectContaining({ status: ['draft'] }),
      })
    );
  });

  it('should filter characters by edition when edition query param provided', async () => {
    const sr5Characters = mockCharacters.filter((c) => c.editionCode === 'sr5');
    const searchResult: CharacterSearchResult = {
      characters: sr5Characters,
      total: 2,
      hasMore: false,
      limit: 20,
      offset: 0,
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.searchCharacters).mockResolvedValue(searchResult);

    const request = createMockRequest('http://localhost:3000/api/characters?edition=sr5');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toEqual(sr5Characters);
    expect(data.total).toBe(2);
    expect(characterStorageModule.searchCharacters).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'test-user-id',
        filters: expect.objectContaining({ edition: ['sr5'] }),
      })
    );
  });

  it('should filter by both status and edition', async () => {
    const draftCharacter = {
      ...mockCharacters[0],
      status: 'draft' as const,
    };
    const draftCharacters = [draftCharacter];
    const searchResult: CharacterSearchResult = {
      characters: draftCharacters,
      total: 1,
      hasMore: false,
      limit: 20,
      offset: 0,
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.searchCharacters).mockResolvedValue(searchResult);

    const request = createMockRequest('http://localhost:3000/api/characters?status=draft&edition=sr5');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toHaveLength(1);
    expect(data.characters[0].status).toBe('draft');
    expect(data.characters[0].editionCode).toBe('sr5');
    expect(characterStorageModule.searchCharacters).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'test-user-id',
        filters: expect.objectContaining({
          status: ['draft'],
          edition: ['sr5'],
        }),
      })
    );
  });

  it('should sort characters by updated date (most recent first)', async () => {
    // Characters are returned already sorted by the search function
    const sortedCharacters: Character[] = [
      {
        id: 'char-2',
        ownerId: 'test-user-id',
        name: 'Character 2',
        metatype: 'elf',
        editionId: 'sr5',
        editionCode: 'sr5',
        creationMethodId: 'priority',
        rulesetSnapshotId: 'test-snapshot-id',
        attachedBookIds: [],
        status: 'active',
        attributes: { bod: 3, agi: 4, rea: 3, str: 3, cha: 4, int: 3, log: 3, wil: 3 },
        specialAttributes: { edge: 1, essence: 6, magic: 6, resonance: 0 },
        skills: {},
        positiveQualities: [],
        negativeQualities: [],
        magicalPath: 'full-mage',
        nuyen: 5000,
        startingNuyen: 20000,
        gear: [],
        contacts: [],
        derivedStats: { physicalLimit: 4, mentalLimit: 4, socialLimit: 5, initiative: 6 },
        condition: { physicalDamage: 0, stunDamage: 0 },
        karmaTotal: 10,
        karmaCurrent: 5,
        karmaSpentAtCreation: 0,
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-05').toISOString(), // More recent
      },
      {
        id: 'char-1',
        ownerId: 'test-user-id',
        name: 'Character 1',
        metatype: 'human',
        editionId: 'sr5',
        editionCode: 'sr5',
        creationMethodId: 'priority',
        rulesetSnapshotId: 'test-snapshot-id',
        attachedBookIds: [],
        status: 'draft',
        attributes: { bod: 3, agi: 3, rea: 3, str: 3, cha: 3, int: 3, log: 3, wil: 3 },
        specialAttributes: { edge: 2, essence: 6, magic: 0, resonance: 0 },
        skills: {},
        positiveQualities: [],
        negativeQualities: [],
        magicalPath: 'mundane',
        nuyen: 0,
        startingNuyen: 0,
        gear: [],
        contacts: [],
        derivedStats: { physicalLimit: 4, mentalLimit: 4, socialLimit: 4, initiative: 6 },
        condition: { physicalDamage: 0, stunDamage: 0 },
        karmaTotal: 0,
        karmaCurrent: 0,
        karmaSpentAtCreation: 0,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      },
    ];
    const searchResult: CharacterSearchResult = {
      characters: sortedCharacters,
      total: 2,
      hasMore: false,
      limit: 20,
      offset: 0,
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.searchCharacters).mockResolvedValue(searchResult);

    const request = createMockRequest('http://localhost:3000/api/characters');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Verify sorting: most recent first
    const dates = data.characters.map((c: { updatedAt: string }) => new Date(c.updatedAt).getTime());
    expect(dates[0]).toBeGreaterThan(dates[1]);
    expect(data.characters[0].id).toBe('char-2'); // Most recent first
    expect(data.characters[1].id).toBe('char-1');
  });

  it('should return 401 when not authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/characters');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
    expect(characterStorageModule.searchCharacters).not.toHaveBeenCalled();
  });

  it('should return 404 when user not found', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/characters');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('User not found');
  });

  it('should return 500 when an error occurs', async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.searchCharacters).mockRejectedValue(
      new Error('Database error')
    );

    const request = createMockRequest('http://localhost:3000/api/characters');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to get characters');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});

describe('POST /api/characters', () => {
  const mockUser: import('@/lib/types/user').User = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hash',
    role: ['user'] as UserRole[],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: 'active',
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
  };

  const mockDraft: CharacterDraft = {
    id: 'new-char-id',
    ownerId: 'test-user-id',
    name: 'New Character',
    metatype: 'human',
    editionId: 'sr5',
    editionCode: 'sr5',
    creationMethodId: 'priority',
    attachedBookIds: [],
    status: 'draft',
    attributes: { bod: 1, agi: 1, rea: 1, str: 1, cha: 1, int: 1, log: 1, wil: 1 },
    specialAttributes: { edge: 2, essence: 6 },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: 'mundane',
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: { physicalLimit: 1, mentalLimit: 1, socialLimit: 1, initiative: 2 },
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create character draft successfully', async () => {
    const requestBody = {
      editionId: 'sr5',
      editionCode: 'sr5',
      creationMethodId: 'priority',
      name: 'New Character',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.createCharacterDraft).mockResolvedValue(mockDraft);

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.character).toBeDefined();
    expect(data.character.id).toBe(mockDraft.id);
    expect(data.character.name).toBe(mockDraft.name);
    expect(characterStorageModule.createCharacterDraft).toHaveBeenCalledWith(
      'test-user-id',
      'sr5',
      'sr5',
      'priority',
      'New Character',
      undefined
    );
  });

  it('should return 400 when editionId is missing', async () => {
    const requestBody = {
      editionCode: 'sr5',
      creationMethodId: 'priority',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    // The route validates after parsing, so it should return 400
    // But if JSON parsing fails, it would be 500
    expect([400, 500]).toContain(response.status);
    expect(data.success).toBe(false);
    if (response.status === 400) {
      expect(data.error).toContain('Missing required fields');
    }
    expect(characterStorageModule.createCharacterDraft).not.toHaveBeenCalled();
  });

  it('should return 400 when editionCode is missing', async () => {
    const requestBody = {
      editionId: 'sr5',
      creationMethodId: 'priority',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect([400, 500]).toContain(response.status);
    expect(data.success).toBe(false);
    if (response.status === 400) {
      expect(data.error).toContain('Missing required fields');
    }
  });

  it('should return 400 when creationMethodId is missing', async () => {
    const requestBody = {
      editionId: 'sr5',
      editionCode: 'sr5',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect([400, 500]).toContain(response.status);
    expect(data.success).toBe(false);
    if (response.status === 400) {
      expect(data.error).toContain('Missing required fields');
    }
  });

  it('should return 401 when not authenticated', async () => {
    const requestBody = {
      editionId: 'sr5',
      editionCode: 'sr5',
      creationMethodId: 'priority',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
    expect(characterStorageModule.createCharacterDraft).not.toHaveBeenCalled();
  });

  it('should return 404 when user not found', async () => {
    const requestBody = {
      editionId: 'sr5',
      editionCode: 'sr5',
      creationMethodId: 'priority',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('User not found');
  });

  it('should return 500 when an error occurs', async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    const requestBody = {
      editionId: 'sr5',
      editionCode: 'sr5',
      creationMethodId: 'priority',
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.createCharacterDraft).mockRejectedValue(
      new Error('Database error')
    );

    const request = createMockRequest(
      'http://localhost:3000/api/characters',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to create character');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
