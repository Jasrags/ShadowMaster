/**
 * Expanded Lifestyle Rules (Run Faster, pp. 216-227)
 *
 * Pure functions for the component-based lifestyle system:
 * - Cost calculation with component levels and entertainment
 * - Point budget validation
 * - Component level validation
 * - Entertainment requirement validation
 * - Neighborhood zone lookup
 * - Fatigue DV calculation
 * - Security threshold calculation
 */

export {
  calculateExpandedLifestyleCost,
  calculateComponentLevelCost,
  calculateLifestyleTotalCost,
} from "./cost";

export {
  validatePointBudget,
  validateComponentLevels,
  validateEntertainmentRequirements,
} from "./validation";

export { getNeighborhoodZone, calculateFatigueDV, calculateSecurityThreshold } from "./mechanics";
