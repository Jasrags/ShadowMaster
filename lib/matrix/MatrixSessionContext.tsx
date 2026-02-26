"use client";

/**
 * Matrix Session Context
 *
 * Provides matrix session state management for a single character.
 * Unlike CombatSessionContext (server-driven, polled), this is client-driven
 * ephemeral state — it lives entirely in React context and resets on navigation.
 *
 * The rule engine functions (overwatch, marks, convergence) are pure and called
 * directly from this context, not via API.
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
import type { Character } from "@/lib/types";
import type {
  MatrixState,
  MatrixMode,
  MatrixPersona,
  LoadedProgram,
  OverwatchSession,
  ConvergenceResult,
  MarkTargetType,
  MatrixMark,
  HostAuthLevel,
} from "@/lib/types/matrix";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";
import {
  hasMatrixAccess,
  getActiveCyberdeck,
  getCharacterCommlinks,
  calculateMatrixConditionMonitor,
} from "@/lib/rules/matrix/cyberdeck-validator";
import {
  startOverwatchSession,
  recordOverwatchEvent,
  endOverwatchSession,
  getCurrentScore,
  getConvergenceProgress,
} from "@/lib/rules/matrix/overwatch-tracker";
import {
  getOverwatchWarningLevel,
  handleConvergence,
  checkConvergence,
} from "@/lib/rules/matrix/overwatch-calculator";
import {
  placeMark as placeMarkOnState,
  removeMarks as removeMarksFromState,
  clearAllMarks as clearAllMarksFromState,
  receiveMarkOnSelf as receiveMarkOnSelfState,
  removeReceivedMarks as removeReceivedMarksFromState,
  getMarksOnTarget as getMarksOnTargetFromState,
  hasRequiredMarks as hasRequiredMarksFromState,
} from "@/lib/rules/matrix/mark-tracker";
import type { MarkPlacementResult, MarkRemovalResult } from "@/lib/rules/matrix/mark-tracker";

// =============================================================================
// Types
// =============================================================================

export interface MatrixSessionState {
  /** Full matrix state (null if no matrix hardware) */
  matrixState: MatrixState | null;
  /** Active overwatch tracking session */
  overwatchSession: OverwatchSession | null;
  /** Whether character has matrix hardware (cyberdeck or commlink) */
  hasMatrixHardware: boolean;
  /** Whether currently jacked into the Matrix */
  isJackedIn: boolean;
  /** Current connection mode */
  connectionMode: MatrixMode;
  /** Current Overwatch Score */
  overwatchScore: number;
  /** Warning level for OS display */
  overwatchWarningLevel: "safe" | "caution" | "warning" | "danger" | "critical";
  /** Whether GOD convergence has occurred */
  isConverged: boolean;
  /** Whether an action is in progress */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export interface MatrixSessionActions {
  /** Connect to the Matrix */
  jackIn: (mode: MatrixMode, deviceId?: string) => void;
  /** Disconnect from the Matrix */
  jackOut: () => void;
  /** Switch connection mode (AR/Cold-sim/Hot-sim) */
  changeConnectionMode: (mode: MatrixMode) => void;
  /** Add to Overwatch Score from an action */
  addOverwatchScore: (action: string, score: number) => void;
  /** Reset Overwatch Score to 0 */
  resetOverwatchScore: () => void;
  /** Place a mark on a target */
  placeMark: (
    targetId: string,
    targetType: MarkTargetType,
    targetName: string,
    count?: number
  ) => MarkPlacementResult;
  /** Remove marks from a target */
  removeMark: (targetId: string, count?: number) => MarkRemovalResult;
  /** Clear all marks (held and received) */
  clearAllMarks: () => void;
  /** Record a mark placed on this persona */
  receiveMarkOnSelf: (mark: MatrixMark) => void;
  /** Remove all marks from a specific source on this persona */
  removeReceivedMark: (markerId: string) => void;
  /** Apply matrix damage to condition monitor */
  applyMatrixDamage: (amount: number) => void;
  /** Heal matrix damage */
  healMatrixDamage: (amount: number) => void;
  /** Trigger GOD convergence */
  triggerConvergence: () => ConvergenceResult | null;
  /** Enter a matrix host */
  enterHost: (hostId: string, authLevel: HostAuthLevel) => void;
  /** Leave current host */
  leaveHost: () => void;
  /** Clear the current error */
  clearError: () => void;
}

export interface MatrixSessionContextValue extends MatrixSessionState, MatrixSessionActions {}

// =============================================================================
// Context
// =============================================================================

const MatrixSessionContext = createContext<MatrixSessionContextValue | null>(null);

// =============================================================================
// Helper: Build initial MatrixState from character data
// =============================================================================

/**
 * Derive a MatrixState from character equipment data.
 * Returns null if the character has no matrix hardware.
 */
function buildMatrixStateFromCharacter(character: Character): MatrixState | null {
  if (!hasMatrixAccess(character)) {
    return null;
  }

  const cyberdeck = getActiveCyberdeck(character);
  const commlinks = getCharacterCommlinks(character);

  let persona: MatrixPersona;
  let activeDeviceId: string | undefined;
  let activeDeviceType: MatrixState["activeDeviceType"];
  let attributeConfig = cyberdeck?.currentConfig;
  let deviceRating: number;

  if (cyberdeck) {
    deviceRating = cyberdeck.deviceRating;
    activeDeviceId = cyberdeck.id ?? cyberdeck.catalogId;
    activeDeviceType = "cyberdeck";
    const config = cyberdeck.currentConfig;
    persona = {
      personaId: `persona-${activeDeviceId}`,
      attack: config.attack,
      sleaze: config.sleaze,
      dataProcessing: config.dataProcessing,
      firewall: config.firewall,
      deviceRating,
    };
  } else if (commlinks.length > 0) {
    const commlink = commlinks[0];
    deviceRating = commlink.deviceRating;
    activeDeviceId = commlink.id ?? commlink.catalogId;
    activeDeviceType = "commlink";
    attributeConfig = undefined;
    persona = {
      personaId: `persona-${activeDeviceId}`,
      attack: 0,
      sleaze: 0,
      dataProcessing: deviceRating,
      firewall: deviceRating,
      deviceRating,
    };
  } else {
    return null;
  }

  // Build LoadedProgram[] from character.programs that are loaded on the active device
  const loadedPrograms: LoadedProgram[] = (character.programs ?? [])
    .filter((p) => p.loaded && p.loadedOnDeviceId === activeDeviceId)
    .map((p) => ({
      programId: p.id ?? p.catalogId,
      catalogId: p.catalogId,
      name: p.name,
      category: p.category as LoadedProgram["category"],
      rating: p.rating,
      isRunning: true,
    }));
  const programSlotsMax = cyberdeck ? cyberdeck.programSlots : 0;

  return {
    isConnected: false,
    connectionMode: "ar",
    activeDeviceId,
    activeDeviceType,
    attributeConfig,
    persona,
    loadedPrograms,
    programSlotsUsed: loadedPrograms.length,
    programSlotsMax,
    matrixConditionMonitor: calculateMatrixConditionMonitor(deviceRating),
    matrixDamageTaken: 0,
    overwatchScore: 0,
    overwatchThreshold: OVERWATCH_THRESHOLD,
    overwatchConverged: false,
    marksHeld: [],
    marksReceived: [],
  };
}

// =============================================================================
// Provider
// =============================================================================

interface MatrixSessionProviderProps {
  /** The character whose matrix session to manage */
  character: Character;
  /** Callback when character data changes (e.g., equipment mutations) */
  onCharacterUpdate: (updated: Character) => void;
  children: ReactNode;
}

export function MatrixSessionProvider({ character, children }: MatrixSessionProviderProps) {
  const [matrixState, setMatrixState] = useState<MatrixState | null>(() =>
    buildMatrixStateFromCharacter(character)
  );
  const [overwatchSession, setOverwatchSession] = useState<OverwatchSession | null>(null);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const hasMatrixHardware = useMemo(() => hasMatrixAccess(character), [character]);

  const isJackedIn = matrixState?.isConnected ?? false;

  const connectionMode: MatrixMode = matrixState?.connectionMode ?? "ar";

  const overwatchScore = matrixState?.overwatchScore ?? 0;

  const overwatchWarningLevel = useMemo(
    () => getOverwatchWarningLevel(overwatchScore),
    [overwatchScore]
  );

  const isConverged = matrixState?.overwatchConverged ?? false;

  // ---------------------------------------------------------------------------
  // Character sync: re-derive hardware fields when character prop changes
  // without destroying session-level ephemeral state
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!matrixState) {
      // If we didn't have matrix state before, try to build it now
      const newState = buildMatrixStateFromCharacter(character);
      if (newState) {
        setMatrixState(newState);
      }
      return;
    }

    // Character changed — sync hardware fields only
    const freshState = buildMatrixStateFromCharacter(character);
    if (!freshState) {
      // Character lost matrix hardware
      setMatrixState(null);
      setOverwatchSession(null);
      return;
    }

    // Preserve session-level ephemeral state, update hardware-derived fields
    setMatrixState((prev) => {
      if (!prev) return freshState;
      return {
        ...prev,
        activeDeviceId: freshState.activeDeviceId,
        activeDeviceType: freshState.activeDeviceType,
        attributeConfig: freshState.attributeConfig,
        persona: freshState.persona,
        loadedPrograms: freshState.loadedPrograms,
        programSlotsUsed: freshState.programSlotsUsed,
        programSlotsMax: freshState.programSlotsMax,
        matrixConditionMonitor: freshState.matrixConditionMonitor,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const jackIn = useCallback(
    (mode: MatrixMode, deviceId?: string) => {
      if (!matrixState) {
        setError("No matrix hardware available");
        return;
      }

      // If a specific device was requested, rebuild state for it
      let state = matrixState;
      if (deviceId && deviceId !== matrixState.activeDeviceId) {
        const freshState = buildMatrixStateFromCharacter(character);
        if (freshState) {
          state = freshState;
        }
      }

      const session = startOverwatchSession(character.id);

      setMatrixState({
        ...state,
        isConnected: true,
        connectionMode: mode,
        overwatchScore: 0,
        overwatchThreshold: OVERWATCH_THRESHOLD,
        overwatchConverged: false,
        marksHeld: [],
        marksReceived: [],
        matrixDamageTaken: 0,
        sessionStartedAt: new Date().toISOString() as import("@/lib/types").ISODateString,
      });
      setOverwatchSession(session);
      setError(null);
    },
    [matrixState, character]
  );

  const jackOut = useCallback(() => {
    if (overwatchSession) {
      endOverwatchSession(overwatchSession, "jacked_out");
    }

    setMatrixState((prev) => {
      if (!prev) return prev;
      const cleared = clearAllMarksFromState(prev);
      return {
        ...cleared,
        isConnected: false,
        connectionMode: "ar" as MatrixMode,
        overwatchScore: 0,
        overwatchConverged: false,
        matrixDamageTaken: 0,
        currentHost: undefined,
        hostAuthLevel: undefined,
        sessionStartedAt: undefined,
      };
    });
    setOverwatchSession(null);
    setError(null);
  }, [overwatchSession]);

  const changeConnectionMode = useCallback((mode: MatrixMode) => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      return { ...prev, connectionMode: mode };
    });
  }, []);

  const addOverwatchScoreAction = useCallback(
    (action: string, score: number) => {
      if (!overwatchSession || !matrixState) return;

      const updatedSession = recordOverwatchEvent(overwatchSession, action, score);
      setOverwatchSession(updatedSession);

      const newScore = getCurrentScore(updatedSession);
      const converged = checkConvergence(newScore);

      setMatrixState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          overwatchScore: newScore,
          overwatchConverged: converged,
        };
      });
    },
    [overwatchSession, matrixState]
  );

  const resetOverwatchScoreAction = useCallback(() => {
    if (overwatchSession) {
      // Start a fresh session to reset OS
      const newSession = startOverwatchSession(character.id);
      setOverwatchSession(newSession);
    }

    setMatrixState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        overwatchScore: 0,
        overwatchConverged: false,
      };
    });
  }, [overwatchSession, character.id]);

  const placeMarkAction = useCallback(
    (
      targetId: string,
      targetType: MarkTargetType,
      targetName: string,
      count?: number
    ): MarkPlacementResult => {
      if (!matrixState) {
        return {
          success: false,
          mark: null,
          errors: [{ code: "NOT_CONNECTED", message: "Not connected to the Matrix" }],
          newMarkCount: 0,
        };
      }

      // Place one or multiple marks
      let currentState = matrixState;
      let lastResult: MarkPlacementResult = {
        success: false,
        mark: null,
        errors: [],
        newMarkCount: 0,
      };

      const iterations = count ?? 1;
      for (let i = 0; i < iterations; i++) {
        const { state, result } = placeMarkOnState(currentState, targetId, targetType, targetName, {
          silentCap: true,
        });
        currentState = state;
        lastResult = result;
      }

      setMatrixState(currentState);
      return lastResult;
    },
    [matrixState]
  );

  const removeMarkAction = useCallback(
    (targetId: string, count?: number): MarkRemovalResult => {
      if (!matrixState) {
        return { success: false, marksRemoved: 0, remainingMarks: 0 };
      }

      const { state, result } = removeMarksFromState(matrixState, targetId, count);
      setMatrixState(state);
      return result;
    },
    [matrixState]
  );

  const clearAllMarksAction = useCallback(() => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      return clearAllMarksFromState(prev);
    });
  }, []);

  const receiveMarkOnSelfAction = useCallback(
    (mark: MatrixMark) => {
      if (!matrixState) return;
      const updated = receiveMarkOnSelfState(matrixState, mark);
      setMatrixState(updated);
    },
    [matrixState]
  );

  const removeReceivedMarkAction = useCallback((markerId: string) => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      return removeReceivedMarksFromState(prev, markerId);
    });
  }, []);

  const applyMatrixDamage = useCallback((amount: number) => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      const newDamage = Math.min(prev.matrixDamageTaken + amount, prev.matrixConditionMonitor);
      return { ...prev, matrixDamageTaken: Math.max(0, newDamage) };
    });
  }, []);

  const healMatrixDamage = useCallback((amount: number) => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      const newDamage = Math.max(0, prev.matrixDamageTaken - amount);
      return { ...prev, matrixDamageTaken: newDamage };
    });
  }, []);

  const triggerConvergenceAction = useCallback((): ConvergenceResult | null => {
    if (!matrixState) return null;

    const result = handleConvergence(character, matrixState);

    // Convergence forces jack-out
    if (overwatchSession) {
      endOverwatchSession(overwatchSession, "converged");
    }

    setMatrixState((prev) => {
      if (!prev) return prev;
      const cleared = clearAllMarksFromState(prev);
      return {
        ...cleared,
        isConnected: false,
        connectionMode: "ar" as MatrixMode,
        overwatchScore: 0,
        overwatchConverged: true,
        currentHost: undefined,
        hostAuthLevel: undefined,
        sessionStartedAt: undefined,
      };
    });
    setOverwatchSession(null);

    return result;
  }, [matrixState, character, overwatchSession]);

  const enterHost = useCallback((hostId: string, authLevel: HostAuthLevel) => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentHost: hostId,
        hostAuthLevel: authLevel,
      };
    });
  }, []);

  const leaveHost = useCallback(() => {
    setMatrixState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentHost: undefined,
        hostAuthLevel: undefined,
      };
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------

  const value = useMemo<MatrixSessionContextValue>(
    () => ({
      // State
      matrixState,
      overwatchSession,
      hasMatrixHardware,
      isJackedIn,
      connectionMode,
      overwatchScore,
      overwatchWarningLevel,
      isConverged,
      isLoading,
      error,
      // Actions
      jackIn,
      jackOut,
      changeConnectionMode,
      addOverwatchScore: addOverwatchScoreAction,
      resetOverwatchScore: resetOverwatchScoreAction,
      placeMark: placeMarkAction,
      removeMark: removeMarkAction,
      clearAllMarks: clearAllMarksAction,
      receiveMarkOnSelf: receiveMarkOnSelfAction,
      removeReceivedMark: removeReceivedMarkAction,
      applyMatrixDamage,
      healMatrixDamage,
      triggerConvergence: triggerConvergenceAction,
      enterHost,
      leaveHost,
      clearError,
    }),
    [
      matrixState,
      overwatchSession,
      hasMatrixHardware,
      isJackedIn,
      connectionMode,
      overwatchScore,
      overwatchWarningLevel,
      isConverged,
      isLoading,
      error,
      jackIn,
      jackOut,
      changeConnectionMode,
      addOverwatchScoreAction,
      resetOverwatchScoreAction,
      placeMarkAction,
      removeMarkAction,
      clearAllMarksAction,
      receiveMarkOnSelfAction,
      removeReceivedMarkAction,
      applyMatrixDamage,
      healMatrixDamage,
      triggerConvergenceAction,
      enterHost,
      leaveHost,
      clearError,
    ]
  );

  return <MatrixSessionContext.Provider value={value}>{children}</MatrixSessionContext.Provider>;
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to access matrix session context.
 * Returns safe defaults when used outside the provider (does not throw).
 */
export function useMatrixSession(): MatrixSessionContextValue {
  const context = useContext(MatrixSessionContext);

  if (!context) {
    return {
      matrixState: null,
      overwatchSession: null,
      hasMatrixHardware: false,
      isJackedIn: false,
      connectionMode: "ar",
      overwatchScore: 0,
      overwatchWarningLevel: "safe",
      isConverged: false,
      isLoading: false,
      error: null,
      jackIn: () => {},
      jackOut: () => {},
      changeConnectionMode: () => {},
      addOverwatchScore: () => {},
      resetOverwatchScore: () => {},
      placeMark: () => ({
        success: false,
        mark: null,
        errors: [{ code: "NO_PROVIDER", message: "MatrixSessionProvider not mounted" }],
        newMarkCount: 0,
      }),
      removeMark: () => ({ success: false, marksRemoved: 0, remainingMarks: 0 }),
      clearAllMarks: () => {},
      receiveMarkOnSelf: () => {},
      removeReceivedMark: () => {},
      applyMatrixDamage: () => {},
      healMatrixDamage: () => {},
      triggerConvergence: () => null,
      enterHost: () => {},
      leaveHost: () => {},
      clearError: () => {},
    };
  }

  return context;
}

/**
 * Specialized hook for overwatch state.
 * Provides a focused view of OS tracking data.
 */
export function useOverwatchState(): {
  score: number;
  threshold: number;
  warningLevel: "safe" | "caution" | "warning" | "danger" | "critical";
  isConverged: boolean;
  progress: number;
  session: OverwatchSession | null;
} {
  const { matrixState, overwatchSession, overwatchScore, overwatchWarningLevel, isConverged } =
    useMatrixSession();

  return useMemo(
    () => ({
      score: overwatchScore,
      threshold: matrixState?.overwatchThreshold ?? OVERWATCH_THRESHOLD,
      warningLevel: overwatchWarningLevel,
      isConverged,
      progress: overwatchSession ? getConvergenceProgress(overwatchSession) : 0,
      session: overwatchSession,
    }),
    [
      overwatchScore,
      matrixState?.overwatchThreshold,
      overwatchWarningLevel,
      isConverged,
      overwatchSession,
    ]
  );
}

/**
 * Specialized hook for matrix marks.
 * Provides mark query utilities alongside the marks data.
 */
export function useMatrixMarks(): {
  marksHeld: MatrixMark[];
  marksReceived: MatrixMark[];
  getMarksOnTarget: (targetId: string) => number;
  hasRequiredMarks: (targetId: string, required: number) => boolean;
} {
  const { matrixState } = useMatrixSession();

  const getMarksOnTarget = useCallback(
    (targetId: string): number => {
      if (!matrixState) return 0;
      return getMarksOnTargetFromState(matrixState, targetId);
    },
    [matrixState]
  );

  const hasRequiredMarks = useCallback(
    (targetId: string, required: number): boolean => {
      if (!matrixState) return required <= 0;
      return hasRequiredMarksFromState(matrixState, targetId, required);
    },
    [matrixState]
  );

  return useMemo(
    () => ({
      marksHeld: matrixState?.marksHeld ?? [],
      marksReceived: matrixState?.marksReceived ?? [],
      getMarksOnTarget,
      hasRequiredMarks,
    }),
    [matrixState?.marksHeld, matrixState?.marksReceived, getMarksOnTarget, hasRequiredMarks]
  );
}
