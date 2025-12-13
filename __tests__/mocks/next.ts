/**
 * Next.js module mocks for testing
 */

import { vi } from 'vitest';

/**
 * Mock Next.js cookies() function
 */
export function createMockCookies(cookieValue?: string) {
  return vi.fn(async () => ({
    get: (name: string) => {
      if (name === 'session' && cookieValue) {
        return { name: 'session', value: cookieValue };
      }
      return undefined;
    },
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(),
  }));
}

/**
 * Mock Next.js navigation hooks
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

export const mockPathname = '/';
export const mockSearchParams = new URLSearchParams();

