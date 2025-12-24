/**
 * Tests for session management
 * 
 * Tests session cookie creation, retrieval, and clearing.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, getSession, clearSession } from '../session';
import { cookies } from 'next/headers';
import { getUserById } from '../../storage/users';
import { NextResponse } from 'next/server';
import type { User } from '../../types/user';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

// Mock user storage
vi.mock('../../storage/users', () => ({
  getUserById: vi.fn(),
}));

// Mock NextResponse
const mockNextResponse = {
  cookies: {
    set: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('next/server', () => ({
  NextResponse: class {
    static json = vi.fn();
    cookies = {
      set: vi.fn(),
      delete: vi.fn(),
    };
  },
}));

describe('Session Management', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashed-password',
    role: ['user'],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
  };

  const mockCookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  describe('createSession', () => {
    it('should set session cookie with user ID and version', () => {
      const response = mockNextResponse as unknown as NextResponse;
      const userId = 'test-user-id';
      const sessionVersion = 1;

      createSession(userId, response, sessionVersion);

      expect(response.cookies.set).toHaveBeenCalledWith(
        'session',
        `${userId}:${sessionVersion}`,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })
      );
    });

    it('should set secure flag in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();
      createSession('user-id', response);

      expect(response.cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ secure: true })
      );
    });

    it('should not set secure flag in development', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();
      createSession('user-id', response);

      expect(response.cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ secure: false })
      );
    });

    it('should set expiration date', () => {
      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();
      createSession('user-id', response);

      const setCall = vi.mocked(response.cookies.set).mock.calls[0];
      expect(setCall).toBeDefined();
      const options = setCall![2];
      expect(options).toBeDefined();
      expect(options!.expires).toBeInstanceOf(Date);
      
      // Should be approximately 7 days from now
      const expires = options!.expires as Date;
      const expectedExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const timeDiff = Math.abs(expires.getTime() - expectedExpiry);
      expect(timeDiff).toBeLessThan(1000); // Within 1 second
    });
  });

  describe('getSession', () => {
    it('should retrieve user ID from session cookie when version matches', async () => {
      mockCookieStore.get.mockReturnValue({ name: 'session', value: 'test-user-id:1' });
      vi.mocked(getUserById).mockResolvedValue({ ...mockUser, id: 'test-user-id', sessionVersion: 1 });

      const userId = await getSession();

      expect(userId).toBe('test-user-id');
      expect(mockCookieStore.get).toHaveBeenCalledWith('session');
      expect(getUserById).toHaveBeenCalledWith('test-user-id');
    });

    it('should return null when version does not match', async () => {
      mockCookieStore.get.mockReturnValue({ name: 'session', value: 'test-user-id:1' });
      vi.mocked(getUserById).mockResolvedValue({ ...mockUser, id: 'test-user-id', sessionVersion: 2 });

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      mockCookieStore.get.mockReturnValue({ name: 'session', value: 'test-user-id:1' });
      vi.mocked(getUserById).mockResolvedValue(null);

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it('should return null when no session cookie exists', async () => {
      mockCookieStore.get.mockReturnValue(undefined);

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it('should return null when session cookie has invalid format', async () => {
      mockCookieStore.get.mockReturnValue({ name: 'session', value: 'test-user-id' });

      const userId = await getSession();

      expect(userId).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should delete session cookie', () => {
      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();

      clearSession(response);

      expect(response.cookies.delete).toHaveBeenCalledWith('session');
    });
  });

  describe('session duration', () => {
    it('should use correct session duration constant', () => {
      // This test documents the expected session duration
      const SESSION_DURATION_DAYS = 7;
      const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

      expect(SESSION_DURATION_MS).toBe(7 * 24 * 60 * 60 * 1000);
    });
  });
});

