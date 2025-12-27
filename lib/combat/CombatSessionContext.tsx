"use client";

/**
 * Combat Session Context
 *
 * Provides combat session awareness across the application.
 * Tracks when a character is in active combat and provides
 * access to the current combat session state.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type {
  CombatSession,
  CombatParticipant,
  ActionAllocation,
} from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

export interface CombatSessionState {
  /** Current combat session (null if not in combat) */
  session: CombatSession | null;
  /** The character's participant data in the session */
  participant: CombatParticipant | null;
  /** Whether the character is currently in active combat */
  isInCombat: boolean;
  /** Whether it's currently the character's turn */
  isMyTurn: boolean;
  /** Whether loading session data */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export interface CombatSessionActions {
  /** Join a combat session */
  joinSession: (sessionId: string) => Promise<boolean>;
  /** Leave the current combat session */
  leaveSession: () => Promise<boolean>;
  /** Refresh session state from server */
  refreshSession: () => Promise<void>;
  /** Execute an action in combat */
  executeAction: (actionId: string, targetId?: string) => Promise<boolean>;
  /** Delay turn */
  delayTurn: () => Promise<boolean>;
  /** End turn */
  endTurn: () => Promise<boolean>;
  /** Use interrupt action */
  useInterrupt: (actionId: string, targetId?: string) => Promise<boolean>;
}

export interface CombatSessionContextValue extends CombatSessionState, CombatSessionActions {}

// =============================================================================
// Context
// =============================================================================

const CombatSessionContext = createContext<CombatSessionContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface CombatSessionProviderProps {
  /** Character ID to track combat session for */
  characterId: string;
  /** Optional initial session ID to load */
  initialSessionId?: string;
  /** Polling interval for session updates (ms) - 0 to disable */
  pollInterval?: number;
  children: ReactNode;
}

export function CombatSessionProvider({
  characterId,
  initialSessionId,
  pollInterval = 5000,
  children,
}: CombatSessionProviderProps) {
  // State
  const [session, setSession] = useState<CombatSession | null>(null);
  const [isLoading, setIsLoading] = useState(!!initialSessionId);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const participant = useMemo(() => {
    if (!session) return null;
    return session.participants.find((p) => p.entityId === characterId) || null;
  }, [session, characterId]);

  const isInCombat = useMemo(() => {
    return session !== null && session.status === "active";
  }, [session]);

  const isMyTurn = useMemo(() => {
    if (!session || !participant) return false;
    const currentParticipantId = session.initiativeOrder[session.currentTurn];
    return currentParticipantId === participant.id;
  }, [session, participant]);

  // Fetch session data
  const fetchSession = useCallback(
    async (sessionId: string): Promise<CombatSession | null> => {
      try {
        const response = await fetch(`/api/combat/${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch session");
        }

        return data.session;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch session";
        setError(message);
        return null;
      }
    },
    []
  );

  // Refresh current session
  const refreshSession = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const updated = await fetchSession(session.id);
      if (updated) {
        setSession(updated);
      }
    } finally {
      setIsLoading(false);
    }
  }, [session, fetchSession]);

  // Join a combat session
  const joinSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        // First fetch the session
        const fetchedSession = await fetchSession(sessionId);
        if (!fetchedSession) return false;

        // Check if already a participant
        const existingParticipant = fetchedSession.participants.find(
          (p) => p.entityId === characterId
        );

        if (existingParticipant) {
          // Already in session, just set it
          setSession(fetchedSession);
          return true;
        }

        // Add as participant
        const response = await fetch(`/api/combat/${sessionId}/participants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ characterId }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to join session");
        }

        setSession(data.session);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to join session";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [characterId, fetchSession]
  );

  // Leave current session
  const leaveSession = useCallback(async (): Promise<boolean> => {
    if (!session || !participant) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/combat/${session.id}/participants/${participant.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to leave session");
      }

      setSession(null);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to leave session";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, participant]);

  // Execute an action
  const executeAction = useCallback(
    async (actionId: string, targetId?: string): Promise<boolean> => {
      if (!session || !participant) {
        setError("Not in combat");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/combat/${session.id}/actions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: participant.id,
            actionId,
            targetId,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to execute action");
        }

        // Update session with new state
        if (data.session) {
          setSession(data.session);
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to execute action";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [session, participant]
  );

  // Delay turn
  const delayTurn = useCallback(async (): Promise<boolean> => {
    if (!session || !participant) {
      setError("Not in combat");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/combat/${session.id}/turn/delay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: participant.id }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delay turn");
      }

      if (data.session) {
        setSession(data.session);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delay turn";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, participant]);

  // End turn
  const endTurn = useCallback(async (): Promise<boolean> => {
    if (!session || !participant) {
      setError("Not in combat");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/combat/${session.id}/turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to end turn");
      }

      if (data.session) {
        setSession(data.session);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to end turn";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, participant]);

  // Use interrupt action
  const useInterrupt = useCallback(
    async (actionId: string, targetId?: string): Promise<boolean> => {
      if (!session || !participant) {
        setError("Not in combat");
        return false;
      }

      if (!participant.actionsRemaining.interrupt) {
        setError("Interrupt action not available");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/combat/${session.id}/actions/interrupt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: participant.id,
            actionId,
            targetId,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to use interrupt");
        }

        if (data.session) {
          setSession(data.session);
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to use interrupt";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [session, participant]
  );

  // Load initial session
  useEffect(() => {
    if (initialSessionId) {
      joinSession(initialSessionId);
    }
  }, [initialSessionId, joinSession]);

  // Poll for session updates
  useEffect(() => {
    if (!session || pollInterval === 0) return;

    const interval = setInterval(() => {
      refreshSession();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [session, pollInterval, refreshSession]);

  // Context value
  const value: CombatSessionContextValue = useMemo(
    () => ({
      session,
      participant,
      isInCombat,
      isMyTurn,
      isLoading,
      error,
      joinSession,
      leaveSession,
      refreshSession,
      executeAction,
      delayTurn,
      endTurn,
      useInterrupt,
    }),
    [
      session,
      participant,
      isInCombat,
      isMyTurn,
      isLoading,
      error,
      joinSession,
      leaveSession,
      refreshSession,
      executeAction,
      delayTurn,
      endTurn,
      useInterrupt,
    ]
  );

  return (
    <CombatSessionContext.Provider value={value}>
      {children}
    </CombatSessionContext.Provider>
  );
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to access combat session context
 */
export function useCombatSession(): CombatSessionContextValue {
  const context = useContext(CombatSessionContext);

  if (!context) {
    // Return a default "not in combat" state when outside provider
    return {
      session: null,
      participant: null,
      isInCombat: false,
      isMyTurn: false,
      isLoading: false,
      error: null,
      joinSession: async () => false,
      leaveSession: async () => false,
      refreshSession: async () => {},
      executeAction: async () => false,
      delayTurn: async () => false,
      endTurn: async () => false,
      useInterrupt: async () => false,
    };
  }

  return context;
}

/**
 * Hook to get action economy for current participant
 */
export function useActionEconomy(): ActionAllocation | null {
  const { participant } = useCombatSession();
  return participant?.actionsRemaining || null;
}

/**
 * Hook to check if a specific action type is available
 */
export function useCanPerformAction(actionType: "free" | "simple" | "complex" | "interrupt"): boolean {
  const actions = useActionEconomy();

  if (!actions) return false;

  switch (actionType) {
    case "free":
      return actions.free > 0;
    case "simple":
      return actions.simple > 0;
    case "complex":
      return actions.complex > 0 || actions.simple >= 2;
    case "interrupt":
      return actions.interrupt;
    default:
      return false;
  }
}

/**
 * Hook to get current turn participant
 */
export function useCurrentTurnParticipant(): CombatParticipant | null {
  const { session } = useCombatSession();

  if (!session) return null;

  const currentId = session.initiativeOrder[session.currentTurn];
  return session.participants.find((p) => p.id === currentId) || null;
}
