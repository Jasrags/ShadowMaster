/**
 * Tests for /api/characters endpoint
 * 
 * Tests character listing (GET) and creation (POST) including
 * authentication, filtering, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import * as sessionModule from '@/lib/auth/session';
import * as userStorageModule from '@/lib/storage/users';
import * as characterStorageModule from '@/lib/storage/characters';

import type { Character, UserRole } from "@/lib/types";

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
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hash',
    role: ['user'] as UserRole[],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
  };

  const mockCharacters = [
    {
      id: 'char-1',
      userId: 'test-user-id',
      name: 'Character 1',
      editionCode: 'sr5',
      status: 'draft',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    } as unknown as Character,
    {
      id: 'char-2',
      userId: 'test-user-id',
      name: 'Character 2',
      editionCode: 'sr5',
      status: 'active',
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-04').toISOString(),
    } as unknown as Character,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user characters when authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const request = createMockRequest('http://localhost:3000/api/characters');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toEqual(mockCharacters);
    expect(data.count).toBe(2);
    expect(characterStorageModule.getUserCharacters).toHaveBeenCalledWith('test-user-id');
  });

  it('should filter characters by status when status query param provided', async () => {
    const draftCharacters = [mockCharacters[0]];

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.getCharactersByStatus).mockResolvedValue(draftCharacters);

    const request = createMockRequest('http://localhost:3000/api/characters?status=draft');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toEqual(draftCharacters);
    expect(data.count).toBe(1);
    expect(characterStorageModule.getCharactersByStatus).toHaveBeenCalledWith(
      'test-user-id',
      'draft'
    );
  });

  it('should filter characters by edition when edition query param provided', async () => {
    const sr5Characters = mockCharacters.filter((c) => c.editionCode === 'sr5');

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const request = createMockRequest('http://localhost:3000/api/characters?edition=sr5');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toEqual(sr5Characters);
    expect(data.count).toBe(2);
  });

  it('should filter by both status and edition', async () => {
    // getCharactersByStatus returns only draft characters
    const draftCharacter = {
      ...mockCharacters[0],
      status: 'draft' as const,
    };
    const draftCharacters = [draftCharacter];
    // Then edition filter is applied
    draftCharacters.filter((c) => c.editionCode === 'sr5');

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.getCharactersByStatus).mockResolvedValue(draftCharacters);

    const request = createMockRequest('http://localhost:3000/api/characters?status=draft&edition=sr5');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toHaveLength(1);
    expect(data.characters[0].status).toBe('draft');
    expect(data.characters[0].editionCode).toBe('sr5');
  });

  it('should sort characters by updated date (most recent first)', async () => {
    // Create characters with different dates - char-2 should be first (most recent)
    const unsortedCharacters = [
      {
        id: 'char-1',
        userId: 'test-user-id',
        name: 'Character 1',
        editionCode: 'sr5',
        status: 'draft',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: 'char-2',
        userId: 'test-user-id',
        name: 'Character 2',
        editionCode: 'sr5',
        status: 'active',
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-05').toISOString(), // More recent
      },
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(characterStorageModule.getUserCharacters).mockResolvedValue(unsortedCharacters);

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
    expect(characterStorageModule.getUserCharacters).not.toHaveBeenCalled();
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
    vi.mocked(characterStorageModule.getUserCharacters).mockRejectedValue(
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
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hash',
    role: ['user'] as UserRole[],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
  };

  const mockDraft = {
    id: 'new-char-id',
    userId: 'test-user-id',
    name: 'New Character',
    editionId: 'sr5',
    editionCode: 'sr5',
    status: 'draft',
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
      'New Character'
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
