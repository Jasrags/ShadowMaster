/**
 * Drone Network Manager
 *
 * Manages drone WAN (Wide Area Network) coordination through RCC.
 * Handles slaving, autosoft sharing, and command issuance.
 *
 * SR5 Core Rulebook p. 265-269
 */

import type { CharacterDrone, CharacterAutosoft } from "@/lib/types/character";
import type {
  DroneNetwork,
  SlavedDrone,
  SharedAutosoft,
  InstalledAutosoft,
  RCCConfiguration,
  DroneCommandType,
  RiggingValidationError,
} from "@/lib/types/rigging";
import { VEHICLE_CONDITION_BASE } from "@/lib/types/rigging";
import { calculateMaxSlavedDrones } from "./rcc-validator";
import { calculateDroneNoise, type SpamZoneLevel, type StaticZoneLevel } from "./noise-calculator";

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface DroneNetworkResult {
  success: boolean;
  network: DroneNetwork | null;
  errors: RiggingValidationError[];
}

export interface SlaveOperationResult {
  success: boolean;
  network: DroneNetwork;
  errors: RiggingValidationError[];
  slavedDrone?: SlavedDrone;
}

export interface CommandResult {
  success: boolean;
  network: DroneNetwork;
  affectedDrones: string[];
  errors: RiggingValidationError[];
}

// =============================================================================
// NETWORK CREATION
// =============================================================================

/**
 * Create a new drone network for RCC
 */
export function createDroneNetwork(networkId: string, rccConfig: RCCConfiguration): DroneNetwork {
  // Convert running autosofts to shared autosofts
  const sharedAutosofts: SharedAutosoft[] = rccConfig.runningAutosofts.map((autosoft) => ({
    autosoftId: autosoft.autosoftId,
    name: autosoft.name,
    rating: autosoft.rating,
    category: autosoft.category,
    target: autosoft.target,
  }));

  return {
    networkId,
    rccId: rccConfig.rccId,
    slavedDrones: [],
    maxDrones: rccConfig.maxSlavedDrones,
    sharedAutosofts,
    baseNoise: 0,
  };
}

// =============================================================================
// DRONE SLAVING
// =============================================================================

/**
 * Calculate drone condition monitor from Body
 * Formula: ceil(Body / 2) + 8
 */
export function calculateDroneConditionMonitor(body: number): number {
  return Math.ceil(body / 2) + VEHICLE_CONDITION_BASE;
}

/**
 * Convert CharacterDrone to SlavedDrone
 * Note: installedAutosofts are just IDs - caller should resolve from character's autosofts if needed
 */
function createSlavedDrone(
  drone: CharacterDrone,
  distanceFromRigger: number = 0,
  rccNoiseReduction: number = 0,
  autosofts?: CharacterAutosoft[]
): SlavedDrone {
  // Calculate noise for this drone's distance
  const noiseCalc = calculateDroneNoise(distanceFromRigger, rccNoiseReduction);

  // Resolve installed autosoft IDs to full data
  const installedAutosoftIds = drone.installedAutosofts ?? [];
  const installedAutosofts: InstalledAutosoft[] = installedAutosoftIds.map((autosoftId) => {
    // Find the autosoft in character's owned autosofts
    const autosoft = autosofts?.find((a) => a.id === autosoftId || a.catalogId === autosoftId);
    if (!autosoft) {
      // Return placeholder if not found
      return {
        autosoftId,
        name: autosoftId,
        rating: 1,
        category: "perception" as const,
        target: undefined,
      };
    }
    return {
      autosoftId: autosoft.catalogId,
      name: autosoft.name,
      rating: autosoft.rating,
      category: autosoft.category,
      target: autosoft.target,
    };
  });

  return {
    droneId: drone.id ?? drone.catalogId,
    catalogId: drone.catalogId,
    name: drone.customName ?? drone.name,
    pilotRating: drone.pilot,
    controlMode: "remote",
    isJumpedIn: false,
    conditionDamageTaken: 0, // Start undamaged; track damage through gameplay
    conditionMonitorMax: calculateDroneConditionMonitor(drone.body),
    currentCommand: undefined,
    customCommandDescription: undefined,
    distanceFromRigger,
    noisePenalty: noiseCalc.totalNoise,
    installedAutosofts,
  };
}

/**
 * Slave a drone to the network
 */
export function slaveDroneToNetwork(
  network: DroneNetwork,
  drone: CharacterDrone,
  rccNoiseReduction: number,
  distanceFromRigger: number = 0,
  autosofts?: CharacterAutosoft[]
): SlaveOperationResult {
  const errors: RiggingValidationError[] = [];

  // Check if already at capacity
  if (network.slavedDrones.length >= network.maxDrones) {
    errors.push({
      code: "NETWORK_FULL",
      message: `Cannot slave drone: network is at capacity (${network.maxDrones} drones)`,
      field: "slavedDrones",
    });
    return { success: false, network, errors };
  }

  // Check if drone is already slaved
  const droneId = drone.id ?? drone.catalogId;
  if (network.slavedDrones.some((d) => d.droneId === droneId)) {
    errors.push({
      code: "ALREADY_SLAVED",
      message: `Drone "${drone.name}" is already slaved to this network`,
      field: "droneId",
    });
    return { success: false, network, errors };
  }

  // Create slaved drone entry
  const slavedDrone = createSlavedDrone(drone, distanceFromRigger, rccNoiseReduction, autosofts);

  // Add to network
  const updatedNetwork: DroneNetwork = {
    ...network,
    slavedDrones: [...network.slavedDrones, slavedDrone],
  };

  return {
    success: true,
    network: updatedNetwork,
    errors: [],
    slavedDrone,
  };
}

/**
 * Release a drone from the network
 */
export function releaseDroneFromNetwork(network: DroneNetwork, droneId: string): DroneNetwork {
  return {
    ...network,
    slavedDrones: network.slavedDrones.filter((d) => d.droneId !== droneId),
  };
}

/**
 * Release all drones from the network
 */
export function releaseAllDrones(network: DroneNetwork): DroneNetwork {
  return {
    ...network,
    slavedDrones: [],
  };
}

// =============================================================================
// AUTOSOFT SHARING
// =============================================================================

/**
 * Add a shared autosoft to the network
 */
export function shareAutosoftToNetwork(
  network: DroneNetwork,
  autosoft: CharacterAutosoft
): DroneNetwork {
  const sharedAutosoft: SharedAutosoft = {
    autosoftId: autosoft.catalogId,
    name: autosoft.name,
    rating: autosoft.rating,
    category: autosoft.category,
    target: autosoft.target,
  };

  return {
    ...network,
    sharedAutosofts: [...network.sharedAutosofts, sharedAutosoft],
  };
}

/**
 * Remove a shared autosoft from the network
 */
export function unshareAutosoftFromNetwork(
  network: DroneNetwork,
  autosoftId: string
): DroneNetwork {
  return {
    ...network,
    sharedAutosofts: network.sharedAutosofts.filter((a) => a.autosoftId !== autosoftId),
  };
}

/**
 * Get effective autosoft rating for a drone
 * Returns the higher of installed vs shared from RCC
 */
export function getEffectiveAutosoftRating(
  drone: SlavedDrone,
  autosoftCategory: string,
  sharedAutosofts: SharedAutosoft[],
  target?: string
): number {
  // Check installed autosofts on drone
  const installedMatch = drone.installedAutosofts.find(
    (a) =>
      a.category === autosoftCategory &&
      (target === undefined || a.target === target || a.target === undefined)
  );
  const installedRating = installedMatch?.rating ?? 0;

  // Check shared autosofts from RCC
  const sharedMatch = sharedAutosofts.find(
    (a) =>
      a.category === autosoftCategory &&
      (target === undefined || a.target === target || a.target === undefined)
  );
  const sharedRating = sharedMatch?.rating ?? 0;

  // Return the higher of the two
  return Math.max(installedRating, sharedRating);
}

/**
 * Get all effective autosofts for a drone (merged installed + shared)
 */
export function getEffectiveAutosofts(
  drone: SlavedDrone,
  sharedAutosofts: SharedAutosoft[]
): SharedAutosoft[] {
  const result: Map<string, SharedAutosoft> = new Map();

  // Add shared autosofts first
  for (const autosoft of sharedAutosofts) {
    const key = `${autosoft.category}:${autosoft.target ?? "any"}`;
    result.set(key, autosoft);
  }

  // Override with installed if higher rating
  for (const installed of drone.installedAutosofts) {
    const key = `${installed.category}:${installed.target ?? "any"}`;
    const existing = result.get(key);
    if (!existing || installed.rating > existing.rating) {
      result.set(key, {
        autosoftId: installed.autosoftId,
        name: installed.name,
        rating: installed.rating,
        category: installed.category,
        target: installed.target,
      });
    }
  }

  return Array.from(result.values());
}

// =============================================================================
// COMMAND ISSUANCE
// =============================================================================

/**
 * Issue command to a single drone
 */
export function issueDroneCommand(
  network: DroneNetwork,
  droneId: string,
  command: DroneCommandType,
  customDescription?: string
): CommandResult {
  const errors: RiggingValidationError[] = [];

  // Find the drone
  const droneIndex = network.slavedDrones.findIndex((d) => d.droneId === droneId);
  if (droneIndex === -1) {
    errors.push({
      code: "DRONE_NOT_FOUND",
      message: `Drone "${droneId}" is not slaved to this network`,
      field: "droneId",
    });
    return { success: false, network, affectedDrones: [], errors };
  }

  // Update drone with new command
  const updatedDrones = [...network.slavedDrones];
  updatedDrones[droneIndex] = {
    ...updatedDrones[droneIndex],
    currentCommand: command,
    customCommandDescription: command === "custom" ? customDescription : undefined,
  };

  return {
    success: true,
    network: { ...network, slavedDrones: updatedDrones },
    affectedDrones: [droneId],
    errors: [],
  };
}

/**
 * Issue command to all drones in network
 */
export function issueNetworkCommand(
  network: DroneNetwork,
  command: DroneCommandType,
  customDescription?: string
): CommandResult {
  if (network.slavedDrones.length === 0) {
    return {
      success: true,
      network,
      affectedDrones: [],
      errors: [],
    };
  }

  const updatedDrones = network.slavedDrones.map((drone) => ({
    ...drone,
    currentCommand: command,
    customCommandDescription: command === "custom" ? customDescription : undefined,
  }));

  return {
    success: true,
    network: { ...network, slavedDrones: updatedDrones },
    affectedDrones: updatedDrones.map((d) => d.droneId),
    errors: [],
  };
}

/**
 * Clear command from a drone
 */
export function clearDroneCommand(network: DroneNetwork, droneId: string): DroneNetwork {
  return {
    ...network,
    slavedDrones: network.slavedDrones.map((drone) =>
      drone.droneId === droneId
        ? { ...drone, currentCommand: undefined, customCommandDescription: undefined }
        : drone
    ),
  };
}

/**
 * Clear all commands from network
 */
export function clearAllCommands(network: DroneNetwork): DroneNetwork {
  return {
    ...network,
    slavedDrones: network.slavedDrones.map((drone) => ({
      ...drone,
      currentCommand: undefined,
      customCommandDescription: undefined,
    })),
  };
}

// =============================================================================
// POSITION & NOISE UPDATES
// =============================================================================

/**
 * Update drone position and recalculate noise
 */
export function updateDronePosition(
  network: DroneNetwork,
  droneId: string,
  distanceMeters: number,
  rccNoiseReduction: number,
  environment?: {
    spamZone?: SpamZoneLevel;
    staticZone?: StaticZoneLevel;
  }
): DroneNetwork {
  const noiseCalc = calculateDroneNoise(distanceMeters, rccNoiseReduction, {
    spamZone: environment?.spamZone,
    staticZone: environment?.staticZone,
  });

  return {
    ...network,
    slavedDrones: network.slavedDrones.map((drone) =>
      drone.droneId === droneId
        ? {
            ...drone,
            distanceFromRigger: distanceMeters,
            noisePenalty: noiseCalc.totalNoise,
          }
        : drone
    ),
  };
}

/**
 * Update all drone positions (batch update)
 */
export function updateAllDronePositions(
  network: DroneNetwork,
  positions: Array<{ droneId: string; distanceMeters: number }>,
  rccNoiseReduction: number
): DroneNetwork {
  const positionMap = new Map(positions.map((p) => [p.droneId, p.distanceMeters]));

  return {
    ...network,
    slavedDrones: network.slavedDrones.map((drone) => {
      const distance = positionMap.get(drone.droneId);
      if (distance === undefined) {
        return drone;
      }
      const noiseCalc = calculateDroneNoise(distance, rccNoiseReduction);
      return {
        ...drone,
        distanceFromRigger: distance,
        noisePenalty: noiseCalc.totalNoise,
      };
    }),
  };
}

// =============================================================================
// NETWORK QUERIES
// =============================================================================

/**
 * Get a drone from the network by ID
 */
export function getDroneFromNetwork(network: DroneNetwork, droneId: string): SlavedDrone | null {
  return network.slavedDrones.find((d) => d.droneId === droneId) ?? null;
}

/**
 * Get count of slaved drones
 */
export function getSlavedDroneCount(network: DroneNetwork): number {
  return network.slavedDrones.length;
}

/**
 * Get remaining drone capacity
 */
export function getRemainingCapacity(network: DroneNetwork): number {
  return network.maxDrones - network.slavedDrones.length;
}

/**
 * Check if network is at capacity
 */
export function isNetworkFull(network: DroneNetwork): boolean {
  return network.slavedDrones.length >= network.maxDrones;
}

/**
 * Get drones with a specific command
 */
export function getDronesWithCommand(
  network: DroneNetwork,
  command: DroneCommandType
): SlavedDrone[] {
  return network.slavedDrones.filter((d) => d.currentCommand === command);
}

/**
 * Get drones that are jumped into
 */
export function getJumpedInDrone(network: DroneNetwork): SlavedDrone | null {
  return network.slavedDrones.find((d) => d.isJumpedIn) ?? null;
}
