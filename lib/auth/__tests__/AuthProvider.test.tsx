/**
 * Tests for AuthProvider and useAuth hook
 *
 * Tests authentication context, sign in/out flows, and user state management.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "../AuthProvider";
import type { PublicUser, AuthResponse } from "@/lib/types/user";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console.error to reduce test noise
const originalConsoleError = console.error;

// Mock user for testing
const mockUser: PublicUser = {
  id: "user-123",
  email: "test@example.com",
  username: "testuser",
  role: ["user"],
  preferences: { theme: "system", navigationCollapsed: false },
  createdAt: new Date().toISOString(),
  lastLogin: null,
  characters: [],
  failedLoginAttempts: 0,
  lockoutUntil: null,
  sessionVersion: 1,
  accountStatus: "active",
  statusChangedAt: null,
  statusChangedBy: null,
  statusReason: null,
  lastRoleChangeAt: null,
  lastRoleChangeBy: null,
  emailVerified: true,
  emailVerifiedAt: null,
};

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  // ===========================================================================
  // useAuth HOOK TESTS
  // ===========================================================================

  describe("useAuth hook", () => {
    it("throws error when used outside AuthProvider", () => {
      // Suppress React error boundary output
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      spy.mockRestore();
    });

    it("provides auth context when used inside provider", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("signIn");
      expect(result.current).toHaveProperty("signUp");
      expect(result.current).toHaveProperty("signOut");
      expect(result.current).toHaveProperty("refreshUser");
    });
  });

  // ===========================================================================
  // INITIAL STATE TESTS
  // ===========================================================================

  describe("initial state", () => {
    it("starts with isLoading=true and user=null", () => {
      // Don't resolve fetch yet to capture loading state
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it("fetches user from /api/auth/me on mount", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/auth/me");
      });
    });

    it("sets user when fetch succeeds with valid user", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it("sets user to null when fetch returns no user", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("sets user to null when fetch throws error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("sets isLoading to false after fetch completes", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  // ===========================================================================
  // SIGN IN TESTS
  // ===========================================================================

  describe("signIn", () => {
    it("calls POST /api/auth/signin with credentials", async () => {
      // Initial fetch for useEffect
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Sign in fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      await act(async () => {
        await result.current.signIn({ email: "test@example.com", password: "password123" });
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
      });
    });

    it("sets user and navigates to / on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      await act(async () => {
        await result.current.signIn({ email: "test@example.com", password: "password123" });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("returns { success: true } on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      let signInResult: { success: boolean; error?: string };
      await act(async () => {
        signInResult = await result.current.signIn({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(signInResult!).toEqual({ success: true });
    });

    it("returns { success: false, error } when API returns error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false, error: "Invalid credentials" }),
      });

      let signInResult: { success: boolean; error?: string };
      await act(async () => {
        signInResult = await result.current.signIn({
          email: "test@example.com",
          password: "wrong",
        });
      });

      expect(signInResult!).toEqual({ success: false, error: "Invalid credentials" });
    });

    it("returns default error message when API returns no error message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }), // No error field
      });

      let signInResult: { success: boolean; error?: string };
      await act(async () => {
        signInResult = await result.current.signIn({
          email: "test@example.com",
          password: "wrong",
        });
      });

      expect(signInResult!).toEqual({ success: false, error: "Sign in failed" });
    });

    it("returns { success: false, error } when fetch throws", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      let signInResult: { success: boolean; error?: string };
      await act(async () => {
        signInResult = await result.current.signIn({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(signInResult!).toEqual({
        success: false,
        error: "An error occurred during sign in",
      });
    });

    it("does not update user state on failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false, error: "Invalid credentials" }),
      });

      await act(async () => {
        await result.current.signIn({ email: "test@example.com", password: "wrong" });
      });

      expect(result.current.user).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // SIGN UP TESTS
  // ===========================================================================

  describe("signUp", () => {
    it("calls POST /api/auth/signup with signup data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      await act(async () => {
        await result.current.signUp({
          email: "new@example.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "new@example.com",
          username: "newuser",
          password: "password123",
        }),
      });
    });

    it("sets user and navigates to / on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      await act(async () => {
        await result.current.signUp({
          email: "new@example.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("returns { success: true } on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      let signUpResult: { success: boolean; error?: string };
      await act(async () => {
        signUpResult = await result.current.signUp({
          email: "new@example.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(signUpResult!).toEqual({ success: true });
    });

    it("returns { success: false, error } when API returns error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false, error: "Email already exists" }),
      });

      let signUpResult: { success: boolean; error?: string };
      await act(async () => {
        signUpResult = await result.current.signUp({
          email: "existing@example.com",
          username: "existinguser",
          password: "password123",
        });
      });

      expect(signUpResult!).toEqual({ success: false, error: "Email already exists" });
    });

    it("returns default error message when API returns no error message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }), // No error field
      });

      let signUpResult: { success: boolean; error?: string };
      await act(async () => {
        signUpResult = await result.current.signUp({
          email: "new@example.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(signUpResult!).toEqual({ success: false, error: "Sign up failed" });
    });

    it("returns { success: false, error } when fetch throws", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      let signUpResult: { success: boolean; error?: string };
      await act(async () => {
        signUpResult = await result.current.signUp({
          email: "new@example.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(signUpResult!).toEqual({
        success: false,
        error: "An error occurred during sign up",
      });
    });
  });

  // ===========================================================================
  // SIGN OUT TESTS
  // ===========================================================================

  describe("signOut", () => {
    it("calls POST /api/auth/signout", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/signout", {
        method: "POST",
      });
    });

    it("sets user to null after signout", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });

    it("navigates to /signin after signout", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockPush).toHaveBeenCalledWith("/signin");
    });

    it("handles fetch error gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Should not throw
      await act(async () => {
        await result.current.signOut();
      });

      // User should remain set if signout fails (based on implementation)
      // The implementation only sets user to null and navigates even on error
      // This test verifies the function doesn't throw
    });
  });

  // ===========================================================================
  // REFRESH USER TESTS
  // ===========================================================================

  describe("refreshUser", () => {
    it("re-fetches user from /api/auth/me", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Clear mock to track refresh call
      mockFetch.mockClear();

      const updatedUser = { ...mockUser, username: "updateduser" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: updatedUser }),
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/me");
    });

    it("updates user state with new data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user?.username).toBe("testuser");
      });

      const updatedUser = { ...mockUser, username: "updateduser" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: updatedUser }),
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user?.username).toBe("updateduser");
    });
  });
});
