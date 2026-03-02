/**
 * Inventory Module
 *
 * Exports for equipment state management, container operations,
 * concealment, and loadout management.
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

export {
  // Types
  type CapacityValidationResult,
  type ContainerOperationResult,
  // Constants
  MAX_CONTAINER_DEPTH,
  READINESS_RESTRICTION_ORDER,
  // Item lookup
  findGearItemById,
  isContainer,
  // Containment queries
  getContainerContents,
  getContainerChain,
  isCircularContainment,
  getContainmentDepth,
  // Effective readiness
  getEffectiveReadiness,
  // Weight calculation
  getContainerContentWeight,
  // Validation
  validateContainerCapacity,
  canAddToContainer,
  // Container operations
  addItemToContainer,
  removeItemFromContainer,
  moveItemBetweenContainers,
} from "./container-manager";

export {
  // Types
  type ConcealmentCheck,
  type ConcealedItemInfo,
  // Constants
  CONCEALMENT_BY_READINESS,
  // Functions
  getConcealmentModifier,
  calculateConcealmentCheck,
  getConcealedItems,
} from "./concealment";

export {
  // Types
  type LoadoutApplicationResult,
  type CreateLoadoutConfig,
  // CRUD
  createLoadout,
  saveCurrentAsLoadout,
  updateLoadout,
  deleteLoadout,
  // Application
  getLoadoutDiff,
  applyLoadout,
} from "./loadout-manager";
