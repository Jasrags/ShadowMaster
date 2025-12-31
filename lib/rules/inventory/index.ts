/**
 * Inventory Module
 *
 * Exports for equipment state management.
 */

export {
  // Types
  type ActionType,
  type StateTransitionResult,
  type WirelessToggleResult,
  type DeviceConditionResult,
  // Constants
  STATE_TRANSITION_COSTS,
  VALID_STATES,
  // State management
  getDefaultState,
  getValidTransitions,
  getTransitionActionCost,
  isValidTransition,
  setEquipmentReadiness,
  // Wireless management
  toggleWireless,
  toggleAugmentationWireless,
  setAllWireless,
  // Device condition
  setDeviceCondition,
  brickDevice,
  repairDevice,
  isDeviceUsable,
  // Bulk operations
  readyAllWeapons,
  holsterAllWeapons,
  getEquipmentStateSummary,
} from "./state-manager";
