/**
 * Tests for /api/auth/me endpoint
 * 
 * Tests current user retrieval including authentication check
 * and user data formatting.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../me/route';
import * as sessionModule from '@/lib/auth/session';
import * as storageModule from '@/lib/storage/users';
import type { User } from '@/lib/types/user';

// Mock dependencies
vi.mock('@/lib/auth/session');
vi.mock('@/lib/storage/users');

describe('GET /api/auth/me', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashed-password',
    role: ['user'],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: ['char-1', 'char-2'],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current user data when authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(mockUser.id);
    expect(data.user.email).toBe(mockUser.email);
    expect(data.user.username).toBe(mockUser.username);
    expect(data.user.role).toEqual(mockUser.role);
    expect(data.user.createdAt).toBe(mockUser.createdAt);
    expect(data.user.lastLogin).toBe(mockUser.lastLogin);
    expect(data.user.characters).toEqual(mockUser.characters);
    expect(data.user.passwordHash).toBeUndefined();

    expect(sessionModule.getSession).toHaveBeenCalled();
    expect(storageModule.getUserById).toHaveBeenCalledWith('test-user-id');
  });

  it('should return 401 when not authenticated', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Not authenticated');
    expect(storageModule.getUserById).not.toHaveBeenCalled();
  });

  it('should return 404 when user not found', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue('non-existent-user-id');
    vi.mocked(storageModule.getUserById).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('User not found');
  });

  it('should not include passwordHash in response', async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue('test-user-id');
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(data.user.passwordHash).toBeUndefined();
    expect(data.user).not.toHaveProperty('passwordHash');
  });

  it('should return 500 when an error occurs', async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(sessionModule.getSession).mockRejectedValue(
      new Error('Session error')
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('An error occurred');
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
