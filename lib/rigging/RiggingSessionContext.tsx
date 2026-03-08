"use client";

/**
 * Rigging Session Context
 *
 * Provides rigging session state management for a single character.
 * Client-driven ephemeral state that lives entirely in React context
 * and resets on navigation. Follows the MatrixSessionContext pattern.
 *
 * Rule engine functions (drone-network, jumped-in-manager, biofeedback-handler)
 * are pure and called directly from this context, not via API.
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
import type { Character, CharacterDrone, CharacterAutosoft } from "@/lib/types";
import type {
  RiggingState,
  DroneNetwork,
  JumpedInState,
  RCCConfiguration,
  RiggerVRMode,
  DroneCommandType,
} from "@/lib/types/rigging";
import { hasRiggingAccess } from "@/components/character/sheet/rigging-helpers";
import {
  hasVehicleControlRig,
  getVehicleControlRig,
  hasRCC,
  getActiveRCC,
  buildRCCConfiguration,
  getOwnedDrones,
  getOwnedAutosofts,
} from "@/lib/rules/rigging";
import {
  createDroneNetwork,
  slaveDroneToNetwork,
  releaseDroneFromNetwork,
  releaseAllDrones,
  shareAutosoftToNetwork,
  unshareAutosoftFromNetwork,
  issueDroneCommand,
  issueNetworkCommand,
  getSlavedDroneCount,
  getRemainingCapacity,
  isNetworkFull,
} from "@/lib/rules/rigging/drone-network";
import {
  jumpIn as jumpInFn,
  jumpOut as jumpOutFn,
  switchVRMode as switchVRModeFn,
  isJumpedIn as isJumpedInFn,
  isBodyVulnerable as isBodyVulnerableFn,
  getJumpedInDuration as getJumpedInDurationFn,
} from "@/lib/rules/rigging/jumped-in-manager";
import {
  trackBiofeedbackDamage as trackBiofeedbackDamageFn,
  handleForcedEjection as handleForcedEjectionFn,
  getBiofeedbackWarningLevel as getBiofeedbackWarningLevelFn,
} from "@/lib/rules/rigging/biofeedback-handler";
import type { ForcedEjectionResult } from "@/lib/rules/rigging/biofeedback-handler";
import type { SlaveOperationResult, CommandResult } from "@/lib/rules/rigging/drone-network";
import type { JumpInResult, JumpOutResult } from "@/lib/rules/rigging/jumped-in-manager";

// =============================================================================
// Types
// =============================================================================

export interface RiggingSessionState {
  /** Full rigging state (null if no rigging hardware) */
  riggingState: RiggingState | null;
  /** Whether character has rigging-related equipment */
  hasRiggingHardware: boolean;
  /** Whether a rigging session is active */
  isSessionActive: boolean;
  /** Active drone network */
  droneNetwork: DroneNetwork | null;
  /** Active RCC configuration */
  rccConfig: RCCConfiguration | null;
  /** Current jumped-in state */
  jumpedInState: JumpedInState | undefined;
  /** Whether currently jumped in */
  isJumpedIn: boolean;
  /** Whether rigger body is vulnerable */
  isBodyVulnerable: boolean;
  /** Biofeedback warning level */
  biofeedbackWarningLevel: "safe" | "caution" | "danger" | "critical";
  /** Whether an action is in progress */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export interface RiggingSessionActions {
  /** Start a rigging session */
  startSession: () => void;
  /** End the rigging session */
  endSession: () => void;
  /** Slave a drone to the network */
  slaveDrone: (drone: CharacterDrone) => SlaveOperationResult;
  /** Release a drone from the network */
  releaseDrone: (droneId: string) => void;
  /** Release all drones */
  releaseAllDrones: () => void;
  /** Jump into a vehicle or drone */
  jumpIn: (
    targetId: string,
    targetType: "vehicle" | "drone",
    targetName: string,
    vrMode: RiggerVRMode
  ) => JumpInResult;
  /** Jump out of current vehicle/drone */
  jumpOut: () => JumpOutResult;
  /** Switch VR mode while jumped in */
  switchVRMode: (newMode: RiggerVRMode) => void;
  /** Issue command to a single drone */
  issueDroneCommand: (
    droneId: string,
    command: DroneCommandType,
    customDescription?: string
  ) => CommandResult;
  /** Issue command to all drones */
  issueNetworkCommand: (command: DroneCommandType, customDescription?: string) => CommandResult;
  /** Share autosoft to network */
  shareAutosoft: (autosoft: CharacterAutosoft) => void;
  /** Unshare autosoft from network */
  unshareAutosoft: (autosoftId: string) => void;
  /** Track biofeedback damage */
  trackBiofeedback: (damage: number) => void;
  /** Handle forced ejection (dumpshock) */
  handleForcedEjection: (
    reason: "vehicle_destroyed" | "link_severed" | "jammed" | "ic_attack"
  ) => ForcedEjectionResult | null;
  /** Clear the current error */
  clearError: () => void;
}

export interface RiggingSessionContextValue extends RiggingSessionState, RiggingSessionActions {}

// =============================================================================
// Context
// =============================================================================

const RiggingSessionContext = createContext<RiggingSessionContextValue | null>(null);

// =============================================================================
// Helper: Build initial RiggingState from character data
// =============================================================================

function buildRiggingStateFromCharacter(character: Character): {
  riggingState: RiggingState | null;
  rccConfig: RCCConfiguration | null;
  droneNetwork: DroneNetwork | null;
} {
  if (!hasRiggingAccess(character)) {
    return { riggingState: null, rccConfig: null, droneNetwork: null };
  }

  const vcr = getVehicleControlRig(character);
  const autosofts = getOwnedAutosofts(character);

  // Build RCC configuration if available
  let rccConfig: RCCConfiguration | null = null;
  if (hasRCC(character)) {
    const rcc = getActiveRCC(character);
    if (rcc) {
      rccConfig = buildRCCConfiguration(rcc, autosofts);
    }
  }

  // Build drone network if RCC is available
  let droneNetwork: DroneNetwork | null = null;
  if (rccConfig) {
    droneNetwork = createDroneNetwork(`network-${character.id}`, rccConfig);
  }

  const riggingState: RiggingState = {
    sessionId: `rigging-${character.id}-${Date.now()}`,
    characterId: character.id,
    startedAt: new Date().toISOString(),
    vcr: vcr ?? undefined,
    rccConfig: rccConfig ?? undefined,
    droneNetwork: droneNetwork ?? undefined,
    biofeedbackDamageTaken: 0,
    biofeedbackDamageType: "stun",
    isActive: false,
  };

  return { riggingState, rccConfig, droneNetwork };
}

// =============================================================================
// Provider
// =============================================================================

interface RiggingSessionProviderProps {
  /** The character whose rigging session to manage */
  character: Character;
  /** Callback when character data changes */
  onCharacterUpdate: (updated: Character) => void;
  children: ReactNode;
}

export function RiggingSessionProvider({ character, children }: RiggingSessionProviderProps) {
  const [riggingState, setRiggingState] = useState<RiggingState | null>(() => {
    const built = buildRiggingStateFromCharacter(character);
    return built.riggingState;
  });
  const [rccConfig, setRccConfig] = useState<RCCConfiguration | null>(() => {
    const built = buildRiggingStateFromCharacter(character);
    return built.rccConfig;
  });
  const [droneNetwork, setDroneNetwork] = useState<DroneNetwork | null>(() => {
    const built = buildRiggingStateFromCharacter(character);
    return built.droneNetwork;
  });
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const hasRiggingHardware = useMemo(() => hasRiggingAccess(character), [character]);

  const isSessionActive = riggingState?.isActive ?? false;

  const jumpedInState = riggingState?.jumpedInState;

  const isJumpedInValue = riggingState ? isJumpedInFn(riggingState) : false;

  const isBodyVulnerableValue = riggingState ? isBodyVulnerableFn(riggingState) : false;

  const biofeedbackWarningLevel = useMemo(() => {
    if (!riggingState) return "safe" as const;
    return getBiofeedbackWarningLevelFn(riggingState, character);
  }, [riggingState, character]);

  // ---------------------------------------------------------------------------
  // Character sync: re-derive hardware fields when character prop changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!riggingState) {
      const built = buildRiggingStateFromCharacter(character);
      if (built.riggingState) {
        setRiggingState(built.riggingState);
        setRccConfig(built.rccConfig);
        setDroneNetwork(built.droneNetwork);
      }
      return;
    }

    // Character changed — sync hardware fields only
    const vcr = getVehicleControlRig(character);
    const autosofts = getOwnedAutosofts(character);

    let newRccConfig: RCCConfiguration | null = null;
    if (hasRCC(character)) {
      const rcc = getActiveRCC(character);
      if (rcc) {
        newRccConfig = buildRCCConfiguration(rcc, autosofts);
      }
    }

    // Update RCC config but preserve session state
    setRccConfig(newRccConfig);

    // Update VCR in rigging state
    setRiggingState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vcr: vcr ?? undefined,
        rccConfig: newRccConfig ?? undefined,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const startSession = useCallback(() => {
    if (!riggingState) {
      setError("No rigging hardware available");
      return;
    }

    const autosofts = getOwnedAutosofts(character);

    // Rebuild RCC config
    let newRccConfig: RCCConfiguration | null = null;
    if (hasRCC(character)) {
      const rcc = getActiveRCC(character);
      if (rcc) {
        newRccConfig = buildRCCConfiguration(rcc, autosofts);
      }
    }

    // Create drone network
    let newDroneNetwork: DroneNetwork | null = null;
    if (newRccConfig) {
      newDroneNetwork = createDroneNetwork(`network-${character.id}-${Date.now()}`, newRccConfig);
    }

    setRiggingState({
      ...riggingState,
      isActive: true,
      startedAt: new Date().toISOString(),
      sessionId: `rigging-${character.id}-${Date.now()}`,
      rccConfig: newRccConfig ?? undefined,
      droneNetwork: newDroneNetwork ?? undefined,
      jumpedInState: undefined,
      biofeedbackDamageTaken: 0,
      biofeedbackDamageType: "stun",
      endReason: undefined,
    });
    setRccConfig(newRccConfig);
    setDroneNetwork(newDroneNetwork);
    setError(null);
  }, [riggingState, character]);

  const endSession = useCallback(() => {
    setRiggingState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isActive: false,
        jumpedInState: undefined,
        droneNetwork: prev.droneNetwork ? releaseAllDrones(prev.droneNetwork) : undefined,
        biofeedbackDamageTaken: 0,
        endReason: "session_ended",
      };
    });
    setDroneNetwork((prev) => (prev ? releaseAllDrones(prev) : null));
    setError(null);
  }, []);

  const slaveDroneAction = useCallback(
    (drone: CharacterDrone): SlaveOperationResult => {
      if (!droneNetwork || !rccConfig) {
        return {
          success: false,
          network: droneNetwork!,
          errors: [{ code: "NO_NETWORK", message: "No active drone network" }],
        };
      }

      const autosofts = getOwnedAutosofts(character);
      const result = slaveDroneToNetwork(
        droneNetwork,
        drone,
        rccConfig.noiseReduction,
        0,
        autosofts
      );

      if (result.success) {
        setDroneNetwork(result.network);
        setRiggingState((prev) => {
          if (!prev) return prev;
          return { ...prev, droneNetwork: result.network };
        });
      }

      return result;
    },
    [droneNetwork, rccConfig, character]
  );

  const releaseDroneAction = useCallback(
    (droneId: string) => {
      if (!droneNetwork) return;

      const updated = releaseDroneFromNetwork(droneNetwork, droneId);
      setDroneNetwork(updated);
      setRiggingState((prev) => {
        if (!prev) return prev;
        return { ...prev, droneNetwork: updated };
      });
    },
    [droneNetwork]
  );

  const releaseAllDronesAction = useCallback(() => {
    if (!droneNetwork) return;

    const updated = releaseAllDrones(droneNetwork);
    setDroneNetwork(updated);
    setRiggingState((prev) => {
      if (!prev) return prev;
      return { ...prev, droneNetwork: updated };
    });
  }, [droneNetwork]);

  const jumpInAction = useCallback(
    (
      targetId: string,
      targetType: "vehicle" | "drone",
      targetName: string,
      vrMode: RiggerVRMode
    ): JumpInResult => {
      if (!riggingState) {
        return {
          success: false,
          jumpedInState: null,
          riggingState: riggingState!,
          errors: [{ code: "NO_STATE", message: "No rigging session active" }],
          warnings: [],
        };
      }

      const result = jumpInFn(character, riggingState, targetId, targetType, targetName, vrMode);

      if (result.success) {
        setRiggingState(result.riggingState);
        if (result.riggingState.droneNetwork) {
          setDroneNetwork(result.riggingState.droneNetwork);
        }
      }

      return result;
    },
    [riggingState, character]
  );

  const jumpOutAction = useCallback((): JumpOutResult => {
    if (!riggingState) {
      return {
        success: false,
        riggingState: riggingState!,
        previousState: null,
      };
    }

    const result = jumpOutFn(riggingState);

    if (result.success) {
      setRiggingState(result.riggingState);
      if (result.riggingState.droneNetwork) {
        setDroneNetwork(result.riggingState.droneNetwork);
      }
    }

    return result;
  }, [riggingState]);

  const switchVRModeAction = useCallback(
    (newMode: RiggerVRMode) => {
      if (!riggingState) return;
      const updated = switchVRModeFn(riggingState, newMode);
      setRiggingState(updated);
    },
    [riggingState]
  );

  const issueDroneCommandAction = useCallback(
    (droneId: string, command: DroneCommandType, customDescription?: string): CommandResult => {
      if (!droneNetwork) {
        return {
          success: false,
          network: droneNetwork!,
          affectedDrones: [],
          errors: [{ code: "NO_NETWORK", message: "No active drone network" }],
        };
      }

      const result = issueDroneCommand(droneNetwork, droneId, command, customDescription);

      if (result.success) {
        setDroneNetwork(result.network);
        setRiggingState((prev) => {
          if (!prev) return prev;
          return { ...prev, droneNetwork: result.network };
        });
      }

      return result;
    },
    [droneNetwork]
  );

  const issueNetworkCommandAction = useCallback(
    (command: DroneCommandType, customDescription?: string): CommandResult => {
      if (!droneNetwork) {
        return {
          success: false,
          network: droneNetwork!,
          affectedDrones: [],
          errors: [{ code: "NO_NETWORK", message: "No active drone network" }],
        };
      }

      const result = issueNetworkCommand(droneNetwork, command, customDescription);

      if (result.success) {
        setDroneNetwork(result.network);
        setRiggingState((prev) => {
          if (!prev) return prev;
          return { ...prev, droneNetwork: result.network };
        });
      }

      return result;
    },
    [droneNetwork]
  );

  const shareAutosoftAction = useCallback(
    (autosoft: CharacterAutosoft) => {
      if (!droneNetwork) return;

      const updated = shareAutosoftToNetwork(droneNetwork, autosoft);
      setDroneNetwork(updated);
      setRiggingState((prev) => {
        if (!prev) return prev;
        return { ...prev, droneNetwork: updated };
      });
    },
    [droneNetwork]
  );

  const unshareAutosoftAction = useCallback(
    (autosoftId: string) => {
      if (!droneNetwork) return;

      const updated = unshareAutosoftFromNetwork(droneNetwork, autosoftId);
      setDroneNetwork(updated);
      setRiggingState((prev) => {
        if (!prev) return prev;
        return { ...prev, droneNetwork: updated };
      });
    },
    [droneNetwork]
  );

  const trackBiofeedbackAction = useCallback(
    (damage: number) => {
      if (!riggingState) return;
      const updated = trackBiofeedbackDamageFn(riggingState, damage);
      setRiggingState(updated);
    },
    [riggingState]
  );

  const handleForcedEjectionAction = useCallback(
    (
      reason: "vehicle_destroyed" | "link_severed" | "jammed" | "ic_attack"
    ): ForcedEjectionResult | null => {
      if (!riggingState) return null;

      const result = handleForcedEjectionFn(riggingState, reason);

      setRiggingState(result.riggingState);
      if (result.riggingState.droneNetwork) {
        setDroneNetwork(result.riggingState.droneNetwork);
      }

      return result;
    },
    [riggingState]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------

  const value = useMemo<RiggingSessionContextValue>(
    () => ({
      // State
      riggingState,
      hasRiggingHardware,
      isSessionActive,
      droneNetwork,
      rccConfig,
      jumpedInState,
      isJumpedIn: isJumpedInValue,
      isBodyVulnerable: isBodyVulnerableValue,
      biofeedbackWarningLevel,
      isLoading,
      error,
      // Actions
      startSession,
      endSession,
      slaveDrone: slaveDroneAction,
      releaseDrone: releaseDroneAction,
      releaseAllDrones: releaseAllDronesAction,
      jumpIn: jumpInAction,
      jumpOut: jumpOutAction,
      switchVRMode: switchVRModeAction,
      issueDroneCommand: issueDroneCommandAction,
      issueNetworkCommand: issueNetworkCommandAction,
      shareAutosoft: shareAutosoftAction,
      unshareAutosoft: unshareAutosoftAction,
      trackBiofeedback: trackBiofeedbackAction,
      handleForcedEjection: handleForcedEjectionAction,
      clearError,
    }),
    [
      riggingState,
      hasRiggingHardware,
      isSessionActive,
      droneNetwork,
      rccConfig,
      jumpedInState,
      isJumpedInValue,
      isBodyVulnerableValue,
      biofeedbackWarningLevel,
      isLoading,
      error,
      startSession,
      endSession,
      slaveDroneAction,
      releaseDroneAction,
      releaseAllDronesAction,
      jumpInAction,
      jumpOutAction,
      switchVRModeAction,
      issueDroneCommandAction,
      issueNetworkCommandAction,
      shareAutosoftAction,
      unshareAutosoftAction,
      trackBiofeedbackAction,
      handleForcedEjectionAction,
      clearError,
    ]
  );

  return <RiggingSessionContext.Provider value={value}>{children}</RiggingSessionContext.Provider>;
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to access rigging session context.
 * Returns safe defaults when used outside the provider (does not throw).
 */
export function useRiggingSession(): RiggingSessionContextValue {
  const context = useContext(RiggingSessionContext);

  if (!context) {
    return {
      riggingState: null,
      hasRiggingHardware: false,
      isSessionActive: false,
      droneNetwork: null,
      rccConfig: null,
      jumpedInState: undefined,
      isJumpedIn: false,
      isBodyVulnerable: false,
      biofeedbackWarningLevel: "safe",
      isLoading: false,
      error: null,
      startSession: () => {},
      endSession: () => {},
      slaveDrone: () => ({
        success: false,
        network: null as unknown as DroneNetwork,
        errors: [{ code: "NO_PROVIDER", message: "RiggingSessionProvider not mounted" }],
      }),
      releaseDrone: () => {},
      releaseAllDrones: () => {},
      jumpIn: () => ({
        success: false,
        jumpedInState: null,
        riggingState: null as unknown as RiggingState,
        errors: [{ code: "NO_PROVIDER", message: "RiggingSessionProvider not mounted" }],
        warnings: [],
      }),
      jumpOut: () => ({
        success: false,
        riggingState: null as unknown as RiggingState,
        previousState: null,
      }),
      switchVRMode: () => {},
      issueDroneCommand: () => ({
        success: false,
        network: null as unknown as DroneNetwork,
        affectedDrones: [],
        errors: [{ code: "NO_PROVIDER", message: "RiggingSessionProvider not mounted" }],
      }),
      issueNetworkCommand: () => ({
        success: false,
        network: null as unknown as DroneNetwork,
        affectedDrones: [],
        errors: [{ code: "NO_PROVIDER", message: "RiggingSessionProvider not mounted" }],
      }),
      shareAutosoft: () => {},
      unshareAutosoft: () => {},
      trackBiofeedback: () => {},
      handleForcedEjection: () => null,
      clearError: () => {},
    };
  }

  return context;
}

/**
 * Specialized hook for drone network state.
 * Provides a focused view of drone network data.
 */
export function useDroneNetwork(): {
  network: DroneNetwork | null;
  slavedCount: number;
  remainingCapacity: number;
  isFull: boolean;
  rccConfig: RCCConfiguration | null;
} {
  const { droneNetwork, rccConfig } = useRiggingSession();

  return useMemo(
    () => ({
      network: droneNetwork,
      slavedCount: droneNetwork ? getSlavedDroneCount(droneNetwork) : 0,
      remainingCapacity: droneNetwork ? getRemainingCapacity(droneNetwork) : 0,
      isFull: droneNetwork ? isNetworkFull(droneNetwork) : false,
      rccConfig,
    }),
    [droneNetwork, rccConfig]
  );
}

/**
 * Specialized hook for jumped-in state.
 * Provides a focused view of jump-in data.
 */
export function useJumpedInState(): {
  jumpedInState: JumpedInState | undefined;
  isJumpedIn: boolean;
  isBodyVulnerable: boolean;
  targetName: string | null;
  vrMode: RiggerVRMode | null;
  duration: number;
} {
  const { riggingState, jumpedInState, isJumpedIn, isBodyVulnerable } = useRiggingSession();

  return useMemo(
    () => ({
      jumpedInState,
      isJumpedIn,
      isBodyVulnerable,
      targetName: jumpedInState?.targetName ?? null,
      vrMode: jumpedInState?.vrMode ?? null,
      duration: riggingState ? getJumpedInDurationFn(riggingState) : 0,
    }),
    [jumpedInState, isJumpedIn, isBodyVulnerable, riggingState]
  );
}
