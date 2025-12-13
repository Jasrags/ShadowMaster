/**
 * Tests for /api/auth/signout endpoint
 * 
 * Tests sign-out functionality including session clearing.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../signout/route';
import * as sessionModule from '@/lib/auth/session';

// Mock dependencies
vi.mock('@/lib/auth/session');

describe('POST /api/auth/signout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should clear session and return success', async () => {
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sessionModule.clearSession).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should return 500 when an error occurs', async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(sessionModule.clearSession).mockImplementation(() => {
      throw new Error('Session error');
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('An error occurred during signout');
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
