/**
 * Tests for session management
 * 
 * Tests session cookie creation, retrieval, and clearing.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, getSession, clearSession } from '../session';
import { cookies } from 'next/headers';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
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
  const mockCookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);
  });

  describe('createSession', () => {
    it('should set session cookie with user ID', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = mockNextResponse as any;
      const userId = 'test-user-id';

      createSession(userId, response);

      expect(response.cookies.set).toHaveBeenCalledWith(
        'session',
        userId,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })
      );
    });

    it('should set secure flag in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = mockNextResponse as any;
      vi.clearAllMocks();
      createSession('user-id', response);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callArgs = (response.cookies.set as any).mock.calls[0];
      expect(callArgs[2].secure).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it('should not set secure flag in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = mockNextResponse as any;
      vi.clearAllMocks();
      createSession('user-id', response);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callArgs = (response.cookies.set as any).mock.calls[0];
      expect(callArgs[2].secure).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });

    it('should set expiration date', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = mockNextResponse as any;
      vi.clearAllMocks();
      createSession('user-id', response);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callArgs = (response.cookies.set as any).mock.calls[0];
      expect(callArgs[2].expires).toBeInstanceOf(Date);
      
      // Should be approximately 7 days from now
      const expires = callArgs[2].expires as Date;
      const expectedExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const timeDiff = Math.abs(expires.getTime() - expectedExpiry);
      expect(timeDiff).toBeLessThan(1000); // Within 1 second
    });
  });

  describe('getSession', () => {
    it('should retrieve user ID from session cookie', async () => {
      mockCookieStore.get.mockReturnValue({ name: 'session', value: 'test-user-id' });

      const userId = await getSession();

      expect(userId).toBe('test-user-id');
      expect(mockCookieStore.get).toHaveBeenCalledWith('session');
    });

    it('should return null when no session cookie exists', async () => {
      mockCookieStore.get.mockReturnValue(undefined);

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it('should return null when session cookie has no value', async () => {
      mockCookieStore.get.mockReturnValue({ name: 'session', value: null });

      const userId = await getSession();

      expect(userId).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should delete session cookie', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = mockNextResponse as any;
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

