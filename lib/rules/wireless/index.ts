/**
 * Wireless Module
 *
 * Exports for wireless bonus calculation and management.
 */

export {
  // State checks
  isGlobalWirelessEnabled,
  isItemWirelessActive,
  isCyberwareWirelessActive,
  // Effect collection
  collectCyberwareEffects,
  collectBiowareEffects,
  collectWeaponModEffects,
  // Main calculator
  calculateWirelessBonuses,
  calculateContextualWirelessBonuses,
  // Convenience getters
  getWirelessInitiativeBonus,
  getWirelessInitiativeDiceBonus,
  getWirelessAttributeBonus,
  getWirelessAttackBonus,
  getWirelessDefenseBonus,
  getWirelessLimitBonus,
  // UI helpers
  getWirelessBonusSummary,
} from "./bonus-calculator";
