/**
 * Drone Condition Tracker
 *
 * Tracks drone damage, condition monitors, and destruction state.
 * Drones use physical condition monitor based on Body attribute.
 *
 * SR5 Core Rulebook p. 199 (Condition Monitors)
 */

import type { SlavedDrone, DroneNetwork } from "@/lib/types/rigging";
import { VEHICLE_CONDITION_BASE } from "@/lib/types/rigging";

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface DroneConditionResult {
  conditionMonitorMax: number;
  currentDamage: number;
  remainingBoxes: number;
  damageModifier: number;
  isDisabled: boolean;
  isDestroyed: boolean;
}

export interface DamageApplicationResult {
  drone: SlavedDrone;
  damageApplied: number;
  overflow: number;
  wasDestroyed: boolean;
  previousDamage: number;
}

export interface RepairResult {
  drone: SlavedDrone;
  healedAmount: number;
  previousDamage: number;
  currentDamage: number;
}

// =============================================================================
// CONDITION MONITOR CALCULATIONS
// =============================================================================

/**
 * Calculate drone condition monitor from Body
 * Formula: ceil(Body / 2) + 8
 */
export function calculateDroneConditionMonitor(body: number): number {
  return Math.ceil(body / 2) + VEHICLE_CONDITION_BASE;
}

/**
 * Get the damage modifier (wound penalty) for a drone
 * Every 3 boxes of damage = -1 penalty
 */
export function getDroneDamageModifier(damage: number): number {
  return -Math.floor(damage / 3);
}

/**
 * Get full condition status for a drone
 */
export function getDroneConditionStatus(drone: SlavedDrone): DroneConditionResult {
  const conditionMonitorMax = drone.conditionMonitorMax;
  const currentDamage = drone.conditionDamageTaken;
  const remainingBoxes = Math.max(0, conditionMonitorMax - currentDamage);
  const damageModifier = getDroneDamageModifier(currentDamage);
  const isDisabled = currentDamage >= conditionMonitorMax;
  const isDestroyed = currentDamage > conditionMonitorMax;

  return {
    conditionMonitorMax,
    currentDamage,
    remainingBoxes,
    damageModifier,
    isDisabled,
    isDestroyed,
  };
}

// =============================================================================
// DAMAGE APPLICATION
// =============================================================================

/**
 * Apply damage to a drone
 * Returns updated drone and overflow damage
 */
export function applyDroneDamage(
  drone: SlavedDrone,
  damage: number
): DamageApplicationResult {
  const previousDamage = drone.conditionDamageTaken;
  const newDamage = previousDamage + damage;
  const overflow = Math.max(0, newDamage - drone.conditionMonitorMax);
  const actualDamage = Math.min(damage, drone.conditionMonitorMax - previousDamage + 1);

  const updatedDrone: SlavedDrone = {
    ...drone,
    conditionDamageTaken: Math.min(newDamage, drone.conditionMonitorMax + 1), // +1 for destroyed state
  };

  return {
    drone: updatedDrone,
    damageApplied: actualDamage,
    overflow,
    wasDestroyed: newDamage > drone.conditionMonitorMax,
    previousDamage,
  };
}

/**
 * Apply damage to a drone in a network
 */
export function applyDamageToNetworkDrone(
  network: DroneNetwork,
  droneId: string,
  damage: number
): { network: DroneNetwork; result: DamageApplicationResult | null } {
  const droneIndex = network.slavedDrones.findIndex((d) => d.droneId === droneId);
  if (droneIndex === -1) {
    return { network, result: null };
  }

  const drone = network.slavedDrones[droneIndex];
  const result = applyDroneDamage(drone, damage);

  const updatedDrones = [...network.slavedDrones];
  updatedDrones[droneIndex] = result.drone;

  return {
    network: { ...network, slavedDrones: updatedDrones },
    result,
  };
}

// =============================================================================
// REPAIR/HEALING
// =============================================================================

/**
 * Repair drone damage
 * Repairs cannot exceed the current damage
 */
export function repairDroneDamage(
  drone: SlavedDrone,
  healAmount: number
): RepairResult {
  const previousDamage = drone.conditionDamageTaken;
  const actualHeal = Math.min(healAmount, previousDamage);
  const currentDamage = previousDamage - actualHeal;

  const updatedDrone: SlavedDrone = {
    ...drone,
    conditionDamageTaken: currentDamage,
  };

  return {
    drone: updatedDrone,
    healedAmount: actualHeal,
    previousDamage,
    currentDamage,
  };
}

/**
 * Fully repair a drone
 */
export function fullyRepairDrone(drone: SlavedDrone): SlavedDrone {
  return {
    ...drone,
    conditionDamageTaken: 0,
  };
}

/**
 * Repair a drone in a network
 */
export function repairNetworkDrone(
  network: DroneNetwork,
  droneId: string,
  healAmount: number
): { network: DroneNetwork; result: RepairResult | null } {
  const droneIndex = network.slavedDrones.findIndex((d) => d.droneId === droneId);
  if (droneIndex === -1) {
    return { network, result: null };
  }

  const drone = network.slavedDrones[droneIndex];
  const result = repairDroneDamage(drone, healAmount);

  const updatedDrones = [...network.slavedDrones];
  updatedDrones[droneIndex] = result.drone;

  return {
    network: { ...network, slavedDrones: updatedDrones },
    result,
  };
}

// =============================================================================
// STATUS CHECKS
// =============================================================================

/**
 * Check if drone is destroyed (overflow damage)
 */
export function isDroneDestroyed(drone: SlavedDrone): boolean {
  return drone.conditionDamageTaken > drone.conditionMonitorMax;
}

/**
 * Check if drone is disabled (at max damage but not destroyed)
 */
export function isDroneDisabled(drone: SlavedDrone): boolean {
  return drone.conditionDamageTaken >= drone.conditionMonitorMax;
}

/**
 * Check if drone is operational (can take actions)
 */
export function isDroneOperational(drone: SlavedDrone): boolean {
  return drone.conditionDamageTaken < drone.conditionMonitorMax;
}

/**
 * Check if drone is lightly damaged (< 25% damage)
 */
export function isDroneLightlyDamaged(drone: SlavedDrone): boolean {
  const percentage = drone.conditionDamageTaken / drone.conditionMonitorMax;
  return percentage > 0 && percentage < 0.25;
}

/**
 * Check if drone is moderately damaged (25-50% damage)
 */
export function isDroneModeratelyDamaged(drone: SlavedDrone): boolean {
  const percentage = drone.conditionDamageTaken / drone.conditionMonitorMax;
  return percentage >= 0.25 && percentage < 0.5;
}

/**
 * Check if drone is heavily damaged (50-75% damage)
 */
export function isDroneHeavilyDamaged(drone: SlavedDrone): boolean {
  const percentage = drone.conditionDamageTaken / drone.conditionMonitorMax;
  return percentage >= 0.5 && percentage < 0.75;
}

/**
 * Check if drone is critically damaged (75%+ damage)
 */
export function isDroneCriticallyDamaged(drone: SlavedDrone): boolean {
  const percentage = drone.conditionDamageTaken / drone.conditionMonitorMax;
  return percentage >= 0.75 && percentage < 1;
}

/**
 * Get damage severity description
 */
export function getDroneDamageSeverity(
  drone: SlavedDrone
): "undamaged" | "light" | "moderate" | "heavy" | "critical" | "disabled" | "destroyed" {
  if (isDroneDestroyed(drone)) return "destroyed";
  if (isDroneDisabled(drone)) return "disabled";
  if (drone.conditionDamageTaken === 0) return "undamaged";
  if (isDroneLightlyDamaged(drone)) return "light";
  if (isDroneModeratelyDamaged(drone)) return "moderate";
  if (isDroneHeavilyDamaged(drone)) return "heavy";
  return "critical";
}

// =============================================================================
// NETWORK-LEVEL QUERIES
// =============================================================================

/**
 * Get all operational drones in network
 */
export function getOperationalDrones(network: DroneNetwork): SlavedDrone[] {
  return network.slavedDrones.filter(isDroneOperational);
}

/**
 * Get all destroyed drones in network
 */
export function getDestroyedDrones(network: DroneNetwork): SlavedDrone[] {
  return network.slavedDrones.filter(isDroneDestroyed);
}

/**
 * Get all disabled drones in network
 */
export function getDisabledDrones(network: DroneNetwork): SlavedDrone[] {
  return network.slavedDrones.filter(isDroneDisabled);
}

/**
 * Get count of operational drones
 */
export function getOperationalDroneCount(network: DroneNetwork): number {
  return getOperationalDrones(network).length;
}

/**
 * Get network health summary
 */
export function getNetworkHealthSummary(network: DroneNetwork): {
  total: number;
  operational: number;
  disabled: number;
  destroyed: number;
  averageDamagePercent: number;
} {
  const total = network.slavedDrones.length;
  const operational = getOperationalDroneCount(network);
  const destroyed = getDestroyedDrones(network).length;
  const disabled = getDisabledDrones(network).length - destroyed; // Disabled includes destroyed

  // Calculate average damage percentage
  let totalDamagePercent = 0;
  for (const drone of network.slavedDrones) {
    totalDamagePercent += drone.conditionDamageTaken / drone.conditionMonitorMax;
  }
  const averageDamagePercent = total > 0 ? (totalDamagePercent / total) * 100 : 0;

  return {
    total,
    operational,
    disabled,
    destroyed,
    averageDamagePercent,
  };
}

/**
 * Remove destroyed drones from network
 */
export function removeDestroyedDrones(network: DroneNetwork): DroneNetwork {
  return {
    ...network,
    slavedDrones: network.slavedDrones.filter((d) => !isDroneDestroyed(d)),
  };
}
