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
