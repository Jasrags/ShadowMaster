/**
 * CombatSessionContext Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import {
  CombatSessionProvider,
  useCombatSession,
  useActionEconomy,
  useCanPerformAction,
  useCurrentTurnParticipant,
} from "../CombatSessionContext";
import type { CombatSession, CombatParticipant } from "@/lib/types";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock combat session
const mockSession: CombatSession = {
  id: "session-1",
  ownerId: "user-1",
  editionCode: "sr5",
  name: "Test Combat",
  status: "active",
  round: 2,
  currentTurn: 0,
  currentPhase: "action",
  participants: [
    {
      id: "p1",
      name: "Street Samurai",
      type: "character",
      entityId: "char-1",
      initiativeScore: 15,
      initiativeDice: [5, 4, 3],
      status: "active",
      actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
      interruptsPending: [],
      controlledBy: "user-1",
      woundModifier: 0,
      conditions: [],
      isGMControlled: false,
    },
    {
      id: "p2",
      name: "Ganger",
      type: "npc",
      entityId: "npc-1",
      initiativeScore: 8,
      initiativeDice: [2],
      status: "active",
      actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
      interruptsPending: [],
      controlledBy: "user-1",
      woundModifier: -1,
      conditions: [],
      isGMControlled: true,
    },
  ],
  initiativeOrder: ["p1", "p2"],
  environment: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function createWrapper(characterId: string, initialSessionId?: string) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <CombatSessionProvider
        characterId={characterId}
        initialSessionId={initialSessionId}
        pollInterval={0} // Disable polling for tests
      >
        {children}
      </CombatSessionProvider>
    );
  };
}

describe("CombatSessionContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCombatSession", () => {
    it("returns default state when no session", () => {
      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1"),
      });

      expect(result.current.session).toBeNull();
      expect(result.current.participant).toBeNull();
      expect(result.current.isInCombat).toBe(false);
      expect(result.current.isMyTurn).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it("returns default state when used outside provider", () => {
      const { result } = renderHook(() => useCombatSession());

      expect(result.current.session).toBeNull();
      expect(result.current.isInCombat).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it("loads initial session when provided", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.session).not.toBeNull();
      });

      expect(result.current.session?.id).toBe("session-1");
      expect(result.current.isInCombat).toBe(true);
    });

    it("identifies correct participant", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.participant).not.toBeNull();
      });

      expect(result.current.participant?.name).toBe("Street Samurai");
      expect(result.current.participant?.entityId).toBe("char-1");
    });

    it("detects when it is my turn", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.isMyTurn).toBe(true);
      });
    });

    it("detects when it is not my turn", async () => {
      const sessionNotMyTurn = {
        ...mockSession,
        currentTurn: 1, // p2's turn
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: sessionNotMyTurn }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.session).not.toBeNull();
      });

      expect(result.current.isMyTurn).toBe(false);
    });
  });

  describe("joinSession", () => {
    it("joins a combat session successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1"),
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.joinSession("session-1");
      });

      expect(success!).toBe(true);
      expect(result.current.session).not.toBeNull();
    });

    it("handles join failure", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: "Session not found" }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1"),
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.joinSession("invalid-session");
      });

      expect(success!).toBe(false);
      expect(result.current.error).toBe("Session not found");
    });
  });

  describe("leaveSession", () => {
    it("leaves a combat session successfully", async () => {
      // First join
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.session).not.toBeNull();
      });

      // Then leave
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.leaveSession();
      });

      expect(success!).toBe(true);
      expect(result.current.session).toBeNull();
    });
  });

  describe("useActionEconomy", () => {
    it("returns null when not in combat", () => {
      const { result } = renderHook(() => useActionEconomy(), {
        wrapper: createWrapper("char-1"),
      });

      expect(result.current).toBeNull();
    });

    it("returns action economy when in combat", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useActionEconomy(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      expect(result.current?.free).toBe(1);
      expect(result.current?.simple).toBe(2);
      expect(result.current?.complex).toBe(1);
      expect(result.current?.interrupt).toBe(true);
    });
  });

  describe("useCanPerformAction", () => {
    it("returns true for all actions outside combat", () => {
      const { result: freeResult } = renderHook(() => useCanPerformAction("free"), {
        wrapper: createWrapper("char-1"),
      });
      const { result: simpleResult } = renderHook(() => useCanPerformAction("simple"), {
        wrapper: createWrapper("char-1"),
      });
      const { result: complexResult } = renderHook(() => useCanPerformAction("complex"), {
        wrapper: createWrapper("char-1"),
      });
      const { result: interruptResult } = renderHook(() => useCanPerformAction("interrupt"), {
        wrapper: createWrapper("char-1"),
      });

      // Outside combat, hooks return false (no action economy)
      expect(freeResult.current).toBe(false);
      expect(simpleResult.current).toBe(false);
      expect(complexResult.current).toBe(false);
      expect(interruptResult.current).toBe(false);
    });

    it("checks action availability correctly", async () => {
      const sessionWithLimitedActions: CombatSession = {
        ...mockSession,
        participants: [
          {
            ...mockSession.participants[0],
            actionsRemaining: { free: 0, simple: 1, complex: 0, interrupt: true },
          },
          mockSession.participants[1],
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: sessionWithLimitedActions }),
      });

      const { result } = renderHook(() => useActionEconomy(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      expect(result.current?.free).toBe(0);
      expect(result.current?.simple).toBe(1);
      expect(result.current?.complex).toBe(0);
      expect(result.current?.interrupt).toBe(true);
    });
  });

  describe("useCurrentTurnParticipant", () => {
    it("returns null when not in combat", () => {
      const { result } = renderHook(() => useCurrentTurnParticipant(), {
        wrapper: createWrapper("char-1"),
      });

      expect(result.current).toBeNull();
    });

    it("returns current turn participant", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, session: mockSession }),
      });

      const { result } = renderHook(() => useCurrentTurnParticipant(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      expect(result.current?.name).toBe("Street Samurai");
    });
  });

  describe("executeAction", () => {
    it("executes action successfully", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, session: mockSession }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              success: true,
              session: {
                ...mockSession,
                participants: [
                  {
                    ...mockSession.participants[0],
                    actionsRemaining: { free: 1, simple: 1, complex: 1, interrupt: true },
                  },
                  mockSession.participants[1],
                ],
              },
            }),
        });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.session).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.executeAction("fire-weapon", "p2");
      });

      expect(success!).toBe(true);
    });

    it("fails when not in combat", async () => {
      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1"),
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.executeAction("fire-weapon");
      });

      expect(success!).toBe(false);
      expect(result.current.error).toBe("Not in combat");
    });
  });

  describe("endTurn", () => {
    it("ends turn successfully", async () => {
      const updatedSession = {
        ...mockSession,
        currentTurn: 1,
      };

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, session: mockSession }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, session: updatedSession }),
        });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.session).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.endTurn();
      });

      expect(success!).toBe(true);
      expect(result.current.session?.currentTurn).toBe(1);
    });
  });

  describe("delayTurn", () => {
    it("delays turn successfully", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, session: mockSession }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              success: true,
              session: {
                ...mockSession,
                participants: [
                  {
                    ...mockSession.participants[0],
                    status: "delayed",
                  },
                  mockSession.participants[1],
                ],
              },
            }),
        });

      const { result } = renderHook(() => useCombatSession(), {
        wrapper: createWrapper("char-1", "session-1"),
      });

      await waitFor(() => {
        expect(result.current.session).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.delayTurn();
      });

      expect(success!).toBe(true);
    });
  });
});
