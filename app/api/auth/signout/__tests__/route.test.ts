/**
 * Tests for /api/auth/signout endpoint
 *
 * Tests sign-out functionality including session clearing
 * and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import * as sessionModule from "@/lib/auth/session";

// Mock dependencies
vi.mock("@/lib/auth/session");

describe("POST /api/auth/signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should sign out successfully", async () => {
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sessionModule.clearSession).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should work even without a valid session (idempotent)", async () => {
    // clearSession should be called regardless of session state
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sessionModule.clearSession).toHaveBeenCalled();
  });

  it("should return 500 when an error occurs during session clearing", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock clearSession to throw an error
    vi.mocked(sessionModule.clearSession).mockImplementation(() => {
      throw new Error("Session clearing failed");
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred during signout");

    consoleErrorSpy.mockRestore();
  });

  it("should clear session cookie", async () => {
    // Reset the mock to ensure it doesn't throw from previous test
    vi.mocked(sessionModule.clearSession).mockImplementation(() => {});

    const response = await POST();

    // Verify clearSession was called with a NextResponse object
    expect(sessionModule.clearSession).toHaveBeenCalledWith(
      expect.objectContaining({
        // The response object should have json method
        json: expect.any(Function),
      })
    );

    // Response should still be successful
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
