/**
 * Skills Components
 *
 * Modal-based skill management for character creation.
 */

// Modal components
export { SkillModal } from "./SkillModal";
export { SkillGroupModal } from "./SkillGroupModal";
export { SkillListItem } from "./SkillListItem";
export { SkillCustomizeModal, type SkillCustomizeChanges } from "./SkillCustomizeModal";
export { SkillGroupBreakModal, type SkillGroupBreakChanges } from "./SkillGroupBreakModal";
export { SkillKarmaConfirmModal, type SkillKarmaConfirmModalProps } from "./SkillKarmaConfirmModal";
export {
  SkillGroupKarmaConfirmModal,
  type SkillGroupKarmaConfirmModalProps,
} from "./SkillGroupKarmaConfirmModal";
export { SkillSpecModal } from "./SkillSpecModal";
export { FreeSkillsPanel } from "./FreeSkillsPanel";
export { FreeSkillDesignationModal } from "./FreeSkillDesignationModal";

// Custom hooks
export {
  useSkillDesignations,
  type UseSkillDesignationsResult,
  type FreeSkillDesignationModalState,
} from "./useSkillDesignations";
export { useGroupBreaking, type UseGroupBreakingResult } from "./useGroupBreaking";
export {
  useKarmaPurchase,
  type UseKarmaPurchaseResult,
  type PurchaseMode,
  type GroupPurchaseMode,
  type SkillKarmaPurchaseState,
  type GroupKarmaPurchaseState,
} from "./useKarmaPurchase";

// Utilities
export {
  updateKarmaSpent,
  updateDesignationsByType,
  removeFromDesignations,
  addToDesignations,
  getKarmaSpent,
  EMPTY_KARMA_SPENT,
  type SkillKarmaSpent,
} from "./utils";
