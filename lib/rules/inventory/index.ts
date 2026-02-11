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
  type ActivationToggleResult,
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
  // Device activation
  toggleActivation,
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
