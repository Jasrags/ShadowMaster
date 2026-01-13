/**
 * Noise Calculator for Rigging Operations
 *
 * Calculates signal noise based on distance, terrain, and interference.
 * Noise applies as a penalty to all Matrix actions including rigging.
 *
 * SR5 Core Rulebook p. 231
 */

import type { DistanceBand, TerrainModifier, NoiseCalculation } from "@/lib/types/rigging";

// =============================================================================
// CONSTANTS - DISTANCE NOISE (SR5 p. 231)
// =============================================================================

/**
 * Distance bands and their noise values
 */
const DISTANCE_NOISE: Record<DistanceBand, number> = {
  close: 0, // 0-100m
  near: 1, // 101m - 1km
  medium: 3, // 1km - 10km
  far: 5, // 10km - 100km
  extreme: 8, // 100km+
};

/**
 * Distance thresholds in meters
 */
const DISTANCE_THRESHOLDS = {
  close: 100,
  near: 1000,
  medium: 10000,
  far: 100000,
  // Anything above far is extreme
};

// =============================================================================
// CONSTANTS - TERRAIN/SITUATION MODIFIERS
// =============================================================================

/**
 * Terrain and situation modifiers for noise
 */
const TERRAIN_NOISE: Record<TerrainModifier, number> = {
  dense_foliage: 1,
  faraday_cage: 10, // Effectively blocks signal
  jamming: 0, // Variable based on jammer rating
  spam_zone: 2, // Average spam zone
  static_zone: 3, // Average static zone
};

// =============================================================================
// DISTANCE BAND CALCULATION
// =============================================================================

/**
 * Get distance band from meters
 */
export function getDistanceBand(distanceMeters: number): DistanceBand {
  if (distanceMeters <= DISTANCE_THRESHOLDS.close) {
    return "close";
  }
  if (distanceMeters <= DISTANCE_THRESHOLDS.near) {
    return "near";
  }
  if (distanceMeters <= DISTANCE_THRESHOLDS.medium) {
    return "medium";
  }
  if (distanceMeters <= DISTANCE_THRESHOLDS.far) {
    return "far";
  }
  return "extreme";
}

/**
 * Get noise value for a distance band
 */
export function getDistanceNoise(band: DistanceBand): number {
  return DISTANCE_NOISE[band];
}

/**
 * Get noise value for distance in meters
 */
export function getNoiseForDistance(distanceMeters: number): number {
  const band = getDistanceBand(distanceMeters);
  return DISTANCE_NOISE[band];
}

// =============================================================================
// TERRAIN MODIFIER CALCULATION
// =============================================================================

/**
 * Get noise value for a terrain modifier
 */
export function getTerrainNoise(modifier: TerrainModifier): number {
  return TERRAIN_NOISE[modifier];
}

/**
 * Calculate total terrain noise from multiple modifiers
 */
export function calculateTerrainNoise(modifiers: TerrainModifier[]): number {
  return modifiers.reduce((total, mod) => total + TERRAIN_NOISE[mod], 0);
}

// =============================================================================
// SPAM/STATIC ZONE NOISE
// =============================================================================

/**
 * Spam zone noise levels
 * Light: 1, Medium: 2, Heavy: 3
 */
export type SpamZoneLevel = "none" | "light" | "medium" | "heavy";

/**
 * Static zone noise levels
 * Light: 1, Medium: 2, Heavy: 3
 */
export type StaticZoneLevel = "none" | "light" | "medium" | "heavy";

const SPAM_ZONE_NOISE: Record<SpamZoneLevel, number> = {
  none: 0,
  light: 1,
  medium: 2,
  heavy: 3,
};

const STATIC_ZONE_NOISE: Record<StaticZoneLevel, number> = {
  none: 0,
  light: 1,
  medium: 2,
  heavy: 3,
};

/**
 * Get spam zone noise
 */
export function getSpamZoneNoise(level: SpamZoneLevel): number {
  return SPAM_ZONE_NOISE[level];
}

/**
 * Get static zone noise
 */
export function getStaticZoneNoise(level: StaticZoneLevel): number {
  return STATIC_ZONE_NOISE[level];
}

// =============================================================================
// COMPLETE NOISE CALCULATION
// =============================================================================

/**
 * Noise calculation input
 */
export interface NoiseCalculationInput {
  /** Distance in meters */
  distanceMeters: number;

  /** Terrain modifiers */
  terrainModifiers?: TerrainModifier[];

  /** Spam zone level */
  spamZone?: SpamZoneLevel;

  /** Static zone level */
  staticZone?: StaticZoneLevel;

  /** RCC noise reduction */
  noiseReduction?: number;

  /** Additional modifiers (jammer rating, etc.) */
  additionalNoise?: number;
}

/**
 * Calculate complete noise value
 */
export function calculateNoise(input: NoiseCalculationInput): NoiseCalculation {
  const distanceBand = getDistanceBand(input.distanceMeters);
  const distanceNoise = DISTANCE_NOISE[distanceBand];

  const terrainNoise = input.terrainModifiers ? calculateTerrainNoise(input.terrainModifiers) : 0;

  const spamZoneNoise = input.spamZone ? SPAM_ZONE_NOISE[input.spamZone] : 0;

  const staticZoneNoise = input.staticZone ? STATIC_ZONE_NOISE[input.staticZone] : 0;

  const additionalNoise = input.additionalNoise ?? 0;
  const noiseReduction = input.noiseReduction ?? 0;

  const grossNoise =
    distanceNoise + terrainNoise + spamZoneNoise + staticZoneNoise + additionalNoise;
  const totalNoise = Math.max(0, grossNoise - noiseReduction);

  return {
    distanceBand,
    distanceNoise,
    terrainNoise,
    spamZoneNoise,
    staticZoneNoise,
    noiseReduction,
    totalNoise,
  };
}

// =============================================================================
// NOISE APPLICATION
// =============================================================================

/**
 * Apply noise to dice pool
 * Noise reduces the dice pool (minimum 0)
 */
export function applyNoiseToPool(basePool: number, noise: number): number {
  return Math.max(0, basePool - noise);
}

/**
 * Check if signal is blocked (too much noise)
 * Generally considered blocked at noise > 12 or when specific conditions exist
 */
export function isSignalBlocked(noise: number): boolean {
  return noise >= 12;
}

/**
 * Get noise rating description
 */
export function getNoiseDescription(noise: number): string {
  if (noise === 0) return "Clear signal";
  if (noise <= 2) return "Light interference";
  if (noise <= 4) return "Moderate interference";
  if (noise <= 6) return "Heavy interference";
  if (noise <= 8) return "Severe interference";
  if (noise <= 11) return "Critical interference";
  return "Signal blocked";
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate effective noise reduction from multiple sources
 */
export function calculateTotalNoiseReduction(sources: number[]): number {
  // Noise reduction stacks
  return sources.reduce((total, reduction) => total + reduction, 0);
}

/**
 * Get distance description for a band
 */
export function getDistanceDescription(band: DistanceBand): string {
  switch (band) {
    case "close":
      return "Within 100m";
    case "near":
      return "100m - 1km";
    case "medium":
      return "1km - 10km";
    case "far":
      return "10km - 100km";
    case "extreme":
      return "Over 100km";
  }
}

/**
 * Calculate noise for a drone at a specific distance from rigger
 */
export function calculateDroneNoise(
  distanceMeters: number,
  rccNoiseReduction: number,
  environmentModifiers?: {
    terrain?: TerrainModifier[];
    spamZone?: SpamZoneLevel;
    staticZone?: StaticZoneLevel;
  }
): NoiseCalculation {
  return calculateNoise({
    distanceMeters,
    noiseReduction: rccNoiseReduction,
    terrainModifiers: environmentModifiers?.terrain,
    spamZone: environmentModifiers?.spamZone,
    staticZone: environmentModifiers?.staticZone,
  });
}
