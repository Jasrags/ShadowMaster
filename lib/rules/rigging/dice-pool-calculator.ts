/**
 * Vehicle Dice Pool Calculator
 *
 * Calculates dice pools for vehicle/drone tests based on control mode,
 * autosofts, VCR bonuses, and other modifiers.
 *
 * Based on SR5 Core Rulebook Chapter 11: Riggers
 */

import type { Character } from "@/lib/types/character";
import type {
  RiggingState,
  ControlMode,
  VehicleTestType,
  SlavedDrone,
  SharedAutosoft,
  ActiveVehicleState,
} from "@/lib/types/rigging";
import type { VehicleCatalogItem, DroneCatalogItem, HandlingRating } from "@/lib/types/vehicles";
import {
  getApplicableAutosofts,
  getControlModeBonus,
  getLimitTypeForTest,
  type VehicleActionValidation,
} from "./action-validator";
import type { VehicleActionType } from "@/lib/types/rigging";

// =============================================================================
// RESULT TYPES
// =============================================================================

/**
 * Component of a dice pool calculation
 */
export interface DicePoolComponent {
  /** Source of this component */
  source: string;
  /** Attribute used (if applicable) */
  attribute?: string;
  /** Skill used (if applicable) */
  skill?: string;
  /** Autosoft used (if applicable) */
  autosoft?: string;
  /** Modifier description */
  modifier?: string;
  /** Value added to pool */
  value: number;
}

/**
 * Complete dice pool calculation result
 */
export interface VehicleDicePoolResult {
  /** Total dice pool */
  pool: number;
  /** Human-readable formula */
  formula: string;
  /** Breakdown of pool components */
  breakdown: DicePoolComponent[];
  /** Limit for this test */
  limit: number;
  /** Type of limit applied */
  limitType: "handling" | "speed" | "sensor";
  /** Control mode used */
  controlMode: ControlMode;
  /** Any penalties applied */
  penalties: DicePoolComponent[];
}

// =============================================================================
// ATTRIBUTE LOOKUPS
// =============================================================================

/**
 * Get character attribute value
 */
function getAttributeValue(character: Character, attribute: string): number {
  const attrs = character.attributes;
  switch (attribute.toLowerCase()) {
    case "reaction":
    case "rea":
      return attrs.reaction || 0;
    case "intuition":
    case "int":
      return attrs.intuition || 0;
    case "logic":
    case "log":
      return attrs.logic || 0;
    case "agility":
    case "agi":
      return attrs.agility || 0;
    case "willpower":
    case "wil":
      return attrs.willpower || 0;
    default:
      return 0;
  }
}

/**
 * Get character skill value
 */
function getSkillValue(character: Character, skillName: string): number {
  const skills = character.skills || {};

  // Try direct lookup first
  if (skills[skillName] !== undefined) {
    return skills[skillName];
  }

  // Try lowercase match
  const lowerSkill = skillName.toLowerCase();
  for (const [key, rating] of Object.entries(skills)) {
    if (key.toLowerCase() === lowerSkill || key.toLowerCase().includes(lowerSkill)) {
      return rating;
    }
  }

  return 0;
}

/**
 * Get the appropriate pilot skill for a vehicle category
 */
function getPilotSkillForVehicle(category: string): string {
  switch (category) {
    case "bikes":
    case "cars":
    case "trucks":
      return "pilot_ground_craft";
    case "boats":
    case "submarines":
      return "pilot_watercraft";
    case "fixed-wing":
    case "rotorcraft":
    case "vtol":
    case "lav":
      return "pilot_aircraft";
    default:
      return "pilot_ground_craft";
  }
}

/**
 * Get the attribute used for vehicle tests by test type
 */
function getAttributeForTestType(testType: VehicleTestType): string {
  switch (testType) {
    case "control":
    case "chase":
    case "stunt":
    case "crash_avoidance":
    case "ramming":
      return "reaction";
    case "sensor":
      return "logic";
    case "gunnery":
      return "agility";
    default:
      return "reaction";
  }
}

// =============================================================================
// LIMIT CALCULATIONS
// =============================================================================

/**
 * Get handling value, handling both single and on-road/off-road formats
 */
function getHandlingValue(handling: HandlingRating, isOffRoad: boolean = false): number {
  if (typeof handling === "number") {
    return handling;
  }
  return isOffRoad ? handling.offRoad : handling.onRoad;
}

/**
 * Calculate the limit for a vehicle test
 */
export function calculateVehicleLimit(
  vehicle: VehicleCatalogItem | DroneCatalogItem | ActiveVehicleState,
  testType: VehicleTestType,
  isOffRoad: boolean = false
): number {
  const limitType = getLimitTypeForTest(testType);

  // Handle ActiveVehicleState (has modified stats)
  if ("vehicleId" in vehicle && "handlingModifier" in vehicle) {
    // ActiveVehicleState doesn't have raw handling, we need the catalog item
    // For now, return a reasonable default
    return 4; // Reasonable default handling
  }

  // Handle VehicleCatalogItem or DroneCatalogItem
  switch (limitType) {
    case "handling":
      if ("handling" in vehicle) {
        return getHandlingValue(vehicle.handling, isOffRoad);
      }
      return 4; // Default for drones
    case "speed":
      return vehicle.speed || 4;
    case "sensor":
      return vehicle.sensor || 2;
    default:
      return 4;
  }
}

// =============================================================================
// DICE POOL CALCULATIONS
// =============================================================================

/**
 * Calculate dice pool for a vehicle test with character piloting
 *
 * Pool = Reaction + Pilot Skill + Modifiers
 * Limit = Handling/Speed/Sensor (based on test type)
 */
export function calculateVehicleDicePool(
  character: Character,
  riggingState: RiggingState | undefined,
  testType: VehicleTestType,
  vehicle: VehicleCatalogItem | DroneCatalogItem,
  validation?: VehicleActionValidation
): VehicleDicePoolResult {
  const breakdown: DicePoolComponent[] = [];
  const penalties: DicePoolComponent[] = [];
  let pool = 0;
  const formulaParts: string[] = [];

  // Determine control mode
  const controlMode = validation?.controlMode || "manual";

  // Get the appropriate attribute
  const attributeName = getAttributeForTestType(testType);
  const attributeValue = getAttributeValue(character, attributeName);

  if (attributeValue > 0) {
    breakdown.push({
      source: "Attribute",
      attribute: attributeName,
      value: attributeValue,
    });
    pool += attributeValue;
    formulaParts.push(`${attributeName.toUpperCase()} ${attributeValue}`);
  }

  // Get the appropriate skill
  let skillName: string;
  if (testType === "gunnery") {
    skillName = "gunnery";
  } else if (testType === "sensor") {
    skillName = "perception";
  } else {
    // Get pilot skill based on vehicle category
    const category = "category" in vehicle ? vehicle.category : "ground";
    skillName = getPilotSkillForVehicle(category);
  }

  const skillValue = getSkillValue(character, skillName);

  if (skillValue > 0) {
    breakdown.push({
      source: "Skill",
      skill: skillName,
      value: skillValue,
    });
    pool += skillValue;
    formulaParts.push(`${skillName.replace("_", " ")} ${skillValue}`);
  } else {
    // No skill means defaulting (usually not allowed for vehicle tests)
    // But for simplicity, we'll allow it with -1 penalty
    penalties.push({
      source: "Defaulting",
      modifier: "No relevant skill",
      value: -1,
    });
    pool -= 1;
    formulaParts.push("Defaulting -1");
  }

  // Add VCR bonus if jumped in
  if (controlMode === "jumped-in" && riggingState?.vcr) {
    const vcrBonus = riggingState.vcr.controlBonus;
    if (vcrBonus > 0) {
      breakdown.push({
        source: "Vehicle Control Rig",
        modifier: `Rating ${riggingState.vcr.rating}`,
        value: vcrBonus,
      });
      pool += vcrBonus;
      formulaParts.push(`VCR +${vcrBonus}`);
    }
  }

  // Apply validation bonuses (autosofts, etc.)
  if (validation?.applicableBonuses) {
    for (const bonus of validation.applicableBonuses) {
      // Skip VCR bonus if already added
      if (bonus.source === "Vehicle Control Rig") continue;

      breakdown.push({
        source: bonus.source,
        autosoft: bonus.autosoft,
        value: bonus.value,
      });
      pool += bonus.value;
      formulaParts.push(`${bonus.source} +${bonus.value}`);
    }
  }

  // Apply noise penalty
  if (validation?.noisePenalty && validation.noisePenalty > 0) {
    penalties.push({
      source: "Signal Noise",
      modifier: `Distance/interference`,
      value: -validation.noisePenalty,
    });
    pool -= validation.noisePenalty;
    formulaParts.push(`Noise -${validation.noisePenalty}`);
  }

  // Calculate limit
  const limit = calculateVehicleLimit(vehicle, testType);
  const limitType = getLimitTypeForTest(testType);

  // Ensure pool is at least 0
  pool = Math.max(0, pool);

  return {
    pool,
    formula: formulaParts.join(" + "),
    breakdown,
    limit,
    limitType,
    controlMode,
    penalties,
  };
}

/**
 * Calculate dice pool for drone using autosofts (no rigger)
 *
 * When a drone operates autonomously:
 * Pool = Pilot + Autosoft Rating
 * Limit = Handling/Speed/Sensor
 */
export function calculateDroneDicePool(
  drone: SlavedDrone,
  testType: VehicleTestType,
  sharedAutosofts: SharedAutosoft[],
  droneData: DroneCatalogItem
): VehicleDicePoolResult {
  const breakdown: DicePoolComponent[] = [];
  const penalties: DicePoolComponent[] = [];
  let pool = 0;
  const formulaParts: string[] = [];

  // Drone's pilot rating is the base
  const pilotRating = drone.pilotRating;
  breakdown.push({
    source: "Drone Pilot",
    value: pilotRating,
  });
  pool += pilotRating;
  formulaParts.push(`Pilot ${pilotRating}`);

  // Find the best applicable autosoft
  // Convert test type to action type for autosoft lookup
  const actionType = getActionForTestType(testType);
  const applicableAutosofts = getApplicableAutosofts(actionType, drone, sharedAutosofts);

  // Use the highest rated applicable autosoft
  if (applicableAutosofts.length > 0) {
    const bestAutosoft = applicableAutosofts.reduce((best, current) =>
      current.rating > best.rating ? current : best
    );

    breakdown.push({
      source: "Autosoft",
      autosoft: bestAutosoft.name,
      value: bestAutosoft.rating,
    });
    pool += bestAutosoft.rating;
    formulaParts.push(`${bestAutosoft.name} ${bestAutosoft.rating}`);
  } else {
    // No autosoft means the drone cannot perform this action effectively
    penalties.push({
      source: "No Autosoft",
      modifier: "No applicable autosoft",
      value: 0,
    });
    formulaParts.push("(no autosoft)");
  }

  // Apply noise penalty
  if (drone.noisePenalty > 0) {
    penalties.push({
      source: "Signal Noise",
      value: -drone.noisePenalty,
    });
    pool -= drone.noisePenalty;
    formulaParts.push(`Noise -${drone.noisePenalty}`);
  }

  // Apply damage modifiers
  const damageModifier = calculateDroneConditionModifier(drone);
  if (damageModifier < 0) {
    penalties.push({
      source: "Damage",
      modifier: `${drone.conditionDamageTaken} boxes`,
      value: damageModifier,
    });
    pool += damageModifier;
    formulaParts.push(`Damage ${damageModifier}`);
  }

  // Calculate limit
  const limit = calculateVehicleLimit(droneData, testType);
  const limitType = getLimitTypeForTest(testType);

  // Ensure pool is at least 0
  pool = Math.max(0, pool);

  return {
    pool,
    formula: formulaParts.join(" + "),
    breakdown,
    limit,
    limitType,
    controlMode: drone.controlMode,
    penalties,
  };
}

/**
 * Convert test type to action type for autosoft lookup
 */
function getActionForTestType(testType: VehicleTestType): VehicleActionType {
  switch (testType) {
    case "control":
      return "accelerate";
    case "chase":
      return "catch_up";
    case "stunt":
      return "stunt";
    case "crash_avoidance":
      return "evasive_driving";
    case "ramming":
      return "ram";
    case "gunnery":
      return "fire_weapon";
    case "sensor":
      return "sensor_targeting";
    default:
      return "accelerate";
  }
}

/**
 * Calculate condition modifier for drone based on damage
 *
 * Drones take -1 per 3 boxes of damage (rounded up)
 */
function calculateDroneConditionModifier(drone: SlavedDrone): number {
  if (drone.conditionDamageTaken <= 0) {
    return 0;
  }
  return -Math.ceil(drone.conditionDamageTaken / 3);
}

/**
 * Apply control mode bonus to a dice pool
 */
export function applyControlModeBonus(
  pool: number,
  controlMode: ControlMode,
  vcrRating?: number
): number {
  return pool + getControlModeBonus(controlMode, vcrRating);
}

/**
 * Apply sensor targeting bonus
 *
 * Sensor targeting can add sensor rating to gunnery tests
 */
export function applySensorBonus(
  pool: number,
  sensorRating: number,
  hasTargetingAutosoft: boolean
): number {
  if (hasTargetingAutosoft) {
    return pool + sensorRating;
  }
  return pool;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format a dice pool result for display
 */
export function formatDicePoolResult(result: VehicleDicePoolResult): string {
  const parts: string[] = [];

  parts.push(`Pool: ${result.pool} dice`);
  parts.push(`Limit: ${result.limit} (${result.limitType})`);
  parts.push(`Formula: ${result.formula}`);

  if (result.penalties.length > 0) {
    const penaltyStr = result.penalties.map((p) => `${p.source}: ${p.value}`).join(", ");
    parts.push(`Penalties: ${penaltyStr}`);
  }

  return parts.join("\n");
}

/**
 * Get a summary of the dice pool for display
 */
export function getPoolSummary(result: VehicleDicePoolResult): {
  pool: number;
  limit: number;
  limitType: string;
  hasBonus: boolean;
  hasPenalty: boolean;
} {
  return {
    pool: result.pool,
    limit: result.limit,
    limitType: result.limitType,
    hasBonus: result.breakdown.length > 2, // More than just attribute + skill
    hasPenalty: result.penalties.length > 0,
  };
}

/**
 * Calculate the effective pool (capped by limit)
 */
export function getEffectivePool(result: VehicleDicePoolResult): number {
  // Note: Limit doesn't cap dice pool, it caps hits
  // But we return the pool for display purposes
  return result.pool;
}

/**
 * Check if a pool can be reasonably successful
 *
 * Returns an estimate of success chance based on pool size
 */
export function estimateSuccessChance(
  pool: number,
  threshold: number = 1
): { chance: number; description: string } {
  // Average hits = pool / 3 (each die has 1/3 chance of hitting)
  const averageHits = pool / 3;
  const ratio = averageHits / threshold;

  if (ratio >= 3) {
    return { chance: 0.95, description: "Very Likely" };
  } else if (ratio >= 2) {
    return { chance: 0.85, description: "Likely" };
  } else if (ratio >= 1.5) {
    return { chance: 0.7, description: "Possible" };
  } else if (ratio >= 1) {
    return { chance: 0.5, description: "Uncertain" };
  } else if (ratio >= 0.5) {
    return { chance: 0.3, description: "Unlikely" };
  } else {
    return { chance: 0.1, description: "Very Unlikely" };
  }
}
