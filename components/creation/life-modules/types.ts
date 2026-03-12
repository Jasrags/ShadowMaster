import type { CreationState } from "@/lib/types";
import type { LifeModule, LifeModulePhase, LifeModuleSelection } from "@/lib/types";

export interface LifeModulesCardProps {
  readonly state: CreationState;
  readonly updateState: (updates: Partial<CreationState>) => void;
}

export interface LifeModulesModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelect: (selection: LifeModuleSelection) => void;
  readonly modules: PhaseModules;
  readonly existingSelections: readonly LifeModuleSelection[];
}

export interface LifeModuleDetailPanelProps {
  readonly module: LifeModule;
  readonly subModule?: LifeModule;
}

/** Modules organized by phase for the selection UI */
export type PhaseModules = Record<LifeModulePhase, readonly LifeModule[]>;

export interface QualityReplacementModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  /** Called with the chosen replacement quality ID */
  readonly onSelect: (replacementQualityId: string) => void;
  /** The duplicate quality ID that needs replacing */
  readonly duplicateQualityId: string;
  /** Whether the duplicate is positive or negative */
  readonly duplicateQualityType: "positive" | "negative";
  /** Full quality catalog to pick replacements from */
  readonly availableQualities: readonly import("@/lib/rules/loader-types").QualityData[];
  /** Quality IDs already on the character (to exclude from choices) */
  readonly alreadySelectedIds?: readonly string[];
}
