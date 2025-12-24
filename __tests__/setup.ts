/**
 * Vitest setup file
 * 
 * This file runs before all tests and sets up global test utilities,
 * mocks, and configurations.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js modules
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js server components
vi.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    url: string;
    method: string;
    headers: Headers;
    body: string | undefined;
    
    constructor(url: string, init?: { method?: string; headers?: HeadersInit; body?: string }) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = init?.body;
    }

    async json() {
      if (this.body) {
        return JSON.parse(this.body);
      }
      return null;
    }
  },
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number; headers?: HeadersInit }) => {
      const headers = new Headers(init?.headers);
      return {
        json: () => Promise.resolve(data),
        status: init?.status || 200,
        headers,
        cookies: {
          set: vi.fn(),
          delete: vi.fn(),
        },
      };
    }),
  },
}));

