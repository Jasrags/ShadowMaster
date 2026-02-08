/**
 * Vehicle modal components for character creation
 */

export { VehicleModal, type VehicleSelection } from "./VehicleModal";
export { DroneModal, type DroneSelection } from "./DroneModal";
export { RCCModal, type RCCSelection } from "./RCCModal";
export { AutosoftModal, type AutosoftSelection } from "./AutosoftModal";

// Unified modal
export {
  VehicleSystemModal,
  type VehicleSystemType,
  type VehicleSystemSelection,
} from "./VehicleSystemModal";

// Sub-components and helpers
export {
  VehicleSystemFilters,
  VehicleSystemHeaderIcon,
  type VehicleSystemFiltersProps,
} from "./VehicleSystemFilters";
export {
  VehicleSystemDetailsPane,
  type VehicleSystemDetailsPaneProps,
} from "./VehicleSystemDetailsPane";
export {
  VehicleSystemItemButton,
  type VehicleSystemItemButtonProps,
} from "./VehicleSystemItemButton";
export {
  formatCurrency as vehicleFormatCurrency,
  getAvailabilityDisplay as vehicleGetAvailabilityDisplay,
  isItemAvailable,
  getRatingTier,
  getMaxAvailableRating,
  getTypeColor,
  MAX_AVAILABILITY as VEHICLE_MAX_AVAILABILITY,
  TYPE_TABS,
  VEHICLE_CATEGORIES,
  DRONE_SIZES,
  RCC_TIERS,
  AUTOSOFT_CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
} from "./vehicleSystemHelpers";
