/**
 * Augmentations Components
 *
 * Cyberware and bioware management for character creation.
 */

// Modal components
export {
  AugmentationModal,
  type AugmentationType,
  type AugmentationSelection,
  type InstalledCyberlimb,
  type InstalledSkillLinkedBioware,
} from "./AugmentationModal";
export {
  CyberwareEnhancementModal,
  type CyberwareEnhancementSelection,
} from "./CyberwareEnhancementModal";
export {
  CyberlimbAccessoryModal,
  type CyberlimbAccessorySelection,
} from "./CyberlimbAccessoryModal";
export { CyberlimbWeaponModal, type CyberlimbWeaponSelection } from "./CyberlimbWeaponModal";

// Display components
export { AugmentationItem, type AugmentationItemProps } from "./AugmentationItem";
export {
  CyberlimbAugmentationItem,
  type CyberlimbAugmentationItemProps,
} from "./CyberlimbAugmentationItem";

// Sub-components and helpers
export {
  AugmentationFilters,
  AugmentationHeaderIcon,
  type AugmentationFiltersProps,
} from "./AugmentationFilters";
export {
  AugmentationDetailsPane,
  type AugmentationDetailsPaneProps,
} from "./AugmentationDetailsPane";
export { AugmentationItemButton, type AugmentationItemButtonProps } from "./AugmentationItemButton";
export {
  formatCurrency as augmentationFormatCurrency,
  formatEssence as augmentationFormatEssence,
  getAvailabilityDisplay as augmentationGetAvailabilityDisplay,
  getLocationConflict,
  MAX_AVAILABILITY as AUGMENTATION_MAX_AVAILABILITY,
  GRADE_LABELS,
  CYBERWARE_CATEGORIES,
  BIOWARE_CATEGORIES,
  CATEGORY_LABELS as AUGMENTATION_CATEGORY_LABELS,
  LOCATION_LABELS,
} from "./augmentationModalHelpers";

// Utilities
export {
  formatCurrency,
  formatEssence,
  GRADE_DISPLAY,
  DISPLAY_CATEGORIES,
  type DisplayCategory,
} from "./utils";
