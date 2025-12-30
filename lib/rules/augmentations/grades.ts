/**
 * Grade Application Utilities
 *
 * Functions for applying cyberware and bioware grade multipliers
 * to essence costs, nuyen costs, and availability.
 *
 * @satisfies Requirement: Essence expenditures MUST be calculated based on authoritative grade definitions
 */

import type { CyberwareGrade, BiowareGrade } from "@/lib/types/character";
import {
  CYBERWARE_GRADE_MULTIPLIERS,
  CYBERWARE_GRADE_AVAILABILITY_MODIFIERS,
  CYBERWARE_GRADE_COST_MULTIPLIERS,
  BIOWARE_GRADE_MULTIPLIERS,
} from "@/lib/types/character";

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Complete set of grade multipliers for an augmentation grade
 */
export interface GradeMultipliers {
  /** Essence cost multiplier (e.g., 0.8 for alpha = 20% reduction) */
  essenceMultiplier: number;
  /** Nuyen cost multiplier (e.g., 2.0 for alpha = 200% cost) */
  costMultiplier: number;
  /** Availability modifier (added to base, e.g., +2 for alpha) */
  availabilityModifier: number;
}

/**
 * Applied grade values after calculation
 */
export interface AppliedGradeValues {
  /** Final essence cost after grade */
  essenceCost: number;
  /** Final nuyen cost after grade */
  cost: number;
  /** Final availability after grade */
  availability: number;
}

// =============================================================================
// BIOWARE GRADE CONSTANTS
// =============================================================================

/**
 * Bioware grade cost multipliers
 * Note: Bioware doesn't have "used" grade
 */
export const BIOWARE_GRADE_COST_MULTIPLIERS: Record<BiowareGrade, number> = {
  standard: 1.0,
  alpha: 2.0,
  beta: 4.0,
  delta: 10.0,
};

/**
 * Bioware grade availability modifiers
 * Note: Bioware doesn't have "used" grade
 */
export const BIOWARE_GRADE_AVAILABILITY_MODIFIERS: Record<BiowareGrade, number> = {
  standard: 0,
  alpha: 2,
  beta: 4,
  delta: 8,
};

// =============================================================================
// CYBERWARE GRADE FUNCTIONS
// =============================================================================

/**
 * Get the essence multiplier for a cyberware grade
 *
 * @param grade - The cyberware grade
 * @returns The essence multiplier (e.g., 1.25 for used, 0.5 for delta)
 */
export function getCyberwareGradeMultiplier(grade: CyberwareGrade): number {
  return CYBERWARE_GRADE_MULTIPLIERS[grade] ?? 1.0;
}

/**
 * Get the cost multiplier for a cyberware grade
 *
 * @param grade - The cyberware grade
 * @returns The cost multiplier (e.g., 0.75 for used, 10.0 for delta)
 */
export function getCyberwareGradeCostMultiplier(grade: CyberwareGrade): number {
  return CYBERWARE_GRADE_COST_MULTIPLIERS[grade] ?? 1.0;
}

/**
 * Get the availability modifier for a cyberware grade
 *
 * @param grade - The cyberware grade
 * @returns The availability modifier (e.g., -4 for used, +8 for delta)
 */
export function getCyberwareGradeAvailabilityModifier(grade: CyberwareGrade): number {
  return CYBERWARE_GRADE_AVAILABILITY_MODIFIERS[grade] ?? 0;
}

/**
 * Get all multipliers for a cyberware grade
 *
 * @param grade - The cyberware grade
 * @returns Complete set of grade multipliers
 */
export function getCyberwareGradeMultipliers(grade: CyberwareGrade): GradeMultipliers {
  return {
    essenceMultiplier: getCyberwareGradeMultiplier(grade),
    costMultiplier: getCyberwareGradeCostMultiplier(grade),
    availabilityModifier: getCyberwareGradeAvailabilityModifier(grade),
  };
}

// =============================================================================
// BIOWARE GRADE FUNCTIONS
// =============================================================================

/**
 * Get the essence multiplier for a bioware grade
 *
 * @param grade - The bioware grade
 * @returns The essence multiplier (e.g., 1.0 for standard, 0.5 for delta)
 */
export function getBiowareGradeMultiplier(grade: BiowareGrade): number {
  return BIOWARE_GRADE_MULTIPLIERS[grade] ?? 1.0;
}

/**
 * Get the cost multiplier for a bioware grade
 *
 * @param grade - The bioware grade
 * @returns The cost multiplier (e.g., 1.0 for standard, 10.0 for delta)
 */
export function getBiowareGradeCostMultiplier(grade: BiowareGrade): number {
  return BIOWARE_GRADE_COST_MULTIPLIERS[grade] ?? 1.0;
}

/**
 * Get the availability modifier for a bioware grade
 *
 * @param grade - The bioware grade
 * @returns The availability modifier (e.g., 0 for standard, +8 for delta)
 */
export function getBiowareGradeAvailabilityModifier(grade: BiowareGrade): number {
  return BIOWARE_GRADE_AVAILABILITY_MODIFIERS[grade] ?? 0;
}

/**
 * Get all multipliers for a bioware grade
 *
 * @param grade - The bioware grade
 * @returns Complete set of grade multipliers
 */
export function getBiowareGradeMultipliers(grade: BiowareGrade): GradeMultipliers {
  return {
    essenceMultiplier: getBiowareGradeMultiplier(grade),
    costMultiplier: getBiowareGradeCostMultiplier(grade),
    availabilityModifier: getBiowareGradeAvailabilityModifier(grade),
  };
}

// =============================================================================
// GENERIC GRADE APPLICATION
// =============================================================================

/**
 * Apply a grade's essence multiplier to a base essence cost
 *
 * @param baseCost - The base essence cost
 * @param grade - The grade (cyberware or bioware)
 * @param isCyberware - Whether this is cyberware (true) or bioware (false)
 * @returns The adjusted essence cost
 */
export function applyGradeToEssence(
  baseCost: number,
  grade: CyberwareGrade | BiowareGrade,
  isCyberware: boolean = true
): number {
  const multiplier = isCyberware
    ? getCyberwareGradeMultiplier(grade as CyberwareGrade)
    : getBiowareGradeMultiplier(grade as BiowareGrade);

  return Math.round(baseCost * multiplier * 100) / 100;
}

/**
 * Apply a grade's cost multiplier to a base nuyen cost
 *
 * @param baseCost - The base nuyen cost
 * @param grade - The grade (cyberware or bioware)
 * @param isCyberware - Whether this is cyberware (true) or bioware (false)
 * @returns The adjusted nuyen cost (rounded to whole number)
 */
export function applyGradeToCost(
  baseCost: number,
  grade: CyberwareGrade | BiowareGrade,
  isCyberware: boolean = true
): number {
  const multiplier = isCyberware
    ? getCyberwareGradeCostMultiplier(grade as CyberwareGrade)
    : getBiowareGradeCostMultiplier(grade as BiowareGrade);

  return Math.round(baseCost * multiplier);
}

/**
 * Apply a grade's availability modifier to a base availability
 *
 * @param baseAvail - The base availability
 * @param grade - The grade (cyberware or bioware)
 * @param isCyberware - Whether this is cyberware (true) or bioware (false)
 * @returns The adjusted availability
 */
export function applyGradeToAvailability(
  baseAvail: number,
  grade: CyberwareGrade | BiowareGrade,
  isCyberware: boolean = true
): number {
  const modifier = isCyberware
    ? getCyberwareGradeAvailabilityModifier(grade as CyberwareGrade)
    : getBiowareGradeAvailabilityModifier(grade as BiowareGrade);

  // Availability can go negative with used grade, but should be at least 0
  return Math.max(0, baseAvail + modifier);
}

/**
 * Apply all grade modifiers to base values
 *
 * @param baseEssence - The base essence cost
 * @param baseCost - The base nuyen cost
 * @param baseAvailability - The base availability
 * @param grade - The grade to apply
 * @param isCyberware - Whether this is cyberware (true) or bioware (false)
 * @returns All values with grade applied
 */
export function applyGradeToAll(
  baseEssence: number,
  baseCost: number,
  baseAvailability: number,
  grade: CyberwareGrade | BiowareGrade,
  isCyberware: boolean = true
): AppliedGradeValues {
  return {
    essenceCost: applyGradeToEssence(baseEssence, grade, isCyberware),
    cost: applyGradeToCost(baseCost, grade, isCyberware),
    availability: applyGradeToAvailability(baseAvailability, grade, isCyberware),
  };
}

// =============================================================================
// GRADE VALIDATION
// =============================================================================

/**
 * Check if a grade is valid for cyberware
 *
 * @param grade - The grade to validate
 * @returns True if valid
 */
export function isValidCyberwareGrade(grade: string): grade is CyberwareGrade {
  return ["used", "standard", "alpha", "beta", "delta"].includes(grade);
}

/**
 * Check if a grade is valid for bioware
 * Note: Bioware cannot have "used" grade
 *
 * @param grade - The grade to validate
 * @returns True if valid
 */
export function isValidBiowareGrade(grade: string): grade is BiowareGrade {
  return ["standard", "alpha", "beta", "delta"].includes(grade);
}

/**
 * Get the display name for a grade
 *
 * @param grade - The grade
 * @returns Human-readable name
 */
export function getGradeDisplayName(grade: CyberwareGrade | BiowareGrade): string {
  const names: Record<string, string> = {
    used: "Used",
    standard: "Standard",
    alpha: "Alphaware",
    beta: "Betaware",
    delta: "Deltaware",
  };
  return names[grade] ?? "Unknown";
}

/**
 * Get all available cyberware grades in order of quality
 */
export function getCyberwareGrades(): CyberwareGrade[] {
  return ["used", "standard", "alpha", "beta", "delta"];
}

/**
 * Get all available bioware grades in order of quality
 */
export function getBiowareGrades(): BiowareGrade[] {
  return ["standard", "alpha", "beta", "delta"];
}

// =============================================================================
// GRADE COMPARISON
// =============================================================================

/**
 * Grade quality order (higher = better quality, lower essence cost, higher nuyen cost)
 */
const GRADE_QUALITY_ORDER: Record<string, number> = {
  used: 0,
  standard: 1,
  alpha: 2,
  beta: 3,
  delta: 4,
};

/**
 * Compare two grades by quality
 *
 * @param a - First grade
 * @param b - Second grade
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
export function compareGrades(
  a: CyberwareGrade | BiowareGrade,
  b: CyberwareGrade | BiowareGrade
): number {
  return (GRADE_QUALITY_ORDER[a] ?? 1) - (GRADE_QUALITY_ORDER[b] ?? 1);
}

/**
 * Check if upgrading from one grade to another is valid
 * You can only upgrade to a higher quality grade
 *
 * @param fromGrade - Current grade
 * @param toGrade - Target grade
 * @returns True if upgrade is valid
 */
export function isValidGradeUpgrade(
  fromGrade: CyberwareGrade | BiowareGrade,
  toGrade: CyberwareGrade | BiowareGrade
): boolean {
  return compareGrades(toGrade, fromGrade) > 0;
}

/**
 * Calculate the essence refund from upgrading grades
 * (Higher grade = less essence used, so you get essence back)
 *
 * @param baseEssenceCost - Base essence cost of the augmentation
 * @param fromGrade - Current grade
 * @param toGrade - Target grade
 * @param isCyberware - Whether this is cyberware
 * @returns The essence difference (positive = essence refunded)
 */
export function calculateGradeUpgradeEssenceRefund(
  baseEssenceCost: number,
  fromGrade: CyberwareGrade | BiowareGrade,
  toGrade: CyberwareGrade | BiowareGrade,
  isCyberware: boolean = true
): number {
  const currentEssence = applyGradeToEssence(baseEssenceCost, fromGrade, isCyberware);
  const newEssence = applyGradeToEssence(baseEssenceCost, toGrade, isCyberware);

  // Positive value means essence is refunded (new grade costs less)
  return Math.round((currentEssence - newEssence) * 100) / 100;
}
